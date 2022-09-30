import {useState,useEffect} from 'react';

import {Header, SideBar} from '../layouts';
import {getProfile, logout, getUser} from '../../apis/users.api';
import {getMessages} from '../../apis/messages.api';


export const Chat = (props: {
	userId: number,
	username: string,
	toUserId: number,
}) => {
	const [toName, setToName] = useState("");
	const [messages, setMessages] = useState([{
		message:"", send_from:0, send_to:0, create_at:"",
	}]);

	useEffect(() => {
		if (props.toUserId != 0) {
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

		}
	}, [props.toUserId])

	return (
		<>
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
			<span>{(m.send_from == props.userId)? 
				props.username 
				: (m.send_from == props.toUserId)? toName : ""}</span>
        	<span>{m.message}</span>
        	<span>{m.create_at}</span>
        	</li>
     	))}
     	</ul>
		</>
		)
}