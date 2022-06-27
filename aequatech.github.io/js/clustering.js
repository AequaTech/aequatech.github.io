// https://bl.ocks.org/alandunning/18c5ec8d06938edd31968e2fd104a58a
const text = "Click on a dot to show the text."
// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 30, left: 10},
	width = $('#clustering_viz').width() - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#clustering_viz")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

const svg_tooltip = d3.select("#clustering_tooltip")
	.append("svg")
		.attr("width", $('#clustering_tooltip').width() + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g");

const tooltip_div = d3.select("#clustering_tooltip")
				.append("div")
				.style("left", 30 + "px")
				.style("top", 20 + "px")
				.attr('class', 'tooltip_div')
				.style('width', $('#clustering_tooltip').width() - margin.left + 'px')
				.style('max-height', $('#clustering_tooltip').height() - margin.top - margin.bottom + 'px')
				// .style('height', $('#clustering_tooltip').height() - margin.top - margin.bottom + 'px');
				.html("<p>"+text+"</p>");

const ovarlay_rect = svg.append("rect")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.attr('class', 'overlay-svg')
						.on("click", function() {
							d3.selectAll('.svg-dots')
								.style('stroke', 'none');
								// .style('stroke', function(d){return color_dots[d['labelsN']]});
							tooltip_div.html("<p>"+text+"</p>");
						});

        // .attr({"class": "overlay" , "width": $('#clustering_tooltip').width() + margin.left + margin.right , "height": height + margin.top + margin.bottom})

let cluster_selection = 'labels2';
$(document).ready( function() {
	function color_dots(algo){
		cluster_selection = algo;
		colors = {
			0: '#206316',
			1: '#030f27'
		}
		d3.selectAll(".svg-dots")
			.style('fill', function(d) { return colors[d[cluster_selection]]});
	}

	$('.dropdown-clustering').append('<a class="dropdown-item dropdown-clustering-item">'+'labelsN'+'</a>');
	$('.dropdown-clustering').append('<a class="dropdown-item dropdown-clustering-item">'+'labels2'+'</a>');

	$('.dropdown-clustering-toggle').text(cluster_selection);

	$('.dropdown-clustering-item').click(function(){
		$('.dropdown-clustering-toggle').text($(this).text());
		color_dots($(this).text());
	});

	//Read the data
	d3.json("data/test_clustering.json", function(data) {

		const max_x = d3.max(data, function(d){return d['docD2'][0]});
		const min_x = d3.min(data, function(d){return d['docD2'][0]});
		const x_lim = d3.max([max_x, Math.abs(min_x)])

		const max_y = d3.max(data, function(d){return d['docD2'][1]});
		const min_y = d3.min(data, function(d){return d['docD2'][0]});
		const y_lim = d3.max([max_y, Math.abs(min_y)])

		var x = d3.scaleLinear()
			.domain(padExtent([-x_lim, x_lim]))
			.range(padExtent([0, width]));
		var y = d3.scaleLinear()
			.domain(padExtent([-y_lim, y_lim]))
			.range(padExtent([height, 0]));

		// Add X axis
		const xAxis = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," +  y.range()[0] / 2  + ")")
			.call(d3.axisBottom(x).ticks(5));

		// Add Y axis
		const yAxis = svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (x.range()[1] / 2) + ", 0)")
			.call(d3.axisLeft(y).ticks(5));

		// Add dots
		svg
			.selectAll(".svg-dots")
			.data(data)
			.enter()
			.append("circle")
				.attr('class', 'svg-dots')
				.attr("cx", function (d) { return x(d['docD2'][0]); } )
				.attr("cy", function (d) { return y(d['docD2'][1]); } )
				.attr("r", 7);

		color_dots(cluster_selection);

		d3.selectAll('.svg-dots')
			.on('mouseover', function(d){
				d3.select(this)
					.transition(1000)
					.attr('r', 15);
			})
			.on('mouseout', function(d){
				d3.selectAll('.svg-dots')
					.transition(1000)
					.attr("r", 7);
			})
			.on('click', function(d){
				d3.selectAll('.svg-dots')
					// .style('stroke', function(d){return color_dots[d['labelsN']]});
					.style('stroke', 'none')
				d3.select(this)
					.style('stroke', '#fdbe33');
				tooltip_div.html("<p>"+d['text']+"</p>");
			});

		// A function that update the plot for a given xlim value
		function updatePlot() {

			// Get the value of the button
			xlim = this.value

			// Update X axis
			x.domain([3,xlim]);
			xAxis.transition().duration(1000).call(d3.axisBottom(x))

			// Update chart
			svg.selectAll("circle")
				.data(data)
				.transition()
				.duration(1000)
				.attr("cx", function (d) { return x(d.Sepal_Length); } )
				.attr("cy", function (d) { return y(d.Petal_Length); } )
		}

		// Add an event listener to the button created in the html part
		d3.select("#buttonXlim").on("input", updatePlot);

		function padExtent(e, p) {
			if (p === undefined) p = 1;
			return ([e[0] - p, e[1] + p]);
		}
	});
});