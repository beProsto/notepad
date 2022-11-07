<style>
	#MainWrapper {
		position: relative;
		margin: 0 auto;
		left: 0px;
		top: 0px;
		width: calc(100vw - 20px);
		height: calc(100vh - 100px);
	}

	#LeftWrapper {
		width: 50%;
		height: 100%;
		float: left;
	}
	#RightWrapper {
		width: 50%;
		height: 100%;
		float: left;
	}

	#TopBar {
		display: flex;
		flex-flow: row;
  		align-items: center;
	}
	.BarElem {
		margin: 0 5px;
	}
	.RightElem {
		margin-left: auto;
	}
	@media only screen and (max-width: 480px) {
		.HideOnMobile {
			display: none;
		}
	}
</style>

<script>
	import { setContext, getContext } from "svelte";

	import Editor from "./Editor.svelte";
	import Viewer from "./Viewer.svelte";
	import Switch from "./Switch.svelte";
	import Nav from "./Nav.svelte";

	import {load, save} from "./lib/ezstore";
	
	// File to edit
	const filename = "a";
	const filenameId = filename + "_code";

	let userInput = load(filenameId, "# Hello, world!");
	setContext("saveInput", (txt) => {
		userInput = txt;
		save(filenameId, userInput);
	});

	// "State machine" - what's displayed rn
	let state = "Viewer";
	let prevState = "Editor";
	const toggleState = () => {
		state = prevState;
		prevState = (state == "Viewer" ? "Editor" : "Viewer");
		return {state, prevState};
	};
	const splitState = () => {
		if(state == "Split") {
			state = (prevState == "Viewer" ? "Editor" : "Viewer");
		}
		else {
			state = "Split";
		}
	}
	setContext("state", state);
	setContext("prevState", prevState);
	setContext("toggleState", toggleState);
</script>


<div id="TopBar">
	<div class="BarElem"> 
		<Nav/>
	</div>
	<div class="BarElem"> 
		<h2>Notepad by beProsto</h2>
	</div>
	<div class="BarElem HideOnMobile">
		<button class="EmojiButton" on:click={splitState}> 🦊 </button>
	</div>
	<div class="BarElem RightElem">
		<Switch />
	</div>
</div>

<div id="MainWrapper">
	{#if state == "Viewer"}
		<Viewer userInput={userInput} />
	{:else if state == "Editor"}
		<Editor userInput={userInput} />
	{:else}
		<div id="LeftWrapper">
			<Editor bind:userInput={userInput} />
		</div>
		<div id="RightWrapper">
			<Viewer bind:userInput={userInput} />
		</div>
	{/if}
</div>