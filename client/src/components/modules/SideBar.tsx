import React, {useState, useEffect} from 'react';

import {ProfileModal} from './ProfileModal';
import {logout, getUsers} from '../../apis/users.api';
import {readMessages, getNewMessagesCount} from '../../apis/messages.api';


export const SideBar = (props: {
    setToUserId: (id: number) => void 
}) => {
	const [users, setUsers] = useState([{user_id:0, nickname:""}]);
	const [toUserNickname, setToUserNickname] = useState("");
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
					<li>
					<SideBarUserButton
						nickname={user.nickname}
						userId={user.user_id}
						onClick={() => {
							props.setToUserId(user.user_id);
							setToUserNickname(user.nickname);
							setIsActive(false);
							readMessages(user.user_id);
						}}
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
	nickname: string,
	userId: number,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}) => {
	const [count, setCount] = useState(0);

	useEffect(() => {
		getNewMessagesCount(props.userId)
		.then(data => {
			if (data && data.count) setCount(data.count);
		});

	}, [props.userId]);

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
        		<span className="is-pulled-right">
        		{count}
        		</span>
        		}
        	</button>
        </>
	);
}