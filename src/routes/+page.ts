import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params }) => {
  // fetch HTML from a remote web page
  const html = await fetch(`https://maggieappleton.com/ai-dark-forest`).then(
    (res) => res.text()
  )

  console.log(html)

  return { html: html }
}
