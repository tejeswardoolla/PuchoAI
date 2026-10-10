async function callGemini(prompt, history = []) {
  const { geminiApiKey, geminiModel } = await chrome.storage.local.get(['geminiApiKey', 'geminiModel']);
  if (!geminiApiKey) {
    throw new Error('API Key is missing. Please configure it in the extension options.');
  }

  let model = geminiModel || 'gemini-3.8-flash';
  if (['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'].includes(model)) {
    model = 'gemini-3.8-flash';
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

  const contents = [];
  for (const msg of history) {
    if (msg && typeof msg.text === 'string' && msg.text.trim()) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
  }
  
  contents.push({
    role: 'user',
    parts: [{ text: String(prompt) }]
  });

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });
  } catch (err) {
    throw new Error('Network error. Please check your connection or ensure the API endpoint is accessible.');
  }

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignore JSON parse errors for non-JSON responses
    }
    
    if (response.status === 429) {
      throw new Error('Quota exceeded or rate limited. Please check your API usage.');
    }
    if (response.status === 403) {
      throw new Error('Access forbidden. Your API key might be invalid or lacking permissions.');
    }
    if (response.status === 400) {
      throw new Error('Bad request. ' + (errorData.error?.message || 'Check your API key and parameters.'));
    }
    
    throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Failed to parse API response as JSON.');
  }
  
  if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Received an empty or invalid response from Gemini.');
  }
}
