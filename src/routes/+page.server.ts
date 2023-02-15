import { fail, json } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const actions: Actions = {
  getHTMLfromUrl: async ({ request }) => {
    const formData = await request.formData()
    const url = String(formData.get('url'))

    if (!url) {
      return fail(400, { url, missing: true })
    }

    const html = await fetch(url).then((res) => res.text())

    return { html: html }
  }
}
