const notes = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13, 'E': 329.63,
    'F': 349.23, 'F#': 369.99, 'G': 392.00, 'G#': 415.30, 'A': 440.00,
    'A#': 466.16, 'B': 493.88, 'C2': 523.25, 'C#2': 554.37, 'D2': 587.33,
    'D#2': 622.25, 'E2': 659.26, 'F2': 698.46
};
const midiMapping = {
    'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64,
    'F': 65, 'F#': 66, 'G': 67, 'G#': 68, 'A': 69,
    'A#': 70, 'B': 71, 'C2': 72, 'C#2': 73, 'D2': 74,
    'D#2': 75, 'E2': 76, 'F2': 77
};
let currentOctaveShift = 0;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const masterGain = audioCtx.createGain();
const convolver = audioCtx.createConvolver();
const analyzer = audioCtx.createAnalyser();
const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.value = -15;
compressor.knee.value = 10;
compressor.ratio.value = 4;
compressor.attack.value = 0.005;
compressor.release.value = 0.1;
masterGain.connect(compressor);
compressor.connect(analyzer);
analyzer.connect(audioCtx.destination);
const canvas = document.querySelector('.visualizer');
const canvasCtx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
analyzer.fftSize = 2048;
const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyzer.getFloatTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'rgb(26, 26, 26)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 255, 0)';
    canvasCtx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] * 90.0;
    const y = (canvas.height / 2) + (v * canvas.height / 2);
    if (i === 0) {
        canvasCtx.moveTo(x, y);
    } else {
        canvasCtx.lineTo(x, y);
    }
    x += sliceWidth;
    }
    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}
