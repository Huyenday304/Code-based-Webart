let heartModel;
let ropeModel1, ropeModel2, ropeModel3, ropeModel4, ropeModel5;
let heartSvg;
let ropeMaterial;

let sentence;
let instruction;
let sparkModel1, sparkModel2, sparkModel3, sparkModel4, sparkModel5;

let showSparks = false;
let sparkOpacity = 0;
let sparkFadeInSpeed = 0.05;
let sparkDelay = 0;

let sparkModels = [];
let currentSparkIndex = -1;

let showRopes = true; 
let showText = true; 

let bgImage;

let sentencePairs = [
  ["Who can love you is the luckiest.", "Who’s gonna love you anyway?"],
  ["It's okay to feel that way.", "Don't be so sensitive."],
  ["You are pretty as you are.", "You're a disgrace to look at."],
  ["You are enough.", "You need to be more successful."],
  ["You can achieve anything you set your mind to.", "You’ll never able to do anything."]
];

let usedSparks = []; // To keep track of used sparks
let currentSentences = []; // Current pair of sentences for the visible sparks

let isAffirmativeLeft; // Boolean to check which side (left or right) has the affirmative sentence
let currentAffirmativeSentence, currentHurtfulSentence; // Current sentences being shown

// Background variables
let backgrounds = [];
let currentBackgroundIndex = 0; // Starts at 0, will increase as the user makes correct choices

let leftSparkDiv, rightSparkDiv;

let showAffirmativeSentence = false;

let ropesRemaining = 5;
let ropeVisibility = [true, true, true, true, true];

let ropeModels = []; // Array to store rope models
let removedRopesCount = 0; // Counter to track how many ropes are removed

let raining = false; // Track if rain should be active
let rainParticles = []; // Store individual rain particles
let maxRainParticles = 380; // Adjust this to control the density of the rain
let rainDuration = 100000; // Time in milliseconds the rain should last

let flashCount = 0;    // To count how many times the flash happens
let isFlashing = false; // To track if the flash is happening
let flashDuration = 5;  // Duration of each flash
let flashInterval = 0;  // Interval between flashes
let flashOpacity;

// let heartTextureOpacity = 255; // Initial opacity (fully visible)
// let fadeOutSpeed = 5;          // Speed at which the texture fades out
// let gameEnded = false;

function preload() {
  bgImage = loadImage('assets/background-bw.png');
  heartModel = loadModel('/assets/heart-nospike.obj', true);
  heartMaterial = loadImage('/assets/broken glass.png', true);

  ropeModel1 = loadModel('/assets/rope 1.obj', true);
  ropeModel2 = loadModel('/assets/rope 2.obj', true);
  ropeModel3 = loadModel('/assets/rope 3.obj', true);
  ropeModel4 = loadModel('/assets/rope 4.obj', true);
  ropeModel5 = loadModel('/assets/rope 5.obj', true);
  ropeMaterial = loadImage('/assets/rope-texture-1.jpeg', true);
  ropeModels = [ropeModel1, ropeModel2, ropeModel3, ropeModel4, ropeModel5];

  sparkModel1 = loadModel('/assets/spark 1.obj', true);
  sparkModel2 = loadModel('/assets/spark 2.obj', true);
  sparkModel3 = loadModel('/assets/spark 3.obj', true);
  sparkModel4 = loadModel('/assets/spark 4.obj', true);
  sparkModel5 = loadModel('/assets/spark 5.obj', true);

  sparkModels = [sparkModel1, sparkModel2, sparkModel3, sparkModel4, sparkModel5];

  // Preload background images
  backgrounds = [
    loadImage('assets/background-bw.png'),
    loadImage('assets/background 1.png'),
    loadImage('assets/background 2.png'),
    loadImage('assets/background 3.png'),
    loadImage('assets/background 4.png'),
    loadImage('assets/background-pink.png')
  ];

}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

