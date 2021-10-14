import React from 'react';
import ReactDOM from 'react-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import './index.css';
import App from './App';
		
// eslint-disable-next-line
const THEMEDARK = createTheme({
	palette: {
		mode: 'dark',
	},
});
const THEMELIGHT = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#4865CC',
			light: '#E0E3FB',
			dark: '#4865CC',
			contrastText: '#fff'
		},
		secondary: {
			main: '#E0E3FB'
		},
		greys: {
			lower: '#F8F9FF',
			mid: '#E0E0E0',
			mid_dark: '#969BA5',
			darkest: '#3D4149'
		},
		text:{
			primary: '#3D4149',
		},
		background: {
			colored: '#6987F1',
			default: '#fff'
		},
		gradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 17.7%, rgba(96, 126, 233, 0.1) 88.02%)'
	},
});

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={THEMELIGHT}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);