/**
 * Main JavaScript for MCP Admin Console
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function(popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Add spinning animation to refresh buttons
  const refreshButtons = document.querySelectorAll('.btn-refresh');
  refreshButtons.forEach(button => {
    button.addEventListener('click', function() {
      const icon = this.querySelector('.fa-sync-alt');
      if (icon) {
        icon.classList.add('spinning');
        setTimeout(() => {
          icon.classList.remove('spinning');
        }, 1000);
      }
    });
  });

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format file sizes
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format durations
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Apply formatters to elements with data attributes
  document.querySelectorAll('[data-format="number"]').forEach(el => {
    el.textContent = formatNumber(parseInt(el.textContent));
  });

  document.querySelectorAll('[data-format="filesize"]').forEach(el => {
    el.textContent = formatFileSize(parseInt(el.textContent));
  });

  document.querySelectorAll('[data-format="date"]').forEach(el => {
    el.textContent = formatDate(el.textContent);
  });

  document.querySelectorAll('[data-format="duration"]').forEach(el => {
    el.textContent = formatDuration(parseInt(el.textContent));
  });

  // Handle sidebar toggle on mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      document.body.classList.toggle('sidebar-toggled');
      document.querySelector('.sidebar').classList.toggle('toggled');
    });
  }

  // Close sidebar on mobile when clicking outside
  document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && sidebar.classList.contains('toggled') && !event.target.closest('.sidebar') && !event.target.closest('#sidebarToggle')) {
      document.body.classList.remove('sidebar-toggled');
      sidebar.classList.remove('toggled');
    }
  });

  // Handle form validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // Handle JSON editor formatting
  const jsonEditors = document.querySelectorAll('.json-editor');
  jsonEditors.forEach(editor => {
    editor.addEventListener('blur', function() {
      try {
        const json = JSON.parse(this.value);
        this.value = JSON.stringify(json, null, 2);
        this.classList.remove('is-invalid');
      } catch (e) {
        this.classList.add('is-invalid');
      }
    });
  });

  // Handle dashboard refresh button
  const refreshDashboard = document.getElementById('refreshDashboard');
  if (refreshDashboard) {
    refreshDashboard.addEventListener('click', function() {
      const icon = this.querySelector('i');
      if (icon) {
        icon.classList.add('spinning');
      }
      this.disabled = true;
      
      // In a real application, this would fetch updated data from the server
      setTimeout(() => {
        if (icon) {
          icon.classList.remove('spinning');
        }
        this.disabled = false;
      }, 1000);
    });
  }
});
