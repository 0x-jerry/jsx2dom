import { isString } from '@0x-jerry/utils'
import { DComponent, isFragment, getContext } from './node'

export function mount(dom: DComponent, selector: string | HTMLElement) {
  const container = isString(selector)
    ? document.querySelector(selector)
    : selector

  if (!container) {
    console.warn(`Can't find container`)
    return
  }

  if (isFragment(dom)) {
    dom.moveTo(container)
  } else {
    container.append(dom)
  }

  getContext(dom).emit('mounted')
}
