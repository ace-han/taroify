import { createSelectorQuery } from "@tarojs/taro"
import { inBrowser } from "../base"
import { createNodesRef, elementUnref, isRootElement, isWindow } from "./element"

export interface Rect {
  dataset: Record<string, any>
  id: string
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export function makeRect(width: number, height: number) {
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  } as Rect
}

export function getRect(elementOrRef: any): Promise<Rect> {
  const element = elementUnref(elementOrRef)
  if (element) {
    if (inBrowser) {
      if (isWindow(element)) {
        const width = element.innerWidth
        const height = element.innerHeight
        return Promise.resolve(makeRect(width, height))
      }

      return Promise.resolve((element.getBoundingClientRect() as unknown) as Rect)
    } else {
      return new Promise<Rect>((resolve) => {
        createNodesRef(element)
          .boundingClientRect()
          .exec(([rect]) => {
            if (isRootElement(element)) {
              const { width, height } = rect
              resolve(makeRect(width, height))
            } else {
              resolve(rect)
            }
          })
      })
    }
  }
  return Promise.resolve(makeRect(0, 0))
}

export function getRects(elementOrRef: any, selector: string): Promise<Rect[]> {
  const element = elementUnref(elementOrRef)
  if (element) {
    if (inBrowser) {
      const rects: Rect[] = []
      element
        .querySelectorAll(selector)
        .forEach((oneElement) =>
          rects.push((oneElement.getBoundingClientRect() as unknown) as Rect),
        )
      return Promise.resolve(rects)
    } else {
      return new Promise<Rect[]>((resolve) => {
        createSelectorQuery()
          .selectAll("#" + element.uid + selector)
          .boundingClientRect()
          .exec(([rects]) => resolve((rects as unknown) as Rect[]))
      })
    }
  }
  return Promise.resolve([])
}
