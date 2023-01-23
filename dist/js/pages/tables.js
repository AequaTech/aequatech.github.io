ciao = []
$(document).ready(function() {
		$.ajax({
				type: "GET",
				url: "../../../data/ddf.json",
				dataType: "json",
				success: function(data) {
					// processData(data);
					process(data)
				}
		 });
});


function processData(allText) {
	var record_num = 7;	// or however many columns there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	var entries = allTextLines[0].split(',');

	var lines = [];

	var headings = entries.splice(0,record_num);
	console.log(headings)
	while (entries.length>0) {
			var tarr = [];
			for (var j=0; j<record_num; j++) {
				tarr.push(headings[j]+":"+entries.shift());
			}
			lines.push(tarr);
	}
    console.log(lines)

}

const tableBody = document.getElementById("example1");
function process(data){
	data.forEach((item, index) => {
		try{
			c = '<tr>'+
					'<td>'+item['sent']+'</td>'+
					'<td>'+item['spacy_sent_dist'].toFixed(3)+'</td>'+
					'<td>'+item['spacy_nearest_word']+'</td>'+
					'<td>'+item['date']+'</td>'+
					'<td>'+item['baseline'].toFixed(3)+'</td>'+
					'<td>'+item['treshold']+'</td>'+
					'<td>'+item['sentiment'].toFixed(3)+'</td>'+
				'</tr>'
			$('#example1').append(c);
		} catch {
			console.log(item);
		}
	});
	$(function () {
		$("#example1").DataTable({
			"responsive": true, "lengthChange": false, "autoWidth": false,
			"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
		}).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
		$('#example2').DataTable({
			"paging": true,
			"lengthChange": false,
			"searching": false,
			"ordering": true,
			"info": true,
			"autoWidth": false,
			"responsive": true,
		});
	});
}