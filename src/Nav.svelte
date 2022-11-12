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
        text-align: left;
        height: 40px;
        width: calc(100% - 80px);
    }
    .deleteButton {
        width: 40px;
        height: 40px;
        padding: 5px;
    }
    .entry {
        width: calc(100% - 20px);
        margin: 5px 10px;
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
	export let filename;

    let navBarVisible = false;
    function toggleNavBar() {
        navBarVisible = !navBarVisible;
    }

    let entries = [];
    entries.push(
        "Note",
    );

    let filenameInput = "Note's Name";
    function onSubmit(e) {
        e.preventDefault();
        entries = [...entries, filenameInput];
    }

    function gotoEntry(n) {
		filename = n;
        console.log(n);
    }
    function delEntry(n) {
        const entryToYeet = entries.findIndex((name) => n == name);

        entries.splice(entryToYeet, 1);

        entries = entries;
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
                    <div class="entry">
                        <button class="deleteButton" on:click={() => delEntry(entry)}>🗑️</button>
                        <button class="entryButton" on:click={() => gotoEntry(entry)}>{entry}</button>
                    </div>
                {/each}
            </div>
        </nav>
    </div>
{/if}