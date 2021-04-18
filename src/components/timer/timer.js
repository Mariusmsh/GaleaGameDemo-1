import { Timer } from "@material-ui/icons";

const startingMinutes = 10/2;
let time = startingMinutes * 60;

const countDownEl = document.getElementById('countdown');

setInterval(updateCountdown, 1000);

function updateCountdown(){
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countDownEl.innetHTML = '${minutes}:${seconds}';
    time--;
}

export default Timer;