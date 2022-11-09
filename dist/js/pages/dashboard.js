/*
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *			This is a demo file used only for the main dashboard (index.html)
 **/

/* global moment:false, Chart:false, Sparkline:false */
let navigator = {
	min: 0,
	max: 0
}
// const cats = {location: 'rgb(255, 54, 54)', servizio: 'rgb(54, 255, 54)', menu: 'rgb(54, 54, 255)', prezzo: 'rgb(255, 255, 54)'};
const cats = {location: '#dc3545', servizio: '#28a745', menu: '#17a2b8', prezzo: '#ffc107'};

$(function () {
	'use strict'

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// Make the dashboard widgets sortable Using jquery UI
	$('.connectedSortable').sortable({
		placeholder: 'sort-highlight',
		connectWith: '.connectedSortable',
		handle: '.card-header, .nav-tabs',
		forcePlaceholderSize: true,
		zIndex: 999999
	})
	$('.connectedSortable .card-header').css('cursor', 'move')

	// jQuery UI sortable for the todo list
	$('.todo-list').sortable({
		placeholder: 'sort-highlight',
		handle: '.handle',
		forcePlaceholderSize: true,
		zIndex: 999999
	})

	// bootstrap WYSIHTML5 - text editor
	$('.textarea').summernote()

	$('.daterange').daterangepicker({
		ranges: {
			Today: [moment(), moment()],
			Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(6, 'days'), moment()],
			'Last 30 Days': [moment().subtract(29, 'days'), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		},
		startDate: moment().subtract(29, 'days'),
		endDate: moment()
	}, function (start, end) {
		// eslint-disable-next-line no-alert
		alert('You chose: ' + start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'))
	})


	// CLUSTERING
	/*
	$.getJSON("../../../../data/test_clustering.json", function(data) {

		var data_d = []
		var data_colors = []
		var data_labels = []
		var clusters = []
		var colors = {
			0: '#206316',
			1: '#030f27'
		}

		data.forEach(function(el){
			data_d.push({x: el['docD2'][0], y: el['docD2'][1], label: el['labels2']});
			data_colors.push(colors[el['labels2']])
			clusters.push(el['labels2'])
			data_labels.push(el['text'])
		});

		var clustering_canvas = $('#clustering-chart').get(0).getContext('2d')

		var clustering_data = {
			cluster: clusters,
			labels: data_labels,
			datasets: [
				{
					label: 'Digital Goods',
					fill: false,
					borderWidth: 2,
					lineTension: 0,
					spanGaps: true,
					borderColor: data_colors,
					pointRadius: 3,
					pointHoverRadius: 7,
					pointBackgroundColor: data_colors,
					data: data_d
				}
			]
		}

		var clustering_options = {
			maintainAspectRatio: false,
			responsive: true,
			// onClick: click_dot,
			legend: {
				display: false
			}
		}

		// This will get the first returned node in the jQuery collection.
		// eslint-disable-next-line no-unused-vars
		var clustering_chart = new Chart(clustering_canvas, { // lgtm[js/unused-local-variable]
			type: 'scatter',
			data: clustering_data,
			options: clustering_options
		});

		$("#clustering-chart").click( 
			function(evt){
				var activePoints = clustering_chart.getElementsAtEvent(evt);

				if(activePoints.length > 0)
					{
					//get the internal index of slice in pie chart
					var clickedElementindex = activePoints[0]["_index"];

					//get specific label by index 
					var label = clustering_chart.data.labels[clickedElementindex];

					//get value by index      
					var value = clustering_chart.data.datasets[0].data[clickedElementindex];

					for (var el in clustering_chart.data.datasets[0].pointBackgroundColor){
						clustering_chart.data.datasets[0].pointBackgroundColor[el] = colors[clusters[el]]
					}

					clustering_chart.data.datasets[0].pointBackgroundColor[clickedElementindex] = 'yellow'
  					clustering_chart.update();
					$('#dot-text').text(label)
				}

			}
		);

		function click_dot(event){
			var activePoints = clustering_chart.getElementAtEvent(event);

        	if(activePoints[0] !== undefined){
				const datasetIndex = clustering_chart.getElementAtEvent(event)[0]._datasetIndex;
				const model = clustering_chart.getElementsAtEvent(event)[datasetIndex]._model;
        	}
		}
	});
	*/

	function set_buttons(stockChart, count_cats){
		$('#navigator').on('click', function(){
			if(stockChart.navigator['dynamicUpdate'])
				stockChart.navigator['dynamicUpdate']=true;
			else
				stockChart.navigator['dynamicUpdate']=true;
		});
		var $dropdown = $("#categories");
		for (const label in cats){
			$dropdown.append('<option value="'+label+'">'+capitalizeFirstLetter(label)+'</option>');
		}
		for(let label in cats){
			$('#title-'+label).text(capitalizeFirstLetter(label));
			const sum = count_cats[label]['sentiment'].reduce((a, b) => a + b, 0);
			const avg = (sum / count_cats[label]['sentiment'].length) || 0;
			$('#sentiment-'+label).text('Sentiment medio: '+roundToTwo(avg));
			$('#val-'+label).text('Volume: '+count_cats[label]['val']);

			$('#more-info-'+label).on('click', function(){
				$('#categories').val(label).trigger("change");
				$('html, body').animate({
					scrollTop: $("#sentiment-graph").offset().top
				}, 2000);
			});
		}
	}
	function roundToTwo(num) {
		return +(Math.round(num + "e+2")  + "e-2");
	}
	function create_bar({labels=['car1', 'car2', 'car3', 'car4'], backgroundColor=['red', 'yellow', 'blue', 'green'], data=[30, 12, 20, 10]}){
		const barChartCanvas =  $('#revenue-chart-canvas').get(0).getContext('2d');
		let dataset = [];
		let colors = Object.keys(cats).map(function(k){return cats[k]});
		for(var i = 0; i < data.length; i++){
			dataset.push({
				data: [data[i]],
				backgroundColor: colors[i],
				label: labels[i]
			})
		}
		const barData = {
			labels: ["Categorie"],
			datasets: dataset
		}
		const barOptions = {
			legend: {
				display: true
			},
			maintainAspectRatio: false,
			responsive: true,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
		const barChart = new Chart(barChartCanvas, { // lgtm[js/unused-local-variable]
			type: 'bar',
			data: barData,
			options: barOptions
		});
		return barChart
	}
	function create_pie({labels=['car1', 'car2', 'car3', 'car4'], backgroundColor=['red', 'yellow', 'blue', 'green'], data=[30, 12, 20, 10]}){

		// Donut Chart
		const pieChartCanvas = $('#sales-chart-canvas').get(0).getContext('2d')
		const pieData = {
			labels: labels,
			datasets: [
				{
					data: data,
					backgroundColor: Object.keys(cats).map(function(k){return cats[k]})
				}
			]
		}

		const pieOptions = {
			legend: {
				display: true
			},
			maintainAspectRatio: false,
			responsive: true
		}
		// Create pie or douhnut chart
		// You can switch between pie and douhnut using the method below.
		// eslint-disable-next-line no-unused-vars
		const pieChart = new Chart(pieChartCanvas, { // lgtm[js/unused-local-variable]
			type: 'doughnut',
			data: pieData,
			options: pieOptions
		});

		return pieChart;
	}
	function create_line_emo(){
		// Sales graph chart
		var timeFormat = 'dd/MM/yyyy';

		var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};

		let labels = getDaysArray(new Date("2018-05-01"),new Date("2018-05-07"));
		let data = {'Median': [], 'Min': [], 'Max': []}

		for (const [index, date] of labels.entries()){
			data['Median'].push({'x': date.toLocaleDateString('it'), 'y': 20})
			data['Min'].push({'x': date.toLocaleDateString('it'), 'y': 10})
			data['Max'].push({'x': date.toLocaleDateString('it'), 'y': 30})
		}

		var ctx = $('#line-chart').get(0).getContext('2d');

		var config = {
			type: 'line',
			data: {
				datasets: [
					{
						label: 'Media',
						data: data['Median'],
						fill: false,
						borderColor: 'rgba(241, 247, 111,0.85)',
						tension: 0.1,
					},
					{
						label: 'Min',
						data: data['Min'],
						fill: '0',
						borderColor: 'rgb(199, 64, 64)',
						tension: 0.1,
						backgroundColor: 'rgba(199, 64, 64,0.35)'
					},
					{
						label: 'Max',
						data: data['Max'],
						fill: '0',
						borderColor: 'rgb(64, 199, 64)',
						tension: 0.1,
						backgroundColor: 'rgba(64, 199, 64,0.35)'
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title:	  {
					display: false,
					text:	"Sentiment per aspetto"
				},
				scales:	 {
					xAxes: [{
						type: "time",
						time: {
							format: timeFormat,
							unit: 'day'
							// tooltipFormat: 'll'
						},
						scaleLabel: {
							display: true,
							labelString: 'Date',
							fontSize: 17
						},
						ticks: {
							fontSize: 15
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Sentiment',
							fontSize: 17
						},
						ticks: {
							fontSize: 15
						}
					}]
				}
			}
		};

		var chart = new Chart(ctx, config);
		return chart;
	}
	function create_lines_emos(){
		// Sales graph chart
		var timeFormat = 'dd/MM/yyyy';

		var getDaysArray = function(s,e) {for(var a=[],d=new Date(s);d<=new Date(e);d.setDate(d.getDate()+1)){ a.push(new Date(d));}return a;};

		let labels = getDaysArray(new Date("2018-05-01"),new Date("2018-05-07"));
		let data = {}

		for (let cat in cats){
			data[cat] = [];
			for (const [index, date] of labels.entries()){
				data[cat].push({'x': date.toLocaleDateString('it'), 'y':  Math.floor(Math.random() * 30) + 1});
			}
		}
		let datasets = [];
		for (let cat in cats){
			datasets.push({
				label: cat,
				data: data[cat],
				fill: false,
				borderColor: cats[cat],
				tension: 0.1,
			});
		}

		var ctx = $('#line-chart-all').get(0).getContext('2d');
		var config = {
			type: 'line',
			data: {
				datasets: datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				title:	  {
					display: false,
					text:	"Sentiment per aspetto"
				},
				scales:	 {
					xAxes: [{
						type: "time",
						time: {
							format: timeFormat,
							unit: 'day'
							// tooltipFormat: 'll'
						},
						scaleLabel: {
							display: true,
							labelString: 'Date',
							fontSize: 17
						},
						ticks: {
							fontSize: 15
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Sentiment',
							fontSize: 17
						},
						ticks: {
							fontSize: 15
						}
					}]
				}
			}
		};

		var chart = new Chart(ctx, config);
		return chart;
	}
	function create_time_chart(volume_object, pieChart, barChart, emoLine, emosLines){
		// https://canvasjs.com/docs/stockcharts/basics-of-creating-html5-stockchart/

		var stockChart = new CanvasJS.StockChart("chartContainer", {
			exportEnabled: true,
			animationEnabled: true,
			zoomEnabled: true,
			title: {
				text:"Volume di recensioni per categoria"
			},
			subtitles: [{
				text:""
			}],
			charts: [{
				axisX: {
					crosshair: {
						enabled: true,
						snapToDataPoint: true,
						valueFormatString: "MMM YYYY"
					}
				},
				axisY: {
					title: "Numero di recensioni",
					prefix: "",
					titleFontSize: 19,
					suffix: "",
					crosshair: {
						enabled: true,
						snapToDataPoint: true,
						// valueFormatString: "$#,###.00M",
					}
				},
				toolTip: {
					shared: true
				},
				legend: {
					cursor: "pointer",
					itemclick: function (e) {
						//console.log("legend click: " + e.dataPointIndex);
						//console.log(e);
						if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
							e.dataSeries.visible = false;
						} else {
							e.dataSeries.visible = true;
						}
						e.chart.render();
					}
				},
				data: [{
					type: "stackedArea100",
					name: "location",
					xValueFormatString: "DD MMM YYYY",
					// yValueFormatString: "$#,###.##M",
					showInLegend: "true",
					dataPoints : volume_object['location'],
					color: cats['location']
				},{
					type: "stackedArea100",
					name: "servizio",
					xValueFormatString: "DD MMM YYYY",
					// yValueFormatString: "$#,###.##M",
					showInLegend: "true",
					dataPoints : volume_object['servizio'],
					color: cats['servizio']
				},{
					type: "stackedArea100",
					name: "menu",
					xValueFormatString: "DD MMM YYYY",
					// yValueFormatString: "$#,###.##M",
					showInLegend: "true",
					dataPoints : volume_object['menu'],
					color: cats['menu']
				},{
					type: "stackedArea100",
					name: "prezzo",
					xValueFormatString: "DD MMM YYYY",
					// yValueFormatString: "$#,###.##M",
					showInLegend: "true",
					dataPoints : volume_object['prezzo'],
					color: cats['prezzo']
				}]
			}],
			navigator: {
				dynamicUpdate: false,
				data: [{
					type: "area",
					color: "gray",
					dataPoints: volume_object['all']
				}],
				slider: {
					minimum: new Date(volume_object['prezzo'][0]['x']),
					maximum: new Date(volume_object['prezzo'][volume_object['prezzo'].length-1]['x'])
				}
			},
			rangeChanged: function (e) {
				function update_emos_lines(index, label){
					emosLines.data.datasets[index].data = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {
							return item['vals'].length>0 ? roundToTwo(item['vals'].reduce((a, b) => a + b) / item['vals'].length) : 0
						});
					emosLines.data.labels = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {return item['x'].toLocaleDateString('it')});
				}
				function update_emo_line(label){
					emoLine.data.datasets[0].data = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {
							return item['vals'].length>0 ? roundToTwo(item['vals'].reduce((a, b) => a + b) / item['vals'].length) : 0
						});
					emoLine.data.datasets[1].data = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {
							return item['vals'].length>0 ? roundToTwo(Math.min.apply(Math, item['vals'])) : 0
						});
					emoLine.data.datasets[2].data = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {
							return item['vals'].length>0 ? roundToTwo(Math.max.apply(Math, item['vals'])) : 0
						});
					emoLine.data.labels = volume_object[label]
						.filter(({x}) => new Date(x) > min && new Date(x) < max)
						.map( item => {return item['x'].toLocaleDateString('it')});

					emoLine.update();
				}
				let min = new Date(e.minimum);
				let max = new Date(e.maximum);
				navigator.min = min;
				navigator.max = max;
				const labels = ['location', 'servizio', 'menu', 'prezzo'];
				for (const [index, label] of labels.entries()){
					pieChart.data.datasets[0].data[index] = volume_object[label].filter(({x}) => new Date(x) > min && new Date(x) < max).reduce((accum,item) => accum + item['y'], 0);
					barChart.data.datasets[index].data = [volume_object[label].filter(({x}) => new Date(x) > min && new Date(x) < max).reduce((accum,item) => accum + item['y'], 0)];
					update_emos_lines(index, label);
				}
				update_emo_line($("#categories").val());
				emosLines.update();
				pieChart.update();
				barChart.update();
			}
		});
		navigator.min = new Date(volume_object['prezzo'][0]['x']);
		navigator.max = new Date(volume_object['prezzo'][volume_object['prezzo'].length-1]['x']);

		var $dropdown = $("#categories");
		$dropdown.on("change", function () {
			function update_emo_line(label){
				emoLine.data.datasets[0].data = volume_object[label]
					.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
					.map( item => {
						return item['vals'].length>0 ? roundToTwo(item['vals'].reduce((a, b) => a + b) / item['vals'].length) : 0
					});
				emoLine.data.datasets[1].data = volume_object[label]
					.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
					.map( item => {
						return item['vals'].length>0 ? roundToTwo(Math.min.apply(Math, item['vals'])) : 0
					});
				emoLine.data.datasets[2].data = volume_object[label]
					.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
					.map( item => {
						return item['vals'].length>0 ? roundToTwo(Math.max.apply(Math, item['vals'])) : 0
					});
				emoLine.data.labels = volume_object[label]
					.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
					.map( item => {return item['x'].toLocaleDateString('it')});

				emoLine.update();
			}
			update_emo_line(this.value);
			emoLine.update();
		});
		return stockChart;
	}

	window.onload = function () {

		let volume_object = {};

		const labels = ['location', 'servizio', 'menu', 'prezzo'];

		$ajax({
			type: 'GET', 
			url: '../../../data/test_cat.json', 
			dataType: 'json',
			success:
				function(data) {
					console.log('Loading data, pls wait...')

					let pieChart = create_pie({labels: labels});
					let barChart = create_bar({labels: labels});
					let emoLine = create_line_emo();
					let emosLines = create_lines_emos();

					for (const [index, label] of labels.entries()){
						volume_object[label] = [];
					}
					volume_object['all'] = [];

					let count_cats = {};
					for (let label in cats){
						count_cats[label] = {val: 0, sentiment: []};
					}

					data.forEach(function(d){
						let temp = {};
						let sum = 0;
						let vals = [];
						for (let key in d){
							if(key != 'year'){
								volume_object[key].push({x: new Date(d['year']), y: d[key].length, vals: d[key]});
								vals.push(d[key]);
								count_cats[key]['val'] += d[key].length;
								count_cats[key]['sentiment'].push(d[key]);
							}
						}
						vals = vals.flat();
						volume_object['all'].push({x: new Date(d['year']), y: vals.length, vals: vals});
					});
					for (let label in cats){
						count_cats[label]['sentiment'] = count_cats[label]['sentiment'].flat();
					}
					console.log(count_cats)

					let stockChart = create_time_chart(volume_object, pieChart, barChart, emoLine, emosLines);
					stockChart.render();

					set_buttons(set_buttons, count_cats);

					for (const [index, label] of labels.entries()){
						pieChart.data.datasets[0].data[index] = volume_object[label].reduce((accum,item) => accum + item['y'], 0);
						barChart.data.datasets[index].data = [volume_object[label].reduce((accum,item) => accum + item['y'], 0)];
					}

					function update_emos_lines(index, label){
						emosLines.data.datasets[index].data = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {
								return item['vals'].length>0 ? roundToTwo(item['vals'].reduce((a, b) => a + b) / item['vals'].length) : 0
							});
						emosLines.data.labels = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {return item['x'].toLocaleDateString('it')});
					}
					function update_emo_line(label){
						emoLine.data.datasets[0].data = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {
								return item['vals'].length>0 ? roundToTwo(item['vals'].reduce((a, b) => a + b) / item['vals'].length) : 0
							});
						emoLine.data.datasets[1].data = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {
								return item['vals'].length>0 ? roundToTwo(Math.min.apply(Math, item['vals'])) : 0
							});
						emoLine.data.datasets[2].data = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {
								return item['vals'].length>0 ? roundToTwo(Math.max.apply(Math, item['vals'])) : 0
							});
						emoLine.data.labels = volume_object[label]
							.filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max)
							.map( item => {return item['x'].toLocaleDateString('it')});

						emoLine.update();
					}

					for (const [index, label] of labels.entries()){
						pieChart.data.datasets[0].data[index] = volume_object[label].filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max).reduce((accum,item) => accum + item['y'], 0);
						barChart.data.datasets[index].data = [volume_object[label].filter(({x}) => new Date(x) > navigator.min && new Date(x) < navigator.max).reduce((accum,item) => accum + item['y'], 0)];
						update_emos_lines(index, label);
					}

					update_emo_line($("#categories").val());
					emosLines.update();
					pieChart.update();
					barChart.update();

					emoLine.update();
					pieChart.update();
					barChart.update();
				} 
		});

	}
});