import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  isSpeaking = signal(false);
  private synthesis = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  speak(text: string, lang: 'en' | 'hi' | 'ml') {
    this.stop();

    // Strip HTML tags for reading
    const cleanText = text.replace(/<[^>]*>/g, '');

    this.utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Map internal lang codes to BCP 47 tags
    const langMap: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ml': 'ml-IN' 
    };

    this.utterance.lang = langMap[lang] || 'en-US';
    this.utterance.rate = 0.9; // Slightly slower for teaching
    this.utterance.pitch = 1;

    this.utterance.onend = () => {
      this.isSpeaking.set(false);
    };

    this.utterance.onerror = () => {
      this.isSpeaking.set(false);
    };

    this.isSpeaking.set(true);
    this.synthesis.speak(this.utterance);
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.isSpeaking.set(false);
  }
}