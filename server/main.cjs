const ws = require('ws');

const server = new ws.Server({port: 42069});

const savedData = {};

function localFileLoad(vault, name, std) {
	const initName = "file_" + vault + name + "_init";
	const valName = "file_" + vault + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
		savedData[valName] = std;
	}
	return savedData[valName];
}
function localFileSave(vault, name, val) {
	const initName = "file_" + vault + name + "_init";
	const valName = "file_" + vault + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
	}
	savedData[valName] = val;
	return;
}

function localList(vault) {
	const initName = "list_" + vault + "_init";
	const valName = "list_" + vault + "_val";

	if(!savedData[initName]) {
		savedData[initName] = true;
		savedData[valName] = ["First Remote Note"];
	}
	
	console.log("LIST", savedData[valName]);
	
	return savedData[valName];
}
function localAdd(vault, entry) {
	const initName = "list_" + vault + "_init";
	const valName = "list_" + vault + "_val";

	if(!savedData[initName]) {
		savedData[initName] = true;
	}

	savedData[valName] = [...savedData[valName], entry];

	console.log("ADD", savedData[valName]);

	return savedData[valName];
}
function localDel(vault, entry) {
	const initName = "list_" + vault + "_init";
	const valName = "list_" + vault + "_val";
	
	if(!savedData[initName]) {
		savedData[initName] = true;
	}

	const idEntryToYeet = savedData[valName].findIndex((name) => entry == name);
	savedData[valName].splice(idEntryToYeet, 1);
	savedData[valName] = savedData[valName];

	console.log("DEL", savedData[valName]);

	return savedData[valName];
}


server.on("connection", (client) => {
	client.on("message", (rdata) => {
		const msg = JSON.parse(rdata);
		console.log("Recv:", msg);
		
		if(msg.action == "conn") {
			client.vault = msg.vault;
			client.send(JSON.stringify(msg));
		}
		else if(msg.action == "load") {
			const content = localFileLoad(client.vault, msg.file, msg.std);
			const toSend = JSON.stringify({
				action: "load",
				file: msg.file,
				content: content
			});
			console.log(toSend);
			client.send(toSend);
		}
		else if(msg.action == "save") {
			localFileSave(client.vault, msg.file, msg.val);
		}
		else if(msg.action == "list") {
			const toSend = JSON.stringify({
				action: "list",
				list: localList(client.vault)
			});
			console.log(toSend);
			client.send(toSend);
		}
		else if(msg.action == "add") {
			const toSend = JSON.stringify({
				action: "list",
				list: localAdd(client.vault, msg.entry)
			});
			console.log(toSend);
			client.send(toSend);
		}
		else if(msg.action == "del") {
			const toSend = JSON.stringify({
				action: "list",
				list: localDel(client.vault, msg.entry)
			});
			console.log(toSend);
			client.send(toSend);
		}
	});
	client.on("close", () => {
		console.log("client disconnected!");
	});
});