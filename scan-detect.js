class ScanToInput {
  constructor(options = {}) {
    const defaults = {
      scanThreshold: 50, // ms between characters to qualify as scan
      minLength: 3, // ignore short accidental inputs
      inputSelector: '[data-scan-box]',
      clearButtonSelector: '[data-scan-remove]',
      mode: 'overwrite', // or 'append'
      onScan: null, // optional callback
      validation: null, // optional function(value) => boolean
    };
    this.config = { ...defaults, ...options };
    this.buffer = '';
    this.lastCharTime = 0;
    this.scanTimeout = null;

    this.scanToInputInit();
  }

  scanToInputInit() {
    document.addEventListener('keydown', (e) =>
      this.scanToInputHandleKeydown(e)
    );
    document
      .querySelectorAll(this.config.clearButtonSelector)
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const input = btn
            .closest('.input-group')
            ?.querySelector(this.config.inputSelector);
          if (input) input.value = '';
          if (input) input.classList.remove('is-valid');
        });
      });
  }

  scanToInputHandleKeydown(event) {
    const now = Date.now();
    const char = event.key;

    if (char.length === 1 && /^[\w\d-]$/i.test(char)) {
      const isFast = now - this.lastCharTime < this.config.scanThreshold;
      this.lastCharTime = now;

      if (isFast || this.buffer.length === 0) {
        this.buffer += char;
        clearTimeout(this.scanTimeout);

        this.scanTimeout = setTimeout(() => {
          if (this.buffer.length >= this.config.minLength) {
            this.scanToInputProcessScan(this.buffer);
          }
          this.buffer = '';
        }, this.config.scanThreshold * 2);
      } else {
        this.buffer = '';
      }
    }
  }

  scanToInputProcessScan(code) {
    if (this.config.validation && !this.config.validation(code)) return;

    const inputs = Array.from(
      document.querySelectorAll(this.config.inputSelector)
    );
    let target = null;

    if (this.config.mode === 'overwrite') {
      target = inputs[0];
    } else {
      target = inputs.find((el) => !el.value);
    }

    if (target) {
      target.value = code;
      target.dispatchEvent(new Event('input'));
    }

    if (typeof this.config.onScan === 'function') {
      this.config.onScan(code, target);
    }
  }
}
