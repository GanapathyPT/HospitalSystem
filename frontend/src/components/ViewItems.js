import React, { useState, useEffect } from 'react';
import { Redirect, useHistory, Link } from "react-router-dom";
import {
	Paper,
	Grid,
	Typography,
} from "@material-ui/core";

import NavBar from "./NavBar";

export default function ViewItems({ setCurrentItem }) {
	const [type, setType] = useState(null);
	const [items, setItem] = useState([]);
	const history = useHistory();

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (!user) {
			history.push("/login");
		} else {
			const userData = JSON.parse(user);
			setType(userData.type);

			const userName = userData.userName
			const password = userData.password

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

					const listOptions = {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Accept": "application/json"
						},
						body: JSON.stringify(
							data.type === "H" ?
							{} :
							{ user: userName }
						)
					}
					fetch("/items/list", listOptions)
					.then(res => res.json())
					.then(data => {
						setItem(data)
					})
				} else {
					history.push("/login")
				}
			})

		}
	}, [])

	return (
		<div>
			<NavBar type={type} />
			<Grid 
				container
				row="column"
				spacing={3}
				alignItems="center"
				justify="center"
			>
			{
				items.map((item, i) => 
					<Grid item key={i} xs={5}>
						<Paper elevation={5}>
							<Grid container>
								<Grid item xs={7} align="center">
									<Typography 
										onClick={() => setCurrentItem(item)}
										to="/details"
										variant="h4"
										component={Link} 
										color="inherit"
									>
										{ item.patient_name }
									</Typography>
								</Grid>
								<Grid item xs={5}>
									<img
										width="100%"
										height="100%" 
										src={item.images[0].image} 
										alt={item.patient_name} 
									/>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				)
			}
			</Grid>
		</div>
	)
}