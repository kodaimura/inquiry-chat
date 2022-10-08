import {useState,useEffect} from 'react';

import {Header} from '../layouts';
import {getProfile, updateProfile} from '../../apis/users.api';


export const ProfileModal = () => {
	const [isActive, setIsActive] = useState(false);
	const [username, setUsername] = useState("");
	const [nickname, setNickname] = useState("");

	useEffect(() => {
		getProfile()
		.then(data => {
			if (data && data.nickname) setNickname(data.nickname);
			if (data && data.user_name) setUsername(data.user_name);
		});
	}, []);

	return (
		<>
		<div className="navbar-item">
			<button 
				className="button is-primary is-small"
				onClick={() => setIsActive(true)}>設定
			</button>
		</div>

		<div className={`modal ${isActive ? "is-active" : ""}`}>
		<div className="modal-background"></div>
		<div className="modal-card">
			<header className="modal-card-head">
			<p className="modal-card-title">設定</p>
			<button 
				className="delete"
				onClick={() => setIsActive(false)}>
			</button>
			</header>
			<section className="modal-card-body">
			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">ユーザ名</label>
				</div>
			<div className="field-body">
				<div className="field">
				<p className="control">
				<input
					type="text"
					className="input"
					value={username}
					disabled/>
				</p>
				</div>
			</div>
			</div>
			<div className="field is-horizontal">
				<div className="field-label is-normal">
					<label className="label">ニックネーム</label>
				</div>
			<div className="field-body">
				<div className="field">
				<p className="control">
				<input
					type="text"
					className="input"
					onChange={(e) => setNickname(e.target.value)}
					value={nickname}/>
				</p>
				</div>
			</div>
			</div>
			</section>
			<footer className="modal-card-foot">
			<button 
				className="button is-success"
				onClick={() => updateProfile(nickname)}
			>保存
			</button>
			<button 
				className="button" 
				onClick={() => setIsActive(false)}
			>キャンセル
			</button>
			</footer>
		</div>
		</div>
		</>
		)
}