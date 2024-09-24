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

let usedSparks = [];
let currentSentences = []; 

let isAffirmativeLeft; 
let currentAffirmativeSentence, currentHurtfulSentence; 

let backgrounds = [];
let currentBackgroundIndex = 0; 

let leftSparkDiv, rightSparkDiv;

let showAffirmativeSentence = false;

let ropesRemaining = 5;
let ropeVisibility = [true, true, true, true, true];

let ropeModels = []; 
let removedRopesCount = 0; 

let raining = false; 
let rainParticles = []; 
let maxRainParticles = 380; 
let rainDuration = 100000; 

let flashCount = 0;    
let isFlashing = false;
let flashDuration = 5;  
let flashInterval = 0;  
let flashOpacity;

function preload() {
  bgImage = loadImage('assets/background-bw.png');
  heartModel = loadModel('/assets/heart-nospike.obj', true);
  heartMaterial = loadImage('/assets/broken-glass.png', true);

  ropeModel1 = loadModel('/assets/rope1.obj', true);
  ropeModel2 = loadModel('/assets/rope2.obj', true);
  ropeModel3 = loadModel('/assets/rope3.obj', true);
  ropeModel4 = loadModel('/assets/rope4.obj', true);
  ropeModel5 = loadModel('/assets/rope5.obj', true);
  ropeMaterial = loadImage('/assets/rope-texture-1.jpeg', true);
  ropeModels = [ropeModel1, ropeModel2, ropeModel3, ropeModel4, ropeModel5];

  sparkModel1 = loadModel('/assets/spark1.obj', true);
  sparkModel2 = loadModel('/assets/spark2.obj', true);
  sparkModel3 = loadModel('/assets/spark3.obj', true);
  sparkModel4 = loadModel('/assets/spark4.obj', true);
  sparkModel5 = loadModel('/assets/spark5.obj', true);

  sparkModels = [sparkModel1, sparkModel2, sparkModel3, sparkModel4, sparkModel5];

  backgrounds = [
    loadImage('assets/background-bw.png'),
    loadImage('assets/background1.png'),
    loadImage('assets/background2.png'),
    loadImage('assets/background3.png'),
    loadImage('assets/background4.png'),
    loadImage('assets/background-pink.png')
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  leftSparkDiv = createDiv('');
  rightSparkDiv = createDiv('');

  leftSparkDiv.style('position', 'absolute');
  leftSparkDiv.style('width', '70px');
  leftSparkDiv.style('height', '70px');
  leftSparkDiv.style('top', '392px');
  leftSparkDiv.style('left', '257px');
  leftSparkDiv.style('background', 'rgba(0, 0, 0, 0)'); 

  rightSparkDiv.style('position', 'absolute');
  rightSparkDiv.style('width', '70px');
  rightSparkDiv.style('height', '70px');
  rightSparkDiv.style('top', '392px');
  rightSparkDiv.style('right', '257px');
  rightSparkDiv.style('background', 'rgba(0, 0, 0, 0)'); 

leftSparkDiv.mouseOver(() => {
  if (showSparks) {  
    leftSparkDiv.style('cursor', 'pointer');
    if (isAffirmativeLeft) {
      document.querySelector('.sentences').textContent = currentAffirmativeSentence;
    } else {
      document.querySelector('.sentences').textContent = currentHurtfulSentence;
    }
  }
});

rightSparkDiv.mouseOver(() => {
  if (showSparks) { 
    rightSparkDiv.style('cursor', 'pointer');
    if (!isAffirmativeLeft) {
      document.querySelector('.sentences').textContent = currentAffirmativeSentence;
    } else {
      document.querySelector('.sentences').textContent = currentHurtfulSentence;
    }
  }
});


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


leftSparkDiv.mousePressed(() => {
  if (showSparks) { 
    if (isAffirmativeLeft) {
      handleSparkClick(isAffirmativeLeft);  
    } else {
      handleSparkClick(!isAffirmativeLeft); 
    }
  }
});

rightSparkDiv.mousePressed(() => {
  if (showSparks) {  
    if (!isAffirmativeLeft) {
      handleSparkClick(isAffirmativeLeft); 
    } else {
      handleSparkClick(!isAffirmativeLeft); 
    }
  }
});



}

function draw() {
  clear();

  drawBackground();

  if (raining) {
    renderRain();
  }

  if (isFlashing) {
    handleThunderFlash(); 
  } 

  angleMode(DEGREES);
  push();
  translate(30,10,0);
  scale(1);
  push();
  noStroke();
  translate(0,0,0);
  rotateZ(180);
  rotateY(-30);
  scale(3.2, 3.2, 3.2);
  noStroke();
  shininess(30);
  tint(230);
  texture(heartMaterial);
  blendMode(SCREEN);
  model(heartModel);
  pop();
  
  if (showRopes) { 
    renderRopes();
  }
  pop();

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
  rectMode(CENTER);
  scale(1.34);
  translate(-width/2, -height/2, -200);
  
  image(backgrounds[currentBackgroundIndex], 0, 0, windowWidth, windowHeight);
  pop();
}
let ropeTint = (255);
function renderRopes() {
  push();
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
    texture(ropeMaterial);
    tint(ropeTint);
    model(ropeModel3);
    pop();
  }
}

function removeRopeModel() {
  if (removedRopesCount < ropeModels.length) {
    ropeVisibility[removedRopesCount] = false; 
    removedRopesCount++;  
  }

  if (removedRopesCount === ropeModels.length) {
    showRopes = false; 
  }
}

