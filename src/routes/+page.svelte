<script lang="ts">
  import type { ActionData } from './$types'
  import type { JDOM, UserMark } from '$lib/util'

  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { htmlToJdom, jdomToText, jdomToHtml } from '$lib/util'
  import { db, getDefaultJdom, saveArticle } from '$lib/db'
  import { liveQuery } from 'dexie'
  import { select_value } from 'svelte/internal'

  export let form: ActionData

  let jdom: JDOM | undefined
  let readableContent = ''
  let url = ''
  let renderedDoc = ''
  let jdomId = 0

  // handle hiding and showing different sections
  let showRawTextContent = false
  let showJDOM = false
  let showRenderedDoc = true

  // Support user's ability to highlight text
  let userMarks: UserMark[] = []

  $: articles = liveQuery(async () => db.jdoms.toArray())

  onMount(async () => {
    // When the page loads, check if there has been a form post
    if (form && form.html) {
      // If there is a form post, parse the HTML and display the results
      url = form.url
      jdom = htmlToJdom(url, form.html)
      readableContent = jdomToText(jdom)
      renderedDoc = jdomToHtml(jdom)
      // Add the JDOM to the db
      const id = await saveArticle(jdom)
      if (id) jdomId = parseInt(id.toString())
    } else {
      // If there is no form post, load the article from the db
      jdom = await getDefaultJdom()

      if (jdom) {
        url = jdom.url
        readableContent = jdomToText(jdom)
        renderedDoc = jdomToHtml(jdom)
        if (jdom.id) jdomId = jdom.id
      }
    }

    // handle highlighting selected text

    // This is very simple logic, and does not work well with anything beyond a
    // single block-level element containing text.
    // It also doesn't support dividing a selection into multiple userMarks based
    // on the readingOrder blocks that it spans.
    document.addEventListener('mouseup', (event) => {
      const selection = window.getSelection()

      if (!selection) return

      if (selection.anchorNode?.parentNode?.parentNode?.nodeName !== 'ARTICLE') return

      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0)
        const startElement = range.startContainer.parentElement
        let startElementStart: number = 0
        let startIndex: number = 0
        if (startElement?.hasAttribute('data-mark-start')) {
          startElementStart = startElement.getAttribute('data-mark-start') as unknown as number
          startIndex = parseInt(startElementStart) + parseInt(selection.anchorOffset)
        }

        const endElement = range.endContainer.parentElement
        let endElementStart: number = 0
        let endIndex: number = 0
        if (endElement?.hasAttribute('data-mark-start')) {
          endElementStart = endElement.getAttribute('data-mark-start') as unknown as number
          endIndex = parseInt(endElementStart) + parseInt(selection.focusOffset) - 1
        }

        if (startIndex >= endIndex + 1) return

        if (startIndex > 0 && endIndex > 0) {
          // Iterate over the reading order blocks between the start and the end
          const userMark: UserMark = {
            start: startIndex,
            end: endIndex,
            markType: 'highlight'
          }
          if (
            !userMarks.some((mark) => mark.start === userMark.start && mark.end === userMark.end)
          ) {
            userMarks.push(userMark)
            userMarks = userMarks
          }
        }
      }
      if (jdom) renderedDoc = jdomToHtml(jdom, userMarks)
    })
  })
</script>

<!-- Uncomment to debug the data returned by the form -->
<!-- {#if form}
  <p>Form data:</p>
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if} -->

