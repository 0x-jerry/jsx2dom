import { isString } from '@0x-jerry/utils'
import { DComponent } from './node'
import { mount } from './hook'
import { disableSSR, enableSSR } from './config'

export function mountApp(dom: DComponent, selector: string | HTMLElement) {
  const container = isString(selector)
    ? document.querySelector(selector)
    : selector

  if (!container) {
    console.warn(`Can't find container`)
    return
  }

  container.append(dom)

  mount(dom)
}

export function renderToString(Comp: DComponent) {
  // todo
  enableSSR()

  const app = document.createElement('div')
  mountApp(Comp, app)

  disableSSR()

  return app.innerHTML
}
