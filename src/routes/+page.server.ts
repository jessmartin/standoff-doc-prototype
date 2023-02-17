import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData()
    const url = String(formData.get('url'))

    if (!url) {
      return fail(400, { url, missing: true })
    }

    const html = await fetch(url).then((res) => res.text())
    // TODO: Handle errors on fetch and show in UI

    return { url: url, html: html }
  }
}
