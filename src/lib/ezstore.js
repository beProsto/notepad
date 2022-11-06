export const load = (name, std="") => {
	const initName = "__ezs_" + name + "_init";
	const valName = "__ezs_" + name + "_val";
	if(!localStorage.getItem(initName)) {
		localStorage.setItem(initName, "true");
		localStorage.setItem(valName, std);
	}
	return localStorage.getItem(valName);
	
};
export const save = (name, val) => {
	const initName = "__ezs_" + name + "_init";
	const valName = "__ezs_" + name + "_val";
	if(!localStorage.getItem(initName)) {
		localStorage.setItem(initName, "true");
	}
	localStorage.setItem(valName, val);
};
