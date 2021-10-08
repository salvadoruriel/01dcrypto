import { useEffect } from "react";

//adds an external script on the html body
const useAddScript = (url, async = true, defer = true, removeOnUnmount = true) => {
	useEffect(() => {
		const script = document.createElement('script');

		script.src = url;
		//google recommends both
		//https://developers.google.com/identity/gsi/web/guides/client-library
		script.async = async;
		script.defer = defer;

		document.body.appendChild(script);

		return () => {
			if (removeOnUnmount) document.body.removeChild(script);
		}
	}, [url, async, defer, removeOnUnmount]);
};

export default useAddScript;