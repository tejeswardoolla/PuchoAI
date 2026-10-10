# ✨ PuchoAI — Just Pucho. Get Clarity.

**Your AI assistant, one shortcut away. 🚀**

Why switch tabs every time you need an explanation?
PuchoAI brings a lightweight, Gemini-powered AI chat panel directly to your browser, helping you understand concepts, explore ideas, debug code, and learn faster — without interrupting your workflow.

💬 Got a question? **Bas PuchoAI se pucho!**

## 🌟 What Makes PuchoAI Different?
- **⚡ Quick Access** — Open your floating assistant with a keyboard shortcut.
- **🪟 Floating Chat UI** — Ask questions without leaving your current webpage.
- **🎨 Customizable Appearance** — Adjust the panel's size and transparency.
- **🧠 Gemini-Powered Answers** — Get explanations, ideas, and coding help through Google's Gemini API.
- **📋 Copy Answers** — Copy responses for notes, study material, or your projects.
- **🌙 Minimal Dark UI** — A sleek interface designed to keep your workspace uncluttered.
- **🔑 Your Own API Key** — Configure your personal Gemini API key through the extension settings.
- **💾 Local Settings** — Store your key in the browser's `chrome.storage.local`.

## 🎯 What Can You Use It For?

| Use case | How PuchoAI helps |
| --- | --- |
| 📚 **Learning** | Break down difficult concepts into simple explanations. |
| 💻 **Coding** | Understand errors, algorithms, and code snippets. |
| 📝 **Revision** | Summarize concepts and create practice questions. |
| 🔍 **Research** | Explore ideas and clarify unfamiliar terminology. |
| 💡 **Productivity** | Brainstorm ideas without constantly switching tabs. |

*Less tab switching. More understanding.*

## ⚙️ Installation
PuchoAI can be installed locally in Chrome using Developer Mode.
1. Download or clone this repository.
2. Open `chrome://extensions/` in Google Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the downloaded PuchoAI project folder.
6. Open the extension's options page and configure your own Gemini API key.
7. Visit a normal webpage and use the configured keyboard shortcut to open the assistant.

That's it! 🎉

## 🔐 API Key Setup
PuchoAI uses the Google Gemini API to generate responses.
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Obtain your own Gemini API key.
3. Open PuchoAI's extension options.
4. Enter your key, select a supported model, and save your settings.

**Security notes:**
- Never commit your personal API key to GitHub.
- The extension stores the configured key in `chrome.storage.local`.
- Local browser storage is not a secure vault against someone who can access your browser profile or inspect the extension.
- API availability, quotas, and pricing depend on Google's current terms and your account.
- This project is intended for personal productivity and learning. Follow the rules of your school, workplace, or examination environment.

## 🛠️ Tech Stack
- JavaScript
- HTML5
- CSS3
- Chrome Extensions — Manifest V3
- Google Gemini API
- Chrome Storage API

## 📂 Project Structure
```text
PuchoAI/
├── manifest.json
├── background.js
├── content.js
├── content.css
├── api.js
├── options.html
├── options.css
├── options.js
├── popup.html
├── popup.css
├── popup.js
├── marked.min.js
├── .gitignore
└── README.md
```

## 🗺️ Roadmap
- [ ] Smarter webpage text selection and explanations
- [ ] Improved conversation management
- [ ] Additional customization options
- [ ] Better error messages and API diagnostics
- [ ] More study and productivity tools

Have an idea? Contributions and suggestions are welcome!

## 🤝 Contributing
Found a bug or have an improvement in mind?
1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request with a clear explanation.

## ⚠️ Disclaimer
PuchoAI is an independent, community-developed project and is not affiliated with or endorsed by Google. Gemini is a Google product. AI-generated answers can be inaccurate, so verify important information.

## ⭐ Support the Project
If PuchoAI makes your workflow easier, consider giving the repository a ⭐ on GitHub.

**PuchoAI — Your browser. Your questions. Your AI assistant.**
*Built with curiosity, powered by Gemini. 🚀*
