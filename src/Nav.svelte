<style>
    #NavBar {
		position: absolute;
		left: 10px;
		top: 70px;
		width: 480px;
        height: calc(100vh - 100px);
        z-index: 100;
    }
    nav {
        position: relative;
		left: 0px;
        top: 0px;
        width: 100%;
		height: 100%;
        background: rgba(0, 0, 0, 0.8);
        border: 2px white solid;
        border-radius: 5px;

        display: flex;
        flex-direction: column;
	}
	@media only screen and (max-width: 480px) {
        #NavBar {
		    top: 85px;
			width: calc(100vw - 24px);
		}
	}

    .entryButton {
        width: calc(100% - 20px);
        margin: 5px 10px;
        text-align: left;
    }
    #EntryList {
        overflow-y: auto;
        width: 100%;
    }

    form {
        width: 100%;
        height: 50px;
        padding: 10px;
    }
    .text {
        width: 68%;
    }
	@media only screen and (max-width: 480px) {
        .text {
            width: 55%;
        }
    }

</style>

<script>
    let navBarVisible = false;
    function toggleNavBar() {
        navBarVisible = !navBarVisible;
    }


    let entries = [];
    entries.push(
        "First Note",
        "Second Note",
        "Third Note",
        "Yet another Note",
    );

    let filenameInput = "Note's Name";
    function onSubmit(e) {
        e.preventDefault();
        entries = [...entries, filenameInput];
    }

    function gotoEntry(n) {
        console.log(n);
    }
</script>


<button class="EmojiButton" on:click={toggleNavBar}> {navBarVisible? "🗿" : "🏳️‍🌈"} </button>

{#if navBarVisible}
    <div id="NavBar">
        <nav>
            <form on:submit={onSubmit}>
                <input class="text" type="text" bind:value={filenameInput}>
                <input type="submit" value="Add">
            </form>
            <div id="EntryList">
                {#each entries as entry}
                    <button class="entryButton" on:click={() => gotoEntry(entry)}>{entry}</button>
                {/each}
            </div>
        </nav>
    </div>
{/if}