document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  const errorDiv = document.getElementById('errorMessage');

  document.getElementById('openSliderBtn').addEventListener('click', () => {
    errorDiv.style.display = 'none';
    
    // Instead of querying the tab and sending the message directly (which requires injection logic here),
    // we delegate to the background script which has the injection logic.
    chrome.runtime.sendMessage({ action: "popup-toggle-slider" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        errorDiv.textContent = "Error communicating with extension.";
        errorDiv.style.display = 'block';
        return;
      }
      
      if (response.success) {
        window.close();
      } else {
        if (response.error === "RESTRICTED_PAGE") {
          errorDiv.textContent = "Cannot open slider on this page. Some pages (like chrome:// URLs) are restricted by Chrome.";
        } else {
          errorDiv.textContent = "Failed to open slider: " + response.error;
        }
        errorDiv.style.display = 'block';
      }
    });
  });
});
