var navLinks = 
	[
		{name: 'collection', url: 'collection.html'},
		{name: 'albums', url: 'albums.html'}
	];

var createNavLink = function (navLink){
	return "<a href=" + navLink.url + " class=\"navbar-link\">" + navLink.name + "</a>";
}

window.onload = function () {
	var nav = document.getElementByClassName('links-container')[0];
	
	nav.innerHTML = '';
	
	for(var i= 0, navLen = navLinks.length; i<len; i++){
		nav.innerHTML += createNavLink(navLinks[i]);
	}
}