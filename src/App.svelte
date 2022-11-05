<script>
	import Editor from "./Editor.svelte";
</script>

<style>
	#EditorWrapper {
		position: absolute;
		left: 100px;
		top: 10px;
		width: 400px;
		height: 200px;
	}
	#Editor2Wrapper {
		position: absolute;
		left: 600px;
		top: 100px;
		width: 200px;
		height: 700px;
	}
</style>

<h1>Notes from beProsto</h1>

<div id="EditorWrapper">
	<Editor/>
</div>

<div id="Editor2Wrapper">
	<Editor/>
</div>

<h2>Just a test app</h2>
