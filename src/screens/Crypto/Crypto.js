import React, { useEffect, useRef, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';

import CryptoItem from "./CryptoItem";
import './Crypto.css'

import { getSymbols, binanceConnect } from "./CryptoConnection";
import CryptoGrid from "./CryptoGrid";

const headersMUI = [
	{ field: '#', headerName: '#', width: 90 },
	{ field: 'symbol', headerName: 'Activo', width: 150, align: 'left' },
	{ field: 'price', headerName: 'PRECIO (USD)', width: 200, align: 'right' },
	{ field: 'change', headerName: 'CAMBIO $', width: 150, align: 'right' },
	{ field: 'changePercent', headerName: 'CAMBIO %', width: 150, align: 'right' }
];

const Crypto = props => {
	const [data, setData] = useState([]);
	const [symbols, setSymbols] = useState([]);
	const ws = useRef(null);
	const readyToSocket = useRef(false);

	const heads = ['#', 'Activo', 'PRECIO (USD)', 'CAMBIO $', 'CAMBIO %'];
	const headers = [
		{ content: '#' },
		{ content: 'Activo', label: 'symbol', alignment: 'left' },
		{ content: 'PRECIO (USD)', label: 'price', alignment: 'right' },
		{ content: 'CAMBIO $', label: 'change', alignment: 'right' },
		{ content: 'CAMBIO %', label: 'changePercent', alignment: 'right' },
	];
	//getting all available symbols
	useEffect(() => {
		getSymbols(setSymbols, readyToSocket);
	}, []);

	useEffect(() => {
		if (readyToSocket.current) binanceConnect(ws, symbols, setData);

		return () => {//onUnmount
			//ws.current.close();
		};
	}, [symbols, readyToSocket]);


	{/* <div>
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
		</div> */}
	{/*
		<CryptoGrid
			headerData={headers}
			rowData={data}
		/>
	*/}
	return (
		<div style={{ height: 650, width: '100%' }}>
			<DataGrid
				rows={data}
				columns={headersMUI}
				pageSize={50}
				rowsPerPageOptions={[25,50,100]}
			/>
		</div>
	);
}

export default Crypto;