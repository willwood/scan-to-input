# Scan-To-Input

**Scan-To-Input** is a lightweight JavaScript plugin that detects input from most _plug-and-play_ USB and Bluetooth hardware barcode or QR code scanners — which emulate keyboard input — and intelligently captures the scanned data into specified HTML form fields.

In other words, it captures a scanned QR or barcode, and passes the value into an HTML `<input>` form element.

It is designed to be simple, extensible, and integration-friendly, making it ideal for a wide range of projects including inventory management, eCommerce systems, research tools, and scientific data collection platforms, like [EnvLog](https://github.com/willwood/EnvLog).

## Why This Plugin?

Most barcode and QR code scanners behave like **keyboard input devices**: they "type" the scanned data into whatever field is focused, usually at very high speed. This presents a challenge:

- The web browser can’t distinguish between fast keystrokes from a **scanner** and a fast typist.
- There’s often **no physical button press** to initiate or end a scan.
- Default behaviour may lead to scanned data being inserted into the wrong field or interfering with user interaction.

Scan-To-Input solves this by detecting:

- **Rapid keystroke sequences**
- **Alphanumeric patterns typical of barcodes**
- And intelligently **redirecting the scanned value** into a defined set of form fields.

## Features

- 🧩 Detects scanner-like input automatically (no need for hardware integration)
- 🔄 Configurable input targeting: overwrite a single field or fill successive empty inputs
- 🧼 Includes optional **clear buttons** next to inputs
- 🔒 Supports custom REGEX **validation logic** (e.g. barcode format checks)
- 📦 Zero dependencies — no jQuery or frameworks required
- 🧪 Extendable via callback hooks (`onScan`)
- 🎯 Optimised for Bootstrap styling but CSS-agnostic

## Scanner Compatibility

Scan-To-Input is designed to work with **most USB and Bluetooth barcode or QR code scanners** that emulate keyboard input — which is the default mode for the vast majority of modern scanners.

The Inateck BCST-23 has proven reliable for scanning both **standard barcodes** (EAN-13, UPC-A, Code 128, etc.) and **2D QR codes** on macOS Sequoia (14.x) and Linux Mint 22.1, in both USB and Bluetooth (BLE/SPP) modes.

Because Scan-To-Input listens for **keyboard-like character input patterns**, it does not need to communicate directly with scanner hardware. This means:

- No drivers or special libraries required.
- Works on virtually any OS (Windows, macOS, Android, Linux, ChromeOS).
- Compatible with browsers that support standard DOM events (Chrome, Firefox, Safari, Edge).

As long as the scanner:

- Emulates keyboard input (also known as HID mode)
- Outputs plain alphanumeric characters

…it should work out of the box.

---

⚠️ Limitations to be aware of...

- Some **basic 1D barcode scanners** do not support QR codes or Data Matrix formats. These typically work only with traditional barcodes (e.g. UPC, EAN).
- Scanners configured to use **serial (COM) mode** instead of HID/keyboard mode will not be compatible without additional drivers or bridging software.
- Certain mobile scanners or camera-based scanning libraries (e.g. using `getUserMedia`) are not currently supported, as they do not emit keystrokes.

---

To ensure best results:

- Configure your scanner to **append an Enter or Tab** character after each scan if supported (optional but helpful).
- Avoid browser input fields that may be auto-focussed or auto-corrected — these can interfere with raw input capture.
- On macOS, ensure the scanner is paired in **keyboard mode**, not serial or “other device” mode.

If your scanner isn't working, try testing it in a plain text editor. If it "types" the barcode characters rapidly into the document, it should be compatible with this plugin.

## Demos

You’ll find working examples in the `/docs/` folder. These are designed to demonstrate real-world use cases using basic HTML and Bootstrap 5 styling.

| Filename                | Description                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **basic-test.html**     | 🧪 _Basic usage demo_ – This is the recommended starting point. It shows how ScanDetect.js captures barcode or QR input and populates a single input field. Ideal for quick scanning into a form.         |
| **isbn-opener.html**    | 📖 _Book lookup via ISBN_ – Demonstrates how to validate ISBN-10/13 and redirect users to a matching book on [Open Library](https://openlibrary.org). Useful for libraries, education, or research tools. |
| **inventory-list.html** | 📦 _Dynamic inventory builder_ – Adds a new row each time a valid barcode is scanned. Ideal for inventory tracking, stocktaking, or scanning items into a basket or manifest.                             |

You will need a USB or Bluetooth barcode scanner to test these examples. The [Inateck BCST-23](https://www.amazon.co.uk/Inateck-Wireless-Bluetooth-Handheld-BCST-21/dp/B0CJJ49MY1?crid=3V80IYLOP1MG&dib=eyJ2IjoiMSJ9.e_nyHBpEgo-FbtjQtGj38rrTkmSHFtP6U9gC6sB3_7M2iyLBSscZa794XXRwOgVoVT3o3BoHewFMu4qK8M34LyLDpBxKM_WiECnWopWsxJV_LyA_eOPiFEgjzndkY27470dAWi9aSY-JSm-Y_IC8D8KWIS8J5goYdk31Vlq9ZiAXzygWnCktyuJ0k1wFRkejD2YBZqsUk_kYn_MqkYPy9sfL_sd_V0-_iKQRVRZ4eAM.pS3ovzIhYhN6JKnhq3C6k6_lIGJSRI8hNX10v696TbU&dib_tag=se&keywords=bar%2Bcode%2Bscanner&qid=1750757594&sprefix=bar%2Bcode%2Bscanner%2Caps%2C88&sr=8-17&th=1) in one such example that works with this plugin, in both USB and

## Installation

Simply include the script in your page:

```html
<script src="scan-to-input.js"></script>
```

Then initialise the scanner detection:

```html
<script>
  const scanner = new ScanDetect({
    mode: 'append',
    onScan: (value, input) => {
      console.log('Scanned:', value);
    },
    validation: (code) => /^[A-Z0-9\-]{4,}$/.test(code),
  });
</script>
```

Give an HTML input box a `data` attribute of `data-scan-box` and optionally include a cancel button with an attribute of `data-scan-remove` to reset the input box:

```html
<div class="position-relative mb-3">
  <input type="text" class="form-control rounded-end" data-scan-box />
  <button
    type="button"
    class="btn btn-link text-decoration-none"
    data-scan-remove
  >
    &times;
  </button>
</div>
```

## Configuration Options

| Option                | Type                        | Default                | Description                                                                                    |
| --------------------- | --------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| `scanThreshold`       | `number`                    | `50`                   | Maximum milliseconds allowed between keystrokes to qualify as a scan.                          |
| `minLength`           | `number`                    | `3`                    | Minimum number of characters to trigger a scan. Prevents short accidental inputs.              |
| `inputSelector`       | `string`                    | `"[data-scan-box]"`    | CSS selector for target input fields.                                                          |
| `clearButtonSelector` | `string`                    | `"[data-scan-remove]"` | Selector for buttons that clear the associated input.                                          |
| `mode`                | `"overwrite"` or `"append"` | `"overwrite"`          | - `overwrite`: Replace the value in the first input<br>- `append`: Fill the next empty input   |
| `onScan`              | `function`                  | `null`                 | Callback called when a scan is detected. Receives `(value, input)` as arguments.               |
| `validation`          | `function`                  | `null`                 | Optional function to validate scanned input before inserting. Should return `true` or `false`. |

## Contributing

Contributions are very welcome!

If you'd like to improve functionality, tweak the documentation, add new demos, fix a bug, or suggest enhancements, feel free to:

- Fork the repository
- Create a new branch for your changes
- Submit a pull request with a clear explanation

Please aim for clear, accessible code and include comments or documentation where useful. Bug reports and feature requests are also appreciated — just open an issue on the GitHub repository. Improvements of benefit to other users will be given greater weighting.

## Licence

This project is open source and available under the **MIT Licence**.

You are free to use, modify, distribute, and incorporate this code in personal or commercial projects, provided that:

- The original licence and copyright notice remain.
- No warranty is provided, and usage is at your own risk.

See [`LICENSE`](./LICENSE) for full terms.
