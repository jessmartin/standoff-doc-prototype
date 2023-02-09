<script>
	let pdfAsText = `TD
1 0 0 1 0 0 Tm
/F1 12 Tf
0 0 Td
(Hello World) Tj
ET`;
	let rawContentStream = `Hello World`;
</script>

<!-- three column layout with vanilla css styles -->
<div class="border-b border-black p-5 pl-10">
	<h1 class="text-xl font-medium relative">
		<span class="absolute -inset-x-6 rotate-90 origin-center w-5 h-7"><a href="#">&#9658;</a></span>
		Document
	</h1>
	<span>Type: PDF</span>
	<div class="border border-black p-5 bg-[#F4F7E7]">
		<pre>{pdfAsText}</pre>
	</div>
</div>
<div class="border-b border-black p-5 pl-10">
	<h1 class="text-xl font-medium relative">
		<span class="absolute -inset-x-6 rotate-90 origin-center w-5 h-7">&#9658;</span>
		Document Model
	</h1>
	<h2>Raw Content Stream</h2>
	<div class="border border-black p-5 bg-[#F4F7E7]">
		<pre>{rawContentStream}</pre>
	</div>
	<h2>Annotations</h2>
	<div class="border border-black p-5 bg-[#F4F7E7]">
		<pre>
        "type": "Annotation",
        "subtype": "Text",
        "rect": [0, 0, 100, 100],
        "contents": "Hello World"
    </pre>
	</div>
</div>
<div class="border-b border-black p-5 pl-10">
	<h1 class="text-xl font-medium relative">
		<span class="absolute -inset-x-6 rotate-90 origin-center w-5 h-7">&#9658;</span>
		Raw HTML
	</h1>
	<div class="border border-black p-5 bg-[#F4F7E7] overflow-scroll">
		<pre>
			<!-- html span tag as plain text -->

			&lt;span style="font-family: Helvetica; font-size: 12px;"&gt;Hello World&lt;/span&gt;
    </pre>
	</div>
</div>
<div class="border-b border-black p-5 pl-10">
	<h1 class="text-xl font-medium relative">
		<span class="absolute -inset-x-6 rotate-90 origin-center w-5 h-7">&#9658;</span>
		Rendered
	</h1>
	<div class="border border-black p-5 bg-[#F4F7E7]">
		<span>Hello World</span>
	</div>
</div>
