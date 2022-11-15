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
    import { add, del, list } from "./lib/ezstore";

	export let filename;
	export let filelist;

	let freeze = false;

    let navBarVisible = false;
    function toggleNavBar() {
        navBarVisible = !navBarVisible;
    }

    let filenameInput = "Note's Name";

    function gotoEntry(n) {
		filename = n;
        console.log(n);
    }
	function addEntry(e) {
		e.preventDefault();
		// filelist = [...filelist, filenameInput];
		add(filenameInput).then(res => {
			filelist = res;
		});
	}
    function delEntry(n) {
		del(n).then(res => {
			filelist = res;
			if(filelist.length > 0) {
				filename = filelist[0];
			}
			else {
				add("New Note").then(res => {
					filelist = res;
					filename = filelist[0];
				});
			}
		});
    }
</script>


<button class="EmojiButton" on:click={toggleNavBar}> {navBarVisible? "🗿" : "🏳️‍🌈"} </button>

{#if navBarVisible}
    <div id="NavBar">
        <nav>
            <form on:submit={addEntry}>
                <input class="text" type="text" bind:value={filenameInput}>
                <input type="submit" value="Add">
            </form>
            <div id="EntryList">
                {#each filelist as entry}
                    <div class="entry">
                        <button class="deleteButton" on:click={() => delEntry(entry)}>🗑️</button>
                        <button class="entryButton" on:click={() => gotoEntry(entry)}>{entry}</button>
                    </div>
                {/each}
            </div>
        </nav>
    </div>
{/if}