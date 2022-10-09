import {responseFilter, apiurl} from './api';


export const getMessages = (userId: number) => {
	return fetch(`${apiurl}/messages/@${userId}`)
	.then(responseFilter)
	.catch(console.error);
}


export const readMessages = (userId: number) => {
	return fetch(`${apiurl}/messages/@${userId}/read`, {
		method: "PUT",
	})
	.then(responseFilter)
	.catch(console.error);
}


export const getNewMessagesCount = (userId: number) => {
	return fetch(`${apiurl}/messages/@${userId}/news/count`)
	.then(responseFilter)
	.catch(console.error);
}