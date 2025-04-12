/**
 * Dashboard functionality for MCP Admin Console
 */

/**
 * Show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getIconForType(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Style the notification
  notification.style.backgroundColor = getColorForType(type);
  notification.style.color = '#fff';
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '4px';
  notification.style.marginBottom = '10px';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.display = 'flex';
  notification.style.justifyContent = 'space-between';
  notification.style.alignItems = 'center';
  notification.style.minWidth = '300px';
  notification.style.maxWidth = '400px';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';

  // Add close button functionality
  const closeButton = notification.querySelector('.notification-close');
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = '#fff';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.style.marginLeft = '10px';

  closeButton.addEventListener('click', () => {
    removeNotification(notification);
  });

  // Add to container
  container.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
}

/**
 * Remove a notification with animation
 * @param {HTMLElement} notification - The notification element to remove
 */
function removeNotification(notification) {
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';

  setTimeout(() => {
    notification.remove();
  }, 300);
}

/**
 * Get the appropriate icon for the notification type
 * @param {string} type - The notification type
 * @returns {string} The Font Awesome icon class
 */
function getIconForType(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    case 'info': return 'fa-info-circle';
    default: return 'fa-info-circle';
  }
}

/**
 * Get the appropriate color for the notification type
 * @param {string} type - The notification type
 * @returns {string} The color code
 */
