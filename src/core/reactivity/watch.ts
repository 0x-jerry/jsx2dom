import {
  effect,
  isRef,
  stop,
  unref,
  type Ref,
  type ReactiveEffectOptions,
} from '@vue/reactivity'
import { type Promisable, isArray, isFn } from '@0x-jerry/utils'

export type StopWatcher = () => void

export type TriggerFn<T> = (newVal: T, oldValue?: T) => Promisable<void>

export interface WatchOption extends ReactiveEffectOptions {}

export function watch<T>(
  getter: Ref<T> | (() => T),
  fn: TriggerFn<T>,
  option?: WatchOption,
): StopWatcher {
  let oldVal: any

  const getterIsRef = isRef(getter)

  const runner = effect(effectFn, option)

  return () => stop(runner)

  function effectFn() {
    let newVal: any

    if (getterIsRef) {
      newVal = getter.value
    } else if (isFn(getter)) {
      newVal = getter()
    }

    newVal = unref(newVal)

    if (isEq(oldVal, newVal)) {
      return
    }

    fn(newVal, oldVal)

    oldVal = newVal
  }
}

function isEq(a: unknown, b: unknown) {
  if (isArray(a) && isArray(b) && a.length === b.length) {
    return a.every((v, idx) => v === b[idx])
  }

  return a === b
}

export function watchLazy<T>(
  getter: Ref<T> | (() => T),
  fn: TriggerFn<T>,
  option?: Omit<WatchOption, 'lazy'>,
): StopWatcher {
  return watch(getter, fn, { ...option, lazy: true })
}
