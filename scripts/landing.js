(var revealPoints = function () {
	var points = document.getElementsByClassName('point');

	for(var i = 0, len = points.length; i < len; i++){
		point[i].style.opacity = 1;
		points[i].style.transform = "scaleX(1) translateY(0)";
		points[i].style.mstransform = "scaleX(1) translateY(0)";
		points[i].style.webkittransform = "scaleX(1) translateY(0)";
	}
}());