// Create two divs for left and right sparks
  leftSparkDiv = createDiv('');
  rightSparkDiv = createDiv('');

  // Set basic styles for the divs (transparent but interactable)
  leftSparkDiv.style('position', 'absolute');
  leftSparkDiv.style('width', '70px');
  leftSparkDiv.style('height', '70px');
  leftSparkDiv.style('top', '392px');
  leftSparkDiv.style('left', '257px');
  leftSparkDiv.style('background', 'rgba(0, 0, 0, 0)'); // Transparent

  rightSparkDiv.style('position', 'absolute');
  rightSparkDiv.style('width', '70px');
  rightSparkDiv.style('height', '70px');
  rightSparkDiv.style('top', '392px');
  rightSparkDiv.style('right', '257px');
  rightSparkDiv.style('background', 'rgba(0, 0, 0, 0)'); // Transparent

// Add event listeners to the divs

// Mouse over for the left spark
leftSparkDiv.mouseOver(() => {
  if (showSparks) {  // Check if sparks should be interactive
    leftSparkDiv.style('cursor', 'pointer');
    // Check if the left spark is the affirmative one
    if (isAffirmativeLeft) {
      document.querySelector('.sentences').textContent = currentAffirmativeSentence;
    } else {
      document.querySelector('.sentences').textContent = currentHurtfulSentence;
    }
  }
});

// Mouse over for the right spark
rightSparkDiv.mouseOver(() => {
  if (showSparks) {  // Check if sparks should be interactive
    rightSparkDiv.style('cursor', 'pointer');
    // Check if the right spark is the affirmative one
    if (!isAffirmativeLeft) {
      document.querySelector('.sentences').textContent = currentAffirmativeSentence;
    } else {
      document.querySelector('.sentences').textContent = currentHurtfulSentence;
    }
  }
});

// Mouse out for both sparks
leftSparkDiv.mouseOut(() => {
  if (showSparks) {
    document.querySelector('.sentences').textContent = "";
  }
});
rightSparkDiv.mouseOut(() => {
  if (showSparks) {
    document.querySelector('.sentences').textContent = "";
  }
});

// Mouse pressed for the left spark
leftSparkDiv.mousePressed(() => {
  if (showSparks) {  // Check if sparks should be interactive
    if (isAffirmativeLeft) {
      handleSparkClick(isAffirmativeLeft);  // Correct click
    } else {
      handleSparkClick(!isAffirmativeLeft); // Wrong click
    }
  }
});

// Mouse pressed for the right spark
rightSparkDiv.mousePressed(() => {
  if (showSparks) {  // Check if sparks should be interactive
    if (!isAffirmativeLeft) {
      handleSparkClick(isAffirmativeLeft);  // Correct click
    } else {
      handleSparkClick(!isAffirmativeLeft); // Wrong click
    }
  }
});



}

function draw() {
  clear();

  // Render the current background
  drawBackground();

  if (raining) {
    renderRain();
  }

  if (isFlashing) {
    handleThunderFlash(); // Trigger the flashing effect
  } 

  // nextSparkSet();

  // orbitControl();
  angleMode(DEGREES);
  push();
  translate(30,10,0);
  scale(1);
  // rotateY(-22);

  push();
  noStroke();
  translate(0,0,0);
  rotateZ(180);
  rotateY(-30);
  scale(3.2, 3.2, 3.2);

  // directionalLight(
  //   200, 200, 200, // color
  //   -1200, 400, 100 // position
  // );
 
  // fill(255);
  noStroke();
  // specularMaterial(255);
  // ambientMaterial(225);
  // emissiveMaterial(200);
  shininess(30);
  // blendMode(SCREEN);

  tint(230);
  texture(heartMaterial);
  blendMode(SCREEN);
  model(heartModel);
  pop();
  
  // render ropes !!!
  if (showRopes) { // Check rope visibility
    renderRopes();
  }
  pop();
// render sparksss !!!
if (showSparks) {
  renderSparks();
}


if (showAffirmativeSentence) {
  document.querySelector('.sentences').textContent = currentAffirmativeSentence;
}
  document.querySelector('.prompts').style.display = showText ? 'block' : 'none';
  document.querySelector('.sentences').style.display = showText ? 'block' : 'none';
  document.querySelector('.howto').style.display = showText ? 'flex' : 'none';
}



