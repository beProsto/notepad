// Just FYI - if at any point in this you feel lost, know; me too

let wsocket = null;
const wsinfo = { opened: false, url: "", vault: "" };

const updates = { onfile: (file, content)=>{}, onlist: ()=>{} };

// File operations
let savedData = JSON.parse(localStorage.getItem("__fileList__") || "{}");

function localLoad(name, std) {
	const initName = "file_" + wsinfo.vault + name + "_init";
	const valName = "file_" + wsinfo.vault + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
		savedData[valName] = std;
	}
	return savedData[valName];
}
function localSave(name, val) {
	const initName = "file_" + wsinfo.vault + name + "_init";
	const valName = "file_" + wsinfo.vault + name + "_val";
	if(!savedData[initName]) {
		savedData[initName] = true;
	}
	savedData[valName] = val;

	localStorage.setItem("__fileList__", JSON.stringify(savedData));
	return;
}

function remoteLoad(name, std) {
	return new Promise(resolve => {
		const composedQuery = {
			action: "load",
			file: name,
			std: std
		};

		wsocket.send(JSON.stringify(composedQuery));
		
		updates.onfile = (file, content) => {
			resolve(content);
		};
	});
}
function remoteSave(name, val) {
	const composedQuery = {
		action: "save",
		file: name,
		val: val
	};
	wsocket.send(JSON.stringify(composedQuery));
}

let fileList = [];

// File List Operations
function localList() {
	const initName = "list_" + wsinfo.vault + "_init";
	const valName = "list_" + wsinfo.vault + "_val";

	if(!savedData[initName]) {
		savedData[initName] = true;
		savedData[valName] = ["First Remote Note"];
	}
	
	console.log("LIST", savedData[valName]);
	
	return savedData[valName];
}
function localAdd(entry) {
	const initName = "list_" + wsinfo.vault + "_init";
	const valName = "list_" + wsinfo.vault + "_val";

	if(!savedData[initName]) {
		savedData[initName] = true;
	}

	if(savedData[valName].includes(entry)) {
		return savedData[valName];
	}

	savedData[valName] = [...savedData[valName], entry];

	console.log("ADD", savedData[valName]);

	localStorage.setItem("__fileList__", JSON.stringify(savedData));
	return savedData[valName];
}
function localDel(entry) {
	const initName = "list_" + wsinfo.vault + "_init";
	const valName = "list_" + wsinfo.vault + "_val";
	
	if(!savedData[initName]) {
		savedData[initName] = true;
	}

	const idEntryToYeet = savedData[valName].findIndex((name) => entry == name);
	savedData[valName].splice(idEntryToYeet, 1);
	savedData[valName] = savedData[valName];

	console.log("DEL", savedData[valName]);

	localStorage.setItem("__fileList__", JSON.stringify(savedData));
	return savedData[valName];
}

function remoteList() {
	return new Promise(resolve => {
		const composedQuery = {
			action: "list"
		};

		wsocket.send(JSON.stringify(composedQuery));
		
		updates.onlist = () => {
			resolve(fileList);
		};
	});
}
function remoteAdd(entry) {
	return new Promise(resolve => {
		const composedQuery = {
			action: "add",
			entry: entry
		};

		wsocket.send(JSON.stringify(composedQuery));
		
		updates.onlist = () => {
			resolve(fileList);
		};
	});
}
function remoteDel(entry) {
	return new Promise(resolve => {
		const composedQuery = {
			action: "del",
			entry: entry
		};

		wsocket.send(JSON.stringify(composedQuery));
		
		updates.onlist = () => {
			resolve(fileList);
		};
	});
}

// File Operations
export const load = async(name, std="") => {
	if(wsinfo.opened == false) {
		return localLoad(name, std);
	}
	else {
		return await remoteLoad(name, std);
	}
};
export const save = async(name, val) => {
	if(wsinfo.opened == false) {
		return localSave(name, val);
	}
	else {
		return remoteSave(name, val);
	}
};
// FileList Operations
export const list = async() => {
	if(wsinfo.opened == false) {
		return localList();
	}
	else {
		return await remoteList();
	}
};
export const add = async(entry) => {
	if(wsinfo.opened == false) {
		return localAdd(entry);
	}
	else {
		return await remoteAdd(entry);
	}
};
export const del = async(entry) => {
	if(wsinfo.opened == false) {
		return localDel(entry);
	}
	else {
		return await remoteDel(entry);
	}
};

export const connectStorage = (url, vault) => {
	if(wsocket != null) {
		wsocket.close();
		wsinfo.opened = false;
		wsinfo.url = "";
		wsinfo.vault = "";
	}

	wsocket = new WebSocket(url);

	const ret = {
		onopen: () => {},
		onerror: () => {}
	};

	wsocket.onopen = () => {
		console.log("WS Connection established.");
		wsocket.send(
			JSON.stringify({
				action: "conn",
				vault: vault
			})
		);
	};
	wsocket.onmessage = (event) => {
		console.log("WS Message received.");

		const msg = JSON.parse(event.data);

		if(!wsinfo.opened) {
			if(!msg || !msg.action || !msg.vault) {
				ret.onerror();
				return;
			}

			if(msg.action == "conn" && msg.vault == vault) {
				wsinfo.opened = true;
				wsinfo.url = url;
				wsinfo.vault = vault;

				ret.onopen();
				return;
			}
			else {
				ret.onerror();
				return;
			}
		}

		if(msg.action == "load") {
			console.log(msg.file);
			console.log(msg.content);

			updates.onfile(msg.file, msg.content);
		}
		if(msg.action == "list") {
			console.log(msg.list);
			
			fileList = msg.list;
			
			updates.onlist();
		}
	};
	wsocket.onclose = (event) => {
		console.log("WS Connection closed.");
	};
	wsocket.onerror = (event) => {
		console.log("WS Connection error.");
		ret.onerror();
	};

	return ret;
}