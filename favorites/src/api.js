const PREFIX_URL = `http://localhost:3001/videos/`;

var properties = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};

export function fetchAction(url, properties) {
    return fetch(url, properties)
        .then(response => response.json())
        .then(res => {
            return res;
        })
        .catch(err => {
            console.log(err);
            return err;
        })
};

// API - DELETE [localhost:3001/videos/] to server, delete unit from favorites list
export function deleteVideo(index) {
    properties.method = 'DELETE';
    return fetchAction(`${PREFIX_URL}${index}`, properties);
};

// API - PUT [localhost:3001/videos/:id] to server, save video to favorites list
export function saveVideo(vid) {
    properties.method = 'PUT';
    properties.body = JSON.stringify(vid);
    return fetchAction(`${PREFIX_URL}${vid.videoId}`, properties);
};

// API - GET [localhost:3001/videos/:id] to server, fetch data on particular video
export function getSingleVideosData(index) {
    properties.method = 'GET';
    return fetchAction(`${PREFIX_URL}${index}`, properties);
};

// API - GET [localhost:3001/videos/trend] to server, get YouTube trend list
export function getVideosTrend() {
    properties.method = 'GET';
    return fetchAction(`${PREFIX_URL}trend`, properties);
};

// API - GET [localhost:3001/videos/search?name=<param>] to server, search YouTube by particular parameter
export function getSearchVideosTrend(param) {
    properties.method = 'GET';
    return fetchAction(`${PREFIX_URL}search?name=${param}`, properties);
};

// API - GET [localhost:3001/videos/] to server, geto favorites list from DB
export function getFavoritesVideos() {
    properties.method = 'GET';
    return fetchAction(PREFIX_URL, properties);
};