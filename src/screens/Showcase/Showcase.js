import React from 'react';

import DonutChart from './DonutChart';

const Showcase = (props) => {
	const dataValues = [1, 2, 3, 5]

	return (
		<div>
			<DonutChart
				values={dataValues}
			/>
		</div>
	);
}

export default Showcase;