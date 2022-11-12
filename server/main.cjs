const ws = require('ws');

const server = new ws.Server({port: 42069});

const savedData = {
	pre_a_code_init: true,
	pre_a_code_val: "This is on the server lol"
};
function localFileLoad(name, std) {
	const initName = "pre_" + name + "_init";
	const valName = "pre_" + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
		savedData[valName] = std;
	}
	return savedData[valName];
}
function localFileSave(name, val) {
	const initName = "pre_" + name + "_init";
	const valName = "pre_" + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
	}
	savedData[valName] = val;
	return;
}

server.on("connection", (client) => {
	client.on("message", (rdata) => {
		const msg = JSON.parse(rdata);
		console.log("Recv:", msg);
		
		if(msg.action == "conn") {
			client.send(JSON.stringify(msg));
		}
		else if(msg.action == "load") {
			const content = localFileLoad(msg.file, msg.std);
			const toSend = JSON.stringify({
				action: "load",
				file: msg.file,
				content: content
			});
			console.log(toSend);
			client.send(toSend);
		}
		else if(msg.action == "save") {
			localFileSave(msg.file, msg.val);
		}
	});
	client.on("close", () => {
		console.log("client disconnected!");
	});
});