import React from "react";

import './CryptoItem.css';

import { decimalFormat, colorFormat } from "../../shared/util/formatting";

//Receives crypto data as props
const CryptoItem = props => {
	let count = 0;
	//console.log(props)

	return (
		<tbody>
			{props.items && props.items.map(item => (
				<tr key={item.symbol}>
					<td className='center table-sticky__Column'>{++count}</td>
					<td className='table-data'>{item.symbol.replace('BUSD', '')}</td>
					<td className='table-data data-value'>${decimalFormat(item.price)}</td>
					<td className={`table-data data-value ${colorFormat(item.change)}`}>
						{decimalFormat(item.change)}
					</td>
					<td className={`table-data data-value ${colorFormat(item.changePercent)}`}>
						{decimalFormat(item.changePercent)} %
					</td>
				</tr>
			))}
		</tbody>
	)
}

export default CryptoItem;