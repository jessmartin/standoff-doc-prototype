<script lang="ts">
  import type { ActionData } from './$types'

  import { slide } from 'svelte/transition'
  import { htmlToJdom, jdomToText, jdomToHtml } from '$lib/util'
  import { onMount } from 'svelte'

  export let form: ActionData

  let readableContent = ''
  let marks: object[] = []
  let readingOrder: object[] = []
  let url = ''
  let renderedDoc = ''

  if (form && form.html) {
    const jdom = htmlToJdom(form.html)
    readableContent = jdomToText(jdom)
    renderedDoc = jdomToHtml(jdom)
    marks = jdom.marks
    readingOrder = jdom.readingOrder
    url = form.url
  }

  // handle hiding and showing different sections
  let showRawTextContent = true
  let showJDOM = true
  let showRenderedDoc = true

  onMount(() => {
    // handle highlighting selected text
    type UserMark = {
      start: number
      end: number
      markType: string
    }
    let userMarks: UserMark[] = []
    document.addEventListener('selectionchange', (event) => {
      console.log('selection event', event)
      const selection = window.getSelection()
      if (!selection) return
      console.log('selection', selection)
      // calculate the start based on the data-mark-start attribute
      const start = 1

      // and the end based on the data-mark-end attribute
      const end = 1

      const userMark: UserMark = {
        start,
        end,
        markType: 'highlight'
      }
      userMarks.push(userMark)
    })
  })
  // To render the highlight, iterate over the Reading Order blocks
  // from the start location to the end location and "apply the style"
</script>

<!-- Uncomment to debug the data returned by the form -->
<!-- {#if form}
  <p>Form data:</p>
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if} -->

<div class="border-b border-black dark:border-white p-5 pl-10">
  <form method="POST">
    <input
      type="text"
      name="url"
      value={url}
      placeholder="Enter URL"
      class="w-1/4 border border-black dark:border-white dark:bg-slate-900 p-2"
    />
    <button
      type="submit"
      class="bg-[#f4f7e7] border border-black dark:border-white dark:bg-slate-900 p-2"
      >Import</button
    >
  </form>
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
      <pre>{#if form}{form.html}{/if}</pre>
    </div>
  {/if}
</div>
<div class="p-5 pl-10">
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
        <pre>{marks.map((e) => JSON.stringify(e, null, 2)).join('\n')}</pre>
      </div>
    </div>
    <div class="border-b border-black dark:border-white p-5 pl-10 w-1/2">
      <h1 class="text-xl font-medium relative mb-5">Reading Order</h1>
      <div
        class="border border-black dark:border-white p-5 bg-[#F4F7E7] dark:bg-slate-900 overflow-scroll max-h-52"
      >
        <pre>{readingOrder.map((e) => JSON.stringify(e, null, 2)).join('\n')}</pre>
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
    <div
      class="border border-black p-5 bg-[#F4F7E7] dark:border-white dark:bg-slate-900"
      transition:slide
    >
      <article class="prose dark:prose-dark">
        {@html renderedDoc}
      </article>
    </div>
  {/if}
</div>
