import mqtt from "precompiled-mqtt";
import * as React from "react";

export default function Logger() {
	var protocol = "ws";
	var host = "test.mosquitto.org";
	var port = "8080";
	var topic = "SSH/NCAS-M";
	var logs = [];
	var status = "Waiting for user input...";

	const broker_connect = () => {
		console.log(host, port, topic, logs);
		console.log("Connecting...");

		logs = [];
		status = "Connecting to ...";

		var client = mqtt.connect(protocol + "://" + host + ":" + port + "/");

		client.on("connect", function () {
			status = "Connected!";
			console.log("Connected!");
			client.subscribe(topic);
			client.publish(topic, "Current time is: " + new Date());
		});

		client.on("error", (err) => {
			console.error("Connection error: ", err);
			client.end();
		});

		client.on(topic, function (topic, message) {
			console.log(message);
		});
	};

	return (
		<div className="content-container">
			<div className="options-container">
				<div className="heading-container">Connection Options</div>
				<div className="option">
					<h3>Host</h3>
					<input type="text" defaultValue={host} />
				</div>
				<div className="option">
					<h3>Port</h3>
					<input type="number" defaultValue={port} />
				</div>
				<div className="option">
					<h3>Topic</h3>
					<input type="text" defaultValue={topic} />
				</div>
				<div className="confirm-button">
					<button id="confirm-button" onClick={broker_connect}>
						Connect
					</button>
				</div>
			</div>
			<div className="data-container">
				<div className="heading-container">Message Logs</div>
				<div id="logger">
					{status}
					{logs}
				</div>
			</div>
		</div>
	);
}