function renderSparks() {
  let sparkModel = sparkModels[currentSparkIndex];
  push();
  translate(-30, 0, 0);
  blendMode(SCREEN);
  

  noStroke();
  tint(255, 255, 255, sparkOpacity * 255);
  fill(255);
  
  specularMaterial(200, 200, 200);
  ambientMaterial(1200);
  emissiveMaterial(100);
  shininess(20);

  push();
  translate(-300,5,280);
  scale(0.25);
  rotateY(15);

  pointLight(
    200, 200, 200, 
    400, 0, 800 
  );
  model(sparkModel);
  pop();

  push();
  translate(300,5,280);
  scale(0.25);
  rotateY(-15);
  pointLight(
    200, 200, 200, 
    100, 0, 800 
  );
  model(sparkModel);
  pop();

  pop();
}
function keyPressed() {
  if (key === ' ') { 
    if (showAffirmativeSentence) {
      showAffirmativeSentence = false;
    } 
      showSparks = !showSparks; 
   
    if (showSparks) {
      let newSparkIndex;
  do {
    newSparkIndex = floor(random(sparkModels.length));
  } while (usedSparks.includes(newSparkIndex));
  
  usedSparks.push(newSparkIndex);
  currentSparkIndex = newSparkIndex;
  currentSentences = sentencePairs[newSparkIndex];

  isAffirmativeLeft = random() > 0.5;

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

  showText = true;
  
  showSparks = true; 

    if (!showSparks) {
      leftSparkDiv.html('');
      rightSparkDiv.html('');
    }
  }
}
  
  if (key === 'r' || key === 'R') { 
    restartGame();
  }
}

function startRain() {
  raining = true; 
  rainParticles = []; 
  
  for (let i = 0; i < maxRainParticles; i++) {
    rainParticles.push(createRainParticle());
  }

  setTimeout(() => {
    raining = false;
  }, rainDuration);

}

function stopRain() {
  if (raining) {
    raining = false;
  }
}

function createRainParticle() {
  return {
    x: random(-width / 2, width / 2),
    y: random(-height, height),
    z: random(-140, -190),
    speed: random(3, 8)
  };
}

function renderRain() {
  push();
  blendMode(SCREEN);
  stroke(255, 25); 
  strokeWeight(0.8);
  for (let i = 0; i < rainParticles.length; i++) {
    let p = rainParticles[i];
    
    line(p.x, p.y, p.x, p.y + 90);
    
    p.y += p.speed*1.5;
    
    if (p.y > height / 2) {
      rainParticles[i] = createRainParticle(); 
    }
  }  
  pop();
}

function startThunder() {
  flashCount = 0;
  isFlashing = true; 
  flashOpacity = 230; 
}

function handleThunderFlash() {
  if (flashCount < 6) { 
    if (frameCount % flashDuration === 0) {
      if (flashInterval % 2 === 0) {
        fill(255, flashOpacity);
        rect(-width / 2, -height / 2, width, height); 
      }
      flashCount++;
      flashInterval++;
    }
  } else {
    isFlashing = false; 
    flashInterval = 0;
  }
}

function handleSparkClick(isAffirmativeLeft) {
  if (isAffirmativeLeft) {
    clear();
    document.querySelector('.prompts').textContent = "Great job! You have removed a string!";
    document.querySelector('#first').textContent = "Press Space to continue";
    showSparks = false;

    if (currentBackgroundIndex < backgrounds.length - 1) {
      currentBackgroundIndex++;
    }
    
    removeRopeModel();
    stopRain();
    stopRainSound();
    
    if (usedSparks.length < sparkModels.length) {
      nextSparkSet(); 
    } else {
      let pinkText = 'RGB(255, 93, 139)';
      document.querySelector('.prompts').style.color = pinkText;
      document.querySelector('.sentences').style.color = pinkText;
      document.querySelector('#first').style.color = pinkText;
      document.querySelector('.howto').style.justifyContent = CENTER;
      document.querySelector('#second').style.padding = '0';
      document.querySelector('.prompts').textContent = "Great job! You have removed all ropes!";
      document.querySelector('#first').textContent = "Press R to play again";
      document.querySelector('#second').textContent = "";
    }

    console.log("Affirmative spark clicked");
  } else {
    document.querySelector('.sentences').textContent = "";
    startRain();
    startThunder();
    document.querySelector('.prompts').textContent = "Try again, it's not the right answer.";
    console.log("Hurtful spark clicked");

    playRainAndThunder();
  }
}

function restartGame() {
  currentSparkIndex = -1;

  showRopes = true; 
  showText = true; 

  usedSparks = []; 
  currentSentences = [];

  ropesRemaining = 5;
  ropeVisibility = [true, true, true, true, true]; 
  removedRopesCount = 0; 

  raining = false;
  rainParticles = [];

  flashCount = 0;
  isFlashing = false;

  currentBackgroundIndex = 0; 
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

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let rainSoundSource = null;  
let isMuted = false; 

function createRainSound() {
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1; 
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime); 

  whiteNoise.connect(filter);
  filter.connect(audioCtx.destination);

  whiteNoise.start(0);
  rainSoundSource = whiteNoise;  
}

function createThunderSound() {
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; 
  oscillator.frequency.setValueAtTime(60, audioCtx.currentTime); 

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.exponentialRampToValueAtTime(1, audioCtx.currentTime + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

  oscillator.start(0);
  oscillator.stop(audioCtx.currentTime + 2); 
}

function playRainAndThunder() {
  if (!isMuted) { 
    createRainSound();
    setTimeout(createThunderSound, 3000); 
  }
}

function stopRainSound() {
  if (rainSoundSource) {
    rainSoundSource.stop(); 
    rainSoundSource.disconnect(); 
    rainSoundSource = null; 
  }
}

function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) {
    stopRainSound(); 
  } else {
    playRainAndThunder();
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'm' || event.key === 'M') { 
    toggleMute();
  }
});

