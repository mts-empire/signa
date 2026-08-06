export const speakText = (text: str, isMuted: boolean = false) => {
  if (isMuted || !('speechSynthesis' in window) || !text) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};
