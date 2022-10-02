import React, {useState} from 'react';


export const Header = (props: {
	rightContent: React.ReactNode
}) => {
	const [isActive, setIsActive] = useState(false);


	return (
		<header className="navbar is-dark mb-3">
			<div className="navbar-brand">
				<a className="navbar-item is-size-4" href="/">問い合わせ</a>
				<a onClick={() => {setIsActive(!isActive);}} 
					role="button"
					className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
					data-target="navbarBurgers" 
					aria-expanded="false"
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>
			<div className={`navbar-menu ${isActive ? "is-active" : ""}`}
				id="navbarBurgers" 
			>
				<div className="navbar-end">
					<div className="navbar-item">{props.rightContent}</div>
				</div>
			</div>
		</header>
	);
}