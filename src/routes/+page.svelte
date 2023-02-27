<script lang="ts">
  import type { ActionData } from './$types'
  import type { JDOM, UserMark } from '$lib/util'

  import { onMount } from 'svelte'
  import { htmlToJdom, jdomToText, jdomToHtml } from '$lib/util'
  import { db, getDefaultJdom, saveArticle } from '$lib/db'
  import { liveQuery } from 'dexie'

  export let form: ActionData

  let jdom: JDOM | undefined
  let readableContent = ''
  let url = ''
  let renderedDoc = ''
  let jdomId = 0
  let userMarks: UserMark[] = []

  $: articles = liveQuery(async () => db.jdoms.toArray())

  const loadJdomContent = async () => {
    if (jdom) {
      if (jdom.id) jdomId = jdom.id
      url = jdom.url
      readableContent = jdomToText(jdom)
      userMarks = await db.highlights.where('jdomId').equals(jdomId).toArray()
      renderedDoc = jdomToHtml(jdom, userMarks)
    }
  }

  onMount(async () => {
    // When the page loads, check if there has been a form post
    if (form && form.html) {
      // If there is a form post, parse the HTML and display the results
      url = form.url
      jdom = htmlToJdom(url, form.html)
      loadJdomContent()
      // Add the JDOM to the db
      const id = await saveArticle(jdom)
      if (id) jdomId = parseInt(id.toString())
    } else {
      // If there is no form post, load the article from the db
      jdom = await getDefaultJdom()

      if (jdom) {
        loadJdomContent()
      }
    }

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
            jdomId: jdomId,
            start: startIndex,
            end: endIndex,
            markType: 'highlight'
          }
          if (
            !userMarks.some((mark) => mark.start === userMark.start && mark.end === userMark.end)
          ) {
            userMarks.push(userMark)
            db.highlights.add(userMark)
            userMarks = userMarks
          }
        }
      }
      if (jdom) renderedDoc = jdomToHtml(jdom, userMarks)
    })
  })

  const clearDatabases = async () => {
    await db.jdoms.clear()
    jdomId = 0
    jdom = undefined
    url = ''
    readableContent = ''
    renderedDoc = ''
    userMarks = []
  }

  let activeMainPanel = 'original'
  let activeSidebar = 'highlights'
</script>

<div
  class="border-b border-black dark:bg-[#333333] dark:border-[#3D3D3D] grid h-full grid-cols-[1fr_320px] grid-rows-[29px,_1fr]"
>
  <div class="col-auto border-b border-black dark:border-[#3D3D3D]">
    <nav class="inline-block mr-3">
      <ul class="list-none dark:bg-[#292929] ">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeMainPanel ===
          'original'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeMainPanel = 'original')}
        >
          Original
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeMainPanel ===
          'text'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeMainPanel = 'text')}
        >
          Text
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeMainPanel ===
          'rendered'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeMainPanel = 'rendered')}
        >
          Rendered
        </li>
      </ul>
    </nav>

    <form method="POST" class="w-1/3 inline-block mr-3">
      <div class="flex flex-grow">
        <input
          type="text"
          name="url"
          value={url}
          placeholder="Enter URL"
          class="border-x border-black dark:border-[#3D3D3D] dark:bg-[#242424] p-1 px-2 grow"
        /><button
          type="submit"
          class="bg-[#f4f7e7] border-r border-black dark:border-[#3D3D3D] dark:bg-[#242424] p-1 px-2 dark:hover:bg-black dark:hover:text-white w-16"
          >Import</button
        >
      </div>
    </form>

    <div class="inline-block">
      <select
        name="articles"
        id="articles"
        bind:value={jdomId}
        class="border-x border-black dark:border-[#3D3D3D] dark:bg-[#242424] p-1 px-2 text-right"
        on:change={async (event) => {
          jdom = await db.jdoms.get(jdomId)
          if (jdom) loadJdomContent()
        }}
      >
        {#if $articles}
          {#each $articles as article (article.id)}
            <option value={article.id}>{article.url}</option>
          {/each}
        {/if}
      </select>

      {#if $articles && $articles.length > 0}
        <button
          type="button"
          class="p-1 mr-2 after:content-['💣'] hover:after:content-['💥'] duration-100 ease-in-out transform hover:scale-150"
          title="Clear all articles"
          on:click={clearDatabases}
        />
      {/if}
    </div>
  </div>
  <div class="col-auto border-b border-black dark:border-[#3D3D3D]">
    <nav class="inline-block">
      <ul class="list-none dark:bg-[#292929] border-l dark:border-[#3D3D3D]">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeSidebar ===
          'marks'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeSidebar = 'marks')}
        >
          Marks
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeSidebar ===
          'readingOrder'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeSidebar = 'readingOrder')}
        >
          Reading Order
        </li>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="bg-[] dark:bg-[#292929] p-1 px-2 dark:hover:bg-black dark:hover:text-white inline-block hover:cursor-pointer {activeSidebar ===
          'highlights'
            ? 'bg-white text-black border-x border-black dark:bg-black dark:text-white'
            : ''}"
          on:click={() => (activeSidebar = 'highlights')}
        >
          Highlights
        </li>
      </ul>
    </nav>
  </div>

  <div class="col-auto dark:bg-[#242424] overflow-y-auto">
    {#if jdom}
      {#if activeMainPanel === 'rendered'}
        <article class="prose dark:prose-dark dark:text-white p-5">
          {@html renderedDoc}
        </article>
      {/if}
      {#if activeMainPanel === 'text'}
        Text
      {/if}
      {#if activeMainPanel === 'original'}
        <pre>{#if jdom}{jdom.rawContent}{/if}</pre>
      {/if}
    {:else}
      <p class="text-center mt-10">Enter a URL above to Import a page.</p>
    {/if}
  </div>
  <div class="col-auto overflow-y-auto dark:bg-[#242424] border-l dark:border-[#3D3D3D]">
    {#if activeSidebar === 'marks'}
      <pre>{#if jdom}{jdom.marks.map((e) => JSON.stringify(e, null, 2)).join('\n')}{/if}</pre>
    {/if}
    {#if activeSidebar === 'readingOrder'}
      <pre>{#if jdom}{jdom.readingOrder
            .map((e) => JSON.stringify(e, null, 2))
            .join('\n')}{/if}</pre>
    {/if}
    {#if activeSidebar === 'highlights'}
      <pre>{userMarks.map((e) => JSON.stringify(e, null, 2)).join('\n')}</pre>
    {/if}
  </div>
</div>
