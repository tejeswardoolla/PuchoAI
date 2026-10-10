document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const modelSelect = document.getElementById('model');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load settings
  chrome.storage.local.get(['geminiApiKey', 'geminiModel'], (result) => {
    if (result.geminiApiKey) apiKeyInput.value = result.geminiApiKey;
    if (result.geminiModel) modelSelect.value = result.geminiModel;
  });

  // Save settings
  saveBtn.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;
    
    chrome.storage.local.set({
      geminiApiKey: apiKey,
      geminiModel: model
    }, () => {
      statusDiv.textContent = 'Settings saved successfully!';
      setTimeout(() => statusDiv.textContent = '', 3000);
    });
  });
});
