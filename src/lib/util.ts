import * as parse5 from 'parse5'
import type { Node, Element } from 'parse5/dist/tree-adapters/default'

let readingOrderIndex = 0

export type Mark = {
  type: string
  start: number
  end: number
}

export type JDOM = {
  rawContent: string
  marks: Mark[]
  readingOrder: object[]
}

export type UserMark = {
  start: number
  end: number
  markType: string
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
  h4: 'heading4',
  h5: 'heading5',
  h6: 'heading6',
  p: 'paragraph',
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic'
}

const markTypesToTag: { [index: string]: string } = {
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading6: 'h6',
  paragraph: 'p',
  bold: 'b',
  italic: 'i'
}

const blockMarks = [
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'paragraph'
]

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

// TODO: Build a HAST and generate the HTML string
export const jdomToHtml = (jdom: JDOM, userMarks: UserMark[] = []) => {
  console.log('jdomToHtml', jdom, userMarks)
  console.log('rawContent length', jdom.rawContent.length)
  // TODO: Add a <html><head></head><body> tags at the beginning
  let html = ''
  for (const readingOrderElem of jdom.readingOrder) {
    const { start, end } = readingOrderElem as { start: number; end: number }
    const content = jdom.rawContent.slice(start, end)

    // Iterate over each character in the content string
    for (let i = 0; i < content.length; i++) {
      const char = content[i]
      const charIndex = start + i

      const activeUserMarks = userMarks.filter((mark) => {
        if (mark.start <= charIndex && mark.end >= charIndex) {
          return true
        }
      })

      // If index matches a start mark, add the start tag
      jdom.marks.map((mark) => {
        if (mark.start === charIndex) {
          html += `<${markTypesToTag[mark.type]} data-mark-start="${mark.start}" data-mark-end="${
            mark.end
          }">`
          if (activeUserMarks.length > 0) {
            html += `<span class="user-highlight">`
          }
          html += char
        }
      })

      // If index matches an end mark, add the end tag
      jdom.marks.map((mark) => {
        if (mark.end === charIndex + 1) {
          html += char
          if (activeUserMarks.length > 0) {
            html += `</span>`
          }
          html += `</${markTypesToTag[mark.type]}>`
        }
      })

      // If index matches no start or end, just add the character
      const matchTag = jdom.marks.some((mark) => {
        if (mark.start === charIndex || mark.end === charIndex + 1) {
          return true
        }
      })
      if (!matchTag) {
        if (
          activeUserMarks.length > 0 &&
          activeUserMarks.some((mark) => {
            return mark.start === charIndex
          })
        ) {
          html += `<span class="user-highlight">`
        }
        html += char
        if (
          activeUserMarks.length > 0 &&
          activeUserMarks.some((mark) => {
            return mark.end === charIndex
          })
        ) {
          html += `</span>`
        }
      }
    }
  }
  // TODO: Close with </body></html> tags

  return html
}
