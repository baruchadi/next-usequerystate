'use client'
import { useRouter } from 'next/compat/router'
import React from 'react'
import type {
  HistoryOptions,
  Nullable,
  Serializers,
  TransitionOptions
} from './defs'

type KeyMapValue<Type> = Serializers<Type> & {
  defaultValue?: Type
}

export type UseQueryStatesKeysMap<Map = any> = {
  [Key in keyof Map]: KeyMapValue<Map[Key]>
}

export interface UseQueryStatesOptions {
  /**
   * The operation to use on state updates. Defaults to `replace`.
   */
  history: HistoryOptions
}

export type Values<T extends UseQueryStatesKeysMap> = {
  [K in keyof T]: T[K]['defaultValue'] extends NonNullable<
    ReturnType<T[K]['parse']>
  >
    ? NonNullable<ReturnType<T[K]['parse']>>
    : ReturnType<T[K]['parse']> | null
}

type UpdaterFn<T extends UseQueryStatesKeysMap> = (
  old: Values<T>
) => Partial<Nullable<Values<T>>>

export type SetValues<T extends UseQueryStatesKeysMap> = (
  values: Partial<Nullable<Values<T>>> | UpdaterFn<T>,
  transitionOptions?: TransitionOptions
) => Promise<boolean>

export type UseQueryStatesReturn<T extends UseQueryStatesKeysMap> = [
  Values<T>,
  SetValues<T>
]

/**
 * Synchronise multiple query string arguments to React state in Next.js
 *
 * @param keys - An object describing the keys to synchronise and how to
 *               serialise and parse them.
 *               Use `queryTypes.(string|integer|float)` for quick shorthands.
 */
export function useQueryStates<KeyMap extends UseQueryStatesKeysMap>(
  keys: KeyMap,
  { history = 'replace' }: Partial<UseQueryStatesOptions> = {}
): UseQueryStatesReturn<KeyMap> {
  const router = useRouter()

  type V = Values<KeyMap>

  // Memoizing the update function has the advantage of making it
  // immutable as long as `history` stays the same.
  // It reduces the amount of reactivity needed to update the state.
  const updateUrl = React.useMemo(
    () =>
      router?.isReady
        ? history === 'push'
          ? router?.push
          : router?.replace
        : () => Promise.resolve(false),
    [history, router]
  )

  const getValues = React.useCallback((): V => {
    if (typeof window === 'undefined') {
      // Not available in an SSR context, return all null (or default if available)
      return Object.keys(keys).reduce((obj, key) => {
        const { defaultValue } = keys[key as keyof KeyMap]
        return {
          ...obj,
          [key]: defaultValue ?? null
        }
      }, {} as V)
    }
    const query = new URLSearchParams(window.location.search)
    return Object.keys(keys).reduce((values, key) => {
      const { parse, defaultValue } = keys[key as keyof KeyMap]
      const value = query.get(key)
      const parsed =
        value !== null
          ? parse(value) ?? defaultValue ?? null
          : defaultValue ?? null
      return {
        ...values,
        [key]: parsed
      }
    }, {} as V)
  }, [keys])

  // Update the state values only when the relevant keys change.
  // Because we're not calling getValues in the function argument
  // of React.useMemo, but instead using it as the function to call,
  // there is no need to pass it in the dependency array.
  const values = React.useMemo(
    getValues,
    Object.keys(keys).map(key => router?.query[key])
  )

  const update = React.useCallback<SetValues<KeyMap>>(
    (stateUpdater, transitionOptions) => {
      const isUpdaterFunction = (input: any): input is UpdaterFn<KeyMap> => {
        return typeof input === 'function'
      }

      // Resolve the new values based on old values & updater
      const oldValues = getValues()
      const newValues = isUpdaterFunction(stateUpdater)
        ? stateUpdater(oldValues)
        : stateUpdater
      // We can't rely on router.query here to avoid causing
      // unnecessary renders when other query parameters change.
      // URLSearchParams is already polyfilled by Next.js
      const query = new URLSearchParams(window.location.search)

      Object.keys(newValues).forEach(key => {
        const newValue = newValues[key]
        if (newValue === null) {
          query.delete(key)
        } else if (newValue !== undefined) {
          const { serialize = String } = keys[key]
          query.set(key, serialize(newValue))
        }
      })
      const search = query.toString()
      const hash = window.location.hash
      return updateUrl?.call(
        router,
        {
          pathname: router?.pathname,
          hash,
          search
        },
        {
          pathname: window.location.pathname,
          hash,
          search
        },
        transitionOptions
      )
    },
    [keys, updateUrl]
  )
  return [values, update]
}
