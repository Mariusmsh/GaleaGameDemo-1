import { Timer } from "@material-ui/icons";

//Konstant for minutter
const startingMinutes = 10/2;
//Start tid
let time = startingMinutes * 60;
//Nedtelling
const countDownEl = document.getElementById('countdown');

//Setter intervallet for nedtelling
setInterval(updateCountdown, 1000);

//Oppdaterer nedtelleren
function updateCountdown(){
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countDownEl.innetHTML = '${minutes}:${seconds}';
    time--;
}

export default Timer;