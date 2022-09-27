import {useState,useEffect} from 'react';

import {Header} from '../layouts';
import {getProfile, logout} from '../../apis/users.api';


export const MyPage = () => {
	const [username, setUsername] = useState("");

	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.user_name) setUsername(data.user_name);
		});
	}, [])

	return (
		<>
		<Header 
			rightContent={
				<button
					className="button is-ghost"
					onClick={() => logout()}
				>LOGOUT</button>}
		/>
		<p>{username}さん</p>
		</>
		)
}