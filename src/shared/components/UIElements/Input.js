import React, { useState, useEffect } from 'react';

import './Input.css';

//can be a textArea or input
//Expects:
//	element (OPTIONAL) 	- to make it a textarea (or specify its an input)
//	id									- identifier
//	onInput							- a callback to parent in case this changes
//	placeholder (OPT)		
//	label								
//	errorText						- to show in case of error
const Input = props => {
	const [input, setInput] = useState('');

	const { id, onInput } = props;

	useEffect(() => {
		onInput(id, input)
	}, [id, input, onInput]);

	const changeHandler = event => {
		setInput(event.target.value);
	}

	const element = props.element === 'textarea' ? (
		<textarea
			id={id}
			rows={props.row || 3}
			placeholder={props.placeholder}
			onChange={changeHandler}
			value={input}
		/>
	) : (
		<input
			id={id}
			type={props.type}
			placeholder={props.placeholder}
			onChange={changeHandler}
			value={input}
		/>
	);


	return (
		<div
			className={`form-control ${!props.isValid && 'form-control--invalid'}`}
		>
			{props.label && <label htmlFor={props.id}>
				{props.label}
			</label>
			}
			{element}
			{!props.isValid && <p>{props.errorText}</p>}
			{props.children}
		</div>
	);
};

export default Input;
