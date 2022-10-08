import {Message} from './Message';


export const Messages = (props: {
	userId: number,
	userNickname: string,
	toUserId: number,
	toUserNickname: string,
	messages: {message:string, send_from:number, create_at:string}[],
}) => {

	return (
		<>
		<ul>
		{props.messages.map((
			m:{
				message: string,
				send_from: number,
				create_at: string,
			},
			index: number
		) =>  (
			<li>
			{(m.send_from === props.userId)?
				<Message 
					userNickname={props.userNickname}
					message={m.message} 
					create_at={m.create_at}
				/> : (m.send_from === props.toUserId)?
				<Message 
					userNickname={props.toUserNickname}
					message={m.message} 
					create_at={m.create_at}
				/> : ""
			}
        	</li>
     	))}
     	</ul>
		</>
		)
}