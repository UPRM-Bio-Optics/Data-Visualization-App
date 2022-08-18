import React from "react";
import "./styles.css";

function App() {
	return (
		<div>
			<div className="banner">
				<div className="logo">Bathymetry Observation Boat</div>
			</div>
			<h1>Data Visualization</h1>
			<div className="app-container">
				<div className="nav-bar">
					<div className="heading">
						<h2>Sensor</h2>
					</div>
				</div>
				<div className="options-card">
					<div className="heading">
						<h2>Options</h2>
					</div>
				</div>
				<div className="graph-card">
					<div className="heading">
						<h2>Graph</h2>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
