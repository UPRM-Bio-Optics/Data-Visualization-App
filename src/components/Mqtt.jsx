import * as React from "react";

export default function Mqtt() {
	return (
		<div className="content-container">
			<div className="options-container">
				<div className="heading-container">Connection Options</div>
				<div className="option">
					<h3>Host</h3>
					<input type="text" />
				</div>
				<div className="option">
					<h3>Client ID</h3>
					<input type="text" />
				</div>
				<div className="option">
					<h3>Topic</h3>
					<input type="text" />
				</div>
				<div className="confirm-button">
					<button id="confirm-button">Connect</button>
				</div>
			</div>
			<div className="data-container">
				<div className="heading-container">Message Logs</div>
			</div>
		</div>
	);
}
