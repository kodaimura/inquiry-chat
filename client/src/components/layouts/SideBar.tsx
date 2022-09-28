import React, {useState} from 'react';


export const SideBar = (props: {
    content: React.ReactNode
}) => {
	const [isActive, setIsActive] = useState(false);
	
	const st1 = {
		width: '320px',
		height: '100vh',
	}

	return (
		<div>
		<nav className="navbar is-link is-hidden-desktop">
			<div className="navbar-brand is-align-items-center">
			<a onClick={() => {setIsActive(!isActive);}} 
				role="button" 
				className={`navbar-burger ${isActive ? "is-active" : ""}`} 
				aria-expanded="false">
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
        	<span aria-hidden="true"></span>
      		</a>
      		</div>
      	</nav>
      	<div className={`navbar-menu ${isActive ? "is-active is-overlay" : ""}`}>
      	<div style={st1} className="has-background-link">
        <aside className="menu pt-5 mt-3">
        {props.content}
        </aside>
        </div>
        </div>
        </div>
	);
}