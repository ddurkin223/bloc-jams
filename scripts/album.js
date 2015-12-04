var createSongRow = function (songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
		+		'<td class="song-item-number" data-song-number="' + songNumber +'">' + songNumber +  '</td>'
		+		'<td class="song-item-title">' + songName + '</td>'
		+		'<td class="song-item-duration">' + songLength + '</td>'
		+	'</tr>';

	var $row = $(template);
	
	var clickHandler = function () {
		var songNum = parseInt($(this).find('.song-item-number').attr('data-song-number'));

		if(currentlyPlayingSongNumber !== null){
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
		if(currentlyPlayingSongNumber !== songNum){
			getSongNumberCell(songNum).html(pauseButtonTemplate);
			setSong(songNum);
		}
		else if(currentlyPlayingSongNumber === songNum){
			getSongNumberCell(songNum).html(playButtonTemplate);
			setSong(null);
			$('.main-controls .play-pause').html(playerBarPlayButton);
		}
	};
	
	var onHover = function(event){
		var songNumCell = $(this).find('.song-item-number');
		var songNum = parseInt($(songNumCell).attr('data-song-number'));
		
		if(songNum !== currentlyPlayingSongNumber){
			songNumCell.html(playButtonTemplate);
		}
	};
	
	var offHover = function(event){
		var songNumCell = $(this).find('.song-item-number');
		var songNum = parseInt($(songNumCell).attr('data-song-number'));
		
		if(songNum !== currentlyPlayingSongNumber){
			songNumCell.html(songNum);
		}
		
		console.log("songNumber type is " + typeof songNum + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
	};
	
	$row.click(clickHandler);
	$row.hover(onHover, offHover);
	
	return $row;
};

var setCurrentAlbum = function (album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');
	
	$albumTitle.text(album.name);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);

	$albumSongList.empty();

	for (var i = 0, len = album.songs.length; i < len; i++) {
		var $newRow = createSongRow(i+1, album.songs[i].name, album.songs[i].length);
		$albumSongList.append($newRow);
	}
};

var trackIndex = function (album,song){
	return album.songs.indexOf(song);
};

var nextSong = function () {
	var getLastSongNum = function(index){
		if(index === 0){
			return currentAlbum.songs.length;
		}
		else{
			return index--;
		}
	};
	
	var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
	currentSongIndex++;
	
	if(currentSongIndex >= currentAlbum.songs.length){
		currentSongIndex = 0;
	}
	
	setSong(currentSongIndex+1);
	
	var lastSongNum = getLastSongNum(currentSongIndex);
	var $prevSongCell = getSongNumberCell(lastSongNum);
	var $nextSongCell = getSongNumberCell(currentlyPlayingSongNumber);
	
	$prevSongCell.html(lastSongNum);
	$nextSongCell.html(pauseButtonTemplate);
};

var previousSong = function () {
	var getLastSongNum = function(index){
		if(index === currentAlbum.songs.length - 1){
			return 1;
		}
		else{
			return index+=2;
		}
	};
	
	var currentSongIndex = trackIndex(currentAlbum,currentSongFromAlbum);
	currentSongIndex--;
	
	if(currentSongIndex < 0){
		currentSongIndex = currentAlbum.songs.length - 1;
	}
	
	setSong(currentSongIndex + 1);
	
	var lastSongNum = getLastSongNum(currentSongIndex);
	var $lastSongCell = getSongNumberCell(lastSongNum);
	var $prevSongCell = getSongNumberCell(currentlyPlayingSongNumber);
		
	$lastSongCell.html(lastSongNum);
	$prevSongCell.html(pauseButtonTemplate);
};

var setSong = function (songNumber) {
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
	
	updatePlayerBarSong();
};

var getSongNumberCell = function(number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBarSong = function () {
	$('.currently-playing .song-name').text(currentSongFromAlbum.name);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>'
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')

$(window).load(function(){
	setCurrentAlbum(albumPicasso);
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
});