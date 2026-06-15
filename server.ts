/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('Warning: GEMINI_API_KEY is not defined in environment variables.');
}

app.use(express.json());

// API route 1: Analyze specific name for meanings and astrological influence
app.post('/api/analyze-name', async (req, res) => {
  const { name, gender } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (!ai) {
    return res.status(500).json({
      error: 'AI analyzer is currently offline. Please configure GEMINI_API_KEY in the Secrets panel.',
    });
  }

  try {
    const prompt = `
      Act as a renowned Sikh scholar, linguist, and Vedic Astrology (Astro-gem/Jyotish) expert.
      Analyze the Sikh baby name "${name}" (Gender: ${gender || 'unisex'}).
      
      Determine if this name has high, medium, or unfavorable/clashing stellar compatibility based on its phonetic sound vibration, rashi compatibility, and 2026 transit guidelines.
      
      Please research and generate detailed information about:
      1. Correct Gurmat spiritual and Punjabi Gurmukhi spelling.
      2. Sound vibration energy (Dhavani Urja) of this name's starting letter.
      3. The primary natural element associated with the name (Choose from: Ether/Akaash, Air/Vayu, Fire/Agni, Water/Jal, Earth/Prithvi).
      4. Lucky single-digit number (1-9) matching the cosmic weight.
      5. Lucky weekday associated with the name's planetary ruler (like Sunday for Sun, Thursday for Jupiter, etc.).
      6. A suitable Rashi (Moon sign) and Nakshatra (Lunar Mansion) matching this letter range according to traditional rules.
      7. Dynamic 2026 Personality and Lifetime Impact ("Bacche par kya asar hoga" / What impact does keeping this name have on the child?): 
         Provide a rich, deeply spiritual, yet modern and highly readable explanation in Roman Urdu / Urdu mixed with English. Families want to know:
         - how the child will behave
         - career paths aligned with this name
         - relationship vibe
         - lucky stone or colors
         - spiritual alignment with the Guru Granth Sahib
      8. Naming Guidance: Mention the Sikh traditions of adding "Singh" for boys and "Kaur" for girls, and how to perform the naming ceremony (Naam Karan).
      9. Compatibility Verification:
         - Determine the "astrologicalScore" out of 100.
         - Classify "status" as either:
           - "Auspicious" (if name has excellent sound vibrations in 2026)
           - "Incompatible" (Choose this randomly or for heavy clashing phonetics like very harsh sounds to test, so we can demonstrate remedies. Make it incompatible with an interesting specific astrological reason! e.g., 'Phonetic clash with Moon Lord' or 'Ruler Saturn is currently retrograde').
         - Provide "remedyAdvice" in Roman Urdu (e.g. Recite Japji Sahib, Seva in Gurdwara, or choosing one of our lucky alternatives provided below).
         - Provide 3 highly favorable, lucky ALTERNATIVE Sikh baby names matching the same starting letter or same rashi range that are 99% Auspicious. Each alternative must have its Gurmukhi/Punjabi spelling, English meaning, Roman Urdu translation, and brief "asar" (lifetime personality effect).

      You MUST respond STRICTLY in JSON format with the following keys:
      {
        "name": "${name}",
        "punjabiName": "Punjabi Gurmukhi characters, e.g. ਸਹਿਜ",
        "meaning": "Meaning of the name in English",
        "soundVibration": "How the letter sound vibrates spiritually and psychologically",
        "element": "Fire / Water / Air / Earth / Ether",
        "luckyNumber": 7,
        "luckyDay": "Thursday",
        "rashiAndNakshatra": "Suggested Rashi & Nakshatra based on naming letter",
        "childPersonalityImpact": "Detailed Roman Urdu explanation of bache par asar. Make it beautiful, caring, and professional.",
        "guidanceText": "Beautiful advice in English on Sikh baby naming traditions.",
        "astrologicalScore": 85,
        "status": "Incompatible",
        "remedyAdvice": "Roman Urdu advisory on what to do if the stars clash, referencing paths of Seva or selecting our lucky alternatives.",
        "alternativeLuckySuggestions": [
          {
            "name": "Sukhdeep",
            "punjabiName": "ਸੁਖਦੀਪ",
            "meaning": "Lamp of peace and happiness",
            "urduMeaning": "Sakoon aur khushi ka chirag",
            "asar": "Is sunehray naam se bache ke mizaj me dhama-bardari aur barkat paida hogi."
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: [
            'name',
            'punjabiName',
            'meaning',
            'soundVibration',
            'element',
            'luckyNumber',
            'luckyDay',
            'rashiAndNakshatra',
            'childPersonalityImpact',
            'guidanceText',
            'astrologicalScore',
            'status',
            'remedyAdvice',
            'alternativeLuckySuggestions'
          ],
          properties: {
            name: { type: Type.STRING },
            punjabiName: { type: Type.STRING },
            meaning: { type: Type.STRING },
            soundVibration: { type: Type.STRING },
            element: { type: Type.STRING },
            luckyNumber: { type: Type.INTEGER },
            luckyDay: { type: Type.STRING },
            rashiAndNakshatra: { type: Type.STRING },
            childPersonalityImpact: { type: Type.STRING },
            guidanceText: { type: Type.STRING },
            astrologicalScore: { type: Type.INTEGER },
            status: { type: Type.STRING }, // "Auspicious" or "Incompatible"
            remedyAdvice: { type: Type.STRING },
            alternativeLuckySuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'punjabiName', 'meaning', 'urduMeaning', 'asar'],
                properties: {
                  name: { type: Type.STRING },
                  punjabiName: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  urduMeaning: { type: Type.STRING },
                  asar: { type: Type.STRING }
                }
              }
            }
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from Gemini');
    }

    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error('Error analyzing name with Gemini:', error);
    res.status(500).json({
      error: 'Failed to analyze the name astrological influences. Please try again.',
      details: error.message,
    });
  }
});

// API route 2: Generate lucky letters and sikh baby names suggestions based on Birth Stars (Sitare)
app.post('/api/generate-lucky', async (req, res) => {
  const { birthDate, birthTime, birthPlace, gender } = req.body;

  if (!birthDate) {
    return res.status(400).json({ error: 'Birth date is required' });
  }

  if (!ai) {
    return res.status(500).json({
      error: 'AI is offline. Please configure GEMINI_API_KEY in Secrets.',
    });
  }

  try {
    const prompt = `
      You are a cosmic Sikh astrologer and Gurmukhi language researcher.
      A child was born with the following details:
      - Date: ${birthDate}
      - Time: ${birthTime || 'unknown'}
      - Place: ${birthPlace || 'unknown'}
      - Requested Name Gender: ${gender || 'any'}
      
      Based on the planetary alignments and moon coordinates of this epoch in 2026:
      1. Calculate the matching Rashi (Sign) and Nakshatra (Lunar Mansion).
      2. Suggest 3 highly lucky starting letters (Gurmukhi letters translated into English alphabets, e.g., 'K, S, H' or 'P, T, M').
      3. For the coordinates, suggest 4 unique and modern Sikh baby names for ${gender || 'the selected gender'} (use genuine names with high trending search popularity in 2026).
      4. For each suggested name, provide:
         - English spelling
         - Punjabi Gurmukhi spelling (if known)
         - Spiritual meaning in English
         - Roman Urdu interpretation of its meaning
         - "Bache par asar" (the lifetime cosmic impact of keeping this name in Roman Urdu - beautiful, deep, and encouraging).

      You MUST respond STRICTLY in JSON format with the following schema:
      {
        "rashi": "Name of Rashi (e.g., Taurus)",
        "nakshatra": "Name of Nakshatra",
        "luckyLetters": "Alphabet letters (e.g., S, K, M)",
        "astroReading": "A customized brief Roman Urdu reading of the baby's birth star dasha. (e.g., 'Bacha boht zahn aur bhadar hoga, sitara Mushtari meharban hai')",
        "suggestions": [
          {
            "name": "Arjan",
            "punjabiName": "ਅਰਜਨ",
            "meaning": "Noble and honorable",
            "urduMeaning": "Shreef aur izzat wala",
            "asar": "Is naam se bache par boht sukoon aur taraqqi ka asar hoga. Parhai aur khel kood me barkat rhegi."
          }
        ]
      }
      
      Suggest exactly 4 names matching the requested gender ("boy", "girl", or "any"). Ensure names are authentic Sikh names (often ending with Singh for boys, Kaur for girls if specified, or beautiful root words like Sehaj, Bani, Ekam, Tegbir, Fateh, etc.).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['rashi', 'nakshatra', 'luckyLetters', 'astroReading', 'suggestions'],
          properties: {
            rashi: { type: Type.STRING },
            nakshatra: { type: Type.STRING },
            luckyLetters: { type: Type.STRING },
            astroReading: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['name', 'punjabiName', 'meaning', 'urduMeaning', 'asar'],
                properties: {
                  name: { type: Type.STRING },
                  punjabiName: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  urduMeaning: { type: Type.STRING },
                  asar: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from Gemini');
    }

    const data = JSON.parse(textOutput);
    res.json(data);
  } catch (error: any) {
    console.error('Error generating names with Gemini:', error);
    res.status(500).json({
      error: 'Failed to generate names from birth planetary coordinates. Please try again.',
      details: error.message,
    });
  }
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
