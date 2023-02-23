import Dexie, { type Table } from 'dexie'

import type { JDOM } from './util'

export class MySubClassedDexie extends Dexie {
  jdoms!: Table<JDOM>

  constructor() {
    super('standoffMarkup')
    this.version(1).stores({
      jdoms: '++id, url, rawContent' // Primary key and indexed props
    })
  }
}
export const db = new MySubClassedDexie()

export const saveArticle = async (jdom: JDOM) => {
  const article = {
    url: jdom.url,
    rawContent: jdom.rawContent,
    marks: jdom.marks,
    readingOrder: jdom.readingOrder
  }
  try {
    const id = await db.jdoms.add(article)

    console.log(`Added article '${jdom.url}' and got id: ${id}`)
    return id
  } catch (error) {
    console.log('Failed to add article to db: ', error)
  }
}

export const getDefaultJDOM = async (): Promise<JDOM | undefined> => {
  try {
    const jdom = await db.jdoms.orderBy(':id').first()
    return jdom
  } catch (error) {
    console.log('Failed to get article from db: ', error)
  }
}
