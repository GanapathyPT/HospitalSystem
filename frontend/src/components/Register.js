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
	MenuItem,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Register() {
	const [userName, setUserName] = useState("")
	const [password, setPassword] = useState("")
	const [type, setType] = useState("D")
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
				body: JSON.stringify({ userName, password, type })
			}

			fetch("/auth/register", options)
			.then(res => res.json())
			.then(data => {
				if (data.status){
					localStorage.setItem("user", JSON.stringify({
						userName,
						password,
						type
					}))
					history.push("/")
				} else if (!!data.type && 
					data.type === "USERNAME") {
					setError("User Name is not valid try other")
				} else
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
										Register
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
									<TextField
										select
										fullWidth
										style={{width: "100%"}}
										label="Category"
										variant="outlined"
										value={type}
										onChange={e => setType(e.target.value)}
									>
										<MenuItem value="D">
											Doctor
										</MenuItem>
										<MenuItem value="H">
											Hospital
										</MenuItem>
									</TextField>
								</Grid>
								<Grid item>
									<Button 
										variant="contained" 
										color="primary"
										onClick={handleSubmit}
									>
										Sign Up
									</Button>
								</Grid>
							</Grid>
						</Container>
					</Paper>
					<Typography variant="small" component="p">
						Already have an account <Link to="/login">Login</Link>
					</Typography>	
				</form>
			</Grid>
		</Grid>
	)
}