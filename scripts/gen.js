const fs = require('fs');
const path = require('path');

const sourceDirectoryPath = path.join(__dirname, '..', 'src');
const publicDirectoryPath = path.join(__dirname, '..', 'public');
const templateDirectoryPath = path.join(__dirname, '..', 'templates');

module.exports = {
	sourceDirectoryPath,
	publicDirectoryPath,
	templateDirectoryPath,
	build: () => {
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
		
		function parsePage(pageFilename) {
			const pageCodePre = fs.readFileSync(pageFilename);
		
			return pageCodePre;
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
			console.log(pageName);
			makeDirFor(pageName);
			fs.writeFileSync(pageName, templatePage(pageFilename));
		}
		
		console.log("Pages built:");
		pageFilenames.forEach(pageFilename => {
			buildPage(pageFilename);
		});
		console.log("___");
	}
};
