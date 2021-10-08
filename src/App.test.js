import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

//Suite, tests
describe('<App>', () => {
	test('renders App', () => {
		//Arrange
		render(<App />);

		//Act

		//Assert
		const AppElement = screen.getByRole('main');
		expect(AppElement).toBeInTheDocument();
	});

	//Portals seems to mess up the tests
	test('renders Modal if button is clicked', () => {
		//Arrange
		ReactDOM.createPortal = jest.fn((element, node) => {
			return element
		})
		render(<App />);

		//Act
		const buttonElement = screen.getByText('MFA', { exact: false });
		userEvent.click(buttonElement)

		//Assert
		const modalElement = screen.getByText('Empareja', { exact: false });
		expect(modalElement).toBeInTheDocument();
	});

});
