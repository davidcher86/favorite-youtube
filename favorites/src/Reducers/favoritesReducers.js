
const initialState = {
    isLoading: false,
    searchField: '',
    activeSearchFilter: '',
    activeTab: 'Trends',
    selectedVideoId: null,
    loadedTrendList: null,
    favoritesList: null,
    nextPageToken: null
};

export const favorites = (state = initialState, action) => {
    let updatedFavoriteList, loadedTrendList;

    switch (action.type) {
        case 'FETCH_NEW_TREND_VIDEOS':
            loadedTrendList = state.loadedTrendList;
            if (loadedTrendList === null) {
                loadedTrendList = action.payload;
            } else {
                loadedTrendList = [...loadedTrendList].concat([...action.payload]);
            }
            return Object.assign({}, state, {loadedTrendList: new Map(loadedTrendList)});
        case 'UPDATE_APP_FIELD':
            return Object.assign({}, state, {[action.field]: action.payload});
        case 'REMOVE_VIDEO_FROM_FAV':
            updatedFavoriteList = state.favoritesList;
            loadedTrendList = state.loadedTrendList;
            updatedFavoriteList.delete(action.index);

            loadedTrendList.set(action.index, Object.assign({}, loadedTrendList.get(action.index), {existInList: false}));

            return Object.assign({}, state, {favoritesList: updatedFavoriteList, loadedTrendList: loadedTrendList});
        case 'ADD_VIDEO_TO_FAV':
            updatedFavoriteList = state.favoritesList;
            loadedTrendList = state.loadedTrendList;
            const newItem = JSON.parse(JSON.stringify(state.loadedTrendList.get(action.index)));
            if (updatedFavoriteList === null) {
                updatedFavoriteList = new Map();
            }
            updatedFavoriteList.set(action.index, newItem);

            loadedTrendList.set(action.index, Object.assign({}, loadedTrendList.get(action.index), {existInList: true}));
            return Object.assign({}, state, {favoritesList: updatedFavoriteList, loadedTrendList: loadedTrendList});
        case 'RESET_MAIN':
            return initialState;
        default:
            return state
    }
}