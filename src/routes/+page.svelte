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
<div class="container">
	<div style="border:1px solid black; padding:5px 10px; margin-bottom: 10px;">
		<h1>Original Doc</h1>
		<span>Type: PDF</span>
		<pre>
      <!-- the raw data for a simple PDF document -->
{pdfAsText}
    </pre>
	</div>
	<div style="border:1px solid black; padding:5px 10px; margin-bottom: 10px;">
		<h1>Document Model</h1>
		<h2>Raw Content Stream</h2>
		<pre>{rawContentStream}</pre>
		<h2>Annotations</h2>
		<pre>
        "type": "Annotation",
        "subtype": "Text",
        "rect": [0, 0, 100, 100],
        "contents": "Hello World"
    </pre>
	</div>
	<div style="border:1px solid black; padding:5px 10px; margin-bottom: 10px;">
		<h1>Raw HTML</h1>
		<pre>
			<!-- html span tag as plain text -->

			&lt;span style="font-family: Helvetica; font-size: 12px;"&gt;Hello World&lt;/span&gt;
    </pre>
	</div>
	<div style="border:1px solid black; padding:5px 10px; margin-bottom: 10px;">
		<h1>Rendered</h1>
		<span style="font-family: Helvetica; font-size: 12px;">Hello World</span>
	</div>
</div>
