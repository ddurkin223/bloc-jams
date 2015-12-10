var createSongRow = function (songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
		+		'<td class="song-item-number" data-song-number="' + songNumber +'">' + songNumber +  '</td>'
		+		'<td class="song-item-title">' + songName + '</td>'
		+		'<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
		+	'</tr>';

	var $row = $(template);

	var clickHandler = function () {
		var songNum = parseInt($(this).find('.song-item-number').attr('data-song-number'));

		//Check to see if anything is playing
		if(currentlyPlayingSongNumber !== null){
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}

		//The currently playing song is different than the one that was clicked
		if(currentlyPlayingSongNumber !== songNum){
			setSong(songNum);
			currentSoundFile.play();

			var $volFill = $('.volume .seek-bar .fill');
			var $volThumb = $('.volume .seek-bar .thumb');
			currentVolPercent = currentVolume + '%';
			$volFill.css({width: currentVolPercent});
			$volThumb.css({left: currentVolPercent});

			getSongNumberCell(songNum).html(pauseButtonTemplate);
			updateSeekBarWhileSongPlays();
		}

		//The currently playing song is the the song that was clicked
		else if(currentlyPlayingSongNumber === songNum){
			if(currentSoundFile.isPaused()){
				getSongNumberCell(songNum).html(pauseButtonTemplate);
				$playPauseButton.html(playerBarPauseButton);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			}
			else{
				getSongNumberCell(songNum).html(playButtonTemplate);
				$playPauseButton.html(playerBarPlayButton);
				currentSoundFile.pause();
			}
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

var setSong = function (songNumber) {
	if(currentSoundFile){
		currentSoundFile.stop();
	}

	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];

	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
		formats: ['mp3'],
		preload: true
	});

	setVolume(currentVolume);
	updatePlayerBarSong();
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
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

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
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

	var lastSongNum = getLastSongNum(currentSongIndex);
	var $lastSongCell = getSongNumberCell(lastSongNum);
	var $prevSongCell = getSongNumberCell(currentlyPlayingSongNumber);

	$lastSongCell.html(lastSongNum);
	$prevSongCell.html(pauseButtonTemplate);
};

var updatePlayerBarSong = function () {
	$('.currently-playing .song-name').text(currentSongFromAlbum.name);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
	$playPauseButton.html(playerBarPauseButton);
	setCurrentTimeInPlayerBar(0);
	setTotalTimeInPlayerBar(currentSongFromAlbum.length);
};

var setCurrentTimeInPlayerBar = function (currentTime){
		$('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime){
		$('.total-time').text(filterTimeCode(totalTime));
};

var updateSeekBarWhileSongPlays = function (){
	if(currentSoundFile){
		currentSoundFile.bind('timeupdate', function(event){
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');

			updateSeekPercentage($seekBar,seekBarFillRatio);
			setCurrentTimeInPlayerBar(this.getTime());
		});
	}
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
	var offsetXPercent = seekBarFillRatio * 100;

	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100,offsetXPercent);

	var percentString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentString);
	$seekBar.find('.thumb').css({left: percentString});
};

var setUpSeekBars = function(){
	var $seekBars = $('.player-bar .seek-bar');

	$seekBars.click(function(event){
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		var seekBarFillRatio = offsetX / barWidth;

		if($(this).parent().attr('class') === "seek-control" && currentSongFromAlbum){
			seek(seekBarFillRatio * currentSongFromAlbum.length)
		}
		else if (currentSongFromAlbum){
			setVolume(seekBarFillRatio * 100);
		}

		updateSeekPercentage($(this), seekBarFillRatio);
	});

	$seekBars.find('.thumb').mousedown(function(event){
		var $seekBar = $(this).parent();

		$(document).bind('mousemove.thumb', function(event){
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;

			if($(this).parent().attr('class') === "seek-control" && currentSongFromAlbum){
				seek(seekBarFillRatio * currentSongFromAlbum.length)
			}
			else if (currentSongFromAlbum){
				setVolume(seekBarFillRatio * 100);
			}

			updateSeekPercentage($seekBar, seekBarFillRatio);
		});

		$(document).bind('mouseup.thumb', function(){
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var filterTimeCode = function (timeInSeconds){
	var time = parseInt(timeInSeconds);
	var mins = Math.floor(time / 60);
	var secs = Math.floor(time % 60);

	var timeStr = mins + ":";
	if(secs < 10){
		timeStr+= "0";
	}
	timeStr += secs;

	return timeStr;
};

var togglePlayFromPlayerBar = function () {
	if(currentSoundFile && currentSoundFile.isPaused()){
		getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
	}
	else if (currentSoundFile) {
		getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.pause();
	}
};

var seek = function (time){
	if(currentSoundFile){
		currentSoundFile.setTime(time);
	}
}

var setVolume = function (volume){
	if(currentSoundFile){
		currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number){
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var trackIndex = function (album,song){
	return album.songs.indexOf(song);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>'
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')
var $playPauseButton = $('.main-controls .play-pause');

$(window).load(function(){
	setCurrentAlbum(albumPicasso);
	setUpSeekBars();
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPauseButton.click(togglePlayFromPlayerBar);
});
