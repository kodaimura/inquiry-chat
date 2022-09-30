import {responseFilter, apiurl} from './api';


export const getMessages = (userId: number) => {
	return fetch(`${apiurl}/messages/@${userId}`)
	.then(responseFilter)
	.catch(console.error);
}