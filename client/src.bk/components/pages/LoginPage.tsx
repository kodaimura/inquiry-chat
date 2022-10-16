import {useNavigate} from 'react-router-dom';

import {Header} from '../layouts';
import {LoginForm} from '../forms';


export const LoginPage = () => {
	const navigate = useNavigate();

	return (
		<>
		<Header
			rightContent={
				<button 
					className="button is-ghost"
					onClick={() => navigate('/signup')}
				>サインアップ</button>}
		/>
		
		<div className="columns is-centered mt-6">
		<div className="column is-half box px-5 pb-5">
		<div className="mb-3 mt-1">
		ログイン
		</div>
		<LoginForm/>
		</div>
		</div>
		</>
	);
}