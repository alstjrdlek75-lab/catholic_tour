// Elegant Wedding Invitation Guide Controller

// 1. Synthesized Classical Piano BGM Sequencer (Web Audio API)
let audioCtx = null;
let bgmIntervalId = null;
let isBgmPlaying = false;
let currentNoteIndex = 0;

// Gentle C-G-Am-F classical piano chord progression
const melodyNotes = [
  // C Major Chord
  { freq: 261.63, dur: 0.4 }, // C4
  { freq: 329.63, dur: 0.4 }, // E4
  { freq: 392.00, dur: 0.4 }, // G4
  { freq: 523.25, dur: 0.6 }, // C5
  
  // G Major Chord
  { freq: 246.94, dur: 0.4 }, // B3
  { freq: 293.66, dur: 0.4 }, // D4
  { freq: 392.00, dur: 0.4 }, // G4
  { freq: 493.88, dur: 0.6 }, // B4
  
  // A Minor Chord
  { freq: 220.00, dur: 0.4 }, // A3
  { freq: 261.63, dur: 0.4 }, // C4
  { freq: 329.63, dur: 0.4 }, // E4
  { freq: 440.00, dur: 0.6 }, // A4
  
  // F Major Chord
  { freq: 174.61, dur: 0.4 }, // F3
  { freq: 220.00, dur: 0.4 }, // A3
  { freq: 261.63, dur: 0.4 }, // C4
  { freq: 349.23, dur: 0.6 }  // F4
];

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPianoNote(freq, duration) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Lowpass filter to soften the synth into a piano-like warm tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    // Mix sine and triangle for a soft chime tone
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    
    // Gentle attack and slow exponential decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.06, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.log('Audio playback blocked or unsupported:', e);
  }
}

function startBgmSequencer() {
  if (bgmIntervalId) return;
  
  isBgmPlaying = true;
  document.getElementById('bgm-trigger').classList.add('playing');
  
  // Play note immediately
  playNextNote();
  
  // Set up timer for subsequent notes
  bgmIntervalId = setInterval(playNextNote, 420); // Gentle rhythm
}

function playNextNote() {
  const note = melodyNotes[currentNoteIndex];
  playPianoNote(note.freq, note.dur);
  currentNoteIndex = (currentNoteIndex + 1) % melodyNotes.length;
}

function stopBgmSequencer() {
  isBgmPlaying = false;
  document.getElementById('bgm-trigger').classList.remove('playing');
  if (bgmIntervalId) {
    clearInterval(bgmIntervalId);
    bgmIntervalId = null;
  }
}



// 3. Document Listeners
document.addEventListener('DOMContentLoaded', () => {
  // BGM Player trigger
  const bgmBtn = document.getElementById('bgm-trigger');
  bgmBtn.addEventListener('click', () => {
    if (isBgmPlaying) {
      stopBgmSequencer();
    } else {
      startBgmSequencer();
    }
  });

  // Tab switcher for walking route and public transit
  const walkTab = document.getElementById('tab-btn-walk');
  const transitTab = document.getElementById('tab-btn-transit');
  const walkView = document.getElementById('map-view-walk');
  const transitView = document.getElementById('map-view-transit');

  walkTab.addEventListener('click', () => {
    playPianoNote(523.25, 0.2); // C5 soft click
    walkTab.classList.add('active');
    transitTab.classList.remove('active');
    walkView.classList.add('active');
    transitView.classList.remove('active');
  });

  transitTab.addEventListener('click', () => {
    playPianoNote(523.25, 0.2);
    transitTab.classList.add('active');
    walkTab.classList.remove('active');
    transitView.classList.add('active');
    walkView.classList.remove('active');
  });

  // Transit Option sub-tabs
  const opt1 = document.getElementById('transit-opt-1');
  const opt2 = document.getElementById('transit-opt-2');
  const card1 = document.getElementById('transit-card-1');
  const card2 = document.getElementById('transit-card-2');

  opt1.addEventListener('click', () => {
    playPianoNote(578.00, 0.2); // D5 soft click
    opt1.classList.add('active');
    opt2.classList.remove('active');
    card1.classList.add('active');
    card2.classList.remove('active');
  });

  opt2.addEventListener('click', () => {
    playPianoNote(578.00, 0.2);
    opt2.classList.add('active');
    opt1.classList.remove('active');
    card2.classList.add('active');
    card1.classList.remove('active');
  });
});
