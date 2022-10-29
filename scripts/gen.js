const fs = require('fs');
const path = require('path');
const { exit } = require('process');

const sourceDirectoryPath = path.join(__dirname, '..', 'src');
const publicDirectoryPath = path.join(__dirname, '..', 'public');
const templateDirectoryPath = path.join(__dirname, '..', 'templates');

module.exports = {
	sourceDirectoryPath,
	publicDirectoryPath,
	templateDirectoryPath,
	build: (dev = false) => {
		const pageTemplate = fs.readFileSync(path.join(templateDirectoryPath, "index.html"), 'utf-8');

		function findFiles(where) {
			let list = [];
			const files = fs.readdirSync(where);
		
			files.forEach((file) => {
				const stat = fs.lstatSync(path.join(where, file));
				if(stat.isDirectory()) {
					list = list.concat(findFiles(path.join(where, file)));
				} else {
					list.push(path.join(where, file));
				}
			});
		
			// When running on windows, filenames will use "\" instead of "/".
			// We want to use the usual "/" no matter the operating system.
			for(let i = 0; i < list.length; i++) {
				list[i] = list[i].replace('\\', '/');
			}
		
			return list;
		}
		
		console.log("___");
		console.log("All files in the source directory:");
		const sourceFilenames = findFiles(sourceDirectoryPath);
		sourceFilenames.forEach(filename => {
			console.log("->", filename);
		});
		console.log("___");
		
		console.log("Page files in the source directory:");
		const pageFilenames = [];
		sourceFilenames.forEach(filename => {
			if(filename.endsWith("page.html")) {
				console.log("->", filename);
				pageFilenames.push(filename);
			}
		});
		console.log("___");
		
		function allIndexOf(str, toSearch) {
			var indices = [];
			for(var pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
				indices.push(pos);
			}
			return indices;
		}

		function loadElement(code) {
			let codePro = "";
			
			let lastIndex = 0;

			const indices = allIndexOf(code, "<import ");
			indices.forEach(i => {
				let srcI = code.indexOf("src", i);
				srcI = code.indexOf("=", srcI);
				srcI = code.indexOf("\"", srcI);
				srcI += 1;
				const srcE = code.indexOf("\"", srcI);

				const filename = code.slice(srcI, srcE);

				const end = code.indexOf("/>", srcE);

				codePro += code.slice(lastIndex, i);

				try {
					const elCode = fs.readFileSync(path.join(sourceDirectoryPath, filename), "utf-8");
					codePro += loadElement(elCode);
					console.log("- -> imported", filename);
				}
				catch(err) {
					console.error(`- -> file couldn't load: ${filename}`);
					if(!dev) {
						exit(1);
					}
					else {
						codePro += `<p class="error">File couldn't load: ${filename}</p>`;
					}
				}

				lastIndex = end+2;
			});
			codePro += code.substring(lastIndex, code.length);
			
			return codePro;
		}

		function parsePage(pageFilename) {
			const pageCodePre = fs.readFileSync(pageFilename, "utf-8");

			const pageCodePro = loadElement(pageCodePre);

			return pageCodePro;
		}
		
		function templatePage(pageFilename) {
			const pageCode = parsePage(pageFilename);
			const finalCode = pageTemplate.replace("{body}", pageCode);
			return finalCode;
		}
		
		function makeDirFor(filePath) {
			const dirname = path.dirname(filePath);
			if(fs.existsSync(dirname)) {
				return true;
			}
			makeDirFor(dirname);
			fs.mkdirSync(dirname);
		}

		function buildPage(pageFilename) {
			let pageName = path.relative(sourceDirectoryPath, pageFilename);
			pageName = path.join(publicDirectoryPath, pageName);
			pageName = pageName.replace("page.html", "index.html");
			console.log("->", pageName);
			makeDirFor(pageName);
			fs.writeFileSync(pageName, templatePage(pageFilename));
		}
		
		console.log("Cleaning step:");
		try {
			fs.rmSync(publicDirectoryPath, { recursive: true });
			console.log("-> cleaned", publicDirectoryPath);
		}
		catch(err) {
			console.error("-> error while cleaning", publicDirectoryPath);
		}
		console.log("___");


		console.log("Copying step:");
		sourceFilenames.forEach(filename => {
			if(!filename.endsWith(".html")) {
				let fname = path.relative(sourceDirectoryPath, filename);
				fname = path.join(publicDirectoryPath, fname);
				console.log("->", fname);
				makeDirFor(fname);
				fs.copyFileSync(filename, fname);
			}
		});
		console.log("___");

		console.log("Pages built:");
		pageFilenames.forEach(pageFilename => {
			buildPage(pageFilename);
		});
		console.log("___");
	}
};
