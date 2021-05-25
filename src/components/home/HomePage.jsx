import { ThemeProvider, createMuiTheme, Grid, Button, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToStocksFromFirestore } from "../../App/firestore/firestoreService";
import { listenToStocks } from "../../redux/actions/stocksActions";
import { addMatchResultsToFirestore } from "../../App/firestore/firestoreService";
import AppLoader from "../common/uiElements/AppLoader";
import GlobalLineChart from "../common/charts/GlobalLineChart";
import useFirestoreCollection from "../common/hooks/useFirestoreCollection";
//import { green, blue, red } from '@material-ui/core/colors'; 
import { useState, useRef, useEffect } from 'react';



//import ScoreTable from "../score/ScoreTable.js";

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';


//popup for the game imported, css style "input button" not the same as regular button
import Modal from 'react-awesome-modal';
import '../common/buttons/buttoncss.css'

//konfetti effekt i applikasjon
import Confetti from 'react-dom-confetti';



//import { CalmButton } from '/GaleaDemo/GaleaGameDemo/src/components/common/buttons/CalmButton.js';

// import the progress bar
import StepProgressBar from 'react-step-progress';
// import the stylesheet
import 'react-step-progress/dist/index.css';

const step1Content = firstStep();
const step2Content = secondStep();
const step3Content = thirdStep();


 
function onFormSubmit() {
  
  // handle the submit logic here
  // This function will be executed at the last step
  // when the submit button (next button in the previous steps) is pressed
}

function firstStep() {
      return (
          <div>
              <h1>Step 1</h1>
              <h2>Follow the aggregated chart.</h2>
              <p>The chart will either go up or down.</p>
              <p>New content will be presented on the right side</p>
              <p>Example: </p>
              
              <a href="https://gyazo.com/98b1538770a4836db9fad1d1b4bb7a0d"><video autoplay="autoplay" loop muted alt="Video from Gyazo" width="966" ><source src="https://i.gyazo.com/98b1538770a4836db9fad1d1b4bb7a0d.mp4" type="video/mp4" /></video></a>
              
          </div>
      )
}

function secondStep(){
  
  function DisplayButton(props) {
    const useStyles = makeStyles({
      root: {
        background: (props) =>
          props.color === 'red'
            ? "linear-gradient(45deg, #178901 30%, #178901 90%)"
            : "linear-gradient(45deg, #e90101 90%, #e90101 90%)",
        border: 0,
        borderRadius: 3,
        boxShadow: (props) =>
          props.color === 'red'
            ? '0 3px 5px 2px rgba(23, 137, 1, .3)'
            : '0 3px 5px 2px rgba(233, 1, 1, .3)',
        color: 'white',
        height: 48,
        width: 1000,
        margin: 8,
      },
    });

    const { color, ...other } = props;
    const classes = useStyles(props);
    return <Button className={classes.root} {...other} />;
  }
  
  DisplayButton.propTypes = {
    color: PropTypes.oneOf(['blue', 'red']).isRequired,
  };


  return(
    
    <div>
    <h1>Step 2</h1>
    <h2>Predict the HIGH and LOW</h2>
    <h3>As you watch the progress of the graph, press HIGH when you predict its highest peak.</h3>
    <h3>Press LOW when you predict when it is at its lowest.</h3>
   
    
    <DisplayButton color="red"> HIGH</DisplayButton>
    <DisplayButton color="blue"> LOW</DisplayButton>

    
</div>


  )
}

function thirdStep() {


  return (
      <div>
          <h1>Step 3</h1>
          <h2>Watch out for the timer!</h2>
          <p>The timer presents how much time you have remaining.</p>
          <p>After the time runs out, you will be presentet your results.</p>

          <div><h1 >Time left: 00:30 </h1></div>
          
          
      </div>
  )
}




