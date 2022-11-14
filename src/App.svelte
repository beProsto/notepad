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

	import {load, save, connectStorage, list, add} from "./lib/ezstore";

	const assumeHref = (window.location.protocol == "http:" ? "ws://" : "wss://") + window.location.hostname + ":42069";
	// const assumeHref = "ws://localhost:90";
	console.log(assumeHref);

	// The file content
	let userInput = "";

	// These values will be updated as we change
	// Whenever the filename changes, we load up it's appropriate content.
	let filename = "this app is still loading";
	function getFilenameId(name) {
		const fnid = name + "_code";
		load(fnid, "# Hello, " + name + "!").then(res => {
			userInput = res;
		});
		return fnid;  
	}
	$: filenameId = getFilenameId(filename);

	// File List
	let filelist = [];

	// Some global functions
	setContext("saveInput", (txt) => {
		userInput = txt;
		save(filenameId, userInput);
		console.log("Saving", filename, "as", filenameId);
	});

	// Try to connect to a remote vault
	const connStatus = connectStorage(assumeHref, "SpecialVault");
	connStatus.onerror = () => {
		console.warn("Couldn't connect to designated websocket server!");
		onConnected();
	};
	connStatus.onopen = () => {
		console.log("Connected succesfully! :flushed:");
		onConnected();
	};
	function onConnected() {
		list().then(res => {
			filelist = res;
			if(filelist.length > 0) {
				finishLoad();
			}
			else {
				add("New Note").then(res => {
					filelist = res;
					finishLoad();
				});
			}
		});
		function finishLoad() {
			filename = filelist[0];
		}
	}

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

	// prevent dialogue window from popping up upon ctrl+s
	window.onkeydown = (e) => {
		if(e.ctrlKey && (e.key == "s" || e.key == "S")) {
			e.preventDefault();
		}
	};
</script>


<div id="TopBar">
	<div class="BarElem"> 
		<Nav bind:filename={filename} bind:filelist={filelist} />
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