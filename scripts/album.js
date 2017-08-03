var setSong = function(songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]')
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '  <tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

    var $row = $(template);

    var count = 0;

    var clickHandler = function() {        
        songNumber = parseInt($(this).attr('data-song-number'));
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            }        
        if (count >= 2 && currentlyPlayingSongNumber === songNumber) {
            if (count % 2 === 0) {
                count++;
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                count++;
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }            
        } else if (currentlyPlayingSongNumber !== songNumber) {
            count = 1;
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();  
        } else if (currentlyPlayingSongNumber === songNumber) {
            count++;
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }
    };
     
    var onHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));         
         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(playButtonTemplate);
         }
    };
     
    var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));         
         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(songNumber);
         }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var setCurrentAlbum = function(album) { 
    currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtURL);

    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
}

var changeSong = function() {

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var lastSongNumber = currentlyPlayingSongNumber;

    if (button === $nextButton) {
        currentSongIndex++;
        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }
        
    } else if (button === $previousButton) {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = currentAlbum.songs.length - 1;
        }
    }

    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
}

// var nextSong = function () {

//     var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//     // Note that we're _incrementing_ the song here
//     currentSongIndex++;

//     if (currentSongIndex >= currentAlbum.songs.length) {
//         currentSongIndex = 0;
//     }

//     // Save the last song number before changing it
//     var lastSongNumber = currentlyPlayingSongNumber;

//     // Set a new current song
//     currentlyPlayingSongNumber = currentSongIndex + 1;
//     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

//     updatePlayerBarSong();

//     var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
//     var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

//     $nextSongNumberCell.html(pauseButtonTemplate);
//     $lastSongNumberCell.html(lastSongNumber);
    
// }

// var previousSong = function () {

//     var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//     // Note that we're _decrementing_ the index here
//     currentSongIndex--;

//     if (currentSongIndex < 0) {
//         currentSongIndex = currentAlbum.songs.length - 1;
//     }

//     // Save the last song number before changing it
//     var lastSongNumber = currentlyPlayingSongNumber;

//     // Set a new current song
//     currentlyPlayingSongNumber = currentSongIndex + 1;
//     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

//     // Update the Player Bar information
//     updatePlayerBarSong();

//     var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
//     var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

//     $previousSongNumberCell.html(pauseButtonTemplate);
//     $lastSongNumberCell.html(lastSongNumber);
// }

var updatePlayerBarSong = function () {
    $('.song-name').text(currentSongFromAlbum.title);
    $('.artist-name').text(currentAlbum.artist);
    $('.artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"><span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
 
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function() {
        button = $previousButton;
        changeSong();
    });
    $nextButton.click( function() {
        button = $nextButton;
        changeSong();
    });
    //$previousButton.click(nextSong);
    //$nextButton.click(previousSong);
});
