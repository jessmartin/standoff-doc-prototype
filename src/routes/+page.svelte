<script lang="ts">
  import type { ActionData } from './$types'

  export let form: ActionData
</script>

{#if form}
  <p>Form data:</p>
  <pre>{JSON.stringify(form, null, 2)}</pre>
{/if}

<article class="prose dark:prose-invert" />

<div class="border-b border-black p-5 pl-10">
  <form method="POST">
    <input type="text" name="url" placeholder="Enter URL" class="w-1/4 border border-black p-2" />
    <button type="submit" class="bg-[#F4F7E7] border border-black p-2">Import</button>
  </form>
</div>
<div class="border-b border-black p-5 pl-10">
  <h1 class="text-xl font-medium relative mb-5">
    <span class="absolute -inset-x-5 rotate-90 origin-center w-3 h-5 text-sm mt-1">&#9658;</span>
    Raw Content
  </h1>
  <div class="border border-black p-5 bg-[#F4F7E7] overflow-scroll max-h-52">
    <pre>{#if form}{form.html}{/if}</pre>
  </div>
</div>
<div class="border-b border-black p-5 pl-10">
  <h1 class="text-xl font-medium relative mb-5">
    <span class="absolute -inset-x-5 rotate-90 origin-center w-3 h-5 text-sm mt-1">&#9658;</span>
    Marks
  </h1>
  <div class="border border-black p-5 bg-[#F4F7E7] overflow-scroll max-h-52">
    <pre>annotations</pre>
  </div>
</div>
