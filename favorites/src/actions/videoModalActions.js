import {getSingleVideosData} from '../api';
import {toggleLoading, selectVideoId} from './favoritesActions';

export const setSelectedVideoId = (val) => dispatch => {
    dispatch({
        type: 'UPDATE_VIDEO_MODAL_FIELD',
        field: 'selectedVideoId',
        payload: val
    })
}

export const recievedData = (item) => dispatch => {
    dispatch({
        type: 'RECIEVED_MODAL_DATA',
        payload: item
    })
}

export const resetModal = () => dispatch => {
    dispatch({
        type: 'RESET_MODAL'
    })
}

export const toggleModal = (val) => dispatch => {
    dispatch({
        type: 'UPDATE_VIDEO_MODAL_FIELD',
        field: 'modalIsOpen',
        payload: val
    })
}

export const getVideoData = (index) => dispatch => {
    dispatch(toggleLoading(true));
    getSingleVideosData(index)
        .then(response => {
            dispatch(selectVideoId(index));
            dispatch(recievedData(response));
            dispatch(toggleLoading(false));
        })
        .catch(err => {
            console.log(`Error: ${err}`);

            // Reverse action. closing back modal, if action failed
            dispatch(selectVideoId(null));
            dispatch(toggleLoading(false));
        });
}