const api = require('./api.js');
var express = require('express');
const bodyParser = require('body-parser')
var app = express();
var fs = require("fs");

var FAVORITES_DB_DATA;
var NEXT_PAGE_TOKEN = null; // Containing nextPageToken for YouTube API to fetch next results.

var SEARCH_FILTER = ''; 	// Containng last searched parameter for managing the nextPageToken (reset the parameter in case of search action,
							// because requesy to API starts from the start)

app.use(
	bodyParser.urlencoded({
	  extended: true,
	})
);

app.use(bodyParser.json());

app.get('/videos', function (req, res) {
	try {
		res.send(FAVORITES_DB_DATA);
	} catch (err) {
		console.log(`Error on GET "/videos/" API, error: ${err}`);
		res.statusCode(500);
	}
})

app.get('/videos/trend', function (req, res) {
	try {
		// Fetch trend list from YouTube API
		api.fetchTrendVideosWithNextPage(NEXT_PAGE_TOKEN)
		    .then(response => {
			var parsedDat = new Map(FAVORITES_DB_DATA);

			// Parsing youtube's raw data of video list to slim data, relevant for client
			const result = Object.assign({}, ...response.items.map(obj => ({[obj.id.videoId]: Object.assign({
										videoId: obj.id.videoId,
										publishedAt: obj.snippet.publishedAt,
										title: obj.snippet.title,
										description: obj.snippet.description,
										thumbnailUrl: obj.snippet.thumbnails.medium.url,
										thumbnailsWidth: obj.snippet.thumbnails.medium.width,
										thumbnailsHeight: obj.snippet.thumbnails.medium.height,
										existInList: parsedDat.has(obj.id.videoId)})})));

			// Generate response to client
			const fixedData = Object.assign({}, {
				nextPageToken: response.nextPageToken,
				regionCode: response.regionCode,
				pageInfo: response.pageInfo,
				items: result
			});

			NEXT_PAGE_TOKEN = response.nextPageToken; // Updating new nextPageToken for next request
			res.send(fixedData);
		});
	} catch (err) {
		console.log(`Error on GET "/videos/trend" API, error: ${err}`);
		res.statusCode(500);
	}
})

app.get('/videos/search', function (req, res) {
	try {
		// Load favorites list from DB  first for sync data between already loaded data to existing in Server
		fs.readFile( __dirname + "/data/favorites.json", 'utf8', function (err, data) {
			var parsedDat = new Map(JSON.parse(data));

			if (SEARCH_FILTER === '' || SEARCH_FILTER !== req.query.name) {
				NEXT_PAGE_TOKEN = null;
			}
			SEARCH_FILTER = req.query.name;

			// Fetching data from YouTube
			api.fetchSearchVideosWithNextPage(req.query.name, NEXT_PAGE_TOKEN)
				.then(response => {
					// Filtering existing favorites list data by search param
					var filteredFavoriteList = new Map();
					if (req.query.name.trim() !== '') {
						for (let [key, item] of parsedDat) {
							if (item.title.includes(req.query.name)) {
								filteredFavoriteList.set(key, JSON.parse(JSON.stringify(item)))
							}
						}
					} else {
						filteredFavoriteList = parsedDat;
					}

					FAVORITES_DB_DATA = Array.from(filteredFavoriteList.entries());  // Updating existing favorites list with filtered results
					NEXT_PAGE_TOKEN = response.nextPageToken;  						 // Updating new nextPageToken for next request

					 // Parsing youtube's raw data of video list to slim data, relevant for client
					const result = Object.assign({}, ...response.items.map(obj => ({[obj.id.videoId]: Object.assign({
						videoId: obj.id.videoId,
						publishedAt: obj.snippet.publishedAt,
						title: obj.snippet.title,
						description: obj.snippet.description,
						thumbnailUrl: obj.snippet.thumbnails.medium.url,
						thumbnailsWidth: obj.snippet.thumbnails.medium.width,
						thumbnailsHeight: obj.snippet.thumbnails.medium.height,
						existInList: parsedDat.has(obj.id.videoId)})})));

					// Parsing data for end response
					const fixedData = Object.assign({}, {
						nextPageToken: response.nextPageToken,
						regionCode: response.regionCode,
						pageInfo: response.pageInfo,
						items: result
					});

					// Generate response to client, containing both youtube filtered data and existing favorites filtered list
					const resp = {
						loadedVideos: fixedData,
						filteredFavoriteList: Array.from(filteredFavoriteList.entries())
					};

					res.setHeader('Content-Type', 'text/plain');
					res.send(resp);
				});
		});
	} catch (err) {
		callback(err);
		console.log(`Error on GET "/videos/search" API, error: ${err}`);
		res.statusCode(500);
	}
})

