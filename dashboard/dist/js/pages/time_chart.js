$.getJSON("../../../../data/test_cat.json", function(data) {
	volume_data = []

	data.forEach(function(d){
		if(volume_data.length<100){
			temp = {};
			sum = 0
			for (key in d){
				if(key != 'year'){
					temp[key] = d[key].length
					sum += d[key].length
				}
			}
			temp['year'] = d['year']
			temp['year2'] = new Date(d['year'])
			temp['all'] = sum
			volume_data.push(
				temp
			);
		}
	});
	console.log(volume_data);

	am5.ready(function() {

		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		var root = am5.Root.new("time-span-chart");


		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([
			am5themes_Animated.new(root)
		]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		var chart = root.container.children.push(am5xy.XYChart.new(root, {
			panX: true,
			panY: true,
			baseInterval: {
				timeUnit: "day",
				count: 1
			},
			wheelX: "panX",
			wheelY: "zoomX",
			layout: root.verticalLayout,
			pinchZoomX:true
		}));

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
			behavior: "none"
		}));
		cursor.lineY.set("visible", false);

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
			categoryField: "year2",
			startLocation: 0.5,
			endLocation: 0.5,
			renderer: am5xy.AxisRendererX.new(root, {}),
			tooltip: am5.Tooltip.new(root, {})
		}));

		xAxis.data.setAll(volume_data);

		var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
			min: 0,
			max: 100,
			calculateTotals: true,
			numberFormat: "#'%'",
			renderer: am5xy.AxisRendererY.new(root, {})
		}));

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		function createSeries(name, field) {
			var series = chart.series.push(am5xy.LineSeries.new(root, {
				name: name,
				stacked: true,
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: field,
				categoryXField: "year2",
				valueYShow: "valueYTotalPercent",//"valueYTotalPercent",valueYSum
				legendValueText: "{valueY}",
				tooltip: am5.Tooltip.new(root, {
					pointerOrientation: "horizontal",
					labelText: "[bold]{name}[/]\n{categoryX}: {valueYTotalPercent.formatNumber('#.0')}% ({valueY})"
				})
			}));

			series.fills.template.setAll({
				fillOpacity: 0.5,
				visible: true
			});

			series.data.setAll(volume_data);
			series.appear(1000);
		}

		// createSeries("Location", "location");
		createSeries("Menu", "menu");
		createSeries("Prezzo", "prezzo");
		createSeries("Servizio", "servizio");

		// Add scrollbar
		// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
		var scrollbarX = am5xy.XYChartScrollbar.new(root, {
			orientation: "horizontal",
			height: 50
		});

		chart.set("scrollbarX", scrollbarX);

		var sbxAxis = scrollbarX.chart.xAxes.push(am5xy.DateAxis.new(root, {
			baseInterval: {
				timeUnit: "day",
				count: 1
			},
			categoryField: "year",
			startLocation: 0.5,
			endLocation: 0.5,
			renderer: am5xy.AxisRendererX.new(root, {}),
			// tooltip: am5.Tooltip.new(root, {})
		}));

		sbxAxis.data.setAll(volume_data);

		root.dateFormatter.set("dateFormat", "dd/mm/yyyy");

		var sbyAxis = scrollbarX.chart.yAxes.push(am5xy.ValueAxis.new(root, {
			min: 0,
			max: maxPricedItem = Math.max(...volume_data.map(o => o['all'])),
			calculateTotals: true,
			// numberFormat: "#'%'",
			renderer: am5xy.AxisRendererY.new(root, {})
		}));

		var sbseries = scrollbarX.chart.series.push(am5xy.LineSeries.new(root, {
			name: 'all',
			// stacked: true,
			xAxis: sbxAxis,
			yAxis: sbyAxis,
			valueYField: 'all',
			categoryXField: "year2",
			valueYShow: "valueYSum"//"valueYTotalPercent",valueYSum
		}));

		sbseries.fills.template.setAll({
			fillOpacity: 0.5,
			visible: false
		});
		sbseries.data.setAll(volume_data);

		// Add legend
		// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
		var legend = chart.children.push(am5.Legend.new(root, {
			centerX: am5.p50,
			x: am5.p50
		}));

		legend.data.setAll(chart.series.values);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		chart.appear(1000, 100);


		scrollbarX.events.on("rangechanged", () => {
			// console.log(scrollbarX)
			// const cursorMin = chart.scrollbarX.range.start;
			// const cursorMax = chart.scrollbarX.range.end;

			// document.getElementById("label").innerHTML = `
			// <h1>Scrollbar range: ${cursorMin} — ${cursorMax}</h1>`;
		});

		// var rangeDate = new Date();
		// am5.time.add(rangeDate, "day", Math.round(sbseries.dataItems.length / 2));
		// var rangeTime1 = rangeDate.getTime() - am5.time.getDuration("day") * 20;
		// var rangeTime2 = rangeDate.getTime() + am5.time.getDuration("day") * 20;

		// var range1 = sbxAxis.createAxisRange(sbxAxis.makeDataItem({}));

		// range1.set("value", rangeTime1);
		// range1.set("endValue", rangeTime2);


		// range1.get("grid").setAll({
		//   strokeOpacity: 1,
		//   stroke: 'red'
		// });


		// var axisFill = range1.get("axisFill");
		// axisFill.setAll({
		//   fillOpacity: 0.15,
		//   fill: 'red',
		//   visible:true,
		//   draggable:true
		// });

		// // restrict from being dragged vertically
		// axisFill.adapters.add("y", function () {
		//   return 0;
		// });

		// axisFill.events.on("dragstop", function(){

		// 	var dx = axisFill.x();

		// 	var x = resizeButton1.x() + dx;
		// 	var position = xAxis.toAxisPosition(x / chart.plotContainer.width());
		// 	var endPosition = xAxis.toAxisPosition((x + axisFill.width()) / chart.plotContainer.width());

		// 	var value = xAxis.positionToValue(position);
		// 	var endValue = xAxis.positionToValue(endPosition);

		// 	console.log("selected range", new Date(value), new Date(endValue))

		// 	range1.set("value", value);
		// 	range1.set("endValue", endValue);
		// 	range2.set("value", endValue);

		// 	axisFill.set("x", 0);
		// })

	});
	// end am5.ready()
});
