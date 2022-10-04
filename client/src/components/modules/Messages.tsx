import {Message} from './Message';


export const Messages = (props: {
	userId: number,
	username: string,
	toUserId: number,
	toUsername: string,
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
					username={props.username}
					message={m.message} 
					create_at={m.create_at}
				/> : (m.send_from === props.toUserId)?
				<Message 
					username={props.toUsername}
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