function drawBackground() {
  push();
  // Reset any transformations that WebGL might have applied
  // resetMatrix();
  rectMode(CENTER);
  scale(1.34);
  translate(-width/2, -height/2, -200); // Position the image correctly
  
  // Draw the background image
  
  image(backgrounds[currentBackgroundIndex], 0, 0, windowWidth, windowHeight);
  pop();
}
let ropeTint = (255);
function renderRopes() {
  push();
  // Render each rope if it's still visible
  if (ropeVisibility[0]) {
    push();
    translate(180, 326, 12);
    rotateZ(0);
    rotateY(-20);
    rotateX(170);
    scale(1.8, 1.8, 1.8);
    noStroke();
    fill(255);
    shininess(10);
    // blendMode(SCREEN);
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel5);
    pop();
  }

  if (ropeVisibility[1]) {
    push();
    translate(400, 90, 0);
    rotateZ(-2);
    rotateY(-20);
    rotateX(170);
    scale(3, 3, 3);
    noStroke();
    fill(255);
    // blendMode(SCREEN);
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel4);
    pop();
  }

  if (ropeVisibility[2]) {
    push();
    translate(528, -318, -135);
    rotateZ(-5.5);
    rotateY(-20);
    rotateX(210);
    scale(3, 3, 3);
    noStroke();
    fill(255);
    // blendMode(SCREEN);
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel1);
    pop();
  }



  if (ropeVisibility[3]) {
    push();
    translate(-440, -220, 211);
    rotateZ(0);
    rotateY(0);
    rotateX(150);
    scale(2, 2, 2);
    noStroke();
    fill(255);
    // blendMode(SCREEN);
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel2);
    pop();
  }

  if (ropeVisibility[4]) {
    push();
    translate(-320, 110, 218);
    rotateZ(10);
    rotateY(50);
    rotateX(160);
    scale(2, 2, 2);
    noStroke();
    fill(255);
    // blendMode(SCREEN);
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel3);
    pop();
  }
}

function removeRopeModel() {
  // Remove one rope based on the removedRopesCount
  if (removedRopesCount < ropeModels.length) {
    ropeVisibility[removedRopesCount] = false;  // Hide the current rope
    removedRopesCount++;  // Move to the next rope for future removals
  }

  // Check if all ropes are removed, then stop rendering ropes
  if (removedRopesCount === ropeModels.length) {
    showRopes = false; // All ropes are gone, so hide the entire rope system
  }
}

function renderSparks() {
  let sparkModel = sparkModels[currentSparkIndex];
  
//draw sparks
  push();
  translate(-30, 0, 0);
  blendMode(SCREEN);
  
  // rotateZ(180);
  noStroke();
  tint(255, 255, 255, sparkOpacity * 255);
  fill(255);
  
  specularMaterial(200, 200, 200);
  ambientMaterial(1200);
  emissiveMaterial(100);
  shininess(20);

  //left one
  push();
  translate(-300,5,280);
  scale(0.25);
  rotateY(15);

  pointLight(
    200, 200, 200, // color
    400, 0, 800 // position
  );
  model(sparkModel);
  pop();

  //right one
  push();
  translate(300,5,280);
  scale(0.25);
  rotateY(-15);
  pointLight(
    200, 200, 200, // color
    100, 0, 800 // position
  );
  model(sparkModel);
  pop();

  pop();
}
// Press Space to start (show sparks)
function keyPressed() {
  if (key === ' ') { // Check for spacebar press
    if (showAffirmativeSentence) {
      // If the affirmative sentence is currently being shown, hide it
      showAffirmativeSentence = false;
      // document.querySelector('.sentences').textContent = ""; // Clear the sentence
    } 
      // Otherwise, toggle spark visibility
      showSparks = !showSparks; // Toggle spark visibility
   
    if (showSparks) {
      let newSparkIndex;
  do {
    newSparkIndex = floor(random(sparkModels.length));
  } while (usedSparks.includes(newSparkIndex));
  
  usedSparks.push(newSparkIndex);
  currentSparkIndex = newSparkIndex;

  // Assign a pair of sentences for this spark
  currentSentences = sentencePairs[newSparkIndex];

  // Randomly decide which side has the affirmative sentence
  isAffirmativeLeft = random() > 0.5;

  // Assign the current affirmative and hurtful sentences
  if (isAffirmativeLeft) {
    currentAffirmativeSentence = currentSentences[0];
    currentHurtfulSentence = currentSentences[1];
  } else {
    currentAffirmativeSentence = currentSentences[1];
    currentHurtfulSentence = currentSentences[0];
  }

 

  let promptsToChoose = "What’d you say to this broken heart?";
  let firstInstruct = "Click the sparks to choose the sentences";
  document.querySelector('.prompts').textContent = promptsToChoose;
  document.querySelector('#first').textContent = firstInstruct;

  // Reset hover interaction
  showText = true;
  
      
  // Show new sparks
  showSparks = true; 
  // Add event listeners to the divs


    if (!showSparks) {
      // Hide the divs when sparks are not visible
      leftSparkDiv.html('');
      rightSparkDiv.html('');
    }
  }
}

  // if (key === 'h') { // Check for 'H' key press
  //   showRopes = !showRopes; // Toggle rope visibility
  //   showText = !showText; // Toggle text visibility
  //   showSparks = !showSparks;
  // }
  
  if (key === 'r' || key === 'R') { 
    restartGame();
  }
  
}

