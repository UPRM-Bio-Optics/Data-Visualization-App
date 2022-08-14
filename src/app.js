console.log("App starting...");

// Lists of file names
var echosounder_files = ["Jul-26-2022.csv", "Mar-25-2022.csv"];
var spectrometer_files = ["Jul-11-2022.csv"];

// File paths url
var url;

// Plotting parameters
var csv_data;
var x_data;
var y_data;
var z_data;
var max_value;
var min_value;

// Graph color scale
var colorscale = [
	[0, "rgb(220, 220, 255)"],
	[0.5, "rgb(100, 100, 255)"],
	[1, "rgb(0, 0, 100)"],
];

// Graph background color
var bg_color = "rgba(0, 0, 0, 0)";

async function init() {
	console.clear();

	$("#graph-heading").text("Waiting for user input...");

	$("#plot-div").empty();

	url = "../../data/" + $("#sensors").val() + "/";

	$("#files").empty();
	$("label").hide();
	$("input:radio").prop("checked", false);

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
		$("#contour-label").show();
		$("#mesh-label").show();
		$("#map-label").show();
		// $("#spectrum-label").hide();
	} else {
		for (index in spectrometer_files) {
			console.log(spectrometer_files[index]);
			$("#files").append(
				new Option(
					(text = spectrometer_files[index]),
					(value = spectrometer_files[index])
				)
			);
		}
		$("#spectrum-label").show();
	}
}

async function graph() {
	if ($("input:radio").is(":checked")) {
		console.log("Initializing graph...");

		csv_data = [];
		x_data = [];
		y_data = [];
		z_data = [];
		surface_data = [];

		console.log("Fetching data...");

		await parseData();

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
	} else {
		alert("Error:\nPlease choose one of the visualization options");
		console.log("ERROR: No visualization selected!");
	}
}

async function parseData() {
	await fetch(url + $("#files").val(), {
		method: "get",
		headers: {
			"content-type": "text/csv;charset=UTF-8",
		},
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
	})
		.then((response) => {
			// console.log(response.text())
			return response.text();
		})
		.then((data) => {
			csv_data = data.split("\r\n");
		})
		.then(() => {
			for (index in csv_data) {
				csv_data[index] = csv_data[index].split(",");
				if (index <= 0 || csv_data[index] == "") {
					continue;
				}
				if ($("#sensors").val() == "echosounder") {
					y_data.push(+csv_data[index][0]);
					x_data.push(+csv_data[index][1]);
					z_data.push(+csv_data[index][2]);
				}
				if ($("#sensors").val() == "spectrometer") {
					x_data.push(+csv_data[index][0]);
					y_data.push(+csv_data[index][1]);
				}
			}
		})
		.then(() => {
			for (value in z_data) {
				var temp = [];
				for (index in z_data) {
					if (index == value) {
						temp.push(z_data[value]);
					} else {
						// temp.push(0);
						temp.push(0);
					}
				}
				// for (var i = 0; i < value; i++) {
				// 	var newFirst = temp.shift();
				// 	temp.push(newFirst);
				// }
				surface_data.push(temp);
			}
		})
		.then(() => {
			max_value = Math.max(...x_data);
			min_value = Math.min(...x_data);
			console.log("CSV Data:", csv_data);
			console.log("X Data:", x_data);
			console.log("Y Data:", y_data);
			console.log("Z Data:", z_data);
			console.log(max_value, min_value);
		});
}

function contourPlot() {
	console.log("Creating contour plot...");

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

function mesh3d() {
	console.log("Creating 3D mesh...");

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

function mapOverlay() {
	console.log("Creating Map Overlay...");

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

function spectrum() {
	console.log("Creating spectrum plot...");

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

init();
