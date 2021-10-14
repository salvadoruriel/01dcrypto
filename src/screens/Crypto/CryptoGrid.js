//Multigrid is very unsupported and error prone from now to the future
//TobeRemoved ---

//Ejemplo del elemento que queremos conseguir:
//	https://bvaughn.github.io/react-virtualized/#/components/MultiGrid
import React from 'react';

import { TableCell, Paper } from '@mui/material';

//Referencias principales para crear y/o entender este elemento:
//	https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md
//	https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md
//Sobre AutoSizer:
//	https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md
import { AutoSizer, MultiGrid } from 'react-virtualized';

//Expects:
//	headerData	- the headers, should be [{ content, label, alignment(OPTIONAL) },...]
//	rowData 		- the data to display, array of objects
// 	others are OPTIONAL
//	fixed...		- how many columns or rows will remain fixed on scrolling
const CryptoGrid = (props) => {
	const { columnWidth, fixedColumnCount } = props;
	const { rowHeight, fixedRowCount } = props;
	const { headerData, rowData } = props;
	//if (!headerData || !rowData)
	//	return (<div><strong>No hay datos para mostrar</strong></div>)

	const cellRenderer = ({ rowIndex, columnIndex, key, style }) => {
		//there shouldnt be null on index nor should cell render in that case
		const alignment = (
			columnIndex != null &&
			headerData[columnIndex].alignment ||
			'center'
		);
		if (rowIndex == 0) return (
			<TableCell
				component='div'
				variant='head'
				key={key}
				style={style}
				align={alignment}
			>
				{headerData[columnIndex].content}
			</TableCell>
		);

		return (
			<TableCell
				component='div'
				variant='body'
				key={key}
				style={style}
				align={alignment}
			>
				{/*Get either the counter for the row or the content to display
						With this the header might be a bit more convoluted but very useful
				*/}
				{columnIndex == 0 && rowIndex ||
					rowData[rowIndex][headerData[columnIndex].label]
				}
			</TableCell>
		);
	}


	return (
		<Paper style={{ height: 400, width: '100%' }}>{/**To prevent a loop with autosizer inside some flex contianer */}
			<AutoSizer >{({ height, width }) => (
				<MultiGrid
					cellRenderer={cellRenderer}
					columnWidth={columnWidth || 100}
					columnCount={headerData.length}
					enableFixedColumnScroll
					fixedColumnCount={fixedColumnCount || 1}

					rowHeight={rowHeight || 40}
					rowCount={rowData.length}
					enableFixedRowScroll
					fixedRowCount={fixedRowCount || 1}

					height={height}
					width={width}
					hideTopRightGridScrollbar
					hideBottomLeftGridScrollbar

					noContentRenderer={<div><strong>No hay datos para mostrar</strong></div>}
				/>
			)}</AutoSizer>
		</Paper>
	)
}

export default CryptoGrid;