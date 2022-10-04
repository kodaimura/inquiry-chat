import {useState,useEffect,useRef} from 'react';

import {Header, SideBar} from '../layouts';
import {Messages} from './Messages';
import {getProfile, logout, getUser} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


const initMsgs = [{
	message:"", send_from:0, create_at:"",
}];
let socket: any;


export const Chat = (props: {
	userId: number,
	username: string,
	toUserId: number,
}) => {
	const [toUsername, setToUsername] = useState("");
	const [messages, setMessages] = useState(initMsgs);
	const [newMessages, setNewMessages] = useState(initMsgs);
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
				if (data && data.user_name) setToUsername(data.user_name);
			});

			getMessages(props.toUserId)
			.then(data => {
				if (data) {
					setMessages(data);
				} else {
					setMessages(initMsgs);
				}
			})

			connectSocket()
		}
	}, [props.toUserId])


	useEffect(() => {
		console.log(111111)
		webSocketRef.current?.addEventListener('message', (event: any) => {
			console.log(newMessages)
			setNewMessages([...newMessages, JSON.parse(event.data)])
		});
	}, [newMessages])


	const st1 = {
		paddingTop: '50px',
		height: 'calc(100% - 140px)',
	}

	const st2 = {
		height: '100%',
		overflowY: 'scroll' as 'scroll',
	}

	return (
		<div style={st1}>
		<div className="ml-3 mt-3" style={st2}>
		<Messages
			userId={props.userId}
			username={props.username}
			toUserId={props.toUserId}
			toUsername={toUsername}
			messages={messages}
		/>
		<Messages
			userId={props.userId}
			username={props.username}
			toUserId={props.toUserId}
			toUsername={toUsername}
			messages={newMessages}
		/>
     	</div>
		<div className="box">
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