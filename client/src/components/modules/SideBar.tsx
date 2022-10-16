import React, {useState, useEffect} from 'react';

import {ProfileModal} from './ProfileModal';
import {logout, getUsers} from '../../apis/users.api';
import {readMessages, getNewMessagesCount} from '../../apis/messages.api';


export const SideBar = (props: {
	userId: number,
    setToUserId: (id: number) => void,
    webSocketRef: any,
}) => {
	const [users, setUsers] = useState([{user_id:0, nickname:""}]);
	const [toUserNickname, setToUserNickname] = useState("");
	const [toUserId, setToUserId] = useState(0);
	const [isActive, setIsActive] = useState(false);

	
	const st1 = {
		width: '280px',
		height: '100%',
        position: 'absolute' as 'absolute',
        zIndex: 1,
	}

	const st2 = {
		width: '280px',
		height: '70px',
	}

	const st3 = {
		height: 'calc(100% - 140px)',
		overflowY: 'scroll' as 'scroll',
	}

	useEffect(() => {
		getUsers()
		.then(data => {
			if (data && data.users) setUsers(data.users);
		});

	}, []);

	return (
		<>
		<nav className="navbar has-background-info is-fixed-top">
			<div className="navbar-brand">
            <div
                onClick={() => {setIsActive(!isActive);}} 
                className={`ml-0 burger navbar-burger ${isActive ? "is-active" : ""}`}
            >
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
            </div>

            <div className="navbar-item">
            	<ProfileModal />
            </div>
            <div className="navbar-item is-size-5 has-text-weight-semibold">
            {(toUserNickname == "")? "" : `@ ${toUserNickname}`}
            </div>
      		</div>
      	</nav>
      	<div className={`navbar-menu has-background-info ${isActive ? "is-active" : ""}`} style={st1}>
            <div style={st1}>
            <div className="is-hidden-mobile" style={st2}></div>
				<ul className="menu-list px-4" style={st3}>
				{users.map((
					user:{
						user_id: number,
						nickname: string,
					},
					index: number
				) =>  (
					<li key={index}>
					<SideBarUserButton
						selectedUserId={toUserId}
						nickname={user.nickname}
						userId={user.user_id}
						onClick={() => {
							props.setToUserId(user.user_id);
							setToUserId(user.user_id);
							setToUserNickname(user.nickname);
							setIsActive(false);
							readMessages(user.user_id);
						}}
						webSocketRef={props.webSocketRef}
					/>
        			</li>
     			))}
				</ul>
				<div className="px-4">
				<button
					className="button is-fullwidth is-link is-light"
					onClick={() => logout()}
				>ログアウト</button>
				</div>
            </div>
        </div>
        </>
	);
}


const SideBarUserButton = (props: {
	selectedUserId: number,
	nickname: string,
	userId: number,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
    webSocketRef: any,
}) => {
	const [count, setCount] = useState(0);


	useEffect(() => {
		getNewMessagesCount(props.userId)
		.then(data => {
			if (data && data.count) setCount(data.count);
		});

	}, [props.userId]);

	useEffect(() => {
		props.webSocketRef?.current?.addEventListener('message', (event: any) => {
			if (JSON.parse(event.data).send_from === props.userId 
				&& props.userId !== props.selectedUserId) {
				getNewMessagesCount(props.userId)
				.then(data => {
					if (data && data.count) setCount(data.count);
				});
			}

		});
	}, [props.webSocketRef]);


	const st1 = {
		backgroundColor: '#ddd',
		height: '22px',
		width: '28px',
		borderRadius: '40%',
 		textAlign: 'center' as 'center',
 		fontSize: '0.8rem',
 		opacity: 0.7,
	}


	return (
		<>
			<button 
				className="button is-fullwidth is-inline-block
				is-justify-content-flex-start has-background-info"
				onClick={(event) => { 
					props.onClick(event);
					setCount(0);
				}}
			>
        		<span className="is-pulled-left">
        			{props.nickname}
        		</span>
        		{(count == 0)? "" : 
        		<div style={st1} className="is-pulled-right">
        			<span>
        			{count}
        			</span>
        		</div>
        		}
        	</button>
        </>
	);
}