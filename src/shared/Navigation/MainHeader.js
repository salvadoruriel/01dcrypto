import React from "react";

import './MainHeader.css';
import logo from '../../assets/logo.svg';

//Receives buttons as props
const MainHeader = props => {
	return (
		<header className="main-header">

			<div className="main-header__brandContainer">
				<div className="main-header__logoContainer">
					<img className="App-logo" src={logo} alt='React' />
				</div>
				
				<h1 className="main-header__title">
					DCrypto
				</h1>
			</div>

			{props.children}

		</header>
	)
}

export default MainHeader;