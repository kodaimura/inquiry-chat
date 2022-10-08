export const Message = (props: {
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
		)
}