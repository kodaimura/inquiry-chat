import {useState,useEffect} from 'react';

import {Header, SideBar} from '../layouts';
import {getProfile, logout, getUsers} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


export const MyPage = () => {
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState([{user_id:0, user_name:""}]);

	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.user_name) setUsername(data.user_name);
		});

		getUsers()
		.then(data => {
			if (data && data.users) setUsers(data.users);
		})
	}, [])

	return (
		<>
		<div className="columns">
		<SideBar 
			content={
				<>
				<ul className="menu-list px-5 is-size-6">
				{users.map((
					user:{
						user_id: number,
						user_name: string,
					},
					index: number
				) =>  (
					<li>
					<button 
						className="button py-3 is-align-items-center is-fullwidth 
						is-small is-justify-content-flex-start is-link"
						onClick={() => getMessages(user.user_id).then(console.log)}
					>
        			<span key={index}>{user.user_name}</span>
        			</button>
        			</li>
     			))}

				<button
					className="button"
					onClick={() => logout()}
				>LOGOUT
				</button>
				</ul>
				</>
			}
		/>
		<div className="column">
		<p>{username}さん</p>
		</div>
		</div>
		</>
		)
}