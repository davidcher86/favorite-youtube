
const initialState = {
    selectedVideoId: null,
    title: '',
    description: '',
    duration: '',
    modalIsOpen: false,
    imgUrl: '',
    imgWidth: 0,
    imgHeight: 0,
    viewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
    existInList: false,
    publishedAt: ''
};

export const singleVideoCard = (state = initialState, action) => {
    switch (action.type) {
        case 'RESET_MODAL':
            return initialState;
        case 'RECIEVED_MODAL_DATA':
            return Object.assign({}, state, {videoId: action.payload.videoId,
                                             selectedVideoId: action.payload.videoId,
                                             imgUrl: action.payload.thumbnailUrl,
                                             imgWidth: action.payload.thumbnailsWidth,
                                             imgHeight: action.payload.thumbnailsHeight,
                                             title: action.payload.title,
                                             duration: action.payload.duration,
                                             viewCount: action.payload.viewCount,
                                             likeCount: action.payload.likeCount,
                                             dislikeCount: action.payload.dislikeCount,
                                             description: action.payload.description,
                                             publishedAt: action.payload.publishedAt,
                                             existInList: action.payload.existInList,
             });
        case 'UPDATE_VIDEO_MODAL_FIELD':
            return Object.assign({}, state, {[action.field]: action.payload});
        default:
            return state
    }
}