import React, { useState } from "react";
import { useHistory, Redirect, Link } from 'react-router-dom';
import {
	Grid,
	Container,
	Paper,
	Button,
	TextField,
	Typography,
	Snackbar,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Login() {
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")

	const history = useHistory()

	const handleSubmit = event => {
		event.preventDefault()

		if (!!userName && !!password) {
			const options = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify({ userName, password })
			}

			fetch("/auth/login", options)
			.then(res => res.json())
			.then(data => {
				if (data.status){
					localStorage.setItem("user", JSON.stringify({
						userName,
						password,
						type: data.type
					}))
					history.push("/")
				}
				else
					setError("Invalid Credentials")
			})
			.catch(err => setError("Something went wrong"))

		} else {
			setError("username or password can't be empty")
		}
	}

	const handleClose = (event, reason) => {
	    if (reason === 'clickaway') {
	      return;
	    }

	    setError("");
	};

	const user = localStorage.getItem("user")
	if (!!user) {
		return <Redirect to="/" />
	}

	return (
		<Grid 
			container 
			direction="row"
			style={{width:'100vw', height:'100vh'}}
			justify="center"
			alignItems="center"
		>
			<Grid item xs={4}>
				<form action="">
					<Paper elevation={5} style={{
						padding: "50px 0"
					}}>
						<Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
					        <Alert onClose={handleClose} severity="error">
					          { error }
					        </Alert>
					      </Snackbar>
						<Container>
							<Grid 
								container
								direction="column"
								justify="center"
								alignItems="center"
								spacing={3}
							>
								<Grid item>
									<Typography align="center" variant="h2" component="h2">
										Login
									</Typography>
								</Grid>
								<Grid item>
									<TextField 
										label="User Name"
										type="text"
										variant="outlined"
										value={userName}
										onChange={e => setUserName(e.target.value)}
									/>
								</Grid>
								<Grid item>
									<TextField 
										label="Password"
										type="password"
										variant="outlined"
										value={password}
										onChange={e => setPassword(e.target.value)}
									/>
								</Grid>
								<Grid item>
									<Button 
										variant="contained" 
										color="primary"
										onClick={handleSubmit}
									>
										Sign In
									</Button>
								</Grid>
							</Grid>
						</Container>
					</Paper>
					<Typography variant="small" component="p">
						Don't have an account <Link to="/register">Regsiter</Link>
					</Typography>
				</form>
			</Grid>
		</Grid>
	)
}