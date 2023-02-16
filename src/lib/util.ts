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
  walk(tree.childNodes, jdom.marks, jdom.readingOrder)

  return jdom
}

const nodesToMark: { [index: string]: string } = {
  h1: 'heading1',
  p: 'paragraph',
  b: 'bold'
}

const nodesNotToRead: [string] = ['nav']
let readingOrderIndex = 0

const walk = (nodes: Node[], marks: object[], readingOrder: object[] = [], readable = true) => {
  if (!nodes) return
  for (const node of nodes) {
    if (nodeIsElement(node)) {
      const element: Element = node as Element
      if (readable && Object.keys(nodesToMark).includes(element.nodeName)) {
        const mark = {
          type: nodesToMark[element.nodeName],
          start: element.sourceCodeLocation?.startTag?.endOffset,
          end: element.sourceCodeLocation?.endTag?.startOffset
        }
        marks.push(mark)
      }

      if (nodesNotToRead.includes(element.nodeName)) {
        walk(element.childNodes, marks, readingOrder, false)
      } else {
        walk(element.childNodes, marks, readingOrder, readable)
      }
    } else if (node.nodeName === '#text') {
      if (readable) {
        const readingOrderElem = {
          start: node.sourceCodeLocation?.startOffset,
          end: node.sourceCodeLocation?.endOffset,
          index: readingOrderIndex++
        }
        readingOrder.push(readingOrderElem)
      }
    }
  }
}

const nodeIsElement = (node: Node): node is Element => {
  return node.nodeName !== undefined && node.nodeName !== '#text' && node.nodeName !== ''
}
