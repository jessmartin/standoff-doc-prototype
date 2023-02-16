import * as parse5 from 'parse5'
import type { Node } from 'parse5/dist/tree-adapters/default'
import type { Element } from 'parse5/dist/tree-adapters/default'

export const generateJDOM = (html: string) => {
  const jdom = {
    rawContent: html,
    marks: [],
    readingOrder: []
  }

  const tree = parse5.parse(html, { sourceCodeLocationInfo: true })
  walk(tree.childNodes, jdom.marks)
  console.log(jdom.marks)

  return jdom
}

const walk = (nodes: Node[], marks: Object[]) => {
  if (!nodes) return
  for (let node of nodes) {
    console.log(node)
    if (
      node.nodeName !== undefined &&
      node.nodeName !== '#text' &&
      node.nodeName !== ''
    ) {
      const element: Element = node as Element
      walk(element.childNodes, marks)
    } else if (node.nodeName === '#text') {
      if (node.parentNode && node.parentNode.sourceCodeLocation) {
        const mark = {
          type: node.parentNode.nodeName,
          start: node.parentNode.sourceCodeLocation.startOffset,
          end: node.parentNode.sourceCodeLocation.endOffset
        }
        marks.push(mark)
      }
    }
  }
}
