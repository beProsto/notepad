<style>
	#m_viewer {
		position: relative;
		left: 0;
		top: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		background: black;
	}

	#m_content {
		resize: none;
		border: none none solid;
		padding: 5px 5px;
		border-radius: 5px;
		border-width: 0;
		border-image: none;
		border: 2px gray solid;
		margin: 0;
		outline: none;

		width: calc(100% - 14px);
		height: calc(100% - 14px);

		overflow-y: auto;
		overflow-x: auto;
	}
</style>

<script>
	export let filename;
	
	import {load, save} from "./lib/ezstore";
	
	const filenameId = filename + "_code";
	
	const textToParse = load(filenameId, "# Hello, world!");

	let outputText = "";

	let lines = textToParse.split('\n')
	for(let line of lines) {
		if(line[0] == "#") {
			outputText+="Header<br>";
		}
		else {
			outputText+="Usual<br>"
		}
	}
</script>

<div id="m_viewer">
	<div id="m_content">{@html outputText}</div>
</div>
