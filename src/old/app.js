// Data visualization tool for CSV files
// Authors: UPRM Bio-Optics undergraduate research students

// Lists of file names - Add new file name here
var echosounder_files = ["Jul-26-2022.csv", "Mar-25-2022.csv"];
var spectrometer_files = ["Jul-11-2022.csv"];

// Files path url
var url;

// Plotting parameters
var csv_data;
var x_data;
var y_data;
var z_data;

// Graph color scale
var colorscale = [
	[0, "rgb(220, 220, 255)"],
	[0.5, "rgb(100, 100, 255)"],
	[1, "rgb(0, 0, 100)"],
];

// Graph background color
var bg_color = "rgba(0, 0, 0, 0)";

// Initialize DOM elements
async function init() {
	// Clear console
	console.clear();

	// Waiting for input state
	$("#graph-heading").text("Waiting for user input...");
	$("#plot-div").empty();

	// Set the url to the file chosen on the dropdown
	url = "../../data/" + $("#sensors").val() + "/";

	// Empty files in dropdown
	$("#files").empty();

	// Hide and uncheck unnecesary visiualization options
	$("label").hide();
	$("input:radio").prop("checked", false);

	// Add echosounder files to dropdown if the sensor is selected
	if ($("#sensors").val() == "echosounder") {
		for (index in echosounder_files) {
			console.log(echosounder_files[index]);
			$("#files").append(
				new Option(
					(text = echosounder_files[index]),
					(value = echosounder_files[index])
				)
			);
		}

		// Show the options for echosounder graphs
		$("#contour-label").show();
		$("#mesh-label").show();
		$("#map-label").show();
	}

	// Add spectrometer files to dropdown if the sensor is selected
	if ($("#sensors").val() == "echosounder") {
		for (index in spectrometer_files) {
			console.log(spectrometer_files[index]);
			$("#files").append(
				new Option(
					(text = spectrometer_files[index]),
					(value = spectrometer_files[index])
				)
			);
		}
		// Show the options for spectrometer graphs
		$("#spectrum-label").show();
	}
}

// Initialize graph properties and call respective functions
async function graph() {
	// Check if a visualization option is selected
	if ($("input:radio").is(":checked")) {
		console.log("Initializing graph...");

		// Initialize data variables
		csv_data = [];
		x_data = [];
		y_data = [];
		z_data = [];

		console.log("Fetching data...");

		// Wait for this function to parse data
		await parseData();

		// Determine which graphing method to use
		if ($("#contour").is(":checked")) {
			$("#graph-heading").text("Contour Plot");
			contourPlot();
		} else if ($("#surface").is(":checked")) {
			$("#graph-heading").text("Surface Plot");
			surfacePlot();
		} else if ($("#mesh").is(":checked")) {
			$("#graph-heading").text("3D Mesh");
			mesh3d();
		} else if ($("#map").is(":checked")) {
			$("#graph-heading").text("Map Overlay");
			mapOverlay();
		} else if ($("#spectrum").is(":checked")) {
			$("#graph-heading").text("Spectrum");
			spectrum();
		}
		console.log("Done!");
	}
	// Notify the user to select a visualization option before pressing confirm
	else {
		alert("Error:\nPlease choose one of the visualization options");
		console.log("ERROR: No visualization selected!");
	}
}

// Parse file into graphing data
async function parseData() {
	// Wait for the fetch api to fetch the file
	await fetch(url + $("#files").val(), {
		method: "get",
		headers: {
			"content-type": "text/csv;charset=UTF-8",
		},
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	})
		// Parse the data into a string
		.then((response) => {
			return response.text();
		})
		// Split the data for each rows
		.then((data) => {
			csv_data = data.split("\r\n");
		})
		// Parse data into necessary values for graphing
		.then(() => {
			for (index in csv_data) {
				// Split the data for each value
				csv_data[index] = csv_data[index].split(",");
				// Check if data is a column name or is empty
				if (index <= 0 || csv_data[index] == "") {
					continue;
				}
				// Check if data is for echosounder
				if ($("#sensors").val() == "echosounder") {
					y_data.push(+csv_data[index][0]);
					x_data.push(+csv_data[index][1]);
					z_data.push(+csv_data[index][2]);
				}
				// Check if data is for spectrometer
				if ($("#sensors").val() == "spectrometer") {
					x_data.push(+csv_data[index][0]);
					y_data.push(+csv_data[index][1]);
				}
			}
		})
		// Log variables to console for testing
		.then(() => {
			console.log("CSV Data:", csv_data);
			console.log("X Data:", x_data);
			console.log("Y Data:", y_data);
			console.log("Z Data:", z_data);
			console.log(max_value, min_value);
		});
}

