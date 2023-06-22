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

// Function to render the visualizer
function renderVisualizer2() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Get the current frequency data
    analyser.getByteFrequencyData(dataArray);
  
    // Calculate the radius of the circle
    const circleRadius = Math.min(canvas.width, canvas.height) / 10;
  
    // Calculate the angle between bars
    const angleIncrement = (2 * Math.PI) / bufferLength;
  
    // Draw the bars
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] * (canvas.height / 255);
  
      // Calculate the position of the bar
      const angle = i * angleIncrement;
      const x = canvas.width / 2 + Math.cos(angle) * circleRadius;
      const y = canvas.height / 2 + Math.sin(angle) * circleRadius;
  
      // Calculate the size of the bar
      const barWidth = barHeight / 2;
  
      ctx.save();
  
      // Rotate the canvas to align the bars with the circle
      ctx.translate(x, y);
      ctx.rotate(angle);
  
      ctx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
      ctx.fillRect(0, -barWidth / 2, barHeight, barWidth);
  
      ctx.restore();
    }
  
    // Call the render function in the next frame
    requestAnimationFrame(renderVisualizer2);
}
  
// Function to render the visualizer
function renderVisualizer3() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Get the current time domain data
    analyser.getByteTimeDomainData(dataArray);
  
    // Calculate bar width
    const barWidth = canvas.width / bufferLength;
  
    // Draw the bars based on pitch
    for (let i = 0; i < bufferLength; i++) {
      // Convert the audio data from the range of 0-255 to -1 to 1
      const sample = (dataArray[i] - 128) / 128;
  
      // Calculate the pitch (frequency) using the index
      const pitch = (i / bufferLength) * audioContext.sampleRate;
  
      // Calculate the bar height based on the pitch
      const barHeight = Math.abs(sample) * canvas.height;
  
      const x = i * barWidth;
      const y = canvas.height - barHeight;
  
      ctx.fillStyle = 'rgb(50, ' + (barHeight + 100) + ', 50)';
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  
    // Call the render function in the next frame
    requestAnimationFrame(renderVisualizer3);
}
  
// Number of bars to use for the moving average
const smoothingFactor = 10;
let smoothedDataArray = new Array(bufferLength).fill(0);

// Function to render the visualizer
function renderVisualizer4() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get the current time domain data
  analyser.getByteTimeDomainData(dataArray);

  // Apply moving average smoothing
  for (let i = 0; i < bufferLength; i++) {
    smoothedDataArray[i] += (dataArray[i] - 128) / 128;
    if (i >= smoothingFactor) {
      smoothedDataArray[i] -= (dataArray[i - smoothingFactor] - 128) / 128;
    }
    smoothedDataArray[i] /= smoothingFactor;
  }

  // Calculate bar width
  const barWidth = canvas.width / bufferLength;

  // Draw the bars based on the smoothed data
  for (let i = 0; i < bufferLength; i++) {
    // Calculate the pitch (frequency) using the index
    const pitch = (i / bufferLength) * audioContext.sampleRate;

    // Calculate the bar height based on the pitch and smoothed data
    const barHeight = Math.abs(smoothedDataArray[i]) * canvas.height;

    const x = i * barWidth;
    const y = canvas.height - barHeight;

    ctx.fillStyle = 'rgb(50, ' + (barHeight * 50) + ', 50)';
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  // Call the render function in the next frame
  requestAnimationFrame(renderVisualizer4);
}



 // Helper function to convert HSB color to RGB
 function hsbToRgb(h, s, br) {
    h /= 60;
    s /= 100;
    br /= 100;
  

    const i = Math.floor(h);
    const f = h - i;
    const p = br * (1 - s);
    const q = br * (1 - s * f);
    const t = br * (1 - s * (1 - f));
  
    let r, g, b;
    if (i === 0) {
      [r, g, b] = [br, t, p];
    } else if (i === 1) {
      [r, g, b] = [q, br, p];
    } else if (i === 2) {
      [r, g, b] = [p, br, t];
    } else if (i === 3) {
      [r, g, b] = [p, q, br];
    } else if (i === 4) {
      [r, g, b] = [t, p, br];
    } else {
      [r, g, b] = [br, p, q];
    }
  
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

// Function to render the visualizer
function renderVisualizer5() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Get the current frequency data
    analyser.getByteFrequencyData(dataArray);
  
    // Calculate bar width
    const barWidth = canvas.width / bufferLength;
  
    // Define initial color values
    let hue = 0;
    let saturation = 100;
  
    // Draw the bars
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] * (canvas.height / 255);
  
      // Adjust brightness based on bar height
      const brightness = Math.min(100 + barHeight, 100);
  
      // Convert HSB color to RGB
      const rgbColor = hsbToRgb(hue, saturation, brightness);
  
      const x = i * barWidth;
      const y = canvas.height - barHeight;
  
      ctx.fillStyle = 'rgb(' + rgbColor.join(', ') + ')';
      ctx.fillRect(x, y, barWidth, barHeight);
  
      // Update color values
      hue = (hue + 1) % 360;
    }
  
    // Call the render function in the next frame
    requestAnimationFrame(renderVisualizer5);
}
  
 // Set the desired number of bars
const numBars = 30;
const bufferLength2 = numBars;

// Function to render the visualizer
function renderVisualizer6() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get the current frequency data
  analyser.getByteFrequencyData(dataArray);

  // Calculate bar width
  const barWidth = canvas.width / numBars;

  // Define initial color values
  let hue = 0;
  let saturation = 100;

  // Draw the bars
  for (let i = 0; i < numBars; i++) {
    const dataIndex = Math.floor(i * (bufferLength2 / numBars));
    const barHeight = dataArray[dataIndex] * (canvas.height / 255);

    // Adjust brightness based on bar height
    const brightness = Math.min(100 + barHeight, 100);

    // Convert HSB color to RGB
    const rgbColor = hsbToRgb(hue, saturation, brightness);

    const x = i * barWidth;
    const y = canvas.height - barHeight;

    ctx.fillStyle = 'rgb(' + rgbColor.join(', ') + ')';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Update color values
    hue = (hue + 1) % 360;
  }

  // Call the render function in the next frame
  requestAnimationFrame(renderVisualizer6);
}

  



// Start the audio playback
audioElement.play();

// Start rendering the visualizer
// renderVisualizer();
// renderVisualizer2();
// renderVisualizer3();
// renderVisualizer4();
// renderVisualizer5();
renderVisualizer6();