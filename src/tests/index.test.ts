import { describe, it, expect } from 'vitest'
import { generateJDOM } from '../lib/util'

describe('generateJDOM', () => {
  it('should return a JDOM object', () => {
    const jdom = generateJDOM(
      '<h1>Fox</h1><nav><h1>Content</h1></nav><p>The fox <b>jumped</b>.</p>'
    )

    expect(jdom).toHaveProperty('rawContent')
    expect(jdom).toHaveProperty('marks')
    expect(jdom).toHaveProperty('readingOrder')

    expect(jdom.rawContent).toBe(
      '<h1>Fox</h1><nav><h1>Content</h1></nav><p>The fox <b>jumped</b>.</p>'
    )
    expect(jdom.marks).toContainEqual({ type: 'h1', start: 4, end: 7 })
  })
})
