var animatePoints = function () {
	var points = document.getElementsByClassName('point');
	
	for (var i = 0, len = points.length; i<len;i++) {
		points[i].style.animation = "all 7s ease-in-out 0s 1";
	}
}