// Function to trigger the rain effect
function startRain() {
  raining = true; // Activate rain
  rainParticles = []; // Reset rain particles
  
  // Create initial rain particles
  for (let i = 0; i < maxRainParticles; i++) {
    rainParticles.push(createRainParticle());
  }

  // Stop rain after a delay
  setTimeout(() => {
    raining = false; // Deactivate rain after some time
  }, rainDuration);

//   if (!raining) {
//     raining = true;
// }
}

function stopRain() {
  if (raining) {
    raining = false;
  }
}

// Function to create a new rain particle
function createRainParticle() {
  return {
    x: random(-width / 2, width / 2),
    y: random(-height, height),
    z: random(-140, -190),
    speed: random(3, 8)
  };
}

// Function to render rain particles
function renderRain() {
  push();
  blendMode(SCREEN);
  stroke(255, 25); 
  strokeWeight(0.8);
  // filter(BLUR, 20);

  // Loop through rain particles and draw them
  for (let i = 0; i < rainParticles.length; i++) {
    let p = rainParticles[i];
    
    // Draw each rain particle as a line
    line(p.x, p.y, p.x, p.y + 90);
    
    // Move the particle downwards
    p.y += p.speed*1.5;
    
    // Reset the particle if it moves off the screen
    if (p.y > height / 2) {
      rainParticles[i] = createRainParticle(); // Reset the particle position
    }
  }
  
  pop();
}

function startThunder() {
  flashCount = 0;
  isFlashing = true; // Start the flash
  flashOpacity = 230; // Reset opacity for a strong flash
}

function handleThunderFlash() {
  if (flashCount < 6) { // Flash 3 times (each flash has two parts: on and off)
    if (frameCount % flashDuration === 0) {
      if (flashInterval % 2 === 0) {
        // Flash "on" state: Draw a white transparent rectangle
        fill(255, flashOpacity); // Set fill color to white with transparency
        rect(-width / 2, -height / 2, width, height); // Overlay a white flash
      }
      flashCount++;
      flashInterval++;
    }
  } else {
    isFlashing = false; // Stop flashing after the sequence completes
    flashInterval = 0;  // Reset interval for the next flash
  }
}

