# Gemini Assistant Chrome Extension

A sleek, lightweight Chrome Extension powered by Google's Gemini API that provides a floating AI assistant seamlessly integrated into any webpage.

## Features
- **Spotlight-Style UI:** Pops up right in the center of your screen with a gorgeous dark/light theme.
- **Draggable & Resizable:** Drag the header to move it around, and use the bottom-right corner to resize.
- **Theme Toggle:** Instantly switch between Light and Dark mode with the sun/moon icon.
- **Transparency Control:** Adjust the slider to see the underlying webpage while you chat.
- **Markdown Support:** The assistant formats code, links, and text beautifully.
- **Copy Answer:** Easily copy the AI's response to your clipboard with a single click.
- **Privacy-First:** Your API key is stored locally in Chrome and is never transmitted anywhere except directly to Google's official Gemini endpoint.

## Installation

Since this extension is not currently published on the Chrome Web Store, you can easily install it as an "Unpacked Extension" directly from this source code.

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the folder containing this project.
6. The Gemini Assistant extension will now appear in your list of extensions!

## Configuration (API Key)

To use the assistant, you need to provide your own Gemini API key.

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. In Chrome, click the puzzle piece icon (Extensions) in the top right.
3. Find **Gemini Assistant** and click the three dots (`⋮`) next to it, then select **Options**.
4. Paste your API key into the configuration page and select your preferred model (e.g., Gemini 3.8 Flash).
5. Click **Save Settings**.

Your API key is securely saved locally in your browser (`chrome.storage.local`).

## Usage

- Press **Alt+B** (or your configured shortcut) on any webpage to open the Gemini floating panel.
- Type your question or prompt into the input field and hit **Enter**.
- Use the minimize (`-`), close (`X`), theme, and transparency controls located in the header to customize the view.

## Security & Privacy Notice

- **No Hardcoded Secrets:** This repository does not contain any hardcoded API keys.
- **.gitignore:** We use a `.gitignore` file to ensure local secrets (like `.env`) are never accidentally pushed.
- **Direct API Calls:** The extension communicates directly with Google's APIs. No middleman servers intercept your data.

## License
MIT License
