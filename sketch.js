const videoElement = document.getElementsByClassName('input_video')[0];
var button;
let colorChoice;
let colors = ['#ff0099', '#ffff00', '#00ffff', '#6600ff', '#ff6600', '#ff0000', '#00ff00','#0000ff', '#ff00ff'];

let states = null;

function onResults(results) {
  // calculate states from landmarks (just the first one)
  if(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    states = CalculateStates(results.multiFaceLandmarks[0]);
  }
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 600,
  height: 400
});
camera.start();

function setup(){
  createCanvas(600, 400);
  background(0);
  colorChoice = floor(random(0,7));
  button = createButton("change color");
  button.mousePressed(changeColor);
  button.position(255, 350);
}

function drawCircle(feature, radius = 10){
  push ();
  translate (feature.x * width, feature.y * height);
  circle (feature.x, feature.y, radius);
  pop();
}

function drawLine(feature){
  push();
  translate (feature.x * width, feature.y * height);
  line (feature.x - 10, feature.y, feature.x + 10, feature.y);
  pop();
}

function drawMouthLine(feature){
  push();
  translate (feature.x * width, feature.y * height);
  line (feature.x, feature.y, feature.x + 20, feature.y);
  pop();
}

function drawRect(feature){
  push();
  translate (feature.x * width, feature.y * height);
  rect (feature.x + 5, feature.y - 2.5, 10, 5);
  pop();
}

function draw () {
  background ("black");
  
  if (states != null){
    //when left eye blinks, draw a line
    if (states.l_blink){
      drawLine(states.l_pos);
      stroke (colors[colorChoice]);
      strokeWeight (3);
    } else {
      drawCircle(states.l_pos);
      fill (colors[colorChoice]);
    }
    
    //when right eye blinks, draw a line
    if (states.r_blink){
      drawLine(states.r_pos);
      stroke (colors[colorChoice]);
      strokeWeight (3);
    } else {
      drawCircle(states.r_pos);
      fill (colors[colorChoice]);
    }
    
    //when mouth opens, draw a circle
    if (states.mouth){
      drawRect(states.mouth_pos);
      fill (colors[colorChoice]);
    } else {
      drawMouthLine(states.mouth_pos);
      stroke (colors[colorChoice]);
      strokeWeight (3);
    }
  }
}

function changeColor(){
  colorChoice = floor(random(0,7));
}