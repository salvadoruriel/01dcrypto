import { render, screen } from '@testing-library/react';
//import axios from 'axios';

import Crypto from './Crypto';

//Suite, tests
describe('<Crypto>', () => {
	test('renders Crypto Main table', () => {
		//Arrange
		render(<Crypto />);

		//Act

		//Assert
		const cryptoElement = screen.getByRole('table');
		expect(cryptoElement).toBeInTheDocument();
	});

	test('renders Crypto headers for the table', () => {
		//Arrange
		render(<Crypto />);

		//Act

		//Assert
		const cryptoHeaderElements = screen.getAllByRole('columnheader');
		expect(cryptoHeaderElements).not.toHaveLength(0);
	});

	test('renders Crypto items from the web', async () => {
		//Arrange
		render(<Crypto />);

		//Act

		//Assert
		//5 seconds should be enough for both api and web socket
		const cryptoItemElements = await screen.findAllByRole('cell', {}, {timeout: 5000});
		expect(cryptoItemElements).not.toHaveLength(0);
	});
});
