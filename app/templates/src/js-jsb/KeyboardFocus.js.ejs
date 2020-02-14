import logging from 'node-logging-js';

/**
 * apply class `keyboard-focus` to dom element if user navigates via keyboard
 *
 * Usage:
 *
 * KeyboardFocus.initialize(element = document.documentElement);
 */
class KeyboardFocus {

    isInitialized = false

    element = null

    constructor() {
        logging.applyLogging(this, 'KeyboardFocus', false);
    }

    /**
     * enable keyboard navigation detection
     *
     * @param {HTMLElement} element - DOM Element that gets the modifier class
     */
    initialize(element = document.documentElement) {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.element = element;
            element.addEventListener('keydown', this.onKeydown);
            this.logDebug('initialized');
        }
    }

    /**
     * disable keyboard navigation detection
     */
    off() {
        if (this.isInitialized) {
            this.element.classList.remove('keyboard-focus');
            this.element.removeEventListener('keydown', this.onKeydown);
            this.element.removeEventListener('mousemouve', this.onMouseMove);
            this.logDebug('disabled');
        }
    }

    onKeydown = (event) => {
        if (event.keyCode !== 9) {
            return;
        }

        this.element.classList.add('keyboard-focus');
        this.element.addEventListener('mousemove', this.onMouseMove);
        this.element.removeEventListener('keydown', this.onKeydown);
    }

    onMouseMove = () => {
        this.element.classList.remove('keyboard-focus');
        this.element.addEventListener('keydown', this.onKeydown);
        this.element.removeEventListener('mousemouve', this.onMouseMove);
    }
}

export default new KeyboardFocus();
