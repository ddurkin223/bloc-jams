var animatePoints = function () {
	var revealPoint = function(){
		$(this).css({
			opacity: 1,
			animation: "all 1.5s ease-in-out 0s 1"
		});
	};
	
	$.each($('.point'), revealPoint);
};

$(window).load(function(){
	if($(window).height() > 950){
		animatePoints();
	}
	
	var scrollDistance = $('.selling-points').offset().top - $(window).height() + 100;
	
	$(window).scroll(function(event){
		if($(window).scrollTop() >= scrollDistance){
			animatePoints();
		}
	});
});