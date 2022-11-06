<style>
	#MainWrapper {
		position: relative;
		margin: 0 auto;
		left: 0px;
		top: 0px;
		width: 90%;
		height: 80vh;
	}
</style>

<script>
	import { setContext, getContext } from "svelte";

	import Editor from "./Editor.svelte";
	import Viewer from "./Viewer.svelte";
	import Switch from "./Switch.svelte";

	let state = "Viewer";
	let prevState = "Editor";
	setContext("state", state);
	setContext("prevState", prevState);
	setContext("toggleState", () => {
		const temp = state;
		state = prevState;
		prevState = temp;
		return {state, prevState};
	});



</script>

<h1>Notes from beProsto</h1>

<div id="MainWrapper">
	{#if state == "Viewer"}
		<Viewer filename="a" />
	{:else}
		<Editor filename="a" />
	{/if}
</div>

<Switch />