export default function HomePage() {

  //const that defines the theme 
  const theme = createMuiTheme({
    palette: {
      primary:  {
        main: '#3f51b5',
      },
    }

  });

  //config for confetti
  const config = {
    angle: "118",
    spread: "600",
    startVelocity: "78",
    elementCount: "113",
    dragFriction: "0.13",
    duration: "5000",
    stagger: "23",
    width: "14px",
    height: "15px",
    perspective: "1000px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
  };


  
  const useStyles = makeStyles({
    root: {
      background: (props) =>
        props.color === 'red'
          ? "linear-gradient(45deg, #178901 30%, #178901 90%)"
          : "linear-gradient(45deg, #e90101 90%, #e90101 90%)",
      border: 0,
      borderRadius: 3,
      boxShadow: (props) =>
        props.color === 'red'
          ? '0 3px 5px 2px rgba(23, 137, 1, .3)'
          : '0 3px 5px 2px rgba(233, 1, 1, .3)',
      color: 'white',
      height: 48,
      width: 1000,
      margin: 8,
    },
    
  });
  
  function MyButton(props) {
    const { color, ...other } = props;
    const classes = useStyles(props);
    return <Button className={classes.root} {...other} />;
  }
  
  MyButton.propTypes = {
    color: PropTypes.oneOf(['blue', 'red']).isRequired,
  };





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

//const for saving the score
  const[saveHIGH, setSaveHIGH] = useState(0);
  const [saveLOW, setSaveLow ] = useState(0);


  //const for pressing button and not pressing button
  const [pressed, setPressed] = useState(true);
  const [pressedLow, setPressedLow] = useState (true);

  //const for text color
  const hStyle = { color: 'red' };
  const hStyle1 = { color: 'green' };

  //const for calculating accuracy
  const [accuracy, setAccuracy] = useState('Not set');
  //const for calculating score
  const [score, setScore] = useState('Not set');

  const MAX = getMaxData();
  const MIN = getMinData();


//hide or show the view results button
  const [hidden, setHidden] = useState ('hidden');

  //const for visible score and accuracy
  const [show, setShow] = useState ('hidden');

  


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
      return () => {if(intervalRef.current) clearInterval(intervalRef.current) 
      }
  },[]); //NB OVERSE WARNING!!

  //man kan plassere noe inne i [] som denne skal være dependent på
  //i denne forstand, behold tomt array

  function onClickResetBtn(){
    {if(intervalRef.current) clearInterval(intervalRef.current)}
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

//regner ut accuracy for bruker
function calcAccuracy(HIGH, LOW, MAX, MIN){
  var forMax = Math.floor((HIGH*100)/MAX)
  var forMin;
  if (LOW<=MIN){
    return forMin = Math.floor((LOW*100)/MIN)
  }
  else if (LOW>MIN){
    var temp = ((LOW/MIN)-1)
    return forMin = ((1-temp)*100).toFixed(2);
  }
  const accuracy = (forMax+forMin)/2
  return accuracy;
}

function calcScore(maxPoints, accuracy){
  return (maxPoints*accuracy)/100;
}

//funksjon som kan hente ut nåværende verdi
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



  
 //funksjon som ikke er benyttet for å lagre score til bruker 
function parseScores(){
  var highValue = setSaveHIGH(HIGH)
  var lowValue = setSaveLow(LOW)
  
  addMatchResultsToFirestore(undefined, parseInt(highValue),parseInt(lowValue))
  console.log("denne kjører")
}

const [visible, setVisible] = useState (true);

//functions for the popup box
function openModal() {
  setVisible(true);
}

//lukk popup box
function closeModal() {
  setVisible(false);
}

//setstate for tutorial
const [tutorial, setTutorial] = useState (false);
function openTutorial(){
  setTutorial(true);
}

//lukker tutorial
function closeTutorial(){
  setTutorial(false);
}
  

 

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
      setHidden('none');
      setShow('visible');
      openModal();
      //parseScores();
    }
  }


  //function for clearing the timer
  function clearTimer(endtime){
    setTimer('00:00:35');
    if(intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(()=>{
      startTimer(endtime);
    }, 1000)
    intervalRef.current = id;
  }

  //deadline of timer
  function getDeadlineTime(){
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds()+35);
    return deadline;
  }


