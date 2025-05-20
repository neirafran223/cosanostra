// static/js/notification.js
function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const iconMap = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <span class="notification-icon">${iconMap[type] || iconMap.success}</span>
    <span class="notification-message">${message}</span>
    <span class="notification-close" onclick="this.parentElement.remove()">×</span>
  `;
  
  document.body.appendChild(notification);
  
  // Forzar reflow para activar la transición
  void notification.offsetWidth;
  
  notification.classList.add('show');
  
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
  
  return notification;
}