document.addEventListener("DOMContentLoaded", () => {
  const recordBtn = document.getElementById("recordBtn");
  const volumeSlider = document.getElementById("volumeSlider");

  const audioCtx = new AudioContext();
  const destination = audioCtx.createMediaStreamDestination();

  const trackGain = audioCtx.createGain();
  const padGain = audioCtx.createGain();

  trackGain.gain.value = 0.5;
  padGain.gain.value = 1.0;

  trackGain.connect(destination);
  trackGain.connect(audioCtx.destination);

  padGain.connect(destination);
  padGain.connect(audioCtx.destination);

  let mediaRecorder;
  let recordedChunks = [];

  document.getElementById("continueBtn").addEventListener("click", async () => {
    await audioCtx.resume();
    document.getElementById("introScreen").classList.add("hidden");
    document.getElementById("mainUI").classList.remove("hidden");
  });

  volumeSlider.addEventListener("input", (e) => {
    trackGain.gain.value = e.target.value / 100;
  });

  async function playPad(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(padGain);
    source.start();
  }

  async function playTrack(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(trackGain);
    source.start();
  }

  function triggerPad(padId, soundFile) {
    const pad = document.getElementById(padId);
    pad.classList.add("active");
    playPad(soundFile);
    setTimeout(() => pad.classList.remove("active"), 200);
  }

  // Pad click handlers
  document.getElementById("ayePad").addEventListener("click", () => triggerPad("ayePad", "sounds/aye.mp3"));
  document.getElementById("nightvisionPad").addEventListener("click", () => triggerPad("nightvisionPad", "sounds/nightvision.mp3"));
  document.getElementById("basslongPad").addEventListener("click", () => triggerPad("basslongPad", "sounds/basslong.mp3"));
  document.getElementById("snapPad").addEventListener("click", () => triggerPad("snapPad", "sounds/snap.mp3"));
  document.getElementById("talkingbenPad").addEventListener("click", () => triggerPad("talkingbenPad", "sounds/talkingben.mp3"));
  document.getElementById("wspeedPad").addEventListener("click", () => triggerPad("wspeedPad", "sounds/wspeed.mp3"));
  document.getElementById("bass808Pad").addEventListener("click", () => triggerPad("bass808Pad", "sounds/808bass.mp3"));
  document.getElementById("airhornPad").addEventListener("click", () => triggerPad("airhornPad", "sounds/airhorn.mp3"));

  // Track controls
  document.getElementById("playBtn").addEventListener("click", () => playTrack("sounds/centuries.mp3"));
  document.getElementById("pauseBtn").addEventListener("click", () => audioCtx.suspend());
  document.getElementById("rewindBtn").addEventListener("click", () => playTrack("sounds/centuries.mp3"));

  // Recording
  recordBtn.addEventListener("click", () => {
    if (recordBtn.classList.contains("recording")) {
      mediaRecorder.stop();
      recordBtn.classList.remove("recording");
      recordBtn.textContent = "🔴 Record";
    } else {
      recordedChunks = [];
      mediaRecorder = new MediaRecorder(destination.stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dj-recording.webm";
        a.click();
      };

      mediaRecorder.start();
      recordBtn.classList.add("recording");
      recordBtn.textContent = "✅ Done Recording";
    }
  });

  // Shortcut keys
  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === "a") triggerPad("ayePad", "sounds/aye.mp3");
    else if (key === "w") triggerPad("nightvisionPad", "sounds/nightvision.mp3");
    else if (key === "b") triggerPad("basslongPad", "sounds/basslong.mp3");
    else if (key === "n") triggerPad("snapPad", "sounds/snap.mp3");
    else if (key === "t") triggerPad("talkingbenPad", "sounds/talkingben.mp3");
    else if (key === "e") triggerPad("wspeedPad", "sounds/wspeed.mp3");
    else if (key === "8") triggerPad("bass808Pad", "sounds/808bass.mp3");
    else if (key === "h") triggerPad("airhornPad", "sounds/airhorn.mp3");
    else if (key === "p") playTrack("sounds/centuries.mp3");
    else if (key === "r") playTrack("sounds/centuries.mp3");
    else if (key === "s") audioCtx.suspend();
  });
});
