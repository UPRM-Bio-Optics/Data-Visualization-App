import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Tab from "@mui/material/Tab";
import * as React from "react";
import Graph from "./Graph";
import Mqtt from "./Mqtt";

export default function Navbar() {
	const [value, setValue] = React.useState("1");

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: "100%", typography: "body1" }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<TabList
						onChange={handleChange}
						aria-label="lab API tabs example"
						variant="fullWidth"
						centered
					>
						<Tab label="Connect" value="1" />
						<Tab label="Visualize" value="2" />
					</TabList>
				</Box>
				<Slide direction="right" in={value === "1"} mountOnEnter unmountOnExit>
					<TabPanel value="1" index={0}>
						<Mqtt></Mqtt>
					</TabPanel>
				</Slide>
				<Slide direction="left" in={value === "2"} mountOnEnter unmountOnExit>
					<TabPanel value="2" index={1}>
						<Graph></Graph>
					</TabPanel>
				</Slide>
			</TabContext>
		</Box>
	);
}
