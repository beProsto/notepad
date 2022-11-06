<style>
	#m_viewer {
		position: relative;
		left: 0;
		top: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		/* background: black; */
	}

	#m_content {
		resize: none;
		border: none none solid;
		padding: 5px 5px;
		border-radius: 5px;
		border-width: 0;
		border-image: none;
		border: 2px rgb(100, 100, 100) solid;
		margin: 0;
		outline: none;
		
		background: #313131;

		width: calc(100% - 14px);
		height: calc(100% - 14px);

		overflow-y: auto;
		overflow-x: auto;
	}
</style>

<script>
	export let userInput;
	
	function onUpdate(input) {
		let output = "";
		let lines = input.split('\n')
		let prevline = "";
		for(let line of lines) {
			// if there's two consecutive breaklines, we have a breakline 
			if(line == "" && prevline == "") {
				output += "<br/>"
			}
			// if there's at least one pound symbol, we know it's a header
			else if(line[0] == "#") {
				let headerLevel = 0;
				for(let c of line) {
					if(c != "#") {
						break;
					}
					headerLevel += 1;
				}
				output += "<h"+headerLevel+" style=\"margin: 15px 0px;\">";
				output += line.substring(headerLevel, line.length);
				output += "</h"+headerLevel+">";
			}
			// otherwise make it a paragraph
			else {
				output += "<p style=\"margin: 10px 0px;\">";
				output += line;
				output += "</p>";
			}

			prevline = line;
		}
		return output;
	}

	$: outputText = onUpdate(userInput);
</script>

<div id="m_viewer">
	<div id="m_content">{@html outputText}</div>
</div>
