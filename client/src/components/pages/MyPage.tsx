import {useState,useEffect} from 'react';

import {Header, SideBar} from '../layouts';
import {Chat} from '../modules';
import {getProfile, logout, getUsers} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


export const MyPage = () => {
	const [toUserId, setToUserId] = useState(0);
	const [userId, setUserId] = useState(0);
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState([{user_id:0, user_name:""}]);

	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.user_name) setUsername(data.user_name);
			if (data && data.user_id) setUserId(data.user_id);
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
						onClick={() => setToUserId(user.user_id)}
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
		<Chat userId={userId} username={username} toUserId={toUserId} />
		</div>
		</div>
		</>
		)
}