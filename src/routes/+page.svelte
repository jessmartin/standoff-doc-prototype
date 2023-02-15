<script lang="ts">
  import type { PageData } from './$types'

  export let data: PageData

  function getHtml() {
    return data.html
  }
</script>

<article class="prose dark:prose-invert" />

<div class="border-b border-black p-5 pl-10">
  <!-- input for a website URL -->
  <input
    type="text"
    class="w-1/4 border border-black p-2"
    placeholder="Enter URL"
  />
  <button class="bg-[#F4F7E7] border border-black p-2">Grab URL</button>
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
			{getHtml()}
    </pre>
  </div>
</div>
