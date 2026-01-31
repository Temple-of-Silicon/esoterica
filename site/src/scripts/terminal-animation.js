// Terminal animation: scroll-triggered phase detection with typewriter effect
// Follows patterns from scroll-reveal.js and RESEARCH.md recommendations
(function() {
  // Bail out for reduced-motion users - show all text instantly
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAllPhasesInstantly();
    return;
  }

  var triggers = document.querySelectorAll('.phase-trigger');
  if (!triggers.length) return;

  // State object
  var state = {
    currentPhase: 0,
    completedPhases: {},
    typewriterTimeoutId: null,
    typewriterCancel: null,
    lastY: undefined,
    typingPhase: null
  };

  // Cache DOM elements
  var lines = document.querySelectorAll('.terminal-line[data-phase]');
  var indicators = document.querySelectorAll('.indicator[data-phase]');
  var cursor = document.querySelector('.terminal-cursor');

  // Store original text in data attributes
  lines.forEach(function(line) {
    var textEl = line.querySelector('.terminal-text');
    if (textEl && !textEl.dataset.fullText) {
      textEl.dataset.fullText = textEl.textContent;
      textEl.textContent = '';
    }
  });

  // Phase detection via IntersectionObserver
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var phase = parseInt(entry.target.dataset.phase, 10);
          var currentY = entry.boundingClientRect.y;
          var direction = state.lastY === undefined || currentY < state.lastY ? 'down' : 'up';
          state.lastY = currentY;
          handlePhaseTransition(phase, direction);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  triggers.forEach(function(trigger) {
    observer.observe(trigger);
  });

  // Handle phase transition
  function handlePhaseTransition(phase, direction) {
    // If scrolling down to a new phase
    if (direction === 'down' && !state.completedPhases[phase]) {
      // Complete previous phase instantly if it was still typing
      if (state.typingPhase !== null && state.typingPhase !== phase) {
        completePhaseInstantly(state.typingPhase);
      }

      // Cancel any running typewriter
      if (state.typewriterCancel) {
        state.typewriterCancel();
      }

      // Start typewriter for new phase
      startTypewriter(phase);
      state.currentPhase = phase;
    }
    // If scrolling up (scroll-back)
    else if (direction === 'up') {
      // Re-highlight completed phase without re-animating
      highlightPhase(phase);
      state.currentPhase = phase;
    }
    // If scrolling down but phase already completed
    else if (direction === 'down' && state.completedPhases[phase]) {
      highlightPhase(phase);
      state.currentPhase = phase;
    }

    updateIndicators(phase);
  }

  // Start typewriter animation for a phase
  function startTypewriter(phase) {
    var line = document.querySelector('.terminal-line[data-phase="' + phase + '"]');
    if (!line) return;

    var textEl = line.querySelector('.terminal-text');
    if (!textEl) return;

    var fullText = textEl.dataset.fullText || '';
    var index = 0;
    var baseDelay = 25;

    // Mark as typing
    state.typingPhase = phase;
    clearLineStates();
    line.classList.add('is-typing');
    textEl.textContent = '';

    // Move cursor next to this line
    moveCursorToLine(line);

    function type() {
      if (index < fullText.length) {
        var char = fullText[index];
        textEl.textContent += char;
        index++;

        // Punctuation pauses for natural rhythm
        var delay = baseDelay;
        if ('.!?'.indexOf(char) !== -1) {
          delay = baseDelay * 6; // Sentence end
        } else if (',;:'.indexOf(char) !== -1) {
          delay = baseDelay * 3; // Clause
        } else if (char === '\n') {
          delay = baseDelay * 2; // Line break
        }

        state.typewriterTimeoutId = setTimeout(type, delay);
      } else {
        // Typing complete
        completePhase(phase);
      }
    }

    type();

    // Store cancel function
    state.typewriterCancel = function() {
      clearTimeout(state.typewriterTimeoutId);
      state.typewriterTimeoutId = null;
      state.typewriterCancel = null;
    };
  }

  // Complete a phase after typewriter finishes
  function completePhase(phase) {
    var line = document.querySelector('.terminal-line[data-phase="' + phase + '"]');
    if (line) {
      line.classList.remove('is-typing');
      line.classList.add('is-completed');
    }
    state.completedPhases[phase] = true;
    state.typingPhase = null;
    state.typewriterCancel = null;
  }

  // Complete phase instantly (for scroll-away mid-typing)
  function completePhaseInstantly(phase) {
    // Cancel running typewriter
    if (state.typewriterCancel) {
      state.typewriterCancel();
    }

    var line = document.querySelector('.terminal-line[data-phase="' + phase + '"]');
    if (!line) return;

    var textEl = line.querySelector('.terminal-text');
    if (textEl && textEl.dataset.fullText) {
      textEl.textContent = textEl.dataset.fullText;
    }

    line.classList.remove('is-typing');
    line.classList.add('is-completed');
    state.completedPhases[phase] = true;
    state.typingPhase = null;
  }

  // Highlight a phase (for scroll-back)
  function highlightPhase(phase) {
    clearLineStates();
    var line = document.querySelector('.terminal-line[data-phase="' + phase + '"]');
    if (line) {
      line.classList.add('is-active');
      moveCursorToLine(line);
    }
  }

  // Clear all line state classes
  function clearLineStates() {
    lines.forEach(function(line) {
      var phase = parseInt(line.dataset.phase, 10);
      line.classList.remove('is-active');
      // Keep is-completed for completed phases
      if (state.completedPhases[phase]) {
        line.classList.add('is-completed');
      }
    });
  }

  // Move cursor to follow the specified line
  function moveCursorToLine(line) {
    if (!cursor || !line) return;
    // Cursor stays in its fixed position after the content
    // Just ensure it's visible - no repositioning needed with current DOM structure
  }

  // Update indicator dots
  function updateIndicators(activePhase) {
    indicators.forEach(function(dot) {
      var phase = parseInt(dot.dataset.phase, 10);

      // Reset classes
      dot.classList.remove('active', 'completed');
      dot.removeAttribute('aria-current');

      if (phase === activePhase) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'step');
      } else if (state.completedPhases[phase]) {
        dot.classList.add('completed');
      }
    });
  }

  // Show all phases instantly (reduced-motion fallback)
  function showAllPhasesInstantly() {
    var allLines = document.querySelectorAll('.terminal-line[data-phase]');
    var allIndicators = document.querySelectorAll('.indicator[data-phase]');

    allLines.forEach(function(line) {
      var textEl = line.querySelector('.terminal-text');
      // Text is already in DOM, just ensure it's visible
      line.classList.add('is-completed');
    });

    allIndicators.forEach(function(dot) {
      dot.classList.add('completed');
    });

    // Make last indicator active
    var lastIndicator = allIndicators[allIndicators.length - 1];
    if (lastIndicator) {
      lastIndicator.classList.remove('completed');
      lastIndicator.classList.add('active');
      lastIndicator.setAttribute('aria-current', 'step');
    }
  }
})();
