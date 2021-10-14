import React, {  useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import jwt from 'jsonwebtoken';

import { Button, TextField, Avatar, Divider, Box, Typography } from '@mui/material';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IconButton, FormControl, FilledInput, InputLabel, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { jsGoogleLogin } from '../../shared/components/GoogleLogin';
import logo from '../../assets/logo.svg';

const Auth = (props) => {
	const history = useHistory();
	const [values, setValues] = useState({
		email: '',
		password: '',
		showPassword: false
	});
	
	const handleChange = (event, element) => {
		if (element === 'showPassword')
			setValues({ ...values, [element]: !values.showPassword });
		else
			setValues({ ...values, [element]: event.target.value });
	}

	const login = () => {
		history.push('/');
	};

	useEffect(() => {
		const handleResponse = (res) => {
			console.log(res)
			//https://developers.google.com/identity/gsi/web/reference/js-reference#credential
			console.log('Decoded JWT ID token: ', jwt.decode(res.credential))
			login();
		}

		//timeout to allow all other elements to load first
		setTimeout(() => {
			jsGoogleLogin(handleResponse, 'buttonDiv')
		}, 200);
		//this DOES need to be rendered only at the start, so we disable the 'login' dependency warning
		// eslint-disable-next-line
	}, []);

	return (
		<Dialog open={true}>
			<DialogTitle>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						m: 'auto',
						width: 'fit-content'
					}}
				>
					<Avatar
						alt='Dcrypto logo'
						src={logo}
						sx={{ width: 66, height: 66 }}
					/>
					<Typography variant='h4' component='h2'>
						Bienvenido!
					</Typography>
				</Box>
			</DialogTitle>

			<DialogContent>
				<DialogContentText>
					Puede hacer login a continuacion.
				</DialogContentText>
				<TextField
					autoFocus
					fullWidth

					margin="dense"
					id="email"
					label="Email"
					type="email"
					variant="filled"
					sx={{ m: 1 }}

					value={values.email}
					onChange={(e) => handleChange(e, 'email')}
				/>
				<FormControl fullWidth sx={{ m: 1 }} variant="filled">
					<InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
					<FilledInput
						id="filled-adornment-password"
						type={values.showPassword ? 'text' : 'password'}
						value={values.password}
						onChange={(e) => handleChange(e, 'password')}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={(e) => handleChange(e, 'showPassword')}
									onMouseDown={(e) => e.preventDefault()}
									edge="end"
								>
									{values.showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label="Password"
					/>
				</FormControl>

				<Button
					fullWidth
					variant="contained"
					onClick={login}
					sx={{ m: 1, mt: 3, p: 1 }}
				>
					Continuar
				</Button>

				<Divider sx={{ mb: 2 }}>ó</Divider>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						m: 'auto',
						width: 'fit-content'
					}}
				>
					{/* <GoogleLogin callback={handleResponse}/> */}
					<div id="buttonDiv"></div>
					{props.children}
				</Box>

			</DialogContent>

		</Dialog >
	);
}

export default Auth;