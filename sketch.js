// ------------------ QUBIT STATE ------------------
let theta = 0.5;
let phi = 0.5;

// rotation
let rotX = 0;
let rotY = 0;
let autoSpin = true;

// mouse
let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// circuit history
let circuit = [];

// animation
let animating = false;
let animSteps = 0;
let dTheta = 0;
let dPhi = 0;

// collapse state
let collapsed = false;

// -------------------------------------------------

function setup() {

createCanvas(800,650,WEBGL);

// GATE BUTTONS
createButton("X Gate")
.position(20,20)
.mousePressed(()=>applyGate("X"));

createButton("Z Gate")
.position(100,20)
.mousePressed(()=>applyGate("Z"));

createButton("H Gate")
.position(180,20)
.mousePressed(()=>applyGate("H"));

createButton("Measure")
.position(260,20)
.mousePressed(measureQubit);

createButton("Reset")
.position(350,20)
.mousePressed(resetState);

createButton("Pause Spin")
.position(420,20)
.mousePressed(()=>autoSpin=false);

createButton("Resume Spin")
.position(520,20)
.mousePressed(()=>autoSpin=true);

}

// -------------------------------------------------

function draw(){

background(5);

// auto spin
if(autoSpin){
rotY += 0.01;
}

// gate animation
if(animating){

theta += dTheta;
phi += dPhi;

animSteps--;

if(animSteps<=0){
animating=false;
}

}

// rotation
rotateX(rotX);
rotateY(rotY);

// realistic Bloch sphere grid
drawBlochGrid(180);

// axes
strokeWeight(2);

stroke(255,0,0);
line(-250,0,0,250,0,0);

stroke(0,255,0);
line(0,-250,0,0,250,0);

stroke(0,0,255);
line(0,0,-250,0,0,250);

// qubit vector
drawVector();

// probabilities
let p0 = pow(cos(theta/2),2);
let p1 = pow(sin(theta/2),2);

let alpha = cos(theta/2);
let beta = sin(theta/2);

// UI overlay
resetMatrix();

fill(255);
textSize(16);

text("P(0): "+nf(p0,1,2),20,90);
text("P(1): "+nf(p1,1,2),20,110);

text("|ψ> = "+nf(alpha,1,2)+"|0> + "+nf(beta,1,2)+"|1>",20,140);

text("Circuit:",20,180);
text(circuit.join(" → "),20,200);

if(collapsed){

text("Measurement collapsed state!",20,240);

}

}

// -------------------------------------------------

function drawBlochGrid(r){

stroke(180);
noFill();
strokeWeight(1);

// latitude
for(let i=-80;i<=80;i+=20){

push();
rotateX(radians(i));
ellipse(0,0,r*2,r*2*cos(radians(i)));
pop();

}

// longitude
for(let j=0;j<360;j+=20){

push();
rotateY(radians(j));
ellipse(0,0,r*2,r*2);
pop();

}

}

// -------------------------------------------------

function drawVector(){

let r = 180;

let x = r*sin(theta)*cos(phi);
let y = r*sin(theta)*sin(phi);
let z = r*cos(theta);

// glow
stroke(0,255,255);
strokeWeight(6);
line(0,0,0,x,y,z);

stroke(0,200,255);
strokeWeight(2);
line(0,0,0,x,y,z);

// vector tip
push();
translate(x,y,z);
noStroke();
fill(0,255,255);
sphere(8);
pop();

}

// -------------------------------------------------

function applyGate(gate){

collapsed=false;

circuit.push(gate);

animating=true;
animSteps=40;

if(gate==="X"){

dTheta=0.05;
dPhi=0;

}

if(gate==="Z"){

dTheta=0;
dPhi=0.05;

}

if(gate==="H"){

// Hadamard superposition animation
dTheta=0.04;
dPhi=0.04;

}

}

// -------------------------------------------------

function measureQubit(){

let p0 = pow(cos(theta/2),2);
let rand = random();

collapsed=true;

if(rand < p0){

theta = 0;
phi = 0;

}else{

theta = PI;
phi = 0;

}

}

// -------------------------------------------------

function resetState(){

theta=0.5;
phi=0.5;

circuit=[];
collapsed=false;

}

// -------------------------------------------------

function mousePressed(){

dragging=true;

lastMouseX=mouseX;
lastMouseY=mouseY;

}

function mouseReleased(){

dragging=false;

}

function mouseDragged(){

if(dragging){

let dx=mouseX-lastMouseX;
let dy=mouseY-lastMouseY;

rotY += dx*0.01;
rotX += dy*0.01;

lastMouseX=mouseX;
lastMouseY=mouseY;

}

}