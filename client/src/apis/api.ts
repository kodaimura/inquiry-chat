const loc = document.location;
export const apiurl = `${loc.protocol}//${loc.host}/api`;

export const responseFilter = (response: Response) => {
	if (!response.ok){
   		if (response.status === 401) {
      		document.location.href = "/";
    	}
    	throw new Error(response.statusText);
  	}

  	return response.json();
}