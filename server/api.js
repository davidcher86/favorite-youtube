const fetch = require('node-fetch');

const API_KEY = 'AIzaSyD2iJ_B98554zuENxeTuHBOcExKhuVIRFQ';
const MAX_RESULTS = 10;
const YOUTUBE_URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&type=video&part=snippet&maxResults=${MAX_RESULTS}&q=`;
const YOUTUBE_URL_BY_VEIDEO_ID_P1 = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=`;
const YOUTUBE_URL_BY_VEIDEO_ID_P2 = `&key=${API_KEY}`;
const NEXT_PAGE = `&pageToken=`;

const fetchTrendVideosWithNextPage = (nextPageToken)  => {
    const properties = {
        method: 'GET'
    };

    const URL = `${YOUTUBE_URL}${(nextPageToken !== null ? `${NEXT_PAGE}${nextPageToken}` : '')}`;
    console.log(`Sending request to YouTube API - url: ${URL}`);
    return fetch(URL, properties)
        .then(response => response.json())
        .then(res => {
            return res;
        })
};

const fetchSearchVideosWithNextPage = (param, nextPageToken)  => {
    const properties = {
        method: 'GET'
    };

    const URL = `${YOUTUBE_URL}${param}${(nextPageToken !== null ? `${NEXT_PAGE}${nextPageToken}` : '')}`;
    console.log(`Sending request to YouTube API - url: ${URL}`);
    return fetch(URL, properties)
        .then(response => response.json())
        .then(res => {
            return res;
        })
};

const fetchVideoByVideoID = (videoId)  => {
    const properties = {
        method: 'GET'
    };

    const URL = `${YOUTUBE_URL_BY_VEIDEO_ID_P1}${videoId}${YOUTUBE_URL_BY_VEIDEO_ID_P2}`;
    console.log(`Sending request to YouTube API - url: ${URL}`);
    return fetch(URL, properties)
        .then(response => response.json())
        .then(res => {
            return res;
        })
};

module.exports.fetchTrendVideosWithNextPage = fetchTrendVideosWithNextPage;
module.exports.fetchSearchVideosWithNextPage = fetchSearchVideosWithNextPage;
module.exports.fetchVideoByVideoID = fetchVideoByVideoID;