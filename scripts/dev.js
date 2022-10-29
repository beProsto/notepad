const gen = require('./gen');
const fs = require('fs');

fs.watch(gen.sourceDirectoryPath, "recursive" (eventType, filename) => {
	console.log("\nThe file", filename, "was modified!");
	console.log("The type of change was:", eventType);
})