drawVisualizer();
function createImpulseResponse(duration, decay) {
    const sampleRate = audioCtx.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
    const n = i / length;
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, decay);
    }
    return impulse;
}
document.getElementById('reverb').addEventListener('change', (e) => {
    const reverbTime = parseFloat(e.target.value);
    if (reverbTime === 0) {
    masterGain.disconnect();
    masterGain.connect(analyzer);
    } else {
    convolver.buffer = createImpulseResponse(reverbTime, 2);
    masterGain.disconnect();
    masterGain.connect(convolver);
    convolver.connect(analyzer);
    }
});
let metronomeInterval = null;
function playMetronomeBeat() {
    const osc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    osc.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    osc.frequency.value = 1000;
    clickGain.gain.setValueAtTime(1, audioCtx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
}
function startMetronome() {
    if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    }
    if (metronomeInterval) clearInterval(metronomeInterval);
    const tempo = parseInt(document.getElementById('tempo').value, 10) || 120;
    const intervalTime = 60000 / tempo;
    metronomeInterval = setInterval(playMetronomeBeat, intervalTime);
}
function stopMetronome() {
    if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    }
}
document.getElementById('tempo').addEventListener('change', () => {
    const metronomeCheckbox = document.getElementById('metronomeToggle');
    if (metronomeCheckbox.checked) {
    startMetronome();
    }
});
document.getElementById('metronomeToggle').addEventListener('change', (e) => {
    if (e.target.checked) {
    startMetronome();
    } else {
    stopMetronome();
    }
});
let shiftUpPressed = false;
let shiftDownPressed = false;
function getShiftFactor() {
    let factor = 1;
    if (shiftUpPressed && !shiftDownPressed) {
    factor *= Math.pow(2, 2/12);
    } else if (shiftDownPressed && !shiftUpPressed) {
    factor *= Math.pow(2, -2/12);
    }
    factor *= Math.pow(2, currentOctaveShift);
    return factor;
}
function quantizeTime(time) {
    if (document.getElementById('metronomeToggle').checked) {
    const tempo = parseInt(document.getElementById('tempo').value, 10) || 120;
    const beatInterval = 60 / tempo;
    return Math.round(time / beatInterval) * beatInterval;
    }
    return time;
}
const activeNotes = {};
let isRecording = false;
let recordingStartTime = 0;
let midiEvents = [];
function startNote(keyElement) {
    const keyId = keyElement.dataset.key;
    if (activeNotes[keyId]) return;
    const noteName = keyElement.dataset.note;
    const baseFrequency = notes[noteName];
    if (!baseFrequency) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = document.getElementById('waveform').value;
    oscillator.detune.value = parseFloat(document.getElementById('detune').value);
    const shiftFactor = getShiftFactor();
    oscillator.frequency.value = baseFrequency * shiftFactor;
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(masterGain);
    oscillator.start();
    activeNotes[keyId] = { oscillator, gainNode, baseFrequency, keyElement };
    updatePolyphonicGain();
    if (isRecording) {
    const eventTime = quantizeTime(audioCtx.currentTime - recordingStartTime);
    const midiNote = midiMapping[noteName];
    if (midiNote !== undefined) {
        midiEvents.push({ type: 'noteOn', note: midiNote, time: eventTime });
    }
    }
}
function stopNote(keyElement) {
    const keyId = keyElement.dataset.key;
    const noteData = activeNotes[keyId];
    if (!noteData) return;
    const { oscillator, gainNode } = noteData;
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.01);
    oscillator.stop(audioCtx.currentTime + 0.1);
    delete activeNotes[keyId];
    updatePolyphonicGain();
    if (isRecording) {
    const eventTime = quantizeTime(audioCtx.currentTime - recordingStartTime);
    const midiNote = midiMapping[keyElement.dataset.note];
    if (midiNote !== undefined) {
        midiEvents.push({ type: 'noteOff', note: midiNote, time: eventTime });
    }
    }
}
function updatePolyphonicGain() {
    const activeCount = Object.keys(activeNotes).length;
    if (activeCount > 0) {
    const reduction = Math.max(0.2, 1 / Math.sqrt(activeCount));
    const volume = (document.getElementById('volume').value / 100) * reduction;
    Object.values(activeNotes).forEach(({ gainNode }) => {
        gainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.01);
    });
    }
}
function updateActiveOscillatorFrequencies() {
    const shiftFactor = getShiftFactor();
    const slideTime = 0.1;
    for (const keyId in activeNotes) {
    const { oscillator, baseFrequency } = activeNotes[keyId];
    const newFreq = baseFrequency * shiftFactor;
    oscillator.frequency.cancelScheduledValues(audioCtx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(newFreq, audioCtx.currentTime + slideTime);
    }
}
document.querySelectorAll('.key').forEach(key => {
    ['mousedown', 'touchstart'].forEach(eventName => {
    key.addEventListener(eventName, (e) => {
        e.preventDefault();
        if (audioCtx.state === 'suspended') {
        audioCtx.resume();
        }
        startNote(key);
        key.classList.add('active');
    });
    });
    ['mouseup', 'mouseleave', 'touchend'].forEach(eventName => {
    key.addEventListener(eventName, () => {
        key.classList.remove('active');
        stopNote(key);
    });
    });
});
document.addEventListener('keydown', e => {
    if (e.repeat) return;
    if (e.key.toLowerCase() === 'z') {
    currentOctaveShift = Math.max(-2, currentOctaveShift - 1);
    updateActiveOscillatorFrequencies();
    return;
    }
    if (e.key.toLowerCase() === 'x') {
    currentOctaveShift = Math.min(2, currentOctaveShift + 1);
    updateActiveOscillatorFrequencies();
    return;
    }
    if (e.key === '1') {
    shiftDownPressed = true;
    updateActiveOscillatorFrequencies();
    return;
    }
    if (e.key === '2') {
    shiftUpPressed = true;
    updateActiveOscillatorFrequencies();
    return;
    }
    const keyElement = document.querySelector(`.key[data-key="${e.key}"]`);
    if (keyElement) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    startNote(keyElement);
    keyElement.classList.add('active');
    }
});
document.addEventListener('keyup', e => {
    if (e.key === '1') {
    shiftDownPressed = false;
    updateActiveOscillatorFrequencies();
    return;
    }
    if (e.key === '2') {
    shiftUpPressed = false;
    updateActiveOscillatorFrequencies();
    return;
    }
    const keyElement = document.querySelector(`.key[data-key="${e.key}"]`);
    if (keyElement) {
    keyElement.classList.remove('active');
    stopNote(keyElement);
    }
});
function updateBlackKeys() {
    const piano = document.querySelector('.piano');
    const pianoRect = piano.getBoundingClientRect();
    const whiteKeys = piano.querySelectorAll('.white-keys .key.white');
    const whiteKeyPositions = Array.from(whiteKeys).map(key => {
    const rect = key.getBoundingClientRect();
    return { left: rect.left - pianoRect.left, width: rect.width };
    });
    const blackKeys = piano.querySelectorAll('.black-keys .key.black');
    blackKeys.forEach(key => {
    const posIndex = parseInt(key.dataset.pos, 10);
    if (!isNaN(posIndex) && whiteKeyPositions[posIndex]) {
        const whiteKey = whiteKeyPositions[posIndex];
        const blackWidth = whiteKey.width * (40 / 60);
        const left = whiteKey.left + whiteKey.width - (blackWidth / 2);
        key.style.width = `${blackWidth}px`;
        const blackHeight = pianoRect.height * (160 / 280);
        key.style.height = `${blackHeight}px`;
        key.style.left = `${left}px`;
    }
    });
}
window.addEventListener('resize', updateBlackKeys);
window.addEventListener('DOMContentLoaded', updateBlackKeys);
document.getElementById('recordToggle').addEventListener('click', () => {
if (!isRecording) {
    if (document.getElementById('metronomeToggle').checked) {
    const tempo = parseInt(document.getElementById('tempo').value, 10) || 120;
    const beatInterval = 60 / tempo;
    const currentTime = audioCtx.currentTime;
    const timeSinceLastBeat = currentTime % beatInterval;
    const waitTime = beatInterval - timeSinceLastBeat;
    setTimeout(() => {
        recordingStartTime = audioCtx.currentTime;
        isRecording = true;
        midiEvents = [];
        document.getElementById('recordToggle').textContent = "Stop Recording";
        document.getElementById('exportMIDI').disabled = true;
    }, waitTime * 1000);
    } else {
    recordingStartTime = audioCtx.currentTime;
    isRecording = true;
    midiEvents = [];
    document.getElementById('recordToggle').textContent = "Stop Recording";
    document.getElementById('exportMIDI').disabled = true;
    }
} else {
    isRecording = false;
    document.getElementById('recordToggle').textContent = "Start Recording";
    if (midiEvents.length > 0) {
    document.getElementById('exportMIDI').disabled = false;
    }
}
});
document.getElementById('exportMIDI').addEventListener('click', () => {
    exportMIDIFile();
});
function writeVariableLength(value) {
    let buffer = [];
    while (value > 127) {
    buffer.push((value & 127) | 128);
    value >>= 7;
    }
    buffer.push(value);
    return buffer;
}
function exportMIDIFile() {
    const tempoInput = document.getElementById('tempo');
    const tempo = parseInt(tempoInput.value, 10) || 120;
    const division = 96;
    midiEvents.sort((a, b) => a.time - b.time);
    let trackData = [];
    trackData.push(0x00);
    trackData.push(0xFF, 0x51, 0x03);
    const microPerQuarter = Math.round(60000000 / tempo);
    trackData.push((microPerQuarter >> 16) & 0xFF, (microPerQuarter >> 8) & 0xFF, microPerQuarter & 0xFF);
    let prevTick = 0;
    midiEvents.forEach(event => {
    const currentTick = Math.round(event.time * (tempo / 60) * division);
    const deltaTicks = currentTick - prevTick;
    prevTick = currentTick;
    trackData.push(...writeVariableLength(deltaTicks));
    if (event.type === 'noteOn') {
        trackData.push(0x90, event.note, 64);
    } else if (event.type === 'noteOff') {
        trackData.push(0x80, event.note, 0);
    }
    });
    trackData.push(0x00, 0xFF, 0x2F, 0x00);
    let trackChunk = [];
    trackChunk.push(77, 84, 114, 107);
    const trackLength = trackData.length;
    trackChunk.push(
    (trackLength >> 24) & 0xFF,
    (trackLength >> 16) & 0xFF,
    (trackLength >> 8) & 0xFF,
    trackLength & 0xFF
    );
    trackChunk.push(...trackData);
    let headerChunk = [];
    headerChunk.push(77, 84, 104, 100);
    headerChunk.push(0x00, 0x00, 0x00, 0x06);
    headerChunk.push(0x00, 0x00);
    headerChunk.push(0x00, 0x01);
    headerChunk.push(0x00, division);
    const midiBytes = new Uint8Array([...headerChunk, ...trackChunk]);
    const blob = new Blob([midiBytes], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.mid';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}