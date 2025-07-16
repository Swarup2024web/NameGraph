let chart = null;
let animationInterval = null;
let currentIndex = 0;
let animationPaused = false;
let xFull = [];
let yFull = [];
let colorHue = 0;

function generateCurveFromName(name, x) {
  const codes = Array.from(name).map(c => c.charCodeAt(0));
  let y = 0;
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    if (i % 2 === 0) {
      y += Math.sin(x * code / 50);
    } else {
      y += Math.cos(x * code / 50);
    }
  }
  return y;
}

function plotNameCurve() {
  const name = document.getElementById('nameInput').value.trim();
  const xStart = parseFloat(document.getElementById('xStart').value);
  const xEnd = parseFloat(document.getElementById('xEnd').value);
  const step = 0.1;

  if (!name || isNaN(xStart) || isNaN(xEnd) || xStart >= xEnd) {
    alert("Please enter a valid name and range!");
    return;
  }

  if (animationInterval) clearInterval(animationInterval);
  animationPaused = false;
  currentIndex = 0;
  colorHue = 0;
  xFull = [];
  yFull = [];

  for (let x = xStart; x <= xEnd; x += step) {
    const y = generateCurveFromName(name, x);
    xFull.push(x);
    yFull.push(y);
  }

  const ctx = document.getElementById('graphCanvas').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: `Graph of "${name}"`,
        data: [],
        borderColor: `hsl(${colorHue}, 100%, 60%)`,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        x: { title: { display: true, text: 'x' }, ticks: { color: '#fff' } },
        y: { title: { display: true, text: 'y' }, ticks: { color: '#fff' } }
      },
      plugins: {
        legend: { labels: { color: '#fff' } }
      }
    }
  });

  startNameCurveAnimation();
}

function startNameCurveAnimation() {
  const speed = parseInt(document.getElementById('speedSlider').value);
  const delay = 110 - speed;

  animationInterval = setInterval(() => {
    if (!animationPaused && currentIndex < xFull.length) {
      chart.data.labels.push(xFull[currentIndex]);
      chart.data.datasets[0].data.push(yFull[currentIndex]);

      colorHue = (colorHue + 3) % 360;
      chart.data.datasets[0].borderColor = `hsl(${colorHue}, 100%, 60%)`;

      chart.update();
      currentIndex++;
    }

    if (currentIndex >= xFull.length) {
      clearInterval(animationInterval);
    }
  }, delay);
}
