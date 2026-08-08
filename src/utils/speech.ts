export function speakText(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

export const speak = speakText;
export default speakText;
