import React, { useState } from 'react';
import { render } from "react-dom";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";

import Login from './Login';
import Register from './Register';
import AddScans from './AddScans';
import ViewItems from './ViewItems';
import ItemDetails from './ItemDetails';

export default function App() {
	const [currentItem, setCurrentItem] = useState({})

	const ViewItemsCont = () => <ViewItems setCurrentItem={setCurrentItem} />
	const ItemDetailsCont = () => <ItemDetails currentItem={currentItem} />

	return (
		<Router>
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/add" component={AddScans} />
				<Route path="/details" component={ItemDetailsCont} />
				<Route path="/" component={ViewItemsCont} />
			</Switch>
		</Router>
	)
}

const appDiv = document.getElementById("root")

render(<App />, appDiv);