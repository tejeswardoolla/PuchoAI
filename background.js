async function ensureInjectedAndSendMessage(tab, message) {
  if (!tab || !tab.id) return;
  
  // Check for restricted URLs where we can't inject
  const isRestricted = !tab.url || 
                       tab.url.startsWith('chrome://') || 
                       tab.url.startsWith('edge://') || 
                       tab.url.startsWith('about:') || 
                       tab.url.startsWith('https://chrome.google.com/webstore');

  try {
    // Try sending first (if it's already injected, this will succeed)
    await chrome.tabs.sendMessage(tab.id, message);
  } catch (err) {
    // If restricted, we can't inject. We just throw so caller can handle.
    if (isRestricted) {
      throw new Error('RESTRICTED_PAGE');
    }

    // Otherwise, try to inject the content scripts
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['marked.min.js', 'api.js', 'content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      });
      
      // Give it a tiny moment to initialize, then send the message again
      await new Promise(resolve => setTimeout(resolve, 50));
      await chrome.tabs.sendMessage(tab.id, message);
    } catch (injectErr) {
      console.warn("Failed to inject or send message:", injectErr);
      throw injectErr;
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-with-gemini",
    title: "Explain with Gemini",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "explain-with-gemini" && info.selectionText) {
    try {
      await ensureInjectedAndSendMessage(tab, {
        action: "explain-text",
        text: info.selectionText
      });
    } catch (err) {
      console.warn("Could not open Gemini for explanation:", err);
      // We could optionally show a notification here
    }
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-slider") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length > 0) {
        try {
          await ensureInjectedAndSendMessage(tabs[0], { action: "toggle-slider" });
        } catch (err) {
          console.warn("Could not toggle slider:", err);
        }
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'popup-toggle-slider') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs.length > 0) {
        try {
          await ensureInjectedAndSendMessage(tabs[0], { action: "toggle-slider" });
          sendResponse({ success: true });
        } catch (err) {
          sendResponse({ success: false, error: err.message });
        }
      } else {
        sendResponse({ success: false, error: "NO_ACTIVE_TAB" });
      }
    });
    return true; // Indicates async response
  }
});
