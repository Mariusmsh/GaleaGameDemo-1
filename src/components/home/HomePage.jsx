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
import {
  Link
} from "react-router-dom";

//import { CalmButton } from '/GaleaDemo/GaleaGameDemo/src/components/common/buttons/CalmButton.js';



//får ikke helt 100% til det med farger, burde egt ikke være så vanskelig


export default function HomePage() {

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


  //constants for the timer implementation
  const intervalRef = useRef(null);
  const [timer, setTimer] = useState('00:00:00');
  

  //const for HIGH and low
  const[HIGH, setHIGH] = useState('Not selected');
  const[LOW, setLOW] = useState('Not selected');


  //const for pressing button and not pressing button
  const [pressed, setPressed] = useState(true);
  const [pressedLow, setPressedLow] = useState (true);


  //const for data pushing
//const navigate = useNavigate();
//navigate('/scorepage', {state: {highscore: HIGH, lowscore: LOW}});
  



//listens to stocks from firestore and its changes
  useFirestoreCollection({
    query: () => listenToStocksFromFirestore(),
    data: (stocks) => dispatch(listenToStocks(stocks)),
    deps: [dispatch],
  });

  //starts when the graph starts
  useEffect(()=> {
      clearTimer(getDeadlineTime())
      //this will be run when the component will unmount.
      // we need to be sure that no memory leak or else our app will crash
      return () => {if(intervalRef.current) clearInterval(intervalRef.curent)}
  },[]); //NB OVERSE WARNING!!

  //man kan plassere noe inne i [] som denne skal være dependent på, men hvis man prøver stocks,
  // så blir greia helt loka, kan ha tomt array enn så lenge

  function onClickResetBtn(){
    {if(intervalRef.current) clearInterval(intervalRef.curent)}
    clearTimer(getDeadlineTime());
  }

//gets the input low of the user
function clickLow(){
  return Math.floor.apply(
    Math,
    stocks.map(function (o) {
      return setLOW(o.value);

    })
  );
  
}


function getCurrentValue(){
  return Math.floor.apply(
    Math,
    stocks.map(function (o) {
      return o.value;
      
    })
  );

}

//gets the input high of the user
function clickHigh(){
  
  return Math.floor.apply(
    Math,
    stocks.map(function (o) {
      return setHIGH(o.value);
      
    })
  );
}

//enables disabling button with multiple functions
function handleHighClick(){
  clickHigh();
  setPressed(true);
}

//enables disabling button with multiple functions
function handleLowClick(){
  clickLow();
  setPressedLow(true);
}

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

  /*
  export default function passHigh(){
      return null;
  }
  
  export default function passLow(){
      return null;
  }
  */
  

 

//runs the python script from the firestore (with button event)
  function runPyScript() {
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
    xhr.open('GET', 'http://127.0.0.1:5000/test');
    xhr.send();
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

//timer function

  function getTimeRemaining(endTime){
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor ( (total/1000) % 60);
    const minutes = Math.floor ( (total/1000/60) % 60);
    const hours = Math.floor ( (total/1000*60*60) % 24);
    return {
      total, hours, minutes, seconds
    };
  }

  //function for starting the timer
  function startTimer (deadline){
    let {total, hours, minutes, seconds} = getTimeRemaining(deadline);
    if (total>=0){
      setTimer(
        (hours > 9 ? hours : '0'+hours) + ':'+
        (minutes > 9 ? minutes : '0'+minutes) + ':'+
        (seconds > 9 ? seconds : '0'+seconds)
      )
    }
    else{
      clearInterval(intervalRef.current);
    }
  }


  //function for clearing the timer
  function clearTimer(endtime){
    setTimer('00:00:31');
    if(intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(()=>{
      startTimer(endtime);
    }, 1000)
    intervalRef.current = id;
  }

  //deadline of timer
  function getDeadlineTime(){
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds()+31);
    return deadline;
  }


//handles multiple events for 
function multipleOnClick(){
  /*renderTimer();*/
  runPyScript();
  onClickResetBtn();
  setPressed(false);
  setPressedLow(false);
}

function multipleRestartOnClick(){
    shutdownScript();
    setLOW('Not Selected');
    setHIGH('Not Selected');
}



//new chart integration


  if (stocks && stocks.length < 1) return <AppLoader />, //UNEXPECTED??? KAN IKKE FJERNE
    <div>
      <center>

        <h1>Welcome to Galea Games</h1>
        <Typography>Galea Games is all about guessing when a stock is potentially hitting its LOW and HIGH</Typography>
        <Typography>When you think the graph is hitting its LOW in a 30 second span you press the button LOW</Typography>
        <Typography>When you think the graph is hitting its HIGH in a 30 second span you press the button HIGH</Typography>
        <Typography>Further on you will be presented your accuracy in percent</Typography>
        <Typography>Watch out for the timer!</Typography>
        <Typography>Press start to continute with the gameplay.</Typography>
        <br></br>
        <ThemeProvider theme={theme}>
          <Button variant="contained" size="large" color="primary" onClick={multipleOnClick}>
            Start Game
        </Button>
        </ThemeProvider>
      </center>


    </div>


  return (
 
    <div>
      
      <div>
      <center>
        <ThemeProvider theme={theme}>
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

            <div><h1>Time left: {timer} </h1></div>
            <div><h3>Your HIGH: {HIGH} </h3></div>
            <div><h3>Your LOW: {LOW} </h3></div>
            </Grid>

           <Grid item xs={6}>

          <ThemeProvider theme={theme}> 
          
          <Button style={{maxWidth: '1000px', maxHeight: '50px', minWidth: '1000px', minHeight: '50px'}}
          variant="contained" size="large" color="secondary" onClick={handleHighClick} disabled={pressed}> HIGH </Button>
          
          
          </ThemeProvider>
          
          </Grid>

          

          <Grid item xs={12}>
          
         
          <div style={{ position: 'center', width: '50%' }}>
          

          <GlobalLineChart
              data={stocks}
              xAxis="date" 
              dataValue="value"
              color="#000000"
              tooltip={true}
              legend={false}
              graphFit={getMinData(), getMaxData()}
              graphHIGH={HIGH}
              graphLOW={LOW}
              
            />
              </div>
            


          
          </Grid>
          
          <Grid item xs={6}>

          <ThemeProvider theme={theme}> 
          
           <Button style={{maxWidth: '1000px', maxHeight: '50px', minWidth: '1000px', minHeight: '50px'}}
           variant="contained" size="large" color="tertiary" onClick={handleLowClick} disabled={pressedLow} > LOW</Button> 
           
           </ThemeProvider>
          
          </Grid>

          
          
          

          
      
        </Grid>
         
  
    
      ) : (
        <AppLoader />
      )}
    </div>


  
  );

}
