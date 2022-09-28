import {responseFilter, apiurl} from './api';


export const signup = (
	username: string,
	password: string,
	passwordConfirm: string,
	setErrorMsg?: (msg: string) => void 
) => {
	if (username === "") {
		if (setErrorMsg) {
			setErrorMsg("Name is Required field.");
		}
		return
	}

	if (password !== passwordConfirm && setErrorMsg) {
		setErrorMsg("Confirmation passwords do not match.");
	} else {
		fetch(`${apiurl}/signup`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({"user_name":username, password})
		})
		.then(response => {
			if (!response.ok) {
				if (setErrorMsg) {
					setErrorMsg((response.status === 409)? 
						"This Username is already in use." 
						: "Signup failed.");
				}
				throw new Error(response.statusText);
			}
			document.location.href = "/";
		}).catch(console.error);
	}
}


export const login =　(
	username: string,
	password: string,
	setErrorMsg?: (msg: string) => void 
) => {
	fetch(`${apiurl}/login`, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({"user_name":username, password})
	})
	.then(response => {
		if (!response.ok) {
			if (setErrorMsg) {
				setErrorMsg((response.status === 401)? 
					"Unknown name or bad password." 
					: "Login failed.");
			}
			throw new Error(response.statusText);
		}
		return response.json();
	})
	.then(data => {
		//localStorage.setItem("token", data.access_token);
		document.location.href = "/";
	})
	.catch(console.error);
}


export const logout = () => {
	//localStorage.removeItem("token");
	fetch(`${apiurl}/logout`)
	document.location.href = "/";
}


export const getProfile = () => {
	return fetch(`${apiurl}/profile`, {
		//headers: {Authorization: `Bearer ${localStorage.token}`}
	})
	.then(responseFilter)
	.catch(console.error);
}


export const authorized = () => {
	return fetch(`${apiurl}/profile`, {
		//headers: {Authorization: `Bearer ${localStorage.token}`}
	})
	.then(response => {
		return response.ok? true : false;
	}).catch(() => {
		return false
	});
}


export const getUsers = () => {
	return fetch(`${apiurl}/users`)
	.then(responseFilter)
	.catch(console.error);
}