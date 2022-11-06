<style>
	button {
		width: 70px;
		height: 46px;
		text-align: center;
		padding: 3px 0 0 0;
	}
</style>

<script>
	import { setContext, getContext } from "svelte";

	let toChangeTo = getContext("prevState");
	const toggleState = getContext("toggleState");

	function onclick(e) {
		let {state, prevState} = toggleState();
		toChangeTo = prevState;
	};
</script>

<button on:click={onclick}>{toChangeTo} Mode</button>
