import { ADD_SONG, REMOVE_SONG, VOTE_SONG, UPDATE_QUEUE, RESET_QUEUE } from './Types';
import { emit } from '../utils/Socket';

export const addSong = (songTitle) => {
    return () => {
        emit(ADD_SONG, songTitle);
    }
}

export const removeSong = (songId) => {
    return () => {
        emit(REMOVE_SONG, songId);
    }
}

export const voteSong = (songId, vote) => {
    return (dispatch) => {
        emit(VOTE_SONG, {
            songId: songId,
            vote: vote
        });

        dispatch({
            type: VOTE_SONG,
            payload: {
                songId: songId,
                vote: vote
            }
        });
    }
}

export const updateQueue = (queue) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_QUEUE,
            payload: queue
        });
    }
}

export const resetQueue = () => {
    return (dispatch) => {
        emit(RESET_QUEUE);
         dispatch({
             type: RESET_QUEUE,
             //payload: queue
         })
    }
}