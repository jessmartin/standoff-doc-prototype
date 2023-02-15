<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types'

  export let form: ActionData
</script>

<pre>
  {JSON.stringify(form, null, 2)}
</pre>

<article class="prose dark:prose-invert" />

<div class="border-b border-black p-5 pl-10">
  <form method="POST" action="?/getHTMLfromUrl">
    <input
      type="text"
      name="url"
      placeholder="Enter URL"
      class="w-1/4 border border-black p-2"
    />
    <button type="submit" class="bg-[#F4F7E7] border border-black p-2"
      >Import</button
    >
  </form>
</div>
<div class="border-b border-black p-5 pl-10">
  <h1 class="text-xl font-medium relative">
    <span class="absolute -inset-x-6 rotate-90 origin-center w-5 h-7"
      >&#9658;</span
    >
    Raw HTML
  </h1>
  <div class="border border-black p-5 bg-[#F4F7E7] overflow-scroll">
    <pre>
      {#if form.html}
        {form.html}
      {/if}
      </pre>
  </div>
</div>