app.get('/videos/:id', function (req, res) { // Fetching video data by video ID API
	try {
		var parsedCurrentDat = new Map(FAVORITES_DB_DATA);
		// fs.readFile(`${__dirname}/data/example-single.json`, 'utf8', function (err, data) {
		// 	var response = JSON.parse(data);
		console.log(`Sending request to YouTube API for vide id:[${req.params.id}]`);
		api.fetchVideoByVideoID(req.params.id)
			.then (response => {
				const parsedResult = Object.assign({}, { // Parsing raw data to slim data, relevant for client
					videoId: response.items[0].id,
					publishedAt: response.items[0].snippet.publishedAt,
					title: response.items[0].snippet.title,
					description: response.items[0].snippet.description,
					duration: response.items[0].contentDetails.duration,
					viewCount: response.items[0].statistics.viewCount,
					likeCount: response.items[0].statistics.likeCount,
					dislikeCount: response.items[0].statistics.dislikeCount,
					thumbnailUrl: response.items[0].snippet.thumbnails.high.url,
					thumbnailsWidth: response.items[0].snippet.thumbnails.high.width,
					thumbnailsHeight: response.items[0].snippet.thumbnails.high.height,
					existInList: parsedCurrentDat.has(response.items[0].id)});

				res.setHeader('Content-Type', 'application/json');
				res.send(parsedResult);
			});
	} catch (err) {
		console.log(`Error on GET "/videos/:id" API, error: ${err}`);
		res.statusCode(500);
	}
})

app.put('/videos/:id', function (req, res) { // Adding new video to favorite list API
	try {
		// Load favorites list from DB  first for sync data between already loaded data to existing in Server
		fs.readFile(`${__dirname}/data/favorites.json`, 'utf8', function (err, data) {
			var parsedOriginalDat = new Map(JSON.parse(data));
			var parsedCurrentDat = new Map(FAVORITES_DB_DATA);

			const newVid = req.body;

			parsedOriginalDat.set(newVid.videoId, newVid);
			parsedCurrentDat.set(newVid.videoId, newVid);

			// Saving updated favorites list to DB
			fs.writeFile(`${__dirname}/data/favorites.json`, JSON.stringify(Array.from(parsedOriginalDat.entries())), function (err) {
				if (err) return console.log(err);
				FAVORITES_DB_DATA = Array.from(parsedCurrentDat.entries());

				res.send(Array.from(parsedCurrentDat.entries()));
			});
		});
	} catch (err) {
		callback(err);
		console.error(`Error on PUT "/videos/:id" API, error: ${err}`);
		res.statusCode(500);
	}
})

app.delete('/videos/:id', function (req, res) { // Removing video from favorite list API
	try {
		// Load favorites list from DB  first for sync data between already loaded data to existing in Server
		fs.readFile( __dirname + "/data/favorites.json", 'utf8', function (err, data) {
			var parsedOriginalDat = new Map(JSON.parse(data));
			var parsedCurrentDat = new Map(FAVORITES_DB_DATA);

			parsedOriginalDat.delete(req.params.id);
			parsedCurrentDat.delete(req.params.id);

			// Saving updated favorites list to DB
			fs.writeFile(`${__dirname}/data/favorites.json`, JSON.stringify(Array.from(parsedOriginalDat.entries())), function (err) {
				if (err) return console.log(err);

				FAVORITES_DB_DATA = Array.from(parsedCurrentDat.entries());
				res.setHeader('Content-Type', 'text/plain');

				res.send(Array.from(parsedCurrentDat.entries()));
			});
		});
	} catch (err) {
		console.error(`Error on DELETE "/videos/:id" API, error: ${err}`);
		res.statusCode(500);
	}
})

var server = app.listen(3001, function () {
   	var host = server.address().address
   	var port = server.address().port

	// Load saved favorites from DB (text file [data/favorites.json], instead of DB), for persistant data
  	fs.readFile( __dirname + "/data/favorites.json", 'utf8', function (err, data) {
		FAVORITES_DB_DATA = JSON.parse(data);
	});

    console.log("Server listening at http://%s:%s", host, port)
})