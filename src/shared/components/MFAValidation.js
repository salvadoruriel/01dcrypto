import React, { useCallback, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@mui/material';

import Input from './UIElements/Input';
import Modal from './UIElements/Modal';
import { createSecret, createTOTP, createUriTOTP, googleKeyEncoder, validateTOTP } from '../util/otpMaker';

const MFAValidation = props => {
	const [inputToken, setinputToken] = useState('');
	const [validMFA, setValidMFA] = useState(false);
	const [validado, setValidado] = useState(false);

	const { onCancel, show } = props;

	const validate = useCallback(() => {
		setValidado(true);
		console.log(createTOTP(createSecret()));
		console.log(validateTOTP(inputToken, createSecret()));

		if (validateTOTP(inputToken, createSecret()))
			setValidMFA(true);
		else setValidMFA(false);
	}, [setValidado, setValidMFA, inputToken]);

	const unshowVerify = useCallback(() => {
		onCancel();
		setValidado(false);
	}, [onCancel]);

	return (
		<Modal
			show={show}
			onCancel={unshowVerify}
			header='Empareja tu dispositivo'
			footer={<Button variant="outlined" color="error" onClick={unshowVerify}>CERRAR</Button>}
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

			<Button
				variant="contained"
				onClick={validate}
			>
				Validar
			</Button>
		</Modal>
	);
}

export default MFAValidation;