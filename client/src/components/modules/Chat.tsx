import {useState,useEffect} from 'react';

import {Messages} from './Messages';
import {getProfile, logout, getUser} from '../../apis/users.api';
import {getMessages, readMessages} from '../../apis/messages.api';


const initMsgs = [{
	message:"", send_from:0, send_to:0, create_at:"",
}];


export const Chat = (props: {
	userId: number,
	userNickname: string,
	toUserId: number,
	webSocketRef: any,
}) => {
	const [toUserNickname, setToUserNickname] = useState("");
	const [messages, setMessages] = useState(initMsgs);
	const [newMessages, setNewMessages] = useState(initMsgs);
	const [msg, setMsg] = useState("");


	useEffect(() => {
		const ls = document.getElementById('messages')
		ls!.scrollTo(0, ls!.scrollHeight);
	})


	useEffect(() => {
		if (props.toUserId !== 0) {
			getUser(props.toUserId)
			.then(data => {
				if (data && data.nickname) setToUserNickname(data.nickname);
			});

			getMessages(props.toUserId)
			.then(data => {
				if (data) {
					setMessages(data);
				} else {
					setMessages(initMsgs);
				}
			})

			setNewMessages(initMsgs)
		}

	}, [props.toUserId])


	useEffect(() => {
		props.webSocketRef?.current?.addEventListener('message', (event: any) => {
			let data = JSON.parse(event.data);
			if (data.send_from === props.toUserId || 
				(data.send_from === props.userId && data.send_to === props.toUserId)) {
				setNewMessages([...newMessages, data])
			}
		});

	}, [newMessages, props.webSocketRef])


	const st1 = {
		height: 'calc(100% - 160px)',
	}

	const st2 = {
		height: '100%',
		overflowY: 'scroll' as 'scroll',
	}

	return (
		<div style={st1}>
		<div id="messages" style={st2}>
		<Messages
			userId={props.userId}
			userNickname={props.userNickname}
			toUserId={props.toUserId}
			toUserNickname={toUserNickname}
			messages={messages}
		/>
		<Messages
			userId={props.userId}
			userNickname={props.userNickname}
			toUserId={props.toUserId}
			toUserNickname={toUserNickname}
			messages={newMessages}
		/>
     	</div>
		<div className="box">
			<textarea 
				className="textarea"
				rows={1}
				onChange={(e) => setMsg(e.target.value)}
				value={msg}
			>
			</textarea>
			<div className="is-fullwidth has-text-right">
			{(msg == "")? "" : 
				<i className="fa-solid fa-paper-plane fa-xl has-text-link" 
					onClick={(e) => {
						props.webSocketRef?.current?.send(
							JSON.stringify({"to": props.toUserId, "message":msg})
						);
						setMsg("");
					}}
					style={{bottom:0}}
					>
				</i>
			}
			</div>
		</div>
		</div>
		)
}