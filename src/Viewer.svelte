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
		let isCode = false;
		let codeLang = "";
		for(let line of lines) {
			// if parsing code
			if(isCode) {
				if(line.slice(0, 3) == "```") {
					isCode = false;
					codeLang = "";

					output += "</div>";
				}
				else {
					output += line;
				}
			}
			// if there's two consecutive breaklines, we have a breakline 
			else if(line == "" && prevline == "") {
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
			// if there are 3 ` signs at the beginning of a line we start parsing it all as code
			else if(line.slice(0, 3) == "```") {
				isCode = true;
				codeLang = line.slice(3, line.length);
				console.log("started parsing '", codeLang, "' code");

				output += "<div class=\"CodeBox\">";
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
