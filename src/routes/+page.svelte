<script lang="ts">
  import type { ActionData } from './$types'

  import { generateJDOM, readingOrderContentFromJDOM } from '$lib/util'

  export let form: ActionData

  let readableContent: string = ''
  let marks: object[] = []
  let readingOrder: object[] = []

  if (form && form.html) {
    const jdom = generateJDOM(form.html)
    readableContent = readingOrderContentFromJDOM(jdom)
    marks = jdom.marks
    readingOrder = jdom.readingOrder
  }
</script>

<!-- {#if form}
  <p>Form data:</p>
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if} -->

<div class="border-b border-black dark:border-white p-5 pl-10">
  <form method="POST">
    <input
      type="text"
      name="url"
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
  <h1 class="text-xl font-medium relative mb-5">
    <span class="absolute -inset-x-5 rotate-90 origin-center w-3 h-5 text-sm mt-1">&#9658;</span>
    Raw Text Content
  </h1>
  <div
    class="border border-black p-5 bg-[#F4F7E7] dark:border-white dark:bg-slate-900 overflow-scroll max-h-52"
  >
    <pre>{#if form}{form.html}{/if}</pre>
  </div>
</div>
<div class="p-5 pl-10">
  <h1 class="text-xl font-medium relative mb-5">
    <span class="absolute -inset-x-5 rotate-90 origin-center w-3 h-5 text-sm mt-1">&#9658;</span>
    JDOM
  </h1>
  <h1 class="text-xl font-medium relative mb-5">Raw Content</h1>
  <div
    class="border border-black dark:border-white p-5 bg-[#F4F7E7] dark:bg-slate-900 overflow-scroll max-h-52"
  >
    <pre>{readableContent}</pre>
  </div>
</div>
<div class="flex">
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
