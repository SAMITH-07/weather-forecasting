// Voice Search System

class VoiceSearch {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.initVoiceRecognition();
  }

  initVoiceRecognition() {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      // Configure recognition
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      // Event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceButton(true);
        this.showVoiceFeedback("Listening...");
      };
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleVoiceCommand(transcript);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        this.showVoiceFeedback(`Error: ${event.error}`);
        this.isListening = false;
        this.updateVoiceButton(false);
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButton(false);
        setTimeout(() => this.hideVoiceFeedback(), 2000);
      };
    } else {
      console.warn('Speech recognition not supported');
      this.showVoiceFeedback("Voice search not supported");
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  handleVoiceCommand(transcript) {
    console.log('Voice command:', transcript);
    this.showVoiceFeedback(`Heard: "${transcript}"`);
    
    // Extract city name from voice command
    const cityPatterns = [
      /weather in ([a-zA-Z\s]+)/i,
      /what's the weather in ([a-zA-Z\s]+)/i,
      /how's the weather in ([a-zA-Z\s]+)/i,
      /weather for ([a-zA-Z\s]+)/i,
      /show me weather for ([a-zA-Z\s]+)/i,
      /([a-zA-Z\s]+) weather/i,
      /^([a-zA-Z\s]+)$/i
    ];
    
    let cityName = null;
    
    for (const pattern of cityPatterns) {
      const match = transcript.match(pattern);
      if (match && match[1]) {
        cityName = match[1].trim();
        break;
      }
    }
    
    if (cityName) {
      this.showVoiceFeedback(`Searching weather for ${cityName}...`);
      this.searchWeatherForCity(cityName);
    } else {
      this.showVoiceFeedback("Sorry, I didn't catch the city name");
    }
  }

  searchWeatherForCity(cityName) {
    // Set the search input value and trigger search
    const searchInput = document.getElementById('searchCity');
    const mobileSearchInput = document.getElementById('mobileSearchCity');
    
    if (searchInput) {
      searchInput.value = cityName;
      searchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    } else if (mobileSearchInput) {
      mobileSearchInput.value = cityName;
      mobileSearchInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    }
  }

  updateVoiceButton(isListening) {
    const voiceButtons = document.querySelectorAll('.voice-search-btn');
    voiceButtons.forEach(btn => {
      if (isListening) {
        btn.classList.add('listening');
        btn.innerHTML = '🎤';
        btn.title = 'Stop listening...';
      } else {
        btn.classList.remove('listening');
        btn.innerHTML = '🎙️';
        btn.title = 'Voice search - Click and say "What\'s the weather in London?"';
      }
    });
  }

  showVoiceFeedback(message) {
    let feedback = document.getElementById('voiceFeedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = 'voiceFeedback';
      feedback.className = 'voice-feedback';
      document.body.appendChild(feedback);
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    if (message.includes('Listening')) {
      feedback.classList.add('listening');
    } else {
      feedback.classList.remove('listening');
    }
  }

  hideVoiceFeedback() {
    const feedback = document.getElementById('voiceFeedback');
    if (feedback) {
      feedback.style.display = 'none';
    }
  }
}

// Initialize voice search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const voiceSearch = new VoiceSearch();
  
  // Add voice search buttons to navbar and mobile navbar
  const navbar = document.querySelector('.navbar');
  const mobileNavbar = document.querySelector('.mobile-navbar');
  
  if (navbar) {
    const voiceBtn = document.createElement('li');
    voiceBtn.innerHTML = '<a href="#" class="voice-search-btn" title="Voice search - Click and say \'What\'s the weather in London?\'">🎙️</a>';
    
    // Insert before the search input
    const searchInput = navbar.querySelector('input[type="text"]');
    if (searchInput) {
      searchInput.parentNode.insertBefore(voiceBtn, searchInput);
    }
    
    // Add click event
    voiceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (voiceSearch.isListening) {
        voiceSearch.stopListening();
      } else {
        voiceSearch.startListening();
      }
    });
  }
  
  if (mobileNavbar) {
    const mobileVoiceBtn = document.createElement('li');
    mobileVoiceBtn.innerHTML = '<a href="#" class="voice-search-btn" title="Voice search">🎙️</a>';
    
    // Insert before the search input
    const mobileSearchInput = mobileNavbar.querySelector('input[type="text"]');
    if (mobileSearchInput) {
      mobileSearchInput.parentNode.insertBefore(mobileVoiceBtn, mobileSearchInput);
    }
    
    // Add click event
    mobileVoiceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (voiceSearch.isListening) {
        voiceSearch.stopListening();
      } else {
        voiceSearch.startListening();
      }
    });
  }
  
  // Make voice search globally accessible
  window.voiceSearch = voiceSearch;
});
