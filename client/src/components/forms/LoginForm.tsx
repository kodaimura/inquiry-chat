import {useState} from 'react';

import {login} from '../../apis/users.api';


export const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	return (
		<>
		<span className="has-text-danger">{errorMsg}</span>
		<div className="field">
			<p className="control has-icons-left">
			<input className="input" type="text" placeholder="Name" 
			onChange={(e) => setUsername(e.target.value)}/>
			<span className="icon is-small is-left">
			<i className="fas fa-user"></i>
			</span>
			</p>
		</div>
		<div className="field">
			<p className="control has-icons-left">
			<input className="input" type="password" placeholder="Password" 
			onChange={(e) => setPassword(e.target.value)}/>
			<span className="icon is-small is-left">
			<i className="fas fa-lock"></i>
			</span>
			</p>
		</div>
		<div className="field">
			<p className="control">
			<button className="button is-success" 
			onClick={(e) => login(username, password, setErrorMsg)}>
			Login
			</button>
			</p>
		</div>
		</>
	)
}