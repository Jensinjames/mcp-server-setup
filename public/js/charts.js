/**
 * Chart rendering for MCP Admin Console
 */

// Store chart instances for later updates
let modelsByProviderChart = null;
let usersByRoleChart = null;

/**
 * Initialize a pie chart with the given data
 * @param elementId - The ID of the canvas element
 * @param data - Object containing label-value pairs
 * @param colors - Array of colors for the chart segments
 * @returns The Chart instance or null if initialization failed
 */
function initializePieChart(elementId, data, colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69']) {
  const element = document.getElementById(elementId);
  if (!element || !(element instanceof HTMLCanvasElement)) {
    console.error(`Element with ID ${elementId} not found or is not a canvas element`);
    return null;
  }

  const ctx = element.getContext('2d');
  if (!ctx) {
    console.error(`Could not get 2D context for element with ID ${elementId}`);
    return null;
  }

  // Convert object to arrays safely
  const labels = Object.keys(data);
  const values = labels.map(label => data[label]);

  // Destroy any existing chart on this canvas
  Chart.getChart(element)?.destroy();

  // Create the chart with fixed dimensions
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Changed to true to prevent infinite resizing
      plugins: {
        legend: {
          position: 'right'
        }
      },
      // Add animation options to prevent layout thrashing
      animation: {
        duration: 500 // Shorter animation to reduce layout recalculations
      },
      // Add layout options to prevent infinite resizing
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      }
    }
  });

  return chart;
}

/**
 * Update a pie chart with new data
 * @param chart - The Chart instance to update
 * @param data - Object containing label-value pairs
 * @param colors - Array of colors for the chart segments
 */
function updatePieChart(chart, data, colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69']) {
  if (!chart) {
    console.error('Cannot update chart: chart instance is null');
    return;
  }

  // Convert object to arrays safely
  const labels = Object.keys(data);
  const values = labels.map(label => data[label]);

  // Update chart data
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = colors.slice(0, labels.length);

  // Update chart options to prevent infinite resizing
  chart.options.maintainAspectRatio = true;
  chart.options.animation = {
    duration: 500 // Shorter animation to reduce layout recalculations
  };
  chart.options.layout = {
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  };

  // Update the chart with a debounce to prevent layout thrashing
  setTimeout(() => {
    chart.update('none'); // Use 'none' mode to skip animations for this update
  }, 0);
}

/**
 * Initialize all charts on the dashboard
 */
function initializeCharts() {
  // Models by Provider Chart
  const modelsByProviderData = {
    'OpenAI': 1,
    'Anthropic': 1,
    'Meta': 1
  };
  modelsByProviderChart = initializePieChart('modelsByProviderChart', modelsByProviderData);

  // Users by Role Chart
  const usersByRoleData = {
    'admin': 1,
    'user': 1
  };
  usersByRoleChart = initializePieChart('usersByRoleChart', usersByRoleData,
    ['#e74a3b', '#1cc88a', '#4e73df', '#f6c23e', '#36b9cc', '#5a5c69']);
}

/**
 * Update the Models by Provider chart with new data
 * @param data - Object containing provider-count pairs
 */
function updateModelsByProviderChart(data) {
  if (!modelsByProviderChart) {
    // If chart doesn't exist yet, initialize it
    modelsByProviderChart = initializePieChart('modelsByProviderChart', data);
  } else {
    // Otherwise update the existing chart
    updatePieChart(modelsByProviderChart, data);
  }
}

/**
 * Update the Users by Role chart with new data
 * @param data - Object containing role-count pairs
 */
function updateUsersByRoleChart(data) {
  if (!usersByRoleChart) {
    // If chart doesn't exist yet, initialize it
    usersByRoleChart = initializePieChart('usersByRoleChart', data,
      ['#e74a3b', '#1cc88a', '#4e73df', '#f6c23e', '#36b9cc', '#5a5c69']);
  } else {
    // Otherwise update the existing chart
    updatePieChart(usersByRoleChart, data,
      ['#e74a3b', '#1cc88a', '#4e73df', '#f6c23e', '#36b9cc', '#5a5c69']);
  }
}

/**
 * Handle window resize events for charts
 */
function handleResize() {
  // Use requestAnimationFrame to debounce resize events
  if (resizeTimeout) {
    cancelAnimationFrame(resizeTimeout);
  }

  resizeTimeout = requestAnimationFrame(() => {
    // Only resize if charts exist
    if (modelsByProviderChart) {
      modelsByProviderChart.resize();
    }

    if (usersByRoleChart) {
      usersByRoleChart.resize();
    }

    resizeTimeout = null;
  });
}

// Variable to store the resize timeout ID
let resizeTimeout = null;

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize charts
  initializeCharts();

  // Add resize event listener
  window.addEventListener('resize', handleResize);

  // Add error handling for Chart.js
  Chart.defaults.plugins.title.display = true;
  Chart.defaults.plugins.title.text = 'Chart Data';
  Chart.defaults.plugins.title.font = {
    weight: 'normal',
    size: 16
  };

  // Add global error handler for Chart.js
  const originalDraw = Chart.prototype.draw;
  Chart.prototype.draw = function() {
    try {
      originalDraw.apply(this, arguments);
    } catch (error) {
      console.error('Error drawing chart:', error);

      // Display error message on the canvas
      const ctx = this.ctx;
      const width = this.width;
      const height = this.height;

      ctx.save();
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#dc3545';
      ctx.font = '16px Arial';
      ctx.fillText('Error rendering chart', width / 2, height / 2 - 20);
      ctx.fillText('Check console for details', width / 2, height / 2 + 20);
      ctx.restore();

      // Show notification if available
      if (typeof showNotification === 'function') {
        showNotification('Error rendering chart. Check console for details.', 'error');
      }
    }
  };
});
