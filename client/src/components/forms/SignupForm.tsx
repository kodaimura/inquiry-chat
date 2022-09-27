import {useState} from 'react';

import {signup} from '../../apis/users.api';


export const SignupForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	return (
		<>
		<span className="has-text-danger">{errorMsg}</span>
		<div className="field">
			<p className="control has-icons-left">
			<input className="input" type="text" placeholder="Name" 
			onChange={(e) => setUsername(e.target.value)} required/>
			<span className="icon is-small is-left">
			<i className="fas fa-user"></i>
			</span>
			</p>
		</div>
		<div className="field">
			<p className="control has-icons-left">
			<input className="input" type="password" placeholder="Password" 
			onChange={(e) => setPassword(e.target.value)} required/>
			<span className="icon is-small is-left">
			<i className="fas fa-lock"></i>
			</span>
			</p>
		</div>
		<div className="field">
			<p className="control has-icons-left">
			<input className="input" type="password" placeholder="Password Confirm" 
			onChange={(e) => setPasswordConfirm(e.target.value)}/>
			<span className="icon is-small is-left">
			<i className="fas fa-lock"></i>
			</span>
			</p>
		</div>
		<div className="field">
			<p className="control">
			<button className="button is-info"
			onClick={(e) => signup(username, password, passwordConfirm, setErrorMsg)}>
			Signup
			</button>
			</p>
		</div>
		</>
	)
}