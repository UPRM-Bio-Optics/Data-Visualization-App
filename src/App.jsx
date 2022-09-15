import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import Banner from "./components/Banner";
import Navbar from "./components/Navbar";
import "./styles.css";

const theme = createTheme({
	palette: {
		primary: {
			main: "rgb(73, 141, 78)",
		},
		background: {
			default: "rgb(245, 245, 245)",
		},
	},
});

export default function App() {
	return (
		<div>
			<ThemeProvider theme={theme}>
				<Banner></Banner>
				<Navbar></Navbar>
			</ThemeProvider>
		</div>
	);
}
