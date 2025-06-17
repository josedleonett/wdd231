class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.overlay = this.modal?.closest('.modal-overlay');
        this.isOpen = false;
        
        if (this.modal && this.overlay) {
            this.init();
        }
    }

    init() {
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('hidden');
        this.overlay.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.isOpen = true;

        const firstFocusable = this.modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        this.isOpen = false;

        document.body.style.overflow = '';

        setTimeout(() => {
            this.overlay.classList.add('hidden');
        }, 300);
    }

    setContent(content) {
        const body = this.modal.querySelector('.modal-body');
        if (body && content) {
            body.innerHTML = content;
        }
    }

    setTitle(title) {
        const titleElement = this.modal.querySelector('#modal-title');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }
}

export default Modal;
