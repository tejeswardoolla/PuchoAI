(function() {
  if (window.geminiSliderInjected) return;
  window.geminiSliderInjected = true;

  let sliderContainer = null;
  let chatHistory = [];
  
  // Dragging state variables
  let isDraggingPanel = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let panelStartX = 0;
  let panelStartY = 0;

  function createSlider() {
    if (sliderContainer) return;

    sliderContainer = document.createElement('div');
    sliderContainer.id = 'gemini-floating-slider';
    sliderContainer.innerHTML = `
      <div id="gemini-header">
        <div class="gemini-header-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/></svg>
          <h3>Gemini</h3>
        </div>
        <div class="gemini-header-controls">
          <input type="range" id="gemini-opacity-slider" min="0.2" max="1" step="0.1" value="1" title="Adjust Opacity">
          <button id="gemini-theme-toggle" title="Toggle Light/Dark Theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>
          </button>
          <button id="gemini-minimize" title="Minimize">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button id="gemini-close" title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div id="gemini-chat"></div>
      <div id="gemini-input-container">
        <button id="gemini-attach" title="Attach file">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </button>
        <textarea id="gemini-input" placeholder="Ask Gemini..." rows="1"></textarea>
        <button id="gemini-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    document.body.appendChild(sliderContainer);

    // Initialize theme from storage
    chrome.storage.local.get(['geminiTheme'], (result) => {
      if (result.geminiTheme === 'light') {
        sliderContainer.classList.add('gemini-light-theme');
      }
    });

    const minimizeBtn = sliderContainer.querySelector('#gemini-minimize');
    const closeBtn = sliderContainer.querySelector('#gemini-close');
    const sendBtn = sliderContainer.querySelector('#gemini-send');
    const input = sliderContainer.querySelector('#gemini-input');
    const header = sliderContainer.querySelector('#gemini-header');
    const opacitySlider = sliderContainer.querySelector('#gemini-opacity-slider');
    const themeToggleBtn = sliderContainer.querySelector('#gemini-theme-toggle');

    if (opacitySlider) {
      opacitySlider.addEventListener('input', (e) => {
        sliderContainer.style.setProperty('--gemini-opacity', e.target.value);
      });
    }

    themeToggleBtn.addEventListener('click', () => {
      sliderContainer.classList.toggle('gemini-light-theme');
      const isLight = sliderContainer.classList.contains('gemini-light-theme');
      chrome.storage.local.set({ geminiTheme: isLight ? 'light' : 'dark' });
    });

    minimizeBtn.addEventListener('click', toggleSlider);
    closeBtn.addEventListener('click', toggleSlider);

    sendBtn.addEventListener('click', () => handleSend());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });

    // Panel dragging logic
    header.addEventListener('mousedown', (e) => {
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
      isDraggingPanel = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const rect = sliderContainer.getBoundingClientRect();
      panelStartX = rect.left;
      panelStartY = rect.top;
      
      sliderContainer.classList.add('has-dragged');
      sliderContainer.classList.add('is-dragging');
      
      sliderContainer.style.left = panelStartX + 'px';
      sliderContainer.style.top = panelStartY + 'px';
      
      document.addEventListener('mousemove', onPanelDrag);
      document.addEventListener('mouseup', stopPanelDrag);
      e.preventDefault();
    });

    function onPanelDrag(e) {
      if (!isDraggingPanel) return;
      
      let newX = panelStartX + (e.clientX - dragStartX);
      let newY = panelStartY + (e.clientY - dragStartY);
      
      const maxW = window.innerWidth - sliderContainer.offsetWidth;
      const maxH = window.innerHeight - sliderContainer.offsetHeight;
      
      newX = Math.max(0, Math.min(newX, maxW));
      newY = Math.max(0, Math.min(newY, maxH));
      
      sliderContainer.style.left = newX + 'px';
      sliderContainer.style.top = newY + 'px';
    }

    function stopPanelDrag() {
      isDraggingPanel = false;
      sliderContainer.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onPanelDrag);
      document.removeEventListener('mouseup', stopPanelDrag);
    }
  }

  function toggleSlider() {
    if (!sliderContainer) createSlider();
    sliderContainer.classList.toggle('open');
    if (sliderContainer.classList.contains('open')) {
      setTimeout(() => {
        const input = sliderContainer.querySelector('#gemini-input');
        if (input) input.focus();
      }, 300);
    }
  }

  function appendMessage(role, text) {
    const chat = sliderContainer.querySelector('#gemini-chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = `gemini-message ${role}`;
    
    if (role === 'model') {
      msgDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text;
      const copyBtn = document.createElement('button');
      copyBtn.className = 'gemini-copy-btn';
      copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Answer';
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = 'Copied!';
        setTimeout(() => copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Answer', 2000);
      };
      msgDiv.appendChild(copyBtn);
    } else {
      msgDiv.textContent = text;
    }
    
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
  }

  function showLoading() {
    const chat = sliderContainer.querySelector('#gemini-chat');
    const loadDiv = document.createElement('div');
    loadDiv.className = 'gemini-loading';
    loadDiv.id = 'gemini-loading';
    loadDiv.innerHTML = '<div class="gemini-loading-dot"></div><div class="gemini-loading-dot"></div><div class="gemini-loading-dot"></div>';
    chat.appendChild(loadDiv);
    chat.scrollTop = chat.scrollHeight;
  }

  function hideLoading() {
    const loadDiv = sliderContainer.querySelector('#gemini-loading');
    if (loadDiv) loadDiv.remove();
  }

  async function handleSend(prefilledText = null) {
    const input = sliderContainer.querySelector('#gemini-input');
    const sendBtn = sliderContainer.querySelector('#gemini-send');
    const text = (typeof prefilledText === 'string') ? prefilledText.trim() : input.value.trim();
    
    if (!text) return;
    
    if (!prefilledText) {
      input.value = '';
      input.style.height = 'auto';
    }
    
    appendMessage('user', text);
    showLoading();
    sendBtn.disabled = true;

    try {
      const response = await callGemini(text, chatHistory);
      hideLoading();
      appendMessage('model', response);
      chatHistory.push({ role: 'user', text });
      chatHistory.push({ role: 'model', text: response });
    } catch (error) {
      hideLoading();
      const chat = sliderContainer.querySelector('#gemini-chat');
      const errDiv = document.createElement('div');
      errDiv.className = 'gemini-error';
      errDiv.textContent = error.message;
      chat.appendChild(errDiv);
      chat.scrollTop = chat.scrollHeight;
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggle-slider') {
      toggleSlider();
    } else if (request.action === 'explain-text') {
      if (!sliderContainer || !sliderContainer.classList.contains('open')) {
        toggleSlider();
      }
      handleSend(`Please explain this text: "${request.text}"`);
    }
  });
})();
