// Get the canvas element
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load and decode the audio file
const audioElement = new Audio();
audioElement.src = 'audio/micharl-farenti-the-river.mp3';

const audioSource = audioContext.createMediaElementSource(audioElement);

// Create an analyser node
const analyser = audioContext.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect the audio source to the analyser
audioSource.connect(analyser);
audioSource.connect(audioContext.destination);

// Function to render the visualizer
function renderVisualizer() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get the current frequency data
  analyser.getByteFrequencyData(dataArray);

  // Calculate bar width
  const barWidth = canvas.width / bufferLength;

  // Draw the bars
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * (canvas.height / 255);

    const x = i * barWidth;
    const y = canvas.height - barHeight;

    ctx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  // Call the render function in the next frame
  requestAnimationFrame(renderVisualizer);
}

// Start the audio playback
audioElement.play();

// Start rendering the visualizer
renderVisualizer();