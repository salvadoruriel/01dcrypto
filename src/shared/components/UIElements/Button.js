import React from 'react';

import './Button.css';

//Expects:
//	type	(OPTIONAL) for forms
//	onClick
//	disabled (OPTIONAL)
//	children - text
const Button = props => {

  return (
    <button
      className={`button button--${props.size || 'default'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
