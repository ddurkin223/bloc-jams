var navLinks = 
	[
		{name: 'collection', url: 'collection.html'},
		{name: 'albums', url: 'albums.html'}
	];

var createNavLink = function (navLink){
	var link = document.createElement("a");
	link.setAttribute("href", navLink.url);
	link.className = "navbar-link";
	link.textContent = navLink.name;
	return link;
	//return "<a href=" + navLink.url + " class=\"navbar-link\">" + navLink.name + "</a>";
}

var nav = document.createElement("nav");
nav.className = "navbar";
var brand = document.createElement("a");
brand.setAttribute("href", "index.html");
brand.className = "logo";
var brandImage = document.createElement("img");
brandImage.setAttribute("src", "assets/images/bloc_jams_logo.png");
brandImage.setAttribute("alt", "bloc jams logo");
brand.appendChild(brandImage);
nav.appendChild(brand);
var linksContainer = document.createElement("div");
linksContainer.className = "links-container";
// var nav = document.getElementByClassName('links-container')[0];

//nav.innerHTML = '';

for(var i= 0, navLen = navLinks.length; i<navLen; i++){
	linksContainer.appendChild(createNavLink(navLinks[i]));
}

nav.appendChild(linksContainer);

document.body.insertBefore(nav, document.querySelector(".album-view.container.narrow"));