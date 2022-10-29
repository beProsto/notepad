const gen = require('./gen');
const chokidar = require('chokidar');

chokidar.watch(gen.sourceDirectoryPath).on('all', (event, path) => {
	console.log("Dev action detected: ", event, path);
	if(event == "change") {
		gen.build();
	}
});