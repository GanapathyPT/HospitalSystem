import React, { useState, useEffect } from 'react'
import {
	Grid,
	Container,
	Typography,
	TextField,
	Button,
	Paper,
	MenuItem,
	FormControl,
} from "@material-ui/core";
import Slider from "react-slick";
import { Redirect } from "react-router-dom";

import NavBar from "./NavBar";

const settings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
};

export default function AddScans() {
	const [doctors, setDoctors] = useState([])
	const [doctor, setDoctor] = useState(null)
	const [patientName, setPatientName] = useState("")		
	const [patientAge, setPatientAge] = useState(null)
	const [gender, setGender] = useState("Male")
	const [files, setFiles] = useState([])
	
	useEffect(() => {
		fetch("/auth/doctors")
		.then(res => res.json())
		.then(data => {
			setDoctors(data)
		})
	}, [])

	const addItem = () => {
		const userName = JSON.parse(localStorage.getItem("user")).userName;
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				userName,
				doctor,
				patientName,
				patientAge,
				gender,
				date: new Date()
			})
		}
		fetch("/items/add", options)
		.then(res => res.json())
		.then(data => {
			console.log(data)

			if (data.status) {
				for (file of files) {
					const formData = new FormData()
					formData.append("image", file)
					formData.append("item", data.id)
					fetch("/items/upload-image", {
						method: "POST",
						body: formData
					})
				}
				setDoctor(null)
				setPatientName("")
				setPatientAge(null)
				setGender("Male")
				setFiles([])
			} else {
				console.log("err")
			}
		})
	}

	const handleFileUpload = e => {
		setFiles(oldFiles => [...oldFiles,...e.target.files])
	}

	const removeImage = index => {
		setFiles(files.filter((file, i) => i !== index))
	}

	const user = localStorage.getItem("user")
	if (!user) {
		return <Redirect to="/login" />
	}

	return (
		<>
		<NavBar type="H" />
		<Grid 
			container
			direction="row"
			style={{width:'100%', minHeight:'100vh'}}
			justify="center"
			alignItems="center"
		>
			<Grid item xs={5}>
				<Paper 
					elevation={5}
					style={{padding:"50px 0"}}
				>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
						spacing={3}
					>
						<Grid item>
							<Typography align="center" component="h3" variant="h3">
								New Item
							</Typography>
						</Grid>
						<Grid item style={{width: "56%"}}>
							<Slider {...settings}>
							{
								!!files && files.map((file, i) => 
									<div key={i}>
										<div style={{
											position: "relative",
										}}>
											<img
												width="100%" 
												height="100%"
												src={window.URL.createObjectURL(file)} 
												alt={file.name} 
											/>
											<span onClick={() => removeImage(i)} style={{
												position: "absolute",
												top: 10,
												right: 10,
												background: "rgba(255, 255, 255, .5)",
												color: "#000",
												borderRadius: "50%",
												cursor: "pointer"
											}}>X</span>
										</div>
									</div>
								)
							}
							</Slider>
						</Grid>
						<Grid item>
							<input
								multiple
								onChange={handleFileUpload} 
								type="file" 
								id="file" 
								style={{display:"none"}} 
							/>
							<Button 
								color="secondary" 
								variant="contained" 
								component="label" 
								htmlFor="file"
							>
								Upload files
							</Button>
						</Grid>
						<Grid item>
							<TextField 
								label="Patient Name"
								type="text"
								variant="outlined"
								value={patientName}
								onChange={e => setPatientName(e.target.value)}
							/>
						</Grid>
						<Grid item>
							<TextField 
								label="Patient Age"
								type="number"
								variant="outlined"
								value={patientAge}
								onChange={e => setPatientAge(e.target.value)}
							/>
						</Grid>
						<Grid item>
							<TextField
								select
								fullWidth
								style={{width: "100%"}}
								label="Patient Gender"
								variant="outlined"
								value={gender}
								onChange={e => setGender(e.target.value)}
							>
								<MenuItem value="Male">
									Male
								</MenuItem>
								<MenuItem value="Female">
									Female
								</MenuItem>
								<MenuItem value="Other">
									Other
								</MenuItem>
							</TextField>
						</Grid>

						<Grid item>
							<TextField
								select
								fullWidth
								style={{width: "100%"}}
								label="Doctor to Assign"
								variant="outlined"
								value={doctor}
								onChange={e => setDoctor(e.target.value)}
							>
								{
									doctors.map((doctor, i) => 
										<MenuItem key={i} value={doctor.id}>
											{doctor.username}
										</MenuItem>
									)
								}
							</TextField>
						</Grid>
						<Grid item>
							<Button onClick={addItem} color="primary" variant="contained">
								Send
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Grid>	
		</Grid>
		</>
	)
}