$(document).ready( function() {
	$.getJSON("data/test2.json", function(data) {
		for (const [key, value] of Object.entries(data)) {
			// let butt = '<a class="btn category" href="#"'+key+'>'+key+'</a>';
			// $('.section-header').append(butt);
			$('.dropdown-category').append('<a class="dropdown-item dropdown-category-item">'+key+'</a>');
		}

		$('.dropdown-category-item').click(function(){
			$('.dropdown-category-toggle').text($(this).text());
			$('.aspect').remove();
			$('.item').remove();
			for (const [key, value] of Object.entries(data[$(this).text()])) {
				let butt = '<a class="btn aspect"'+key+'>'+key+'</a>';
				$('.section-header').append(butt);
			}
			$('.aspect').click(function(){
				$('.item').remove();
				let aspect = $(this).text();
				get_reviews(aspect, data);	
			});
		});
	});
});

function get_icon(val){
	// https://fontawesome.com/icons/face-frown?s=solid
	if (val>=0.76){	
		return 'fa-face-grin-hearts';
	} else if (val<=0.75 && val>=0.26){
		return 'fa-face-smile';
	} else if (val<=0.25 && val>=-0.25){
		return 'fa-face-meh';
	} else if (val<=-0.26 && val>=-0.75){
		return 'fa-face-frown';
	} else if (val<=-0.76){
		return 'fa-face-sad-tear';
	}
}

function get_reviews(aspect, data){
	function getColor(value) {
		let hue = ((1 - value) * 120).toString(10);
		return ["hsl(", hue, ",100%,50%)"].join("");
	}

	data[$('.dropdown-category-toggle').text()][aspect].forEach(function(el, index){
		let sen = el['item ']['sentence'];
		let word = el['item ']['most_relevant_word'];
		let rel = el['item ']['relevance'];
		let s = el['item ']['most_relevant_word_span'][0]-1;
		let e = el['item ']['most_relevant_word_span'][1];
		// `+[sen.slice(0, s), '<b style="background-color:'+getColor(rel)+'">'+word+'</b>', sen.slice(e)].join('')+`
		let $items = $(`
				<div class="item blog">
					<div class="content">
						<div class="title">
							<h3>Review `+(index+1)+`<i class="fa-regular smile-icons `+get_icon(el['item ']['sentiment'])+`"></i></h3>
						</div>
						<div class="desc">
							`+[sen.slice(0, s), '<b style="background-color: #fdbe33">'+word+' </b>', sen.slice(e)].join('')+`
						</div>
					</div>
				'</div>`
			);
		$('.grid-container2').append($items);
	});
	resizeAllGridItems();
	allItems = document.getElementsByClassName("item");
	for(x=0;x<allItems.length;x++){
		imagesLoaded( allItems[x], resizeInstance);
	}
	$('.item').mouseenter(function(){
		$('.item').css('opacity', 0.5);
		$(this).css('opacity', 1);
	});
	$('.item').mouseleave(function(){
		$('.item').css('opacity', 1);
	});
}

function resizeGridItem(item){
	grid = document.getElementsByClassName("grid-container2")[0];
	rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
	rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
	rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
	item.style.gridRowEnd = "span "+(rowSpan+1);
}

function resizeAllGridItems(){
	allItems = document.getElementsByClassName("item");
	for(x=0;x<allItems.length;x++){
		resizeGridItem(allItems[x]);
	}
}

function resizeInstance(instance){
	item = instance.elements[0];
	resizeGridItem(item);
}

window.addEventListener("resize", resizeAllGridItems);