import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

//notes on the Modal down below.
const ModalOverlay = props => {
	const content = (
		<div className={`modal ${props.className}`} style={props.style}>

			<header className={`modal__header ${props.headerClass}`}>
				<h2>{props.header}</h2>
			</header>

			{/**event.preventDefault avoids reloading, like when submitting a form with its button */}
			<form onSubmit={
				props.onSubmit ? props.onSubmit : event => event.preventDefault()
			}>
				<div className={`modal__content ${props.contentClass}`}>
					{props.children}
				</div>

				<footer className={`modal__footer ${props.footerClass}`}>
					{props.footer}
				</footer>
			</form>

		</div>
	);

	return ReactDOM.createPortal(content, document.getElementById('modal-portal'));
};

//Expects:
//	show 			- state tracking if the modal should appear or not
//	onCancel 	- what to do if we cancel the modal (normally stop showing)
//	header 		- the header
//	header/content/footerClass - extra syling
//	footer 		- props.children for the footer
//	onSubmit 	-	if buttons are provided, what to do with the form submission.
const Modal = props => {
	return (
		<>
			{props.show && <Backdrop onClick={props.onCancel} />}
			<CSSTransition
				in={props.show}
				mountOnEnter
				unmountOnExit
				timeout={200}
				classNames="modal"
			>
				<ModalOverlay {...props} />
			</CSSTransition>
		</>
	);
};

export default Modal;
