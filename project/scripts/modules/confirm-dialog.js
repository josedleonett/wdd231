class ConfirmDialog {
    constructor() {
        this.dialog = document.getElementById('confirmation-dialog');
        this.title = document.getElementById('dialog-title');
        this.message = document.getElementById('dialog-message');
        this.cancelBtn = document.getElementById('dialog-cancel');
        this.confirmBtn = document.getElementById('dialog-confirm');
        
        this.resolvePromise = null;
        this.init();
    }

    init() {
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.cancel());
        }

        if (this.confirmBtn) {
            this.confirmBtn.addEventListener('click', () => this.confirm());
        }

        if (this.dialog) {
            this.dialog.addEventListener('cancel', () => this.cancel());
        }
    }

    show(options = {}) {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
            
            if (this.title) {
                this.title.textContent = options.title || 'Confirm Action';
            }
            
            if (this.message) {
                this.message.textContent = options.message || 'Are you sure you want to proceed?';
            }
            
            if (this.confirmBtn) {
                this.confirmBtn.textContent = options.confirmText || 'Confirm';
                this.confirmBtn.className = `dialog-btn ${options.type || 'primary'}`;
            }
            
            if (this.cancelBtn) {
                this.cancelBtn.textContent = options.cancelText || 'Cancel';
            }
            
            if (this.dialog) {
                this.dialog.showModal();
                this.confirmBtn?.focus();
            }
        });
    }

    confirm() {
        if (this.dialog) {
            this.dialog.close();
        }
        if (this.resolvePromise) {
            this.resolvePromise(true);
            this.resolvePromise = null;
        }
    }

    cancel() {
        if (this.dialog) {
            this.dialog.close();
        }
        if (this.resolvePromise) {
            this.resolvePromise(false);
            this.resolvePromise = null;
        }
    }
}

export default ConfirmDialog;
