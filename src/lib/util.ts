import * as parse5 from 'parse5'

export const generateJDOM = (html: string) => {
  const jdom = {
    rawContent: html,
    marks: [],
    readingOrder: []
  }

  const tree = parse5.parse(html, { sourceCodeLocationInfo: true })

  const

  return jdom
}

const walk = (nodes: parse5.Node[]) => {
  if (!nodes) return
  walk(nodes[0].childNodes)
}