//handles multiple events for 
function multipleOnClick(){
  /*renderTimer();*/
  setVisible(false);
  runPyScript();
  onClickResetBtn();
  setPressed(false);
  setPressedLow(false);
  //parseScores();
}

function multipleRestartOnClick(){
    shutdownScript();
    setLOW('Not Selected');
    setHIGH('Not Selected');
    setHidden('hidden');
    setShow('hidden');
    
    
}






//new chart integration


  if (stocks && stocks.length < 1) return <AppLoader />, //UNEXPECTED error - IKKE FJERN
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

        
        
        <input type="button"  value="VIEW TUTORIAL" class="button" onClick={() => openTutorial()} ></input>
        
        
                <Modal 
                    visible={tutorial}
                    width="1200"
                    height="1000"
                    effect="fadeInUp"
                    onClickAway={() => closeTutorial()}
                >
                  
                    <div id="parent">
                   
                  
                      
                    <StepProgressBar
                        startingStep={0}
                        onSubmit={onFormSubmit}
                        steps={[
                          {
                            label: 'Step 1',
                            subtitle: '10%',
                            name: 'step 1',
                            content: step1Content
                          },
                          {
                            label: 'Step 2',
                            subtitle: '50%',
                            name: 'step 2',
                            content: step2Content,
                      
                          },
                          {
                            label: 'Step 3',
                            subtitle: '100%',
                            name: 'step 3',
                            content: step3Content,
                            
                          }
                        ]}
                      />;


                      
                        

                  

                        

                    </div>
                </Modal>
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

      
        
        <input type="button" value="VIEW RESULTS" class="button" type={hidden} onClick={() => openModal()} ></input>
        
        
                <Modal 
                    visible={visible}
                    width="1000"
                    height="600"
                    effect="fadeInUp"
                    onClickAway={() => closeModal()}
                >
                  
                    <div id="parent">
                   
                   
                    <div id="child-right"> <Confetti active={ visible } config={ config }/></div>
                      
                        <h1>Congratulations!</h1>
                        <p>Thank you for participating!</p>
                       <br></br>
                       <h2>Match Summary:</h2>
                        <h3>Accuracy: {calcAccuracy(HIGH, LOW, getMaxData(), getMinData())}%</h3>
                        <h3>Score: {calcScore(1000,  calcAccuracy(HIGH, LOW, getMaxData(), getMinData()))}</h3>
                        <h3>LOW: {LOW}</h3>
                        <h3>HIGH: {HIGH}</h3>

                        <a href="javascript:void(0);" onClick={() => closeModal()}>Go to scorepage</a>

                        

                        

                    </div>
                </Modal>
              
        


        </ThemeProvider>

       

        
      </center>
      {/*IKKE FJERN*/}

   
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

            <div><h1 >Time left: {timer} </h1></div>
            <div><h3>Your <span style={ hStyle1 } > HIGH: </span> {HIGH} Your <span style={hStyle}> LOW: </span>{LOW}</h3></div>
            <div><h3 style={{visibility: show}}>Accuracy: {calcAccuracy(HIGH, LOW, getMaxData(), getMinData())}% Score: {calcScore(1000,  calcAccuracy(HIGH, LOW, getMaxData(), getMinData()))} </h3></div>
          
            </Grid>

           <Grid item xs={6}>

      
          
          
            <MyButton onClick={handleHighClick} disabled={pressed} color="red">HIGH</MyButton>
          
          
          
          
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

          
       
           
           
            <MyButton onClick={handleLowClick} disabled={pressedLow} color="blue">LOW</MyButton>
          
         
          
          </Grid>

          
        
          

          
          
      
        </Grid>
         
  
    
      ) : (
        <AppLoader />
      )}
    </div>


  
  );

}