/**
 * TypeScript implementation of chart rendering for MCP Admin Console
 */

interface ChartData {
  [key: string]: number;
}

/**
 * Initialize a pie chart with the given data
 * @param elementId - The ID of the canvas element
 * @param data - Object containing label-value pairs
 * @param colors - Array of colors for the chart segments
 */
function initializePieChart(
  elementId: string, 
  data: ChartData, 
  colors: string[] = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69']
): void {
  const element = document.getElementById(elementId);
  if (!element || !(element instanceof HTMLCanvasElement)) {
    console.error(`Element with ID ${elementId} not found or is not a canvas element`);
    return;
  }

  const ctx = element.getContext('2d');
  if (!ctx) {
    console.error(`Could not get 2D context for element with ID ${elementId}`);
    return;
  }

  // Convert object to arrays safely
  const labels = Object.keys(data);
  const values = labels.map(label => data[label]);

  // Create the chart
  new Chart(ctx, {
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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

/**
 * Initialize all charts on the dashboard
 */
function initializeCharts(): void {
  // Models by Provider Chart
  const modelsByProviderData: ChartData = {
    'OpenAI': 1,
    'Anthropic': 1,
    'Meta': 1
  };
  initializePieChart('modelsByProviderChart', modelsByProviderData);

  // Users by Role Chart
  const usersByRoleData: ChartData = {
    'admin': 1,
    'user': 1
  };
  initializePieChart('usersByRoleChart', usersByRoleData, 
    ['#e74a3b', '#1cc88a', '#4e73df', '#f6c23e', '#36b9cc', '#5a5c69']);
}

// Initialize charts when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCharts);

// Add event listener to refresh button
document.addEventListener('DOMContentLoaded', () => {
  const refreshButton = document.getElementById('refreshDashboard');
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      // In a real application, this would fetch new data and update the charts
      alert('Dashboard refreshed!');
    });
  }
});
