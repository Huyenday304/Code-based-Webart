let audioContext;
let backgroundMusic;
let isMuted = false;


function createBackgroundMusic() {
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume

  const oscillators = [];
  const frequencies = [220, 264, 330]; // A3, C4, E4

  frequencies.forEach(freq => {
    const osc = audioContext.createOscillator();
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    osc.type = 'sine';
    osc.connect(gainNode);
    osc.start();
    oscillators.push(osc);
  });

  return {
    loop: () => {
      oscillators.forEach(osc => {
        osc.frequency.setValueAtTime(osc.frequency.value + random(-1, 1), audioContext.currentTime);
      });
    },
    stop: () => {
      oscillators.forEach(osc => osc.stop());
    }
  };
}

function draw() {
  if (backgroundMusic) {
    backgroundMusic.loop(); // Call the loop function in draw()
  }

    audioContext = getAudioContext();

  // Create background music (but don't start it yet)
  backgroundMusic = createBackgroundMusic();
}

function keyPressed() {
  if (key === 'M') { // Toggle mute on 'M' key press
    isMuted = !isMuted;

    if (isMuted) {
      audioContext.suspend(); // Mute the music
    } else {
      audioContext.resume(); // Restore volume
      backgroundMusic.loop(); // Start music if unmuted
    }
  } else if (audioContext.state === 'suspended') {
    audioContext.resume(); // Resume context on any key press
  }
}
