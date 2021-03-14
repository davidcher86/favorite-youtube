import {getVideosTrend, saveVideo, getFavoritesVideos, deleteVideo, getSearchVideosTrend} from './../api';

export const toggleLoading = (val) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'isLoading',
        payload: val
    })
}

export const resetForm = () => dispatch => {
    dispatch({
        type: 'RESET_MAIN'
    })
}

export const selectVideoId = (val) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'selectedVideoId',
        payload: val
    })
}

export const searchVideosByParam = (param) => dispatch => {
    dispatch(toggleLoading(true));
    getSearchVideosTrend(param)
        .then(response => {
            var mapLoadedObj = new Map(Object.entries(response.loadedVideos.items));
            var mapFavoritesObj = new Map(response.filteredFavoriteList);

            dispatch(updateFavoritesList(mapFavoritesObj));
            dispatch(updateNextPageToken(response.nextPageToken));
            dispatch(loadAdditionalYoutubeData(mapLoadedObj));
            dispatch(setActiveSearchFilter(param));
            dispatch(toggleLoading(false));
        })
        .catch(err => {
            console.error(`error: ${err}`);
            dispatch(toggleLoading(false));
        });
}

export const setActiveSearchFilter = (param) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'activeSearchFilter',
        payload: param
    })
}

export const fetchFavoritesVideos = () => dispatch => {
    dispatch(toggleLoading(true));
    getFavoritesVideos()
        .then(response => {
            var parseDat = new Map(response);
            dispatch(updateFavoritesList(parseDat));
            dispatch(toggleLoading(false));
        })
        .catch(err => {
            console.error(`error: ${err}`);
            dispatch(toggleLoading(false));
        });
}

export const updateFavoritesList = (items) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'favoritesList',
        payload: items
    })
}

export const deleteFromFavoritesList = (index) => dispatch => {
    dispatch(toggleLoading(true));
    dispatch(removeItemFromFav(index));
    deleteVideo(index)
        .then(response => {
            var parsedDat = new Map(response);
            dispatch(toggleLoading(false));
        })
        .catch(err => {
            console.log(`Error: ${err}`);

            // Reverse action. add item back to favorites list, if action failed
            dispatch(addItemToFav(index));
            dispatch(toggleLoading(false));
        });
}

export const removeItemFromFav = (index) => dispatch => {
    dispatch({
        type: 'REMOVE_VIDEO_FROM_FAV',
        field: 'loadedTrendList',
        index
    })
}

export const saveToFavorites = (vid) => dispatch => {
    dispatch(addItemToFav(vid.videoId));
    dispatch(toggleLoading(true));
    saveVideo(vid)
        .then(response => {
            var parsedDat = new Map(response);
            dispatch(toggleLoading(false));
        })
        .catch(err => {
            console.log(`Error: ${err}`);

            // Reverse action. remove new item from favorites list, if action failed
            dispatch(removeItemFromFav(vid.videoId));
            dispatch(toggleLoading(false));
        });
}

export const addItemToFav = (index) => dispatch => {
    dispatch({
        type: 'ADD_VIDEO_TO_FAV',
        field: 'loadedTrendList',
        index
    })
}

export const fetchTrends = () => dispatch => {
    dispatch(toggleLoading(true));
    getVideosTrend()
        .then(response => {
            var mapObj = new Map(Object.entries(response.items));

            dispatch(updateNextPageToken(response.nextPageToken));
            dispatch(loadAdditionalYoutubeData(mapObj));
            dispatch(toggleLoading(false));
            // dispatch(loadYoutubeData(mapObj));
        })
        .catch(err => {
            console.log(`Error: ${err}`);
            dispatch(toggleLoading(false));
        });
}

export const loadAdditionalYoutubeData = (items) => dispatch => {
    dispatch({
        type: 'FETCH_NEW_TREND_VIDEOS',
        payload: items
    })
}

export const loadYoutubeData = (items) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'loadedTrendList',
        payload: items
    })
}

export const updateNextPageToken = (token) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'nextPageToken',
        payload: token
    })
}

export const changeActiveTab = (tab) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'activeTab',
        payload: tab
    })
}

export const updateSearchFilter = (value) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_FIELD',
        field: 'searchField',
        payload: value
    })
}
