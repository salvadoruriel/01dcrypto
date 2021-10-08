import React, { useCallback, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import QRCode from 'react-qr-code';

import MainHeader from './shared/Navigation/MainHeader';
import Crypto from './screens/Crypto/Crypto';

import Button from './shared/components/UIElements/Button';
import Input from './shared/components/UIElements/Input';
import Modal from './shared/components/UIElements/Modal';
import { jsGoogleLogin } from './shared/components/GoogleLogin';
import { createSecret, createTOTP, createUriTOTP, googleKeyEncoder, validateTOTP } from './shared/util/otpMaker';

const App = () => {
	const [inputToken, setinputToken] = useState('');
	const [showMFAModal, setShowMFAModal] = useState(false);
	const [validMFA, setValidMFA] = useState(false);
	const [validado, setValidado] = useState(false);

	const handleResponse = useCallback((res) => {
		console.log(res)
		//https://developers.google.com/identity/gsi/web/reference/js-reference#credential
		console.log('Decoded JWT ID token: ', jwt.decode(res.credential))
	}, []);

	useEffect(() => {
		jsGoogleLogin(handleResponse, 'buttonDiv');
	}, [handleResponse]);

	const showVerify = useCallback(() => {
		setShowMFAModal(true);
		setValidado(false);
	}, []);
	const unshowVerify = useCallback(() => {
		setShowMFAModal(false);
		setValidado(false);
	}, []);

	const validate = useCallback(() => {
		setValidado(true);
		console.log(createTOTP(createSecret()));
		console.log(validateTOTP(inputToken, createSecret()));
		if (validateTOTP(inputToken, createSecret()))
			setValidMFA(true);
		else setValidMFA(false);
	}, [setValidado, setValidMFA, inputToken]);

	return (
		<>
			<MainHeader>
				{/* <GoogleLogin callback={handleResponse}/> */}
				<div id="buttonDiv"></div>
				<Button onClick={showVerify}>MFA</Button>
			</MainHeader>

			<Modal
				show={showMFAModal}
				onCancel={unshowVerify}
				header='Empareja tu dispositivo'
				footer={<Button onClick={unshowVerify}>CERRAR</Button>}
			>
				<QRCode
					value={createUriTOTP(
						undefined,
						undefined,
						googleKeyEncoder(createSecret())
					)}
				/>
				<Input
					id="code"
					onInput={(id, value) => setinputToken(value)}
					type="text"
					label="Validar código"
					errorText="Código incorrecto"
					isValid={!validado || validMFA}
				>
					{validado && validMFA && <span className='text-black'>Codigo Correcto!</span>}
				</Input>
				<Button onClick={validate}>
					Validar
				</Button>
			</Modal>

			<main>
				<Crypto />
			</main>
		</>
	);
}

export default App;
