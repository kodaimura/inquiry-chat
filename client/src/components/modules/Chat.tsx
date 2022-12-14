import {useState,useEffect} from 'react';

import {Messages} from './Messages';
import {getUser} from '../../apis/users.api';
import {getMessages, readMessages} from '../../apis/messages.api';
import {MessageType} from '../../types/types';


const initMsgs: MessageType[] = [{
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
	const [msgRows, setMsgRows] = useState(1);


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

	}, [newMessages, props.webSocketRef, props.toUserId, props.userId])


	useEffect(() => {
		setMsgRows((msg.includes("\n"))? 2 : 1)
	}, [msg])


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
			<div className="columns is-mobile">
			<div className="column is-11 pr-0">
			<textarea 
				className="textarea"
				rows={msgRows}
				onChange={(e) => setMsg(e.target.value)}
				value={msg}
			>
			</textarea>
			</div>
			<div className="column mt-auto mb-auto pl-1">
			{(msg === "")? "" : 
				<i className="fa-solid fa-paper-plane fa-xl has-text-link" 
					onClick={(e) => {
						props.webSocketRef?.current?.send(
							JSON.stringify({"to": props.toUserId, "message":msg})
						);
						readMessages(props.toUserId);
						setMsg("");
					}}
					style={{bottom:0}}
					>
				</i>
			}
			</div>
			</div>
		</div>
		</div>
	)
}