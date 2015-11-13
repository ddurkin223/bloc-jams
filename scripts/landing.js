var pointsArray = document.getElementsByClassName('point');

var revealPoint = function (point) {
	point.style.animation = "all 4s ease-in-out 0s 1";
	point.style.opacity = 1;
};

var animatePoints = function (points) {
	forEach(points, revealPoint);
};

window.onload = function () {
	if(window.innerHeight > 950){
		animatePoints(pointsArray);
	}
	
	var sellingPoints = document.getElementsByClassName('selling-points')[0];
	var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 100;
	
	window.addEventListener('scroll', function(event){
		if(document.body.scrollTop >= scrollDistance){
			animatePoints(pointsArray);
		}
	});
}