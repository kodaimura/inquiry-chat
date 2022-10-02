import React, {useState} from 'react';


export const SideBar = (props: {
    content: React.ReactNode
}) => {
	const [isActive, setIsActive] = useState(false);
	
	const st1 = {
		width: '320px',
		height: '100vh',
        position: 'absolute' as 'absolute',
        zIndex: 1,
	}

	return (
		<div>
		<nav className="navbar is-link is-hidden-desktop">
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
            <div className="mt-5" style={st1}>
            {props.content}
            </div>
        </div>
        </div>
	);
}