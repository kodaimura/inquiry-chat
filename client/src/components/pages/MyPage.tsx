import {useState,useEffect, useRef} from 'react';

import {Chat, SideBar} from '../modules';
import {getProfile} from '../../apis/users.api';
import {wsurl} from '../../constants';


const socket = new WebSocket(wsurl)

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
		{(toUserId === 0)? 
			<ul>
			<li>
		 	<div className="box">
				<span className="has-text-weight-bold">アナウンス</span><br/>
				<span style={{'whiteSpace': 'pre-wrap'}}>歯車マークから表示名を変更することができます。</span>
		 	</div>
		 	</li>
			<li>
			<div className="box">
				<span className="has-text-weight-bold">アナウンス</span><br/>
				<span style={{'whiteSpace': 'pre-wrap'}}>サイドバーからチャット相手を選択することができます。</span>
		 	</div>
		 	</li>
			</ul> :
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
	);
}