import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import {
	Grid,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	Dialog,
	Snackbar,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

import NavBar from "./NavBar"

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ItemDetails({ currentItem }) {
	const [report, setReport] = useState("")
	const [imageOpen, setImageOpen] = useState(null);
	const [error, setError] = useState({})

	useEffect(() => {
		setReport(currentItem.report)
	}, [currentItem.report])

	const handleSubmit = () => {
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({ report, item: currentItem.id })
		 }
		fetch("/items/add-report", options)
		.then(res => res.json())
		.then(data => {
			if (data.status) {
				setError({
					msg: "Report Added Successfully",
					type: "success"
				})
			} else {
				setError({
					msg: "Report adding failed",
					type: "error"
				})
			}
		})
	}

	const handleClose = (event, reason) => {
	    if (reason === 'clickaway') {
	      return;
	    }

	    setError("");
	};

	if (!currentItem.patient_name) 
		return <Redirect to="/" />

	const user = localStorage.getItem("user")
	const type = JSON.parse(user).type

	return (
		<div>
			<NavBar type={type} />
			<Snackbar open={!!error.msg} autoHideDuration={3000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={error.type}>
				  { error.msg }
				</Alert>
			</Snackbar>
			<Grid container
			style={{marginTop: 50}}
			>
				<Grid 
					item 
					xs={12} 
					md={6}
					style={{minHeight: "90vh"}}
				>
					<Typography align="center" variant="h2" component="h1">
						{ currentItem.patient_name }
					</Typography>
					<div>
						{
							!!currentItem.images &&
							currentItem.images.map(image => 
								<img 
									width="45%"
									height="auto"
									src={image.image} 
									style={{margin:"2%", cursor: "pointer"}}
									onClick={() => setImageOpen(image.image)}
									alt={currentItem.patient_name} 
								/>
							)
						}
					</div>
					<List>
						<ListItem button>
							<ListItemText primary={"Patient Name"} />
							<ListItemText primary={currentItem.patient_name} />
						</ListItem>
						<ListItem button>
							<ListItemText primary={"Patient Age"} />
							<ListItemText primary={currentItem.patient_age} />
						</ListItem>
						<ListItem button>
							<ListItemText primary={"Patient Gender"} />
							<ListItemText primary={currentItem.gender} />
						</ListItem>
					</List>
				</Grid>
				<Grid
					item 
					xs={12} 
					md={6}
					style={{minHeight: "100vh"}}
				>
					<Typography align="center" component="p" variant="h4">
						Report
					</Typography>
					<textarea 
						style={{
							minHeight: "85vh", 
							width: "97%",
							fontSize: 25
						}}
						value={report}
						disabled={type === "H"}
						onChange={e => setReport(e.target.value)}
					/>
					<Button 
						disabled={type === "H" || report === currentItem.report}
						onClick={handleSubmit}
						variant="contained"
						color="primary"
					>
						Submit
					</Button>
				</Grid>
			</Grid>
			<Dialog 
				open={!!imageOpen} 
				onClose={() => setImageOpen(null)}
			>
				<img
					width="100%"
					height="100%" 
					src={imageOpen}
					alt={currentItem.patient_name} 
				/>
			</Dialog>
		</div>
	)
}