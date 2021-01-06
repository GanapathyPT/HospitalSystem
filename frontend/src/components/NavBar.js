import React from 'react'
import { Link, useHistory } from "react-router-dom"
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
} from "@material-ui/core"

export default function NavBar({ type }) {
	const history = useHistory()

	const logout = () => {
		localStorage.removeItem("user")
		history.push("/login")
	}

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography 
					to="/" 
					variant="h6" 
					color="inherit"
					style={{textDecoration: "none"}}
					component={Link} 
				>
					Hospital Management System
				</Typography>
				<div style={{marginLeft: "auto"}}>
					{
						type === "H" &&
						<Button 
							to="/add" 
							color="inherit"
							component={Link} 
						>
							Add New Item
						</Button>
					}
					<Button onClick={logout} color="inherit">Logout</Button>
				</div>
			</Toolbar>
		</AppBar>
	)
}