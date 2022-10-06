import {useState,useEffect} from 'react';

import {Header} from '../layouts';
import {Chat, SideBar} from '../modules';
import {getProfile} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


const socket = new WebSocket(`ws://localhost:3000/api/messages/ws`)

export const MyPage = () => {
	const [toUserId, setToUserId] = useState(0);
	const [userId, setUserId] = useState(0);
	const [username, setUsername] = useState("");


	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.user_name) setUsername(data.user_name);
			if (data && data.user_id) setUserId(data.user_id);
		});

	}, []);

	const st1 = {
		position: 'relative' as 'relative',
        zIndex: 0,
        height: '100%',
	}

	const st2 = {
		width: '320px',
		height: '100%',
	}

	return (
		<>
		<div style={st1}>
		<div className="columns is-gapless" style={{height:'100%'}}>
		<SideBar setToUserId={setToUserId}/>
		<div className="is-hidden-touch" style={st2}>
		</div>
		<div className="column" style={{height:'100%'}}>
			<Chat 
				userId={userId} 
				username={username} 
				toUserId={toUserId} 
				socket={socket}
			/>
		</div>
		</div>
		</div>
		</>
		)
}