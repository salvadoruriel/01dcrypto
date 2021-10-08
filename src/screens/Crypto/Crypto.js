import React, { useEffect, useRef, useState } from "react";

import CryptoItem from "./CryptoItem";
import './Crypto.css'

import { getSymbols, binanceConnect } from "./CryptoConnection";

const Crypto = props => {
	const [data, setData] = useState([]);
	const [symbols, setSymbols] = useState([]);
	const ws = useRef(null);
	const readyToSocket = useRef(false);

	const heads = ['#', 'Asset', 'PRICE (USD)', 'CHANGE', 'CHANGE %'];

	//getting all available symbols
	useEffect(() => {
		getSymbols(setSymbols, readyToSocket);
	}, []);

	useEffect(() => {
		if(readyToSocket.current) binanceConnect(ws, symbols, setData);
	}, [symbols, readyToSocket]);


	return (
		<div>
			<table className='table'>
				<thead>
					<tr>
						{heads.map(item => (
							<th className='tableth' key={item}>{item}</th>
						))}
					</tr>
				</thead>
				<CryptoItem items={data} />
			</table>
		</div>
	);
}

export default Crypto;