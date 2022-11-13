// Just FYI - if at any point in this you feel lost, know; me too

let wsocket = null;
const wsinfo = { opened: false, url: "", vault: "" };

const updates = { onfile: (file, content)=>{}, ondir: ()=>{} };

// File operations

function localLoad(name, std) {
	const initName = "__ezs_" + name + "_init";
	const valName = "__ezs_" + name + "_val";
	if(!localStorage.getItem(initName)) {
		localStorage.setItem(initName, "true");
		localStorage.setItem(valName, std);
	}
	return localStorage.getItem(valName);
}
function localSave(name, val) {
	const initName = "__ezs_" + name + "_init";
	const valName = "__ezs_" + name + "_val";
	if(!localStorage.getItem(initName)) {
		localStorage.setItem(initName, "true");
	}
	localStorage.setItem(valName, val);
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

let theList = [];

// File List Operations
function localList() {
	const initName = "__list_ezs_" + wsocket.vault + "_init";
	const valName = "__list_ezs_" + wsocket.vault + "_val";
	if(!localStorage.getItem(initName)) {
		localStorage.setItem(initName, "true");
		localStorage.setItem(valName, JSON.stringify(["FirstNote"]));
	}
	theList = JSON.parse(localStorage.getItem(valName))
	return list;
}
function localAdd(entry) {

}
function localDel(entry) {

}

function remoteList() {

}
function remoteAdd(entry) {

}
function remoteDel(entry) {

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