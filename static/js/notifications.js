// static/js/notifications.js
class Notifier {
  constructor() {
    this.setupContainer();
    this.notificationId = 0;
  }

  setupContainer() {
    this.container = document.getElementById('notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 5000) {
    this.notificationId++;
    const notificationId = `notification-${this.notificationId}`;
    
    const notification = document.createElement('div');
    notification.id = notificationId;
    notification.className = `notification ${type}`;
    
    const icon = this.getIcon(type);
    notification.innerHTML = `${icon}<span>${message}</span>`;
    
    this.container.appendChild(notification);

    // Forzar reflow para activar la animación
    void notification.offsetWidth;
    
    notification.classList.add('show');

    // Eliminar después de la duración especificada
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          this.container.removeChild(notification);
        }
      }, 300);
    }, duration);

    // Cierre manual al hacer click
    notification.addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          this.container.removeChild(notification);
        }
      }, 300);
    });
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return `<span class="notification-icon">${icons[type]}</span>`;
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

const notifier = new Notifier();
export default notifier;