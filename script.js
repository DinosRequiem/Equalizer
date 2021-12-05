import {hslToRgb} from "./util"
const WIDTH = 1500;
const HEIGHT = 1500;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d")
canvas.width = WIDTH;
canvas.height = HEIGHT;
let analyzer;
let bufferLength;
const barWidth = (WIDTH / bufferLength) * 2.5;
const x = 0;


//get sound
async function getAudio() {
 const stream = await navigator.mediaDevices.getUserMedia({audio: true}).catch(handleError);

 const audioCtx = new AudioContext;
 analyzer = audioCtx.createAnalyser();
 const source = audioCtx.createMediaStreamSource(stream);

 //Data Cap
 analyzer.fftSize = 2 ** 10;
 //Retrieve the data
 bufferLength = analyzer.frequencyBinCount;
 const timeData = new Uint8Array(bufferLength);
 console.log(timeData);
 const frequencyData = new Uint8Array(bufferLength);
 console.log(frequencyData);
 drawTimeData(timeData);
 drawFrequency(frequencyData);
}

getAudio();

function handleError(err) {
    console.log("You must give access to your mic in order to proceed.")
}

function drawTimeData(timeData) {
    analyzer.getByteTimeDomainData(timeData);
    console.log(timeData);
    
    //setup canvas drawing
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#ffc600";
    ctx.beginPath();
    const sliceWidth = WIDTH / bufferLength;
    console.log(sliceWidth);
    let x = 0;
    timeData.forEach((data, i) => {
     const v = data / 128;   
     const y = (v * HEIGHT) / 2; 
     //clear canvas
     ctx.clearRect(0, 0, WIDTH, HEIGHT);
     //draw lines
     if (i === 0) {
         ctx.moveTo(x, y);
     }  else {
         ctx.lineTo(x, y)
     }
     x += sliceWidth;
    });

    ctx.stroke();

    //call itself as soon as possible
    requestAnimationFrame(() => drawTimeData(timeData));

}

function drawFrequency(frequencyData) {
    //get data into the array
    analyzer.getByteFrequencyData(frequencyData);
    console.log(frequencyData);
    requestAnimationFrame(() => drawFrequency(frequencyData));
}

frequencyData.forEach((amount) => {
    //0-255
    const percent = amount / 255;
    const [h, s, l] = [360 / (percent * 360) - 0.5,, 0.8, 0.75];
    const barHeight = HEIGHT * percent * 2;
    //convert collor to HSL
    const [r, g, b] = hslToRgb(h, s, l);
    ctx.fillStyle = "rgb(${r},${g},${b})";
    ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 1;
});


