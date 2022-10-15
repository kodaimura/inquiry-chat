import {useState,useEffect, useRef} from 'react';

import {Header} from '../layouts';
import {Chat, SideBar} from '../modules';
import {getProfile} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


const socket = new WebSocket(`ws://localhost:3000/api/messages/ws`)

export const MyPage = () => {
	const [toUserId, setToUserId] = useState(0);
	const [userId, setUserId] = useState(0);
	const [userNickname, setUserNickname] = useState("");
	const webSocketRef = useRef<WebSocket>();


	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.nickname) setUserNickname(data.nickname);
			if (data && data.user_id) setUserId(data.user_id);
		});

	}, []);

	useEffect(() => {
		webSocketRef.current = socket;
	});


	const st1 = {
		position: 'relative' as 'relative',
        zIndex: 0,
        height: '100%',
	}

	const st2 = {
		width: '280px',
		height: '100%',
	}

	const st3 = {
		height:'100%',
		marginTop: '52px',
	}

	const st4 = {
		height:'100%',
		width: '100%',
	}

	return (
		<>
		<div style={st1}>
		<div className="columns is-gapless" style={{height:'100%'}}>
		<SideBar 
			userId={toUserId}
			setToUserId={setToUserId}
			webSocketRef={webSocketRef}
		/>
		<div className="is-hidden-touch" style={st2}>
		</div>
		<div className="column mx-3" style={st3}>
		{(toUserId == 0)? 
			<iframe 
				style={st4}
				src="">
			</iframe> :
			<Chat 
				userId={userId} 
				userNickname={userNickname} 
				toUserId={toUserId} 
				webSocketRef={webSocketRef}
			/>
		}
		</div>
		</div>
		</div>
		</>
		)
}