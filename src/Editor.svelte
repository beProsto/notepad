<style>
	#m_editor {
		position: relative;
		left: 0;
		top: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		/* background: black; */
	}

	textarea {
		resize: none;
		border: none none solid;
		padding: 5px 5px;
		border-radius: 5px;
		border-width: 0;
		border-image: none;
		border: 2px rgb(120, 0, 120) solid;
		margin: 0;
		outline: none;

		background: #2c2c2c;

		width: calc(100% - 14px);
		height: calc(100% - 14px);

		font-family: 'Courier New', Courier, monospace;
	}
</style>

<script>
	export let userInput;

    import { getContext } from "svelte";
	
	const saveInput = getContext("saveInput");

	const processInput = (e) => {
		saveInput(userInput);
	};
</script>

<div id="m_editor">
	<textarea spellcheck="false" autocomplete="true" on:change={processInput} bind:value={userInput}></textarea>
</div>
