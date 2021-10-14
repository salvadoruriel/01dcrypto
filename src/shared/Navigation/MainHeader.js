import React from "react";

import './MainHeader.css';
import logo from '../../assets/logo.svg';

import { styled, alpha } from '@mui/material/styles';
import { AppBar, Box, Toolbar, IconButton, Typography, InputBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));

//on zIndex: https://mui.com/customization/z-index/
//Receives buttons as props
const MainHeader = props => {
	return (
		<header>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>

						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="abrir menu"
							sx={{ mr: 2, display: {xs: 'block', md:'none'}}}
						>
							<MenuIcon />
						</IconButton>

						<div className="main-header__brandContainer">
							<div className="main-header__logoContainer">
								<img className="App-logo" src={logo} alt='React' />
							</div>
						</div>
						<Typography
							variant="h3"
							noWrap
							component="div"
							sx={{ flexGrow: 1, 
								display: { xs: 'none', sm: 'block' },
								zIndex: 7 //needed for logo positioning
							}}
						>
							DCrypto
						</Typography>
						{props.children}

						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Buscar..."
								inputProps={{ 'aria-label': 'buscar' }}
							/>
						</Search>
						
					</Toolbar>
				</AppBar>
			</Box>
		</header>
	)
}

export default MainHeader;