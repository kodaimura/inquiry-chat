import {useState,useEffect,useRef} from 'react';

import {Header, SideBar} from '../layouts';
import {getProfile, logout, getUser} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


let socket: any;


export const Chat = (props: {
	userId: number,
	username: string,
	toUserId: number,
}) => {
	const [toName, setToName] = useState("");
	const [messages, setMessages] = useState([{
		message:"", send_from:0, send_to:0, create_at:"",
	}]);
	const [msg, setMsg] = useState("");
	const webSocketRef = useRef<WebSocket>();
	let socket: WebSocket;

  	const connectSocket = () => {
		socket = new WebSocket(`ws://localhost:3000/api/messages/@${props.toUserId}/ws`);
		webSocketRef.current = socket;
    }

	useEffect(() => {
		if (props.toUserId !== 0) {
			getUser(props.toUserId)
			.then(data => {
				if (data && data.user_name) setToName(data.user_name);
			});

			getMessages(props.toUserId)
			.then(data => {
				if (data) {
					setMessages(data)
				} else {
					setMessages([{
						message:"", send_from:0, send_to:0, create_at:"",
					}])
				}
			})

			connectSocket()
		}
	}, [props.toUserId])

	useEffect(() => {
		webSocketRef.current?.addEventListener('message', (event: any) => {
			setMessages([...messages, JSON.parse(event.data)])
		});
	}, [messages])


	const st1 = {
		height: '100%',
		overflowY: 'scroll' as 'scroll',
	}

	const st2 = {
		paddingTop: '50px',
		//position: 'relative' as 'relative',
		height: 'calc(100% - 140px)',
	}

	const st3 = {
		position: 'absolute' as 'absolute',
		bottom: 0,
		width: '100%'
	}

	return (
		<div style={st2}>
		<div className="ml-3 mt-3" style={st1}>
		<ul>
		{messages.map((
			m:{
				message: string,
				send_from: number,
				send_to: number,
				create_at: string,
			},
			index: number
		) =>  (
			<li>
			<span>{(m.send_from === props.userId)? 
				props.username 
				: (m.send_from === props.toUserId)? toName : ""}</span>
        	<span>{m.message}</span>
        	<span>{m.create_at}</span>
        	</li>
     	))}
     	</ul>
     	</div>

     	<div className="box" style={st3}>
			<textarea 
				className="textarea"
				rows={1}
				onChange={(e) => setMsg(e.target.value)}
			>
			</textarea>
			<button className="button is-success" 
			onClick={(e) => webSocketRef.current?.send(msg)}>
			送信
			</button>
		</div>
		</div>
		)
}