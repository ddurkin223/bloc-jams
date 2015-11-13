var pointArray = document.getElementsByClassName('point');

var animatePoints = function (points) {
	for (var i = 0, len = points.length; i<len;i++) {
		points[i].style.animation = "all 4s ease-in-out 0s 1";
		points[i].style.opacity = "1";
	}
}

window.onload = function () {
	if(window.innerHeight > 950){
		animatePoints(pointArray);
	}
	
	var sellingPoints = document.getElementsByClassName('selling-points')[0];
	var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 100;
	
	window.addEventListener('scroll', function(event){
		if(document.body.scrollTop >= scrollDistance){
			animatePoints(pointArray);
		}
	});
}