function getColorForType(type) {
  switch (type) {
    case 'success': return '#28a745';
    case 'error': return '#dc3545';
    case 'warning': return '#ffc107';
    case 'info': return '#17a2b8';
    default: return '#17a2b8';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Format numbers with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Format file sizes
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Format durations
  function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Error boundary function to safely execute code
   * @param {Function} fn - The function to execute
   * @param {any} fallbackValue - The value to return if an error occurs
   * @param {string} errorMessage - The error message to display
   * @returns {any} The result of the function or the fallback value
   */
  function errorBoundary(fn, fallbackValue, errorMessage = 'An error occurred') {
    try {
      return fn();
    } catch (error) {
      console.error(errorMessage, error);
      showNotification(errorMessage, 'error');
      return fallbackValue;
    }
  }

  // Update dashboard stats with error boundaries
  function updateDashboardStats(data) {
    // Update model stats with error boundary
    if (data.modelStats) {
      errorBoundary(() => {
        document.getElementById('totalModels').textContent = data.modelStats.totalModels;
        document.getElementById('newModels').textContent = data.modelStats.modelsCreatedLast30Days;
        document.getElementById('totalParameters').textContent = formatNumber(data.modelStats.totalParameters) + 'B';
        document.getElementById('updatedModels').textContent = data.modelStats.modelsUpdatedLast7Days;
      }, null, 'Error updating model stats');
    }

    // Update user stats with error boundary
    if (data.userStats) {
      errorBoundary(() => {
        document.getElementById('totalUsers').textContent = data.userStats.totalUsers;
        document.getElementById('adminUsers').textContent = data.userStats.usersByRole.admin || 0;
        document.getElementById('activeUsers').textContent = data.userStats.activeUsers;
        document.getElementById('newUsers').textContent = data.userStats.newUsersLast30Days;
      }, null, 'Error updating user stats');
    }

    // Update system stats with error boundary
    if (data.systemStats) {
      errorBoundary(() => {
        // Update CPU usage
        const cpuUsage = document.getElementById('cpuUsage');
        if (cpuUsage) {
          const cpuPercent = Math.round(data.systemStats.cpuUsage);
          cpuUsage.style.width = `${cpuPercent}%`;
          cpuUsage.textContent = `${cpuPercent}%`;
          cpuUsage.setAttribute('title', `CPU Usage: ${cpuPercent}%`);
        }

        // Update memory usage
        const memoryUsage = document.getElementById('memoryUsage');
        if (memoryUsage) {
          const memoryPercent = Math.round((data.systemStats.memoryUsage.used / data.systemStats.memoryUsage.total) * 100);
          memoryUsage.style.width = `${memoryPercent}%`;
          memoryUsage.textContent = `${memoryPercent}%`;
          memoryUsage.setAttribute('title', `Memory Usage: ${memoryPercent}%`);
        }

        // Update uptime
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
          uptimeElement.textContent = formatDuration(data.systemStats.uptime);
        }

        // Update DB size
        const dbSizeElement = document.getElementById('dbSize');
        if (dbSizeElement) {
          dbSizeElement.textContent = formatFileSize(data.systemStats.databaseSize);
        }

        // Update last backup time
        if (data.systemStats.lastBackupTime) {
          const lastBackupElement = document.getElementById('lastBackup');
          if (lastBackupElement) {
            const lastBackupDate = new Date(data.systemStats.lastBackupTime);
            const now = new Date();
            const diffDays = Math.floor((now - lastBackupDate) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
              lastBackupElement.textContent = 'Today';
            } else if (diffDays === 1) {
              lastBackupElement.textContent = 'Yesterday';
            } else {
              lastBackupElement.textContent = `${diffDays} days ago`;
            }
          }
        }
      }, null, 'Error updating system stats');
    }

    // Update recent models table with error boundary
    if (data.recentModels && data.recentModels.length > 0) {
      errorBoundary(() => {
        const recentModelsTable = document.getElementById('recentModelsTable');
        if (recentModelsTable) {
          recentModelsTable.innerHTML = '';

          data.recentModels.forEach(model => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = model.name || 'Unknown';
            row.appendChild(nameCell);

            const providerCell = document.createElement('td');
            providerCell.textContent = model.provider || 'Unknown';
            row.appendChild(providerCell);

            const parametersCell = document.createElement('td');
            parametersCell.textContent = model.parameters ? formatNumber(model.parameters) : 'N/A';
            row.appendChild(parametersCell);

            const createdCell = document.createElement('td');
            if (model.createdAt) {
              try {
                const createdDate = new Date(model.createdAt);
                const now = new Date();
                const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                  createdCell.textContent = 'Today';
                } else if (diffDays === 1) {
                  createdCell.textContent = 'Yesterday';
                } else {
                  createdCell.textContent = `${diffDays} days ago`;
                }
              } catch (e) {
                createdCell.textContent = 'Invalid date';
              }
            } else {
              createdCell.textContent = 'N/A';
            }
            row.appendChild(createdCell);

            recentModelsTable.appendChild(row);
          });
        }
      }, null, 'Error updating recent models table');
    }

    // Update recent users table with error boundary
    if (data.recentUsers && data.recentUsers.length > 0) {
      errorBoundary(() => {
        const recentUsersTable = document.getElementById('recentUsersTable');
        if (recentUsersTable) {
          recentUsersTable.innerHTML = '';

          data.recentUsers.forEach(user => {
            const row = document.createElement('tr');

            const usernameCell = document.createElement('td');
            usernameCell.textContent = user.username || 'Unknown';
            row.appendChild(usernameCell);

            const roleCell = document.createElement('td');
            const roleBadge = document.createElement('span');
            roleBadge.className = `badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`;
            roleBadge.textContent = user.role || 'user';
            roleCell.appendChild(roleBadge);
            row.appendChild(roleCell);

            const createdCell = document.createElement('td');
            if (user.createdAt) {
              try {
                const createdDate = new Date(user.createdAt);
                const now = new Date();
                const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                  createdCell.textContent = 'Today';
                } else if (diffDays === 1) {
                  createdCell.textContent = 'Yesterday';
                } else {
                  createdCell.textContent = `${diffDays} days ago`;
                }
              } catch (e) {
                createdCell.textContent = 'Invalid date';
              }
            } else {
              createdCell.textContent = 'N/A';
            }
            row.appendChild(createdCell);

            recentUsersTable.appendChild(row);
          });
        }
      }, null, 'Error updating recent users table');
    }

    // Update charts
    updateCharts(data);
  }

  // Update charts with new data using error boundaries
  function updateCharts(data) {
    // Update Models by Provider chart with error boundary
    if (data.modelStats && data.modelStats.modelsByProvider) {
      errorBoundary(() => {
        const modelsByProviderData = data.modelStats.modelsByProvider;
        if (typeof updateModelsByProviderChart === 'function') {
          updateModelsByProviderChart(modelsByProviderData);
        }
      }, null, 'Error updating Models by Provider chart');
    }

    // Update Users by Role chart with error boundary
    if (data.userStats && data.userStats.usersByRole) {
      errorBoundary(() => {
        const usersByRoleData = data.userStats.usersByRole;
        if (typeof updateUsersByRoleChart === 'function') {
          updateUsersByRoleChart(usersByRoleData);
        }
      }, null, 'Error updating Users by Role chart');
    }
  }

  // Sample dashboard data for testing
  const sampleData = {
    modelStats: {
      totalModels: 3,
      modelsByProvider: {
        'OpenAI': 1,
        'Anthropic': 1,
        'Meta': 1
      },
      totalParameters: 445000000000,
      averageParameters: 148333333333,
      modelsCreatedLast30Days: 3,
      modelsUpdatedLast7Days: 1
    },
    userStats: {
      totalUsers: 2,
      usersByRole: {
        'admin': 1,
        'user': 1
      },
      activeUsers: 2,
      newUsersLast30Days: 2
    },
    systemStats: {
      uptime: 3600, // 1 hour in seconds
      memoryUsage: {
        total: 16 * 1024 * 1024 * 1024, // 16 GB
        used: 4 * 1024 * 1024 * 1024,   // 4 GB
        free: 12 * 1024 * 1024 * 1024   // 12 GB
      },
      cpuUsage: 25, // 25%
      databaseSize: 50 * 1024 * 1024, // 50 MB
      lastBackupTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    recentModels: [
      {
        id: '1',
        name: 'GPT-4',
        provider: 'OpenAI',
        parameters: 175000000000,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: '2',
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        parameters: 200000000000,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        id: '3',
        name: 'Llama 3 70B',
        provider: 'Meta',
        parameters: 70000000000,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ],
    recentUsers: [
      {
        id: '1',
        username: 'admin',
        role: 'admin',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        id: '2',
        username: 'user',
        role: 'user',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    ],
    timestamp: new Date()
  };

  // Initialize dashboard with sample data
  updateDashboardStats(sampleData);

  // Handle refresh button click
  const refreshButton = document.getElementById('refreshDashboard');
  if (refreshButton) {
    refreshButton.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.add('fa-spin');
      }
      this.disabled = true;

      // Use requestAnimationFrame for smoother animations
      let startTime = null;
      const duration = 1000; // 1 second animation

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < duration) {
          // Continue the animation
          requestAnimationFrame(animate);
        } else {
          // Animation complete, update the dashboard
          updateDashboardStats(sampleData);

          if (icon) {
            icon.classList.remove('fa-spin');
          }
          refreshButton.disabled = false;

          // Show success message
          // Using a non-blocking notification instead of alert
          showNotification('Dashboard refreshed successfully!', 'success');
        }
      }

      // Start the animation
      requestAnimationFrame(animate);
    });
  }
});
