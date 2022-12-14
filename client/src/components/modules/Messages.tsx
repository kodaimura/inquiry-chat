import {MessageType} from '../../types/types';


export const Messages = (props: {
	userId: number,
	userNickname: string,
	toUserId: number,
	toUserNickname: string,
	messages: MessageType[],
}) => {

	return (
		<>
		<ul>
		{props.messages.map((
			m: MessageType,
			index: number
		) =>  (
			<li key={index}>
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
	);
}


const Message = (props: {
	userNickname: string,
	message: string,
	create_at: string,
}) => {

	return (
		<div className="box">
			<span className="has-text-weight-bold">{props.userNickname} </span>
			<span className="is-size-7">{props.create_at}</span><br/>
			<span style={{'whiteSpace': 'pre-wrap'}}> {props.message}</span>
		 </div>
	);
}