import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'
import {addItemToFav, removeItemFromFav, saveToFavorites, deleteFromFavoritesList} from './../actions/favoritesActions';
import {setSelectedVideoId, resetModal, getVideoData} from './../actions/videoModalActions';

import 'bootstrap/dist/css/bootstrap.css';
import './../styles/styles.scss';

class VideoModal extends Component {
    componentDidMount() {
        const {getVideoData, singleVideoCard} = this.props;
        getVideoData(singleVideoCard.selectedVideoId)
    }

    render() {
        const msToTime = (duration) => { // Convert miliseconds to duration time
            var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }

        const {singleVideoCard, isLoading, resetModal} = this.props;

        return (
            <div className="modal video-modal show fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{singleVideoCard.title}</h5>
                        </div>

                        <div className="modal-body">
                            {isLoading &&
                                <div className="spinner-container">
                                    <div className="spinner-border text-dark" role="status"/>
                                </div>}

                            {!isLoading &&
                                <a href={`https://www.youtube.com/watch?v=${singleVideoCard.videoId}`} rel="noreferrer" target="_blank">
                                    <img
                                        src={singleVideoCard.imgUrl}
                                        className="img-thumbnail"
                                        alt={singleVideoCard.title}
                                        style={{height: singleVideoCard.imgHeight}} />
                                </a>}

                            <div className="row vid-details">
                                <div className="col-md-2 label" style={{top: '4px', position: 'relative'}}>Published:</div>
                                <div className="col-md-5 value" style={{top: '4px', position: 'relative'}}>
                                    {moment(singleVideoCard.publishedAt, "HH:mm:ss").format("d/MM/YYYY")}
                                </div>
                                <div className="col-md-4 offset-md-1">
                                    <div>
                                        <span className="label" style={{marginLeft: '-10px'}}>Duration:</span>
                                        <span className="badge bg-secondary">{msToTime(moment.duration(singleVideoCard.duration).asMilliseconds())}</span>
                                    </div>
                                    <div>
                                        <span className="label" style={{marginLeft: '-10px'}}>Viewed:</span>
                                        <span className="badge bg-secondary">{singleVideoCard.viewCount}</span>
                                    </div>
                                    <div>
                                        <span className="label" style={{marginLeft: '-10px'}}>Liked:</span>
                                        <span className="badge bg-primary">{singleVideoCard.likeCount}</span>
                                    </div>
                                    <div>
                                        <span className="label" style={{marginLeft: '-10px'}}>Disliked:</span>
                                        <span className="badge bg-danger">{singleVideoCard.dislikeCount}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <span className="description">{singleVideoCard.description}</span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={() => resetModal()} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({favorites, singleVideoCard}) => ({
  favorites,
  singleVideoCard,
  selectedVideoId: singleVideoCard.selectedVideoId,
  favoritesList: favorites.favoritesList,
  loadedTrendList: favorites.loadedTrendList,
  isLoading: favorites.isLoading
 })

 const mapDispatchToProps = dispatch => ({
    setSelectedVideoId: (val) => dispatch(setSelectedVideoId(val)),
    resetModal: (val) => dispatch(resetModal(val)),
    getVideoData: (index) => dispatch(getVideoData(index)),
    addItemToFav: (index) => dispatch(addItemToFav(index)),
    removeItemFromFav: (index) => dispatch(removeItemFromFav(index)),
    saveToFavorites: (video) => dispatch(saveToFavorites(video)),
    deleteFromFavoritesList: (index) => dispatch(deleteFromFavoritesList(index))
 })

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);
