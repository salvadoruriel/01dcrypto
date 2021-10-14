import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Button } from '@mui/material';

import Crypto from './screens/Crypto/Crypto';
import Auth from './screens/Auth/Auth';
import Showcase from './screens/Showcase/Showcase';

import MainHeader from './shared/Navigation/MainHeader';
import MFAValidation from './shared/components/MFAValidation';

const App = () => {
	const [showMFAModal, setShowMFAModal] = useState(false);

	let routes = (
		<Switch>

			<Route path='/' exact>
				<MFAValidation
					show={showMFAModal}
					onCancel={() => setShowMFAModal(false)}
				/>
				<Crypto />
			</Route>

			<Route path='/auth' >
				<Auth >
				</Auth>
			</Route>

			<Route path='/showcase' >
				<Showcase >
				</Showcase>
			</Route>

			<Redirect to='/' />

		</Switch>
	);

	let extraButtons = (
		<>
			<Button href='/showcase' color='inherit'>
				Extras
			</Button>
			
			<Button
				variant='outlined'
				color='secondary'
				onClick={() => setShowMFAModal(true)}
			>
				MFA
			</Button>

			<Button href='/auth' color='inherit'>
				Login
			</Button>
		</>
	);

	return (
		<>
			<Router>
				<MainHeader>
					{extraButtons}
				</MainHeader>
				<main>
					{routes}
				</main>
			</Router>
		</>
	);
}

export default App;
