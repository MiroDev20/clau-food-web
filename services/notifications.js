export function showToast(message, type = 'info', duration = 3500) {
    // Remove existing toasts to avoid stacking
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger reflow for animation
    requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
    });

    // Auto remove after duration
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

export function showSuccessToast(message) {
    showToast(message, 'success');
}

export function showErrorToast(message) {
    showToast(message, 'error');
}

export function showWarningToast(message) {
    showToast(message, 'warning');
}