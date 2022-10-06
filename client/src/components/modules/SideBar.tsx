import React, {useState, useEffect} from 'react';

import {logout, getUsers} from '../../apis/users.api';


export const SideBar = (props: {
    setToUserId: (id: number) => void 
}) => {
	const [users, setUsers] = useState([{user_id:0, user_name:""}]);
	const [isActive, setIsActive] = useState(false);
	
	const st1 = {
		width: '320px',
		height: '100%',
        position: 'absolute' as 'absolute',
        zIndex: 1,
	}

	useEffect(() => {
		getUsers()
		.then(data => {
			if (data && data.users) setUsers(data.users);
		});

	}, []);

	return (
		<>
		<nav className="navbar is-link is-fixed-top">
			<div className="navbar-brand">
            <div
                onClick={() => {setIsActive(!isActive);}} 
                className={`ml-0 burger navbar-burger ${isActive ? "is-active" : ""}`}
            >
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
            </div>
      		</div>
      	</nav>
      	<div className={`navbar-menu has-background-link ${isActive ? "is-active" : ""}`} style={st1}>
            <div className="mt-5 pt-5" style={st1}>
				<ul className="menu-list px-5 is-size-6">
				{users.map((
					user:{
						user_id: number,
						user_name: string,
					},
					index: number
				) =>  (
					<li>
					<button 
						className="button is-align-items-center is-fullwidth 
						is-small is-justify-content-flex-start is-link"
						onClick={() => {
							props.setToUserId(user.user_id);
						}}
					>
        			<span key={index}>{user.user_name}</span>
        			</button>
        			</li>
     			))}

				<button
					className="button"
					onClick={() => logout()}
				>LOGOUT
				</button>
				</ul>
            </div>
        </div>
        </>
	);
}