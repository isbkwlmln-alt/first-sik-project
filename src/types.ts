/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SikhName {
  id: string;
  name: string; // The English spelling, e.g., "Arjan"
  punjabiName?: string; // Gurmukhi representation, e.g., "ਅਰਜਨ"
  meaning: string; // Meaning in English
  urduMeaning: string; // Meaning in Roman Urdu or Urdu script
  gender: 'boy' | 'girl' | 'unisex';
  startLetter: string;
  rashi: string; // Moon Sign/Rashi, e.g., "Mesha (Aries)", "Vrishabha (Taurus)"
  nakshatra: string; // Stellar constellation, e.g., "Ashwini", "Krittika"
  personalityEffect: string; // Bache par name rkhne ka asar (English)
  urduPersonalityEffect: string; // Bache par asar (Roman Urdu / Urdu)
  isPopular2026: boolean; // Is it trending in 2026?
}

export interface AstroDetails {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender?: 'boy' | 'girl' | 'any';
}

export interface AnalysisResult {
  name: string;
  punjabiName?: string;
  meaning: string;
  soundVibration: string;
  element: string; // Fire, Water, Air, Earth, Ether
  luckyNumber: number;
  luckyDay: string;
  rashiAndNakshatra: string;
  childPersonalityImpact: string; // detailed explanation of "bache par asar"
  guidanceText: string;
  astrologicalScore?: number;
  status?: string; // "Auspicious" | "Incompatible"
  remedyAdvice?: string;
  alternativeLuckySuggestions?: Array<{
    name: string;
    punjabiName?: string;
    meaning: string;
    urduMeaning: string;
    asar: string;
  }>;
}