<div class="border-b border-black dark:border-white p-5">
  <form method="POST" class="inline-block w-1/2">
    <input
      type="text"
      name="url"
      value={url}
      placeholder="Enter URL"
      class="w-3/4 border border-black dark:border-white dark:bg-slate-900 p-2"
    />
    <button
      type="submit"
      class="bg-[#f4f7e7] border border-black dark:border-white dark:bg-slate-900 p-2"
      >Import</button
    >
  </form>

  <div class="inline-block float-right">
    <select
      name="articles"
      id="articles"
      bind:value={jdomId}
      class="border border-black dark:border-white dark:bg-slate-900 p-2 text-right"
      on:change={async (event) => {
        if (jdomId === 0) console.log('selected id: ', jdomId)
        jdom = await db.jdoms.get(jdomId)
        console.log('jdom: ', jdom)
        if (jdom) {
          url = jdom.url
          readableContent = jdomToText(jdom)
          renderedDoc = jdomToHtml(jdom)
        }
      }}
    >
      {#if $articles}
        {#each $articles as article (article.id)}
          <option value={article.id}>{article.url}</option>
        {/each}
      {/if}
    </select>
  </div>
</div>
<div class="border-b border-black dark:border-white p-5 pl-10">
  <h1 class="text-xl font-medium relative {showRawTextContent ? 'mb-5' : 'mb-0'}" transition:slide>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      on:click={() => (showRawTextContent = !showRawTextContent)}
      class="absolute -inset-x-5 transition {showRawTextContent
        ? 'rotate-90'
        : 'rotate-0'} origin-center w-3 h-5 text-sm mt-1">&#9658;</span
    >
    Raw Text Content
  </h1>
  {#if showRawTextContent}
    <div
      class="border border-black p-5 bg-[#F4F7E7] dark:border-white dark:bg-slate-900 overflow-scroll max-h-52"
      transition:slide
    >
      <pre>{#if jdom}{jdom.rawContent}{/if}</pre>
    </div>
  {/if}
</div>
<div class="{showJDOM ? '' : 'border-b border-black dark:border-white'} p-5 pl-10">
  <h1 class="text-xl font-medium relative mb-5">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      on:click={() => (showJDOM = !showJDOM)}
      class="absolute -inset-x-5 transition {showJDOM
        ? 'rotate-90'
        : 'rotate-0'} origin-center w-3 h-5 text-sm mt-1">&#9658;</span
    >
    JDOM
  </h1>
  {#if showJDOM}
    <div transition:slide>
      <h1 class="text-xl font-medium relative mb-5">Raw Content</h1>
      <div
        class="border border-black dark:border-white p-5 bg-[#F4F7E7] dark:bg-slate-900 overflow-scroll max-h-52"
      >
        <pre>{readableContent}</pre>
      </div>
    </div>
  {/if}
</div>
{#if showJDOM}
  <div class="flex" transition:slide>
    <div class="border-b border-black dark:border-white p-5 pl-10 w-1/2">
      <h1 class="text-xl font-medium relative mb-5">Marks</h1>
      <div
        class="border border-black dark:border-white p-5 bg-[#F4F7E7] dark:bg-slate-900 overflow-scroll max-h-52"
      >
        <pre>{#if jdom}{jdom.marks.map((e) => JSON.stringify(e, null, 2)).join('\n')}{/if}</pre>
      </div>
    </div>
    <div class="border-b border-black dark:border-white p-5 pl-10 w-1/2">
      <h1 class="text-xl font-medium relative mb-5">Reading Order</h1>
      <div
        class="border border-black dark:border-white p-5 bg-[#F4F7E7] dark:bg-slate-900 overflow-scroll max-h-52"
      >
        <pre>{#if jdom}{jdom.readingOrder
              .map((e) => JSON.stringify(e, null, 2))
              .join('\n')}{/if}</pre>
      </div>
    </div>
  </div>
{/if}
<div class="border-b border-black dark:border-white p-5 pl-10">
  <h1 class="text-xl font-medium relative {showRenderedDoc ? 'mb-5' : 'mb-0'}" transition:slide>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      on:click={() => (showRenderedDoc = !showRenderedDoc)}
      class="absolute -inset-x-5 transition {showRenderedDoc
        ? 'rotate-90'
        : 'rotate-0'} origin-center w-3 h-5 text-sm mt-1">&#9658;</span
    >
    Rendered Doc
  </h1>
  {#if showRenderedDoc}
    <div class="flex" transition:slide>
      <div class="border border-black p-5 bg-[#F4F7E7] dark:border-white dark:bg-slate-900 w-3/4">
        <article class="prose dark:prose-dark">
          {@html renderedDoc}
        </article>
      </div>
      <div
        class="border border-black border-l-0 p-5 bg-[#F4F7E7] dark:border-white dark:bg-slate-900 w-1/4"
      >
        <pre>{userMarks.map((e) => JSON.stringify(e, null, 2)).join('\n')}
        </pre>
      </div>
    </div>
  {/if}
</div>
