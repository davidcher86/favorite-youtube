import React, { Component } from 'react';
import { connect } from 'react-redux';
import {addItemToFav, updateSearchFilter, saveToFavorites, deleteFromFavoritesList, selectVideoId} from './../actions/favoritesActions';
import {toggleModal, setSelectedVideoId} from './../actions/videoModalActions';

import 'bootstrap/dist/css/bootstrap.css';
import './../styles/styles.scss';

class VideoCard extends Component {
    render() {
        const {activeSearchFilter, isLoading, video, listType, key, setSelectedVideoId, updateSearchFilter, saveToFavorites, deleteFromFavoritesList} = this.props;

            const getActionButton = () => {
            return (video.existInList || listType === 'favoritesList')
                    ? <button
                            disabled={isLoading}
                            type="button"
                            onClick={() => {
                                deleteFromFavoritesList(video.videoId);
                                updateSearchFilter(activeSearchFilter);
                            }}
                            className="btn btn-dark btn-action">
                                Remove
                        </button>
                    : <button
                            disabled={isLoading}
                            type="button"
                            onClick={() => {
                                saveToFavorites(video);
                                updateSearchFilter(activeSearchFilter);
                            }}
                            className="btn btn-dark btn-action">
                                Save
                        </button>;
        };

        return (
            <div key={`vard-${key}`} id={`${listType}${video.videoId}`} className={`video-card-container`} >
                <a href={`https://www.youtube.com/watch?v=/${video.videoId}`} target="_blank">
                    <img
                        key={`img-${video.videoId}`}
                        alt={video.title}
                        src={video.thumbnailUrl}
                        className="img-thumbnail"
                        style={{height: video.thumbnailsHeight, width: video.thumbnailsWidth}} />
                </a>
                <div className="vid-title">{video.title}</div>
                <div className="btn-container">
                    {getActionButton()}
                    <button
                        disabled={isLoading}
                        onClick={() => {
                            setSelectedVideoId(video.videoId);
                            updateSearchFilter(activeSearchFilter);
                        }}
                        type="button" className="btn btn-dark btn-view">
                            View
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({favorites, singleVideoCard}) => ({
    favorites,
    singleVideoCard,
    activeSearchFilter: favorites.activeSearchFilter,
    selectedVideoId: singleVideoCard.selectedVideoId,
    favoritesList: favorites.favoritesList,
    loadedTrendList: favorites.loadedTrendList,
    isLoading: favorites.isLoading
 })

 const mapDispatchToProps = dispatch => ({
    toggleModal: (val) => dispatch(toggleModal(val)),
    setSelectedVideoId: (val) => dispatch(setSelectedVideoId(val)),
    selectVideoId: (val) => dispatch(selectVideoId(val)),
    addItemToFav: (index) => dispatch(addItemToFav(index)),
    updateSearchFilter: (value) => dispatch(updateSearchFilter(value)),
    saveToFavorites: (video) => dispatch(saveToFavorites(video)),
    deleteFromFavoritesList: (index) => dispatch(deleteFromFavoritesList(index))
 })

export default connect(mapStateToProps, mapDispatchToProps)(VideoCard);
