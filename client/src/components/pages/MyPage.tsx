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

	const st1 = {
		position: 'relative' as 'relative',
        zIndex: 0,
	}

	const st2 = {
		width: '320px',
		height: '100vh',
	}

	return (
		<>
		<div style={st1}>
		<div className="columns is-gapless">
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
						className="button is-align-items-center is-fullwidth 
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
		<div className="is-hidden-touch" style={st2}>
		</div>
		<div className="column">
		<div className="is-hidden-mobile">
			<header className="navbar is-link"/>
		</div>
			<Chat userId={userId} username={username} toUserId={toUserId} />
		</div>
		</div>
		</div>
		</>
		)
}