// Create contour plot
function contourPlot() {
	console.log("Creating contour plot...");

	// Object variables for Plotly
	var data = [
		{
			x: x_data,
			y: y_data,
			z: z_data,
			type: "contour",
			contours: {
				coloring: "heatmap",
			},
			// ncontours: Math.max(...z_data),
			colorbar: {
				title: "Depth (ft)",
				titleside: "right",
			},
			colorscale: colorscale,
		},
	];

	var layout = {
		autosize: true,
		height: "600",
		margin: {
			l: 70,
			r: 0,
			b: 40,
			t: 30,
		},
		plot_bgcolor: bg_color,
		paper_bgcolor: bg_color,
	};

	Plotly.newPlot("plot-div", data, layout);
}

// Create 3D mesh
function mesh3d() {
	console.log("Creating 3D mesh...");

	// Object variables for Plotly
	var data = [
		{
			z: z_data,
			x: x_data,
			y: y_data,
			type: "mesh3d",
			// opacity: 1.0,

			intensity: z_data,
			colorscale: colorscale,
			// opacity: 0.7,
		},
	];

	var updatemenus = [
		{
			buttons: [
				{
					args: ["opacity", 1],
					label: "Solid",
					method: "restyle",
				},
				{
					args: ["opacity", 0.5],
					label: "Transparent",
					method: "restyle",
				},
			],
			direction: "left",
			pad: { r: 0, l: 0, t: 0, b: 0 },
			showactive: true,
			type: "buttons",
			// x: 0.05,
			xanchor: "left",
			y: 1.05,
			yanchor: "top",
			bgcolor: "rgb(255,255,255)",
		},
		{
			buttons: [
				{
					args: [
						{
							"scene.xaxis.visible": true,
							"scene.yaxis.visible": true,
							"scene.zaxis.visible": true,
						},
					],
					label: "Show Grid",
					method: "relayout",
				},
				{
					args: [
						{
							"scene.xaxis.visible": false,
							"scene.yaxis.visible": false,
							"scene.zaxis.visible": false,
						},
					],
					label: "Hide Grid",
					method: "relayout",
				},
			],
			direction: "left",
			pad: { r: 0, l: 0, t: 0, b: 0 },
			showactive: true,
			type: "buttons",
			// x: 0.05,
			xanchor: "left",
			y: 0.99,
			yanchor: "top",
			bgcolor: "rgb(255,255,255)",
		},
	];

	var layout = {
		autosize: true,
		height: "600",
		margin: {
			l: 0,
			r: 0,
			b: 0,
			t: 30,
		},
		scene: {
			xaxis: {
				title: "Longuitud",
				showgrid: true,
			},
			yaxis: {
				title: "Latitude",
				showgrid: true,
			},
			zaxis: {
				title: "Depth",
				autorange: "reversed",
				showgrid: true,
			},
			aspectmode: "manual",
			aspectratio: {
				x: 1,
				y: 1,
				z: 0.5,
			},
		},
		plot_bgcolor: bg_color,
		paper_bgcolor: bg_color,
		updatemenus: updatemenus,
	};

	Plotly.newPlot("plot-div", data, layout);
}

// Cretea map overlay
function mapOverlay() {
	console.log("Creating Map Overlay...");

	// Object variables for Plotly
	var data = [
		{
			type: "densitymapbox",
			lon: x_data,
			lat: y_data,
			z: z_data,
			colorscale: colorscale,
		},
	];

	var layout = {
		mapbox: {
			style: "white-bg",
			layers: [
				{
					sourcetype: "raster",
					source: [
						"https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
					],
					below: "traces",
				},
			],
			center: {
				lon: (Math.max(...x_data) + Math.min(...x_data)) / 2,
				lat: (Math.max(...y_data) + Math.min(...y_data)) / 2,
			},
			zoom: 19,
		},
		xaxis: {
			title: csv_data[1],
		},
		yaxis: {
			title: csv_data[0],
		},
		height: "900",
		margin: {
			l: 0,
			r: 0,
			b: 0,
			t: 30,
		},
		plot_bgcolor: bg_color,
		paper_bgcolor: bg_color,
	};

	Plotly.newPlot("plot-div", data, layout);
}

// Create spectrum graph
function spectrum() {
	console.log("Creating spectrum plot...");

	// Object variables for Plotly
	var data = [
		{
			x: x_data,
			y: y_data,
			type: "scatter",
			mode: "lines",
			line: { color: "green" },
		},
	];

	var layout = {
		autosize: true,
		height: "600",
		margin: {
			l: 70,
			r: 0,
			b: 40,
			t: 30,
		},
		xaxis: {
			// type: "normal",
			// autorange: false,
			// range: [min_value, max_value],
			title: csv_data[0][1],
		},
		yaxis: {
			title: csv_data[0][0],
		},
		plot_bgcolor: bg_color,
		paper_bgcolor: bg_color,
	};

	Plotly.newPlot("plot-div", data, layout);
}

// Start application
console.log("App starting...");
init();
