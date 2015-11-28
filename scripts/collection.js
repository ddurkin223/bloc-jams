var buildCollectionItemTemplate = function () {
	var template = 
	'<div class = "collection-album-container column fourth">'
+	'	<img src="assets/images/album_covers/01.png" alt="Album 1">'
+	'	<div class="collection-album-info caption">'
+	'		<p>'
+	'			<a class="album-name" href="album.html">The Colors</a>'
+	'			<br/>'
+	'			<a href="album.html">Pablo Picasso</a>'
+	'			<br/>'
+	'			X songs'
+	'		</p>'
+	'	</div>'
+	'</div>';

	return $(template);
};

$(window).load(function(){
	var numAlbums = 12;
	var $collectionContainer = $('.album-covers');
	$collectionContainer.empty();
	
	for (var i = 0; i< numAlbums; i++){
		var $newThumb = buildCollectionItemTemplate();
		$collectionContainer.append($newThumb);
	}
});