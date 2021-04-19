import { ThemeProvider, createMuiTheme, Grid, Button, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToStocksFromFirestore } from "../../App/firestore/firestoreService";
import { listenToStocks } from "../../redux/actions/stocksActions";
import AppLoader from "../common/uiElements/AppLoader";
import GlobalLineChart from "../common/charts/GlobalLineChart";
import useFirestoreCollection from "../common/hooks/useFirestoreCollection";
import { green, blue, red } from '@material-ui/core/colors'; 
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



//får ikke helt 100% til det med farger, burde egt ikke være så vanskelig


export default function ScorePage() {

  //const that defines the theme 
  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: green,
      tertiary: red
    }

  });

  

  //dispatches the stocks
  const dispatch = useDispatch();
  const { stocks } = useSelector((state) => state.stocks);
  //const orderData = await stocks.orderBy('date', 'asc').get();

  const {state} = useLocation();
  const { highscore, lowscore } = state; // Read values passed on state



//listens to stocks from firestore and its changes
  useFirestoreCollection({
    query: () => listenToStocksFromFirestore(),
    data: (stocks) => dispatch(listenToStocks(stocks)),
    deps: [dispatch],
  });



  //man kan plassere noe inne i [] som denne skal være dependent på, men hvis man prøver stocks,
  // så blir greia helt loka, kan ha tomt array enn så lenge






//get min data from the firestore document
  function getMinData() {
    return Math.min.apply(
      Math,
      stocks.map(function (o) {
        return o.value;

      })
    );
  }

//get max data from the firestore document as per now only for fitting in the graph
  function getMaxData() {
    return Math.max.apply(
      Math,
      stocks.map(function (o) {
        return o.value;
      })
    );

  }
  

 


//shuts down the python script
  function shutdownScript() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      // In local files, status is 0 upon success in Mozilla Firefox
      if(xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          console.log(xhr.responseText);
        } else {
          // Oh no! There has been an error with the request!
        }
      }
    };
    xhr.open('GET', 'http://127.0.0.1:5000/delete');
    xhr.send();
    
  }





function multipleRestartOnClick(){
    shutdownScript();
}



//new chart integration


  if (stocks && stocks.length < 1) return <AppLoader />, //UNEXPECTED??? KAN IKKE FJERNE
    <div>
      <center>
        <ThemeProvider theme={theme}>
        <Typography>Loading...</Typography>
        </ThemeProvider>
      </center>


    </div>


  return (
 
    <div>
      
      <div>
      <center>
        <ThemeProvider theme={theme}>
          <Typography><h1>Game over!</h1></Typography>

          <Button variant="contained" size="large" color="primary" onClick={multipleRestartOnClick}> 
            Restart Game
        </Button>
        </ThemeProvider>

        
      </center>
      {/*prøvde å flytte på denne, men da begynte programmet å loke og laste inn masse shit i grafen*/}

   
    </div>
    
    


      
      {stocks && stocks.length > 0 ? (
          

        <Grid
          container
          spacing={3}
          direction="column"
          justify="center"
          alignItems="center"
        >
           
          

            <Grid item xs={6}>

            <div><h3>Your HIGH: {highscore} </h3></div>
            <div><h3>Your LOW: {lowscore} </h3></div>
            </Grid>

           <Grid item xs={6}>

      
          
          </Grid>

          

          <Grid item xs={12}>
          
         
          <div style={{ position: 'center', width: '50%' }}>
          

          <GlobalLineChart
              data={stocks}
              xAxis="date" 
              dataValue="value"
              color="#8884d8"
              tooltip={true}
              legend={false}
              graphFit={getMinData(), getMaxData()}
              
            />
              </div>
            


          
          </Grid>
          
          <Grid item xs={6}>

          <ThemeProvider theme={theme}> 
          
           
           
           </ThemeProvider>
          
          </Grid>

        
        </Grid>
         
  
    
      ) : (
        <AppLoader />
      )}
    </div>


  
  );

}
