import React from "react";
//the script is loaded in index.html

//temp credentials, move to environment
const GOOGLEID = '423083756315-udqbn1cnh3gomf8ff0vejv8epgo5cunr.apps.googleusercontent.com'
export const GOOGLESECRET = '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'

//HTML Element way to insert a google login
//https://developers.google.com/identity/gsi/web/guides/display-button#html
//NOTE: DO NOT use with js way, as the ids may cause conflict
//NOTE: Callback must be a string, referring to a function linked in window
//like in:
/*
declare global {
	interface Window {
		callback;
	}
} 
window.callback = (res) => {
	//code
};
*/
const GoogleLogin = props => {
	return (
		<>
			<div id="g_id_onload"
				data-client_id={GOOGLEID}
				data-callback={props.callback}
				/*data-login_uri="http://localhost:3000/"*/
				data-auto_prompt="true">
			</div>
			<div className="g_id_signin"
				data-type="standard"
				data-size="large"
				data-theme="outline"
				data-text="sign_in_with"
				data-shape="rectangular"
				data-logo_alignment="left">
			</div>
		</>
	);
}

export default GoogleLogin;

///Javascript alternative
//https://developers.google.com/identity/gsi/web/guides/display-button#javascript
//<script> should be added on index, regardless there is an automatic retry on this
// expects:
//	func 			- function callback to be run and where the answer is received
//	elementId - the div element id where the google button will be rendered instead
//	customization - https://developers.google.com/identity/gsi/web/reference/js-reference#GsiButtonConfiguration
//	prompt 		- wether the oneTap Login should be displayed as soon as the element loads
//Others are internal
const MAXRETRIES = 20
export const jsGoogleLogin = (func, elementId, customization, prompt = true, counter = 0) => {
	//checking
	if (window.google && window.google.accounts) {
		window.google.accounts.id.initialize({
			client_id: GOOGLEID,
			callback: func
		});
		window.google.accounts.id.renderButton(
			document.getElementById(elementId),
			{ theme: "outline", size: "large", ...customization }  // customization attributes
		);
		if (prompt) window.google.accounts.id.prompt(); // also display the One Tap dialog
		console.log('Cargó google Login. Intentos:', counter)
	}
	else if (counter <= MAXRETRIES) {
		setTimeout(() => {
			jsGoogleLogin(func, elementId, customization, prompt, counter + 1)
		}, 50)
	}
	else {
		console.error('[jsGoogleLogin] TIMEOUT - No se cargar google.accounts');
	}
}
