import base32 from 'thirty-two';
import notp from 'notp';//

//TODO change default use case on production
export const createSecret = (seed, length = 20) => {
	let ans;
	if (!seed) ans = 'TestSeed0710';
	else ans = Math.random().toString().substr(3, length + 3);
	return ans;
}

export const createTOTP = (secret) => {
	return notp.totp.gen(secret);
}

export const validateTOTP = (token, secret, window = 1, time = 30) => {
	return notp.totp.verify(token, secret, { window, time });
}

//secret debe ser base32 RFC 3548 sin el padding ('=') de la seccion 2.2
export const googleKeyEncoder = (key) => {
	return base32.encode(key).toString().replace('=', '');
}
export const googleKeyDecoder = (key) => {
	return base32.decode(key);
}

export const createUriTOTP = (
	issuer = 'CryptoTest',
	accountName = 'testUser',
	secret,
	algorithm = 'SHA1',
	digits = 6,
	period = 30
) => {
	if (!secret) throw new Error('secret is required')
	let uri = 'otpauth://totp/';
	uri += issuer + ':' + accountName + '?'; 	//Label
	uri += 'secret=' + secret; 					//Secret
	uri += '&issuer=' + issuer; 				//Issuer
	uri += '&algorithm=' + algorithm; 		//Algorithm
	uri += '&digits=' + digits;					//Digits - how long the otp will be
	uri += '&period=' + period;					//Period - how long the code will be valid for
	return encodeURI(uri);
};

//HOTP, el counter debera ser verificado por el servidor, parte pendiente segun haya necesidad