function handleSparkClick(isAffirmativeLeft) {
  
  if (isAffirmativeLeft) {
    clear();
    // User clicked the affirmative sentence
    document.querySelector('.prompts').textContent = "Great job! You have removed a string!";
    document.querySelector('#first').textContent = "Press Space to continue";
    // document.querySelector('.sentences').textContent = currentAffirmativeSentence;

    // showAffirmativeSentence = true;
    
    // document.querySelector('.sentences').textContent = "";
     // Hide the sparks and stop hovering interaction
    showSparks = false;
    // showText = false;

    // Update the background image if there are more backgrounds
    if (currentBackgroundIndex < backgrounds.length - 1) {
      currentBackgroundIndex++;
    }
    
    // Remove a rope and progress the game
    removeRopeModel();
    stopRain();
    stopRainSound();
    
    if (usedSparks.length < sparkModels.length) {
      nextSparkSet(); // Load the next pair of sparks and sentences
    } else {
      // Game ends after all sparks have been used
      let pinkText = 'RGB(255, 93, 139)';
      document.querySelector('.prompts').style.color = pinkText;
      document.querySelector('.sentences').style.color = pinkText;
      document.querySelector('#first').style.color = pinkText;
      document.querySelector('.howto').style.justifyContent = CENTER;
      document.querySelector('#second').style.padding = '0';
      document.querySelector('.prompts').textContent = "Great job! You have removed all ropes!";
      document.querySelector('#first').textContent = "Press R to play again";
      document.querySelector('#second').textContent = "";
      // gameEnded = true;
    }

    console.log("Affirmative spark clicked");
  } else {
    document.querySelector('.sentences').textContent = "";
    startRain();
    startThunder();
    // User clicked the hurtful sentence
    document.querySelector('.prompts').textContent = "Try again, it's not the right answer.";
    console.log("Hurtful spark clicked");

    playRainAndThunder();
    
  }
}

function restartGame() {
  // Reset all game states
  // showSparks = false;
  // sparkOpacity = 0;
  // sparkDelay = 0;

  // sparkModels = [];
  currentSparkIndex = -1;

  showRopes = true; 
  showText = true; 

  usedSparks = []; // Reset used sparks
  currentSentences = [];

  ropesRemaining = 5;
  ropeVisibility = [true, true, true, true, true]; // Reset rope visibility
  removedRopesCount = 0; // Reset removed ropes

  raining = false; // Stop rain
  rainParticles = []; // Clear rain particles

  flashCount = 0;
  isFlashing = false;

  currentBackgroundIndex = 0; // Reset background to the first one
  // showAffirmativeSentence = false;
  document.querySelector('.sentences').textContent = "";

  document.querySelector('.prompts').textContent = "Remove all the strings and heal the heart";
  document.querySelector('#first').textContent = "Press Space to start the game";
  document.querySelector('.prompts').style.color = 'white';
  document.querySelector('.sentences').style.color = 'white';
  document.querySelector('#first').style.color = 'white';
  document.querySelector('.howto').style.justifyContent = 'space-between';
  document.querySelector('#second').style.padding = '0 3.6rem 1.8rem 3.6rem';
  document.querySelector('#second').textContent = "Press M to mute/unmute";

  console.log("Game restarted");
}

// Create AudioContext to control sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Function to create rain sound
let rainSoundSource = null;  // Keep track of the rain sound
let isMuted = false; // Track mute state

function createRainSound() {
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // Fill the buffer with white noise (random values)
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; // White noise
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Use a low-pass filter to make the noise sound like rain
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime); // Lower value makes softer rain

  whiteNoise.connect(filter);
  filter.connect(audioCtx.destination);

  whiteNoise.start(0);
  rainSoundSource = whiteNoise;  // Store the rain sound source for stopping it later
}

// Function to create thunder sound
function createThunderSound() {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; // Sine wave for rumbling thunder
  oscillator.frequency.setValueAtTime(60, audioCtx.currentTime); // Low frequency rumble

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Make thunder grow louder and fade away
  gainNode.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

  oscillator.start(0);
  oscillator.stop(audioCtx.currentTime + 2); // Stop after 2 seconds
}

// Function to play rain and thunder sounds
function playRainAndThunder() {
  if (!isMuted) { // Only play if not muted
    createRainSound();
    setTimeout(createThunderSound, 3000); // Add thunder with delay
  }
}

// Function to stop the rain sound
function stopRainSound() {
  if (rainSoundSource) {
    rainSoundSource.stop(); // Stop the rain sound
    rainSoundSource.disconnect(); // Disconnect to prevent further playback
    rainSoundSource = null;  // Reset the source after stopping
  }
}

// Function to toggle mute
function toggleMute() {
  isMuted = !isMuted; // Toggle mute state
  if (isMuted) {
    stopRainSound(); // Stop sounds if muted
  } else {
    playRainAndThunder();
  }
}

// Event listener for the 'M' key
document.addEventListener('keydown', (event) => {
  if (event.key === 'm' || event.key === 'M') { // Check for 'M' or 'm'
    toggleMute();
  }
});

