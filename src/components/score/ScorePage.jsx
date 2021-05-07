import { Grid, Typography } from "@material-ui/core";
import React from "react";
import AppLoader from "../common/uiElements/AppLoader";
import ScoreTable from "../score/ScoreTable.js";
import useFirestoreCollection from "../common/hooks/useFirestoreCollection";
import { listenToScoresFromFirestore } from "../../App/firestore/firestoreService";
import { listenToScores } from "../../redux/actions/scoreActions";
import { useDispatch, useSelector } from "react-redux";


export default function ScorePage() {

    const dispatch = useDispatch();
    const scores  = useSelector((state) => state.scores);


    
//listens to scores from firestore and its changes
  useFirestoreCollection({
    query: () => listenToScoresFromFirestore(),
    data: (scores) => dispatch(listenToScores(scores)),
    deps: [dispatch],
  });


  

 



  if (scores && scores.length < 1) return <AppLoader /> ,
<div>
    <h1>No available data for scorepage</h1>
</div>

return (
    <div>
      <Typography component="h4" variant="h6">
        <center><h2>Leaderboard</h2></center>
      </Typography>
        <ScoreTable/>
    </div>
  );
  
}