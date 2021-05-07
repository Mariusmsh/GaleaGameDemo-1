import {
    CREATE_SCORE_DATA,
    DELETE_SCORE_DATA,
    FETCH_SCORE_DATA,
    UPDATE_SCORE_DATA,
  } from "../constants/scoreConstants";
  import moment from "moment";
  
  export function listenToScores(scores) {
    let data = [];
    scores.forEach((e) => {
      data.push({
        ...e,
        date: moment(e.date).format("HH:mm:ss"),
        //time: moment(e.date).format("HH:mm"),
      });
    });
    return {
      type: FETCH_SCORE_DATA,
      payload: data,
    };
  }
  
  export function createScoreData(score) {
    return {
      type: CREATE_SCORE_DATA,
      payload: score,
    };
  }
  
  export function updateScoreData(score) {
    return {
      type: UPDATE_SCORE_DATA,
      payload: score,
    };
  }
  
  export function deleteScoreData(scoreId) {
    return {
      type: DELETE_SCORE_DATA,
      payload: scoreId,
    };
  }
  