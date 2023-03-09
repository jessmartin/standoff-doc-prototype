import { describe, it, expect } from 'vitest'
import { htmlToJdom, jdomToText, jdomToHtml, type UserMark } from '../lib/util'
import { articleHtml } from './articleFixture'

const jdom = htmlToJdom(
  'http://foxes.com',
  '<h1>Fox</h1><nav><h1>Content</h1></nav><p>The fox <b>jumped</b>.</p>'
)

describe('htmlToJdom', () => {
  it('should return a JDOM object', () => {
    expect(jdom).toHaveProperty('rawContent')
    expect(jdom).toHaveProperty('marks')
    expect(jdom).toHaveProperty('readingOrder')

    expect(jdom.rawContent).toBe(
      '<h1>Fox</h1><nav><h1>Content</h1></nav><p>The fox <b>jumped</b>.</p>'
    )
  })

  it('should correctly parse <h1>s', () => {
    expect(jdom.marks).toContainEqual({ type: 'heading1', start: 4, end: 7 })
  })

  it('should not create marks for elements inside <nav>', () => {
    expect(jdom.marks).not.toContainEqual({
      type: 'heading1',
      start: 21,
      end: 28
    })
  })

  it('should correctly parse <p>s', () => {
    expect(jdom.marks).toContainEqual({ type: 'paragraph', start: 42, end: 64 })
  })

  it('should correctly parse <b>s', () => {
    expect(jdom.marks).toContainEqual({ type: 'bold', start: 53, end: 59 })
  })

  it('should correctly parse readingOrder', () => {
    expect(jdom.readingOrder).toContainEqual({ start: 4, end: 7, index: 0 })
  })

  it('should not parse readingOrder for elements inside <nav>', () => {
    expect(jdom.readingOrder).not.toContainEqual({
      start: 21,
      end: 28,
      index: expect.any(Number)
    })
  })

  it('should handle DOCTYPE', () => {
    const jdom = htmlToJdom(
      'http://foxes.com',
      '<!DOCTYPE html><html><head></head><body><p>The fox <b>jumped</b>.</p></body></html>'
    )
    expect(jdom.readingOrder.length).toBe(3)
  })

  it('should handle self-closing tags', () => {
    const jdom = htmlToJdom(
      'http://foxes.com',
      '<html><head><meta http-equiv="x-ua-compatible" content="ie=edge"/></head><body><p>The fox <b>jumped</b>.</p><br/><meta attr="something"/><p>More content</p></body></html>'
    )
    expect(jdom.readingOrder.length).toBe(4)
  })

  it('should not parse blockquote elements', () => {
    const jdom = htmlToJdom(
      'http://foxes.com',
      '<html><head></head><body><p>The fox <b>jumped</b>.</p><blockquote>Some quote</blockquote></body></html>'
    )
    expect(jdom.readingOrder.length).toBe(3)
  })

  describe('with real-world HTML', () => {
    it.todo('all paragraph elements should have a start and an end', () => {
      const realWorldJdom = htmlToJdom('http://foxes.com', articleHtml)
      const paragraphs = realWorldJdom.marks.filter((m) => m.type === 'paragraph')
      expect(paragraphs).toMatchObject({
        start: expect.any(Number),
        end: expect.any(Number),
        type: 'paragraph'
      })
    })
  })
})

describe('jdomToText', () => {
  it('should return a string', () => {
    const readingOrderContent = jdomToText(jdom)
    expect(typeof readingOrderContent).toBe('string')
  })

  it('should return only the content in reading order', () => {
    const readingOrderContent = jdomToText(jdom)
    expect(readingOrderContent).toEqual('FoxThe fox jumped.')
  })
})

describe('toHTMLFromJDOM', () => {
  it('should return a string', () => {
    const html = jdomToHtml(jdom)
    expect(typeof html).toBe('string')
  })

  it('should support <b> tags', () => {
    const html = jdomToHtml(jdom)
    expect(html).toContain('The fox <b data-mark-start="53" data-mark-end="59">jumped</b>.')
  })

  it('should omit non-reader content such as <nav> and its children', () => {
    const html = jdomToHtml(jdom)
    expect(html).not.toContain('Content')
  })

  it('should render <span class="highlight"> tags for user marks', () => {
    const jdom = htmlToJdom('http://foxes.com', '<p>The fox <b>jumped</b>.</p>')
    const userMarks: UserMark[] = []
    userMarks.push({ markType: 'highlight', start: 3, end: 9 })
    const html = jdomToHtml(jdom, userMarks)
    expect(html).toContain('<span class="user-highlight">The fox</span>')
  })

  it.todo('should render multiple spans across block elements')
})
