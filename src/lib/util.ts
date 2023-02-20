import * as parse5 from 'parse5'
import type { Node, Element } from 'parse5/dist/tree-adapters/default'

let readingOrderIndex = 0

type JDOM = {
  rawContent: string
  marks: object[]
  readingOrder: object[]
}

export const htmlToJdom = (html: string) => {
  readingOrderIndex = 0

  const tree = parse5.parse(html, { sourceCodeLocationInfo: true })

  const jdom: JDOM = {
    rawContent: html,
    marks: [],
    readingOrder: []
  }

  walk(tree.childNodes, jdom.marks, jdom.readingOrder)

  return jdom
}

const nodesToMark: { [index: string]: string } = {
  h1: 'heading1',
  h2: 'heading2',
  h3: 'heading3',
  p: 'paragraph',
  b: 'bold',
  strong: 'bold'
}

const nodesNotToRead: string[] = ['nav', 'head', 'style', 'script', 'footer']

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

export const jdomToText = (jdom: JDOM) => {
  let readingOrderContent = ''
  for (const readingOrderElem of jdom.readingOrder) {
    const { start, end } = readingOrderElem as { start: number; end: number }
    const content = jdom.rawContent.slice(start, end)
    readingOrderContent += content
  }
  return readingOrderContent
}

export const jdomToHtml = (jdom: JDOM) => {
  // Add a <html><head></head><body> tags at the beginning
  // Iterate over each reading order element
  // -- Iterate over each character in the reading order element
  // ---- Find any marks that match the index of the character
  // ------ If index matches a start mark, add the start tag
  // ------ If index matches an end mark, add the end tag
  // Close with </body></html> tags
}
