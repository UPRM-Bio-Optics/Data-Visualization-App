console.log("App starting...");

var echosounder_files = ["Jul-26-2022.csv", "Mar-25-2022.csv"];
var spectrometer_files = ["Jul-11-2022.csv"];

var url;
var csv_data;
var x_data;
var y_data;
var z_data;
var surface_data;

var colorscale = [
	[0, "rgb(220, 220, 255)"],
	[0.5, "rgb(100, 100, 255)"],
	[1, "rgb(0, 0, 100)"],
];

async function init() {
	console.clear();

	$("#graph-heading").text("Waiting for user input...");
	$("#plot-div").empty();

	url = "../../data/" + $("#sensors").val() + "/";

	$("#files").empty();

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
		$("#spectrum-label").hide();
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
		$("#contour-label").hide();
		$("#mesh-label").hide();
		$("#map-label").hide();
		$("#spectrum-label").show();
	}
}

async function graph() {
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
}

async function parseData() {
	await fetch(url + $("#files").val(), {
		method: "get",
		headers: {
			"content-type": "text/csv;charset=UTF-8",
		},
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
				if (index > 0) {
					if ($("#sensors").val() == "echosounder") {
						y_data.push(+csv_data[index][0]);
						x_data.push(+csv_data[index][1]);
						z_data.push(+csv_data[index][2]);
					} else {
						x_data.push(+csv_data[index][0]);
						y_data.push(+csv_data[index][1]);
					}
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
			console.log("CSV Data:", csv_data);
			console.log("X Data:", x_data);
			console.log("Y Data:", y_data);
			console.log("Z Data:", z_data);
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
			},
			yaxis: {
				title: "Latitude",
			},
			zaxis: {
				title: "Depth",
				autorange: "reversed",
			},
			aspectmode: "manual",
			aspectratio: {
				x: 1,
				y: 1,
				z: 0.5,
			},
		},
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
			type: "log",
			autorange: true,
		},
	};

	Plotly.newPlot("plot-div", data, layout);
}

init();
