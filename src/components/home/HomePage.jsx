import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToStocksFromFirestore } from "../../App/firestore/firestoreService";
import { listenToStocks } from "../../redux/actions/stocksActions";
import AppLoader from "../common/uiElements/AppLoader";
import GlobalLineChart from "../common/charts/GlobalLineChart";
import useFirestoreCollection from "../common/hooks/useFirestoreCollection";

export default function HomePage() {
  /*var upClicked = false;
  var downClicked = false;
  var maximum = 0;
  var minimum = 0;
  var currentValue = 0;
  var trend = 0;
  var maximumTrend = 0;
  var minimumTrend = 0;
  var stockId = 1;
  var remTime = 30; */



  const dispatch = useDispatch();
  const { stocks } = useSelector((state) => state.stocks);


  useFirestoreCollection({
    query: () => listenToStocksFromFirestore(),
    data: (stocks) => dispatch(listenToStocks(stocks)),
    deps: [dispatch],
  });

  

  function getMinData() {
    return Math.min.apply(
      Math,
      stocks.map(function (o) {
        return o.value;
      })
    );
  }



  function getMaxData() {
    return Math.max.apply(
      Math,
      stocks.map(function (o) {
        return o.value;
      })
    );
    


    
  }

  

  if (stocks && stocks.length < 1) return <AppLoader />;

  return (
    <div>
      <Typography component="h4" variant="h6">
        Home
      </Typography>

      <Typography component="h7" variant="h7">
        To the right you will be presented stock data. 	&rarr;
      </Typography>

      {stocks && stocks.length > 0 ? (
        <Grid
          container
          spacing={3}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}>
            <GlobalLineChart
              data={stocks}
              xAxis="date" 
              dataValue="value"
              color="#8884d8"
              tooltip={true}
              legend={false}
              graphFit={[getMinData(), getMaxData()]
              }
            />
          </Grid>
        </Grid>
      ) : (
        <AppLoader />
      )}
    </div>
  );
}
