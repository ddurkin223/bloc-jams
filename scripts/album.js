var albumPicasso = {
	name: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ name: 'Blue', length: '4:26' },
		{ name: 'Green', length: '3:14' },
		{ name: 'Red', length: '5:01' },
		{ name: 'Pink', length: '3:21'},
		{ name: 'Magenta', length: '2:15'}
	]
};

var albumMarconi = {
	name: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ name: 'Hello, Operator?', length: '1:01' },
		{ name: 'Ring, ring, ring', length: '5:01' },
		{ name: 'Fits in your pocket', length: '3:21'},
		{ name: 'Can you hear me now?', length: '3:14' },
		{ name: 'Wrong phone number', length: '2:15'}
	]
};

var albumDivers = {
	name: 'Divers',
	artist: 'Joanna Newsom',
	label: 'Drag City',
	year: '2015',
	albumArtUrl: 'assets/images/album_covers/divers.jpg',
	songs: [
		{ name: 'Anecdotes', length: '6:27' },
		{ name: 'Sapokanikan', length: '5:11' },
		{ name: 'Leaving the City', length: '3:48' },
		{ name: 'Goose Eggs', length: '5:01' },
		{ name: 'Waltz of the 101st Lightborne', length: '5:22' },
		{ name: 'The Things I Say', length: '2:25' },
		{ name: 'Divers', length: '7:07' },
		{ name: 'Same Old Man', length: '2:26' },
		{ name: 'You Will Not Take My Heart Alive', length: '4:01' },
		{ name: 'A Pin-Light Bent', length: '4:26' },
		{ name: 'Time, As a Symptom', length: '5:38' }
	]
};

var createSongRow = function (songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
		+		'<td class="song-item-number" data-song-number="' + songNumber +'">' + songNumber +  '</td>'
		+		'<td class="song-item-title">' + songName + '</td>'
		+		'<td class="song-item-duration">' + songLength + '</td>'
		+	'</tr>';

	return template;
};

var setCurrentAlbum = function (album) {
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
		albumArtist = document.getElementsByClassName('album-view-artist')[0];
		albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
		albumImage = document.getElementsByClassName('album-cover-art')[0];
		albumSongList = document.getElementsByClassName('album-view-song-list')[0];

	albumTitle.firstChild.nodeValue = album.name;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);

	albumSongList.innerHTML = '';

	for (var i = 0, len = album.songs.length; i < len; i++) {
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
	}
};

var findParentByClassName = function (currentElement, targetClass){
	var parent = currentElement.parentElement;
	
	while(parent.className !== targetClass){
		parent = parent.parentElement;
	}
	
	return parent;
};

var getSongItem = function (targetElement){

	switch(targetElement.className){
		case 'ion-play':
		case 'ion-pause':
		case 'album-song-button':
			return findParentByClassName(targetElement,'song-item-number');
			break;
		case 'album-view-song-item':
			return targetElement.querySelector('.song-item-number');
			break;
		case 'song-item-title':
		case 'song-item-duration':
			return findParentByClassName(targetElement,'album-view-song-item').querySelector('.song-item-number');
			break;
		case 'song-item-number':
			return targetElement;
		default:
			return;
	}
};

var clickHandler = function(targetElement){
	var songItem = getSongItem(targetElement);
	
	if(currentlyPlayingSong === null){
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	}
	else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')){
		songItem.innerHTML = playButtonTemplate;
		currentlyPlayingSong = null;
	}
	else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')){
		var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
		currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	}
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener('mouseover', function(event) {
        if (event.target.parentElement.className === 'album-view-song-item') {
            var songItem = getSongItem(event.target);
            
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });
    
    for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }     
        });
        songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
        });
    }
};
