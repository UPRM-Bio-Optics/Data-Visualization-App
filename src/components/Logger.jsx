import * as React from "react";
import mqtt from "precompiled-mqtt";

export default function Logger() {
	const [host, setHost] = React.useState("mqtt://test.mosquitto.org");
	const [port, setPort] = React.useState("8081");
	const [topic, setTopic] = React.useState("SSH/NCAS-M");
	const [status, setStatus] = React.useState("Waiting for user input...");
	const [logs, setLogs] = React.useState(null);

	const handleHost = (event) => {
		setHost(event.target.value);
	};
	const handlePort = (event) => {
		setPort(event.target.value);
	};
	const handleTopic = (event) => {
		setTopic(event.target.value);
	};

	const broker_connect = () => {
		console.log("Connecting...");

		setLogs(null);
		var messages = [];

		var client = mqtt.connect(host + ":" + port);

		client.on("connect", () => {
			console.log("Connected!");
			setStatus("Connected!");

			client.subscribe(topic, () => {
				client.publish(topic, "Device connected at time: " + new Date());
			});
		});

		client.on("error", (err) => {
			console.error("Connection error: ", err);
			client.end();
		});

		client.on("message", (topic, message) => {
			console.log(message.toString());
			messages.push(message.toString());
			console.log(messages);

			setLogs(
				messages.map((msg, index) => {
					return <li key={index}>{msg}</li>;
				})
			);
		});
	};

	return (
		<div className="content-container">
			<div className="options-container">
				<div className="heading-container">Connection Options</div>
				<div className="option">
					<h3>Host</h3>
					<input type="text" value={host} onChange={handleHost} />
				</div>
				<div className="option">
					<h3>Port</h3>
					<input type="number" value={port} onChange={handlePort} />
				</div>
				<div className="option">
					<h3>Topic</h3>
					<input type="text" value={topic} onChange={handleTopic} />
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
					<br />
					<ul className="logs">{logs}</ul>
				</div>
			</div>
		</div>
	);
}
