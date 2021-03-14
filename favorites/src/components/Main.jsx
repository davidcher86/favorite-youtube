import React, { Component } from 'react';
import { connect } from 'react-redux';
import {fetchTrends, changeActiveTab, resetForm, loadYoutubeData, updateFavoritesList, updateSearchFilter, fetchFavoritesVideos, searchVideosByParam} from './../actions/favoritesActions';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';

import 'bootstrap/dist/css/bootstrap.css';
import './../styles/styles.scss';

import './../styles/App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        this.props.fetchFavoritesVideos();
        this.props.fetchTrends();
    }

    handleScroll(currentTarget) {
        const {isLoading, activeSearchFilter, loadYoutubeData, searchVideosByParam, fetchTrends} = this.props;

        const scrolledPercentage = 100 * currentTarget.scrollLeft / (currentTarget.scrollWidth - currentTarget.clientWidth);

        // Hhandle infinite scrolling to load data as soon as user reaches 95% of the scrollbar
        if (scrolledPercentage > 90 && !isLoading) {
            if (activeSearchFilter.trim() !== '') {
                searchVideosByParam(activeSearchFilter);
            } else {
                fetchTrends();
            }
        }
    }

    render() {
        const {selectedVideoId, resetForm, favorites, searchField, updateFavoritesList, activeSearchFilter, isLoading, changeActiveTab, updateSearchFilter, searchVideosByParam} = this.props;

        const handleCard = (listType) => {
            var vidStrip = [];
            if (favorites[listType] !== null) {
                favorites[listType].forEach(item => {
                    vidStrip.push(<VideoCard listType={listType} key={item.videoId} video={item} />);
                });
            }

            return vidStrip;
        };

        const videoStrip = listType => <div key={`strip-${listType}`} className="row video-strip-scroller">
                                            <div onScroll={e => this.handleScroll(e.currentTarget)} className="video-strip">
                                                {(favorites[listType] !== undefined && favorites[listType] !== null && favorites[listType].size > 0) && handleCard(listType)}
                                                {(favorites[listType] === undefined || favorites[listType] === null || favorites[listType].size === 0) && <div className="empty-list">No Items</div>}
                                            </div>
                                       </div>;

        const tabButton = type => <button
                                        className={`nav-link ${(favorites.activeTab === type ? 'active': '')}`}
                                        onClick={() => changeActiveTab(type)}
                                        id={`${type}-tab`}
                                        data-bs-toggle="tab"
                                        data-bs-target={`#${type}`}
                                        type="button"
                                        role="tab"
                                        aria-controls={type}
                                        aria-selected="false">
                                            {type}
                                  </button>;

        return (
            <div className="app-container">
                {selectedVideoId !== null && <VideoModal />}
                <div className="container">
                    <div className="row header">

                        <div className="col-md-2 col-sm-6 app-name">Favorites List</div>

                        <div className="col-md-1 col-sm-6 spinner-container">
                            {isLoading && <div className="spinner-border text-light" role="status"/>}
                        </div>

                        <div className="col-md-3 col-sm-12 offset-md-4">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    id="exampleDataList"
                                    defaultValue={searchField}
                                    onChange={e => updateSearchFilter(e.target.value)}
                                    placeholder="Type to search..." /><button
                                    className="btn search-btn"
                                    disabled={isLoading || (activeSearchFilter === searchField)} // Disabled, if search value hasn't change or if loading
                                    onClick={() => {
                                        // loadYoutubeData(new Map());
                                        // updateFavoritesList(new Map());
                                        resetForm();
                                        searchVideosByParam(searchField);
                                    }}
                                    type="button"/>
                            </div>
                        </div>

                        <div className="col-md-2 col-sm-12 no-padding">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className={`nav-item ${(favorites.activeTab === 'Trends' ? 'active': '')}`} role="presentation">{tabButton('Trends')}</li>
                                <li className={`nav-item ${(favorites.activeTab === 'MyLib' ? 'active': '')}`} role="presentation">{tabButton('MyLib')}</li>
                                <li className="presentation-slider" role="presentation"/>
                            </ul>
                        </div>

                    </div>

                <div className="row content">
                    <div className="tab-content" id="myTabContent">

                        <div className={`tab-pane fade ${(favorites.activeTab === 'Trends' ? 'show active': '')}`} id="Trends" role="tabpanel" aria-labelledby="Trends-tab">
                            {videoStrip('loadedTrendList')}
                        </div>

                        <div className={`tab-pane fade ${(favorites.activeTab === 'MyLib' ? 'show active': '')}`} id="MyLib" role="tabpanel" aria-labelledby="MyLib-tab">
                            {videoStrip('favoritesList')}
                        </div>

                    </div>
                </div>
            </div>
            </div>
        );
    }
}

const mapStateToProps = ({favorites, singleVideoCard}) => ({
    favorites,
    selectedVideoId: singleVideoCard.selectedVideoId,
    favoritesList: favorites.favoritesList,
    loadedTrendList: favorites.loadedTrendList,
    searchField: favorites.searchField,
    activeSearchFilter: favorites.activeSearchFilter,
    nextPageToken: favorites.nextPageToken,
    isLoading: favorites.isLoading
})

const mapDispatchToProps = dispatch => ({
    fetchTrends: () => dispatch(fetchTrends()),
    changeActiveTab: (tab) => dispatch(changeActiveTab(tab)),
    updateSearchFilter: (value) => dispatch(updateSearchFilter(value)),
    fetchFavoritesVideos: () => dispatch(fetchFavoritesVideos()),
    updateFavoritesList: () => dispatch(updateFavoritesList()),
    loadYoutubeData: () => dispatch(loadYoutubeData()),
    resetForm: () => dispatch(resetForm()),
    searchVideosByParam: (param) => dispatch(searchVideosByParam(param))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
