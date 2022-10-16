import {useNavigate} from 'react-router-dom';

import {Header} from '../layouts';
import {SignupForm} from '../forms';


export const SignupPage = () => {
	const navigate = useNavigate();
	
	return (
		<>
		<Header 
			rightContent={
				<button
					className="button is-ghost"
					onClick={() => navigate('/')}
				>ログイン</button>}
		/>

		<div className="columns is-centered mt-6">
		<div className="column is-half box px-5 pb-5">
		<div className="mb-3 mt-1">
		<p className="">アカウント作成</p>
		</div>
		<SignupForm />
		</div>
		</div>
		</>
	);
}