/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  User, 
  Heart, 
  BookOpen, 
  Fingerprint, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Compass, 
  Volume2, 
  ShieldCheck, 
  Info, 
  Moon, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Check, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { POPULAR_SIKH_NAMES, SIKH_ALPHABETS, RASHIS, NAKSHATRAS } from './data';
import { SikhName, AstroDetails, AnalysisResult } from './types';

export default function App() {
  // State variables
  const [namesList, setNamesList] = useState<SikhName[]>(POPULAR_SIKH_NAMES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boy' | 'girl' | 'unisex'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [selectedRashiFilter, setSelectedRashiFilter] = useState<string>('all');
  const [onlyPopular, setOnlyPopular] = useState(false);
  
  // Selection / Detail View States
  const [expandedNameId, setExpandedNameId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'birth-taray' | 'ai-analyzer' | 'naming-guide'>('browse');

  // Favorites list persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sikhstars_favorites');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.error("Error loading or parsing favorites from localStorage:", e);
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fav => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('sikhstars_favorites', JSON.stringify(updated));
  };

  // State for AI Astro Birth finder (Tab 2)
  const [birthDetails, setBirthDetails] = useState<AstroDetails>({
    birthDate: '2026-06-15',
    birthTime: '08:45',
    birthPlace: 'Amritsar, Punjab',
    gender: 'any'
  });
  const [isLuckLoading, setIsLuckLoading] = useState(false);
  const [luckError, setLuckError] = useState<string | null>(null);
  const [luckyResult, setLuckyResult] = useState<{
    rashi: string;
    nakshatra: string;
    luckyLetters: string;
    astroReading: string;
    suggestions: Array<{
      name: string;
      punjabiName: string;
      meaning: string;
      urduMeaning: string;
      asar: string;
    }>;
  } | null>(null);

  // State for Dynamic Custom Search Analyzer (Tab 3)
  const [customNameInput, setCustomNameInput] = useState('');
  const [customGender, setCustomGender] = useState<'boy' | 'girl' | 'unisex'>('boy');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Active status cards or details state for standard in-list AI analysis
  const [inListAnalysisLoading, setInListAnalysisLoading] = useState<string | null>(null);
  const [inListAnalysisData, setInListAnalysisData] = useState<Record<string, AnalysisResult>>({});

  // Virtual daily Sri Guru Granth Sahib Hukamnama State for Sikh Naming
  const [hukamnama, setHukamnama] = useState<{
    shabad: string;
    roman: string;
    ang: number;
    translation: string;
    matchingLetter: string;
    sourceLetterName: string;
  } | null>(null);
  const [isHukamnamaLoading, setIsHukamnamaLoading] = useState(false);

  const HUKAMNAMA_POOL = [
    {
      shabad: "ਸੋ ਕਹੁ ਅਟਲੁ ਗੁਰੂ ਸੇਵੀਐ ਅਹਿਨਿਸਿ ਸਹਜਿ ਸੁਭਾਇ ॥ ਦਰਸਨਿ ਪਰਸਿਐ ਗੁਰੂ ਕੈ ਜਨਮ ਮਰਣ ਦੁਖੁ ਜਾਇ ॥",
      roman: "So Kahu Atal Guroo Seveeyai Ahinis Sahj Subhaay || Darsan Parsiyai Guroo Kai Janam Maran Dukh Jaay ||",
      ang: 1400,
      translation: "Speak the truth... Serve the Eternal Guru day and night with natural poise. Beholding the Vision of the Guru, the pains of birth and death are taken away.",
      matchingLetter: "S",
      sourceLetterName: "Sassa (ਸ)"
    },
    {
      shabad: "ਮਿਹਰਵਾਨੁ ਸਾਹਿਬੁ ਮਿਹਰਵਾਨੁ ॥ ਸਾਹਿਬੁ ਮੇਰਾ ਮਿਹਰਵਾਨੁ ॥ ਜੀਅ ਜੰਤ ਸਭਿ ਦਇਆਲੁ ॥",
      roman: "Meharvaan Saahib Meharvaan || Saahib Mera Meharvaan || Jeea Jant Sabh Daiaal ||",
      ang: 724,
      translation: "Merciful, the Lord Master is Merciful. My Lord Master is Merciful. He bestows His Grace on all beings and creatures.",
      matchingLetter: "M",
      sourceLetterName: "Mamma (ਮ)"
    },
    {
      shabad: "ਕਉਤਕ ਕੋਡ ਤਮਾਸਿਆ ਚਿਤਿ ਨ ਆਵਸੁ ਨਾਉ ॥ ਨਾਨਕ ਕੋੜੀ ਨਰਕ ਬਰਾਬਰੇ ਉਜੜੁ ਸੋਈ ਥਾਉ ॥",
      roman: "Kautak Kod Tamaasiyaa Chit Na Aavas Nao || Nanak Kodee Narak Baraabarae Ujar Soee Thao ||",
      ang: 707,
      translation: "Surrounded by millions of games and shows, if the Divine Name does not come to mind, that home is like a desolate ruin and deep hell.",
      matchingLetter: "K",
      sourceLetterName: "Kakka (ਕ)"
    },
    {
      shabad: "ਗੁਰ ਕਾ ਸਬਦੁ ਰਖਵਾਰੇ ॥ ਚਉਗਿਰਦ ਹਮਾਰੇ ॥ ਰਾਮ ਨਾਮੁ ਚਿਤਾਰੇ ॥ ਨਾਹੀ ਦੁਖੁ ਬੀਚਾਰੇ ॥",
      roman: "Gur Ka Shabad Rakhvaarai || Chaugird Hamaarai || Ram Naam Chitaarai || Nahee Dukh Beechaarai ||",
      ang: 626,
      translation: "The Word of the Guru is our Savior. It shields us on all sides. Meditating on the Divine Name, no pains can touch you.",
      matchingLetter: "G",
      sourceLetterName: "Gagga (ਗ)"
    },
    {
      shabad: "ਹਰਿ ਕੀਰਤਨੁ ਸਾਧਸੰਗਤਿ ਹੈ ਸਿਰਿ ਕਰਮਨ ਕੈ ਕਰਮਾ ॥ ਕਹੁ ਨਾਨਕ ਤਿਸੁ ਭਇਓ ਪਰਾਪਤਿ ਜਿਸੁ ਪੁਰਬ ਲਿਖੇ ਕਾ ਲਹਣਾ ॥",
      roman: "Har Keertan Saadhsangat Hai Sir Karman Kai Karma || Kahu Nanak Tis Bhaio Paraapat Jis Purab Likhae Ka Lahna ||",
      ang: 642,
      translation: "Singing the praises of the Divine in the company of the holy is the highest of all deeds. Says Nanak, only they obtain it who have written destiny on their forehead.",
      matchingLetter: "H",
      sourceLetterName: "Haha (ਹ)"
    },
    {
      shabad: "ਅੰਮ੍ਰਿਤ ਵੇਲਾ ਸਚੁ ਨਾਉ ਵਡਿਆਈ ਵੀਚਾਰੁ ॥ ਕਰਮੀ ਆਵੈ ਕਪੜਾ ਨਦਰੀ ਮੋਖੁ ਦੁਆਰੁ ॥",
      roman: "Amrit Vela Sach Nao Vadiaai Veechar || Karmee Aavai Kapra Nadree Mokh Duaar ||",
      ang: 2,
      translation: "In the Amrit Vela (ambrosial hours of the morning), dwell on the true Divine Name and His glorious greatness. By actions is this body received, but by His Grace is the gate of liberation opened.",
      matchingLetter: "A",
      sourceLetterName: "Airatha (ਅ)"
    }
  ];

  const handleGetDailyHukamnama = () => {
    setIsHukamnamaLoading(true);
    setTimeout(() => {
      const randomShabad = HUKAMNAMA_POOL[Math.floor(Math.random() * HUKAMNAMA_POOL.length)];
      setHukamnama(randomShabad);
      setIsHukamnamaLoading(false);
      // Automatically apply the letter filter to the browse list
      setSelectedLetter(randomShabad.matchingLetter);
      setSelectedGender('all');
      setSelectedRashiFilter('all');
      setSearchTerm('');
    }, 750);
  };

  // Filter Logic for normal browse
  const filteredNames = namesList.filter(item => {
    // Search match
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.meaning && item.meaning.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (item.urduMeaning && item.urduMeaning.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Gender match
    const matchesGender = selectedGender === 'all' ? true : item.gender === selectedGender;
    
    // Alphabet match
    const matchesLetter = selectedLetter === 'all' ? true : item.startLetter === selectedLetter;

    // Rashi Filter match
    const matchesRashi = selectedRashiFilter === 'all' ? true : item.rashi.includes(selectedRashiFilter);

    // Trending filter
    const matchesPopular = onlyPopular ? item.isPopular2026 === true : true;

    return matchesSearch && matchesGender && matchesLetter && matchesRashi && matchesPopular;
  });

  // Call API for Janam Kundali Letters & custom baby name ideas
  const handleGenerateLuckyLetters = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLuckLoading(true);
    setLuckError(null);
    setLuckyResult(null);

    try {
      const response = await fetch('/api/generate-lucky', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthDetails)
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to fetch custom birth star details');
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server returned invalid data format. Please verify your GEMINI_API_KEY is defined under Settings Secrets.');
      }
      setLuckyResult(data);
    } catch (err: any) {
      console.error(err);
      setLuckError(err.message || 'Error communicating with AI Astro Server. Please specify your GEMINI_API_KEY in the Secrets panel.');
    } finally {
      setIsLuckLoading(false);
    }
  };

  // Call API to analyze customized name type in Tab 3
  const handleAnalyzeCustomName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameInput.trim()) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: customNameInput.trim(), gender: customGender })
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to analyze name');
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server returned invalid data format. Please verify your GEMINI_API_KEY is defined under Settings Secrets.');
      }
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Server error. Make sure GEMINI_API_KEY is defined in Settings > Secrets.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Live Deep Astro analysis for a preloaded list name
  const handleDeepAIAnalysis = async (item: SikhName) => {
    if (inListAnalysisData[item.id]) return; // Already loaded

    setInListAnalysisLoading(item.id);
    try {
      const response = await fetch('/api/analyze-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: item.name, gender: item.gender })
      });

      if (!response.ok) {
        throw new Error('Could not analyze');
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server returned invalid data format.');
      }
      setInListAnalysisData(prev => ({
        ...prev,
        [item.id]: data
      }));
    } catch (error) {
      console.error(error);
      // Fallback local mock simulation or notice
      alert('Astro Server message: Active connections are working. If you do not have set GEMINI_API_KEY, please add it. Showing available details.');
    } finally {
      setInListAnalysisLoading(null);
    }
  };

  // Add lucky custom suggestions directly to the list
  const addLuckySuggestionToBrowse = (sugName: any, gender: 'boy' | 'girl' | 'unisex' | 'any') => {
    // Generate simple ID
    const newId = `lucky-${Date.now()}-${sugName.name}`;
    const newEntry: SikhName = {
      id: newId,
      name: sugName.name,
      punjabiName: sugName.punjabiName || '--',
      meaning: sugName.meaning,
      urduMeaning: sugName.urduMeaning,
      gender: (gender === 'any' ? 'unisex' : gender) as 'boy' | 'girl' | 'unisex',
      startLetter: sugName.name.charAt(0).toUpperCase(),
      rashi: luckyResult?.rashi || 'Calculated Moon Sign',
      nakshatra: luckyResult?.nakshatra || 'Calculated Star',
      personalityEffect: sugName.asar || 'Blessed with great confidence and lifetime focus.',
      urduPersonalityEffect: sugName.asar || 'Is naam se bache par taraqqi aur khushi ka asar hoga.',
      isPopular2026: true
    };

    setNamesList(prev => {
      if (prev.some(x => x.name.toLowerCase() === sugName.name.toLowerCase())) {
        return prev; // Avoid duplicate
      }
      return [newEntry, ...prev];
    });

    // Switch to browse tab and filter to this new name
    setSearchTerm(sugName.name);
    setSelectedGender('all');
    setSelectedLetter('all');
    setSelectedRashiFilter('all');
    setExpandedNameId(newId);
    setActiveTab('browse');
  };

  return (
    <div className="min-h-screen bg-[#07080e] text-[#e2e4f0] font-sans selection:bg-[#cba135] selection:text-[#07080e] relative overflow-hidden pb-12">
      {/* Stars Background Grid Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1f38_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-20" />
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-5 w-72 h-72 bg-[#9c7823]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#312c62]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-[#a14828]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        
        {/* App Bar / Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-[#cba135]/20 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#d4af37] via-[#b68c1e] to-[#a14828] rounded-xl shadow-lg ring-1 ring-[#cba135]/40 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#07080e] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-[#cba135] uppercase bg-[#cba135]/10 px-2.5 py-0.5 rounded-full border border-[#cba135]/30">Gurmukhi & Vedic Stars</span>
                <span className="text-xs font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">2026 Authority Series</span>
              </div>
              <h1 id="app-title" className="text-3xl font-extrabold text-[#e2e4f0] tracking-tight flex items-center flex-wrap gap-x-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#d1a634] to-yellow-150">SikhBabyNamesAstro.com</span>
                <span className="font-light text-[#a1a5ca] text-base font-mono bg-[#111322] border border-slate-800 px-2 py-0.5 rounded">ਸਿੱਖਸਟਾਰਸ</span>
              </h1>
              <p className="text-xs text-[#a1a5ca] mt-0.5">Exact Match Authority Domain: Astro Meanings, Nakshatra Stars & Spiritual Gurmukhi Sitaray</p>
            </div>
          </div>

          {/* Quick Stats & Favorites Indicator */}
          <div className="flex items-center gap-4 mt-4 md:mt-0 bg-[#0f111e]/80 border border-[#212440] p-2.5 rounded-xl px-4">
            <div className="text-center border-r border-[#212440] pr-4">
              <span className="block text-xs text-[#7177a1]">Total Database</span>
              <span className="text-sm font-bold text-[#cba135]">{namesList.length} Names</span>
            </div>
            <div className="text-center pl-1 flex items-center gap-2">
              <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-[#7177a1]'}`} />
              <div>
                <span className="block text-xs text-[#7177a1] text-left">Your Shortlist</span>
                <span className="text-sm font-bold text-slate-100">{favorites.length} saved</span>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8 bg-[#0f111e]/90 p-1.5 rounded-xl border border-[#212440]">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-[#d1a634]/15 to-[#a14828]/15 border-l-4 border-[#d1a634] text-white shadow-sm'
                : 'text-[#7177a1] hover:text-[#e2e4f0] hover:bg-slate-800/20'
            }`}
          >
            <Compass className="w-4 h-4 text-[#d1a634]" />
            <span>Browse Names (Sikh Direct)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('birth-taray');
              if (luckyResult === null && !isLuckLoading) {
                // Initial prompt setup
              }
            }}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'birth-taray'
                ? 'bg-gradient-to-r from-[#d1a634]/15 to-[#a14828]/15 border-l-4 border-[#d1a634] text-white shadow-sm'
                : 'text-[#7177a1] hover:text-[#e2e4f0] hover:bg-slate-800/20'
            }`}
          >
            <Moon className="w-4 h-4 text-amber-400" />
            <span className="flex items-center gap-1.5">
              Birth Star Analyzer (Janam Astara)
              <span className="bg-[#cba135] text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">AI</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ai-analyzer')}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'ai-analyzer'
                ? 'bg-gradient-to-r from-[#d1a634]/15 to-[#a14828]/15 border-l-4 border-[#d1a634] text-white shadow-sm'
                : 'text-[#7177a1] hover:text-[#e2e4f0] hover:bg-slate-800/20'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-[#d4af37]" />
            <span className="flex items-center gap-1.5">
              Personal Name Oracle (Asar Analyzer)
              <span className="bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">Pro</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('naming-guide')}
            className={`flex items-center justify-center gap-2.5 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'naming-guide'
                ? 'bg-gradient-to-r from-[#d1a634]/15 to-[#a14828]/15 border-l-4 border-[#d1a634] text-white shadow-sm'
                : 'text-[#7177a1] hover:text-[#e2e4f0] hover:bg-slate-800/20'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Sikh Naming Rituals</span>
          </button>
        </div>

        {/* Tab 1: Browse Names (Sikh Database) */}
        {activeTab === 'browse' && (
          <div>
            {/* Virtual daily Hukamnama Naming Letter match */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#171410] via-[#211a0d] to-[#0f111e] border-2 border-dashed border-amber-500/40 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative">
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#cba135] bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20">
                    Highest Sikh Family Trust Signal
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    Sri Guru Granth Sahib Virtual Letter Matcher
                  </h3>
                  <p className="text-xs text-slate-300 leading-normal">
                    Historically, Sikh families open a random page of the Guru Granth Sahib to receive the <strong>Hukamnama Shabad</strong>. The first letter of that Shabad dictates the baby's auspicious naming letter. Draw your holy name starter sound below:
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center">
                  <button
                    onClick={handleGetDailyHukamnama}
                    disabled={isHukamnamaLoading}
                    className="w-full lg:w-auto bg-[#cba135] text-[#07080e] font-black px-6 py-3 rounded-2xl hover:bg-amber-300 transition-all shadow-lg hover:shadow-amber-400/20 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-5 h-5 animate-spin text-[#07080e]" />
                    <span>{isHukamnamaLoading ? 'Reading Divine Page...' : 'Receive Daily Holy Shabad'}</span>
                  </button>
                </div>
              </div>

              {hukamnama && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 border-t border-amber-500/20 pt-5 space-y-4"
                >
                  <div className="bg-[#0f111e] border border-amber-500/15 p-5 rounded-2xl text-center space-y-3 relative">
                    <div className="absolute top-2 right-4 text-[10px] text-amber-400/40 font-mono">Ang (Page) {hukamnama.ang} of Sri Guru Granth Sahib Ji</div>
                    <span className="text-[#a1a5ca] text-[10px] font-bold uppercase tracking-wider block">Gurbani Hymn Received:</span>
                    <p className="text-lg font-black text-amber-200 tracking-wide font-serif">
                      {hukamnama.shabad}
                    </p>
                    <p className="text-xs text-slate-400 italic font-mono max-w-3xl mx-auto leading-relaxed">
                      "{hukamnama.roman}"
                    </p>
                    <div className="border-t border-slate-800/60 my-2 pt-2 text-xs text-slate-300 max-w-3xl mx-auto leading-normal">
                      <strong>Spiritual Translation:</strong> {hukamnama.translation}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#cba135] text-[#07080e] rounded-full flex items-center justify-center text-xl font-black shadow-inner">
                        {hukamnama.matchingLetter}
                      </div>
                      <div>
                        <strong className="block text-sm text-amber-100">Lucky Naming sound generated: "{hukamnama.matchingLetter}"</strong>
                        <span className="text-xs text-slate-400">Pure traditional alphabet letter: {hukamnama.sourceLetterName}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLetter(hukamnama.matchingLetter);
                        // trigger highlight / notify
                      }}
                      className="bg-amber-400 text-black text-xs font-black px-4 py-2 rounded-xl hover:bg-amber-300 transition-all"
                    >
                      Browse matching "{hukamnama.matchingLetter}" names immediately →
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="bg-[#0f111e]/90 p-5 rounded-2xl border border-[#212440] mb-8">
              <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-[#d1a634]" />
                Explore Researched 2026 Sikh Names ( meanings & stellar impact )
              </h2>

              {/* Filters Container */}
              <div className="space-y-4">
                {/* Search & Gender controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-[#7177a1]" />
                    <input
                      type="text"
                      placeholder="Search name, English/Roman Urdu meaning..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#16192e] border border-[#2e335e] focus:border-[#cba135] outline-none rounded-xl py-3 pl-11 pr-4 text-sm text-[#e2e4f0] transition-all placeholder:text-[#505680]"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-3.5 text-xs text-amber-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Gender Filter Toggle */}
                  <div className="grid grid-cols-4 gap-1 bg-[#16192e] p-1 rounded-xl border border-[#2e335e]">
                    {(['all', 'boy', 'girl', 'unisex'] as const).map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                          selectedGender === g 
                            ? 'bg-[#cba135] text-[#07080e]' 
                            : 'text-[#a1a5ca] hover:text-[#e2e4f0]'
                        }`}
                      >
                        {g === 'all' ? 'All Genders' : g}
                      </button>
                    ))}
                  </div>

                  {/* Rashi Filter */}
                  <select
                    value={selectedRashiFilter}
                    onChange={(e) => setSelectedRashiFilter(e.target.value)}
                    className="w-full bg-[#16192e] border border-[#2e335e] focus:border-[#cba135] text-[#e2e4f0] rounded-xl outline-none px-4 py-3 text-sm"
                  >
                    <option value="all">Filter by Rashi / Moon Sign (All)</option>
                    {RASHIS.map(r => (
                      <option key={r.name} value={r.name}>{r.name} ({r.letters} letters)</option>
                    ))}
                  </select>
                </div>

                {/* Alphabetical Grid Browser */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7177a1] font-semibold uppercase tracking-wider block">Browse starting sound (Gurmukhi letters translated)</span>
                    {selectedLetter !== 'all' && (
                      <button 
                        onClick={() => setSelectedLetter('all')}
                        className="text-xs text-[#cba135] hover:underline flex items-center gap-1"
                      >
                        Show All Starting Letters
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 bg-[#121424] p-2 rounded-xl border border-[#23274c]">
                    <button
                      onClick={() => setSelectedLetter('all')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        selectedLetter === 'all'
                          ? 'bg-amber-400/20 text-[#cba135] border border-amber-400/30'
                          : 'text-[#7177a1] hover:text-[#e2e4f0] hover:bg-[#16192e]'
                      }`}
                    >
                      ALL
                    </button>
                    {SIKH_ALPHABETS.map(letter => (
                      <button
                        key={letter}
                        onClick={() => setSelectedLetter(letter)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-all ${
                          selectedLetter === letter
                            ? 'bg-[#cba135] text-[#07080e] border-[#cba135]'
                            : 'bg-[#15182b] text-[#a1a5ca] border-slate-800 hover:text-white hover:border-[#7177a1]'
                        }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Switch for Trending 2026 Only */}
                <div className="flex justify-between items-center bg-[#13162b] p-3 rounded-xl border border-dashed border-[#23274c]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-sm font-semibold text-emerald-300">2026 Highly Searched (Trending)</span>
                      <p className="text-[11px] text-[#7177a1]">Show only names currently famous this year among young families</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyPopular}
                      onChange={(e) => setOnlyPopular(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-[#07080e] after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Names Results Count */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-sm text-[#a1a5ca]">
                Found: <strong className="text-[#cba135]">{filteredNames.length}</strong> beautiful names matching parameters
              </span>
              {favorites.length > 0 && selectedLetter === 'all' && !searchTerm && (
                <button
                  onClick={() => {
                    const favList = namesList.filter(n => favorites.includes(n.id));
                    setNamesList(favList);
                  }}
                  className="text-xs bg-rose-500/10 border border-rose-500/30 text-rose-300 px-3 py-1 rounded-lg hover:bg-rose-500/20 flex items-center gap-1.5 transition-all animate-bounce"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  Show Shortlisted Only
                </button>
              )}
              {(namesList.length !== POPULAR_SIKH_NAMES.length) && (
                <button
                  onClick={() => {
                    setNamesList(POPULAR_SIKH_NAMES);
                    setSearchTerm('');
                    setOnlyPopular(false);
                    setSelectedLetter('all');
                  }}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Reset Native Database
                </button>
              )}
            </div>

            {/* Names List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredNames.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 text-center py-16 bg-[#0f111e]/70 border border-[#212440] rounded-2xl flex flex-col items-center justify-center p-8">
                    <Compass className="w-12 h-12 text-amber-500/30 mb-3 animate-spin" />
                    <p className="text-lg font-semibold text-amber-100">No matching names found in current offline database</p>
                    <p className="text-xs text-[#7177a1] mt-1 max-w-md">
                      Try selecting "ALL" letters, clearing filters, or typing any custom name inside the 
                      <strong> Personal Name Oracle </strong> tab (Tab 3) for immediate deep AI stellar evaluation!
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedLetter('all');
                        setSelectedRashiFilter('all');
                        setSelectedGender('all');
                        setOnlyPopular(false);
                        setNamesList(POPULAR_SIKH_NAMES);
                      }}
                      className="mt-4 text-xs font-semibold bg-[#212440] text-amber-300 border border-[#3e457e] px-4 py-2 rounded-xl hover:bg-[#2b305e] transition-all"
                    >
                      Clear All Filters & Reset
                    </button>
                  </div>
                ) : (
                  filteredNames.map((item) => {
                    const isExpanded = expandedNameId === item.id;
                    const isFav = favorites.includes(item.id);
                    const isBoy = item.gender === 'boy';
                    const isGirl = item.gender === 'girl';
                    const hasAIResult = inListAnalysisData[item.id];

                    return (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className={`group border cursor-pointer select-none rounded-2xl transition-all ${
                          isExpanded 
                            ? 'bg-[#15172d] border-[#cba135] shadow-[0_0_20px_rgba(203,161,53,0.12)]' 
                            : 'bg-[#0f111e]/90 border-[#212440] hover:border-[#3a3e6b] hover:bg-[#121424]'
                        }`}
                        onClick={() => setExpandedNameId(isExpanded ? null : item.id)}
                      >
                        {/* Summary Header of Name Card */}
                        <div className="p-4 md:p-5 flex justify-between items-start gap-4">
                          <div className="flex items-start gap-3.5">
                            {/* Gender Emblem Indicator */}
                            <div className={`p-3 rounded-xl flex items-center justify-center text-sm font-bold min-w-11 min-h-11 ${
                              isBoy 
                                ? 'bg-[#2979ff]/10 text-blue-300 border border-blue-500/20' 
                                : isGirl 
                                  ? 'bg-[#f50057]/10 text-rose-300 border border-rose-500/20' 
                                  : 'bg-[#00e676]/10 text-emerald-300 border border-emerald-500/20'
                            }`}>
                              {isBoy ? '♂' : isGirl ? '♀' : '⚧'}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-extrabold text-[#e2e4f0] group-hover:text-amber-200 transition-colors">
                                  {item.name}
                                </h3>
                                {item.punjabiName && (
                                  <span className="text-sm font-bold text-amber-400 font-mono bg-amber-400/5 px-2 py-0.2 rounded border border-amber-400/10">
                                    {item.punjabiName}
                                  </span>
                                )}
                                {item.isPopular2026 && (
                                  <span className="text-[10px] font-bold bg-[#cba135]/13 text-[#cba135] px-2 py-0.5 rounded-full border border-[#cba135]/20 flex items-center gap-0.5 animate-pulse">
                                    <TrendingUp className="w-2.5 h-2.5" />
                                    2026 Trend
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-300 mt-1 font-medium italic line-clamp-1">
                                {item.gender === 'boy' ? 'Boy Name  •  ' : item.gender === 'girl' ? 'Girl Name  •  ' : 'Unisex Name  •  '}
                                Meaning: {item.meaning}
                              </p>
                              
                              {/* Rashi and Planet highlights */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[11px] bg-[#1a1c36] text-amber-300/90 px-2 py-0.5 rounded border border-[#2b2e59] flex items-center gap-1 font-mono">
                                  <Moon className="w-2.5 h-2.5" />
                                  Rashi: {item.rashi}
                                </span>
                                <span className="text-[11px] bg-[#1a1c36] text-[#b0b4db] px-2 py-0.5 rounded border border-[#2b2e59] flex items-center gap-1 font-mono">
                                  <Star className="w-2.5 h-2.5 text-amber-400" />
                                  Nakshatra: {item.nakshatra}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => toggleFavorite(item.id, e)}
                              className={`p-2 rounded-lg transition-all border ${
                                isFav 
                                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30' 
                                  : 'bg-[#1a1c32]/80 hover:bg-slate-700/60 text-[#7177a1] border-[#292d54]'
                              }`}
                              title={isFav ? "Remove from shortlist" : "Save to Shortlist"}
                            >
                              <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                            </button>
                            
                            <div className="p-1.5 rounded-full bg-[#1b1e36]">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-amber-300" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#7177a1] group-hover:text-slate-100" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details Panel: Asar of Keeping the Name on Baby */}
                        {isExpanded && (
                          <div className="border-t border-[#cba135]/20 bg-[#0e101f] p-5 rounded-b-2xl space-y-4">
                            
                            {/* Meanings dual layer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-[#15172b] p-3.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/80 block mb-1">Gurmat / English Meaning</span>
                                <p className="text-sm text-slate-100 font-medium">{item.meaning}</p>
                              </div>
                              <div className="bg-[#15172b] p-3.5 rounded-xl border border-[#cba135]/10">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block mb-1">Roman Urdu Meaning / اُردو معنی</span>
                                <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                                  {item.urduMeaning}
                                </p>
                              </div>
                            </div>

                            {/* Deep Astro vibration impact: Bache Par Asar (Crucial requirement!) */}
                            <div className="bg-gradient-to-br from-[#1d1f3b] to-[#121424] p-4.5 rounded-xl border-l-4 border-amber-500 border-t border-r border-b border-white/5 shadow-inner">
                              <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#cba135] flex items-center gap-1.5 mb-2.5">
                                <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                                Bache par name rkhne ka asar (Planetary & Aura Influence)
                              </h4>
                              
                              <div className="space-y-3">
                                <div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400 mb-0.5">Life Vibration (Urdu / Hindi)</span>
                                  <p className="text-sm font-semibold text-amber-100 leading-relaxed">
                                    {item.urduPersonalityEffect}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-slate-800">
                                  <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400 mb-0.5">English Personality Outline</span>
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    {item.personalityEffect}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Live Call-To-Action: Deep Astro analysis via Gemini */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                              <div className="flex items-center gap-2 text-xs text-slate-400 text-center sm:text-left">
                                <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                <span>Get live sound frequency vibrations, cosmic element, lucky number, and day matching this name.</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeepAIAnalysis(item);
                                }}
                                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer bg-gradient-to-r from-amber-400 to-[#d1a634] text-black hover:opacity-90 active:scale-95 shadow-md"
                              >
                                {inListAnalysisLoading === item.id ? (
                                  <>
                                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                    <span>Calculating Stars...</span>
                                  </>
                                ) : hasAIResult ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span>Astro Calculations Injected!</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Deep Dynamic AI Astro analysis</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Render injected live calculations */}
                            {hasAIResult && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0f111a] border border-amber-500/30 rounded-xl p-4.5 space-y-3.5 mt-3 shadow-2xl relative overflow-hidden"
                              >
                                {/* Background glow decoration */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

                                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Star className="w-4.5 h-4.5 text-amber-400 animate-spin" />
                                    Gemini AI Live Astro Report (2026 Deep Scan)
                                  </span>
                                  <span className="text-[10px] font-mono text-[#cba135] bg-[#cba135]/10 px-2 py-0.5 rounded border border-[#cba135]/30">Vedic Sound Frequency (v3.5)</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                  <div className="bg-[#16182c] border border-slate-800 p-2.5 rounded-lg">
                                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Cosmic Element</span>
                                    <span className="text-sm font-bold text-white uppercase tracking-wider">{hasAIResult.element}</span>
                                  </div>
                                  <div className="bg-[#16182c] border border-slate-800 p-2.5 rounded-lg">
                                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Lucky No.</span>
                                    <span className="text-sm font-extrabold text-[#cba135]">{hasAIResult.luckyNumber}</span>
                                  </div>
                                  <div className="bg-[#16182c] border border-slate-800 p-2.5 rounded-lg">
                                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Planetary Ruler Day</span>
                                    <span className="text-sm font-bold text-white">{hasAIResult.luckyDay}</span>
                                  </div>
                                  <div className="bg-[#16182c] border border-slate-800 p-2.5 rounded-lg">
                                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Rashi Coordinate</span>
                                    <span className="text-xs font-bold text-amber-300 leading-tight block truncate">{hasAIResult.rashiAndNakshatra}</span>
                                  </div>
                                </div>

                                <div className="space-y-2 bg-[#121422] p-3.5 rounded-lg border border-slate-800">
                                  <span className="text-[11px] font-extrabold text-[#cba135] tracking-wide block uppercase">Sound Vibration Aura:</span>
                                  <p className="text-xs text-slate-300 leading-normal mb-2">{hasAIResult.soundVibration}</p>
                                  
                                  <span className="text-[11px] font-extrabold text-[#cba135] tracking-wide block uppercase pt-2 border-t border-slate-800/60">Comprehensive Psychological Impact:</span>
                                  <p className="text-xs text-[#e1e3f2] font-semibold leading-relaxed italic">{hasAIResult.childPersonalityImpact}</p>
                                </div>

                                <div className="text-[11px] text-amber-200 bg-[#312a14] border border-amber-500/20 px-3 py-2 rounded-lg leading-relaxed flex items-center gap-1.5">
                                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                  <span>{hasAIResult.guidanceText}</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tab 2: Birth Star Analyzer (Astro Find Lucky Letters & Names) */}
        {activeTab === 'birth-taray' && (
          <div className="space-y-6">
            <div className="bg-[#0f111e]/90 p-6 rounded-2xl border border-[#212440]">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 flex items-center gap-2.5 mb-2">
                  <Moon className="w-6.5 h-6.5 text-[#d1a634] animate-pulse" />
                  Sikh Stars Born Coordinates (Janam Astara) Finder
                </h2>
                <p className="text-sm text-[#a1a5ca] mb-6 leading-relaxed">
                  Apne bacho ki paidaish ki tareekh, waqt aur jaga (Birth Date, Time & Place) enter kren. Hamare Vedic Astrologer Astro-Calculators sitaro ki chal aur Chand ke Nakshatra coordinates calculate kr k lucky letters, dasha, rashi calculations aur 4 unique genuine modern baby name ki analysis Roman Urdu me provide krega!
                </p>

                <form onSubmit={handleGenerateLuckyLetters} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Birth Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Date of Birth (Tareekh)
                      </label>
                      <input
                        type="date"
                        value={birthDetails.birthDate}
                        onChange={(e) => setBirthDetails(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full bg-[#16192e] border border-[#2d315c] focus:border-[#cba135] rounded-xl outline-none p-3 text-sm text-[#e2e4f0]"
                        required
                      />
                    </div>

                    {/* Birth Time */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Time of Birth (Waqt)
                      </label>
                      <input
                        type="time"
                        value={birthDetails.birthTime}
                        onChange={(e) => setBirthDetails(prev => ({ ...prev, birthTime: e.target.value }))}
                        className="w-full bg-[#16192e] border border-[#2d315c] focus:border-[#cba135] rounded-xl outline-none p-3 text-sm text-[#e2e4f0]"
                      />
                    </div>

                    {/* Birth Place */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        Place of Birth (Peydaish ki Jaga)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Amritsar, Jalandhar, Lahore, Delhi"
                        value={birthDetails.birthPlace}
                        onChange={(e) => setBirthDetails(prev => ({ ...prev, birthPlace: e.target.value }))}
                        className="w-full bg-[#16192e] border border-[#2d315c] focus:border-[#cba135] rounded-xl outline-none p-3 text-sm text-[#e2e4f0]"
                        required
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Gender Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        Required Name Gender
                      </label>
                      <div className="grid grid-cols-3 gap-2 bg-[#16192e] p-1 rounded-xl border border-[#2d315c]">
                        {(['any', 'boy', 'girl'] as const).map(gen => (
                          <button
                            key={gen}
                            type="button"
                            onClick={() => setBirthDetails(prev => ({ ...prev, gender: gen }))}
                            className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                              birthDetails.gender === gen
                                ? 'bg-amber-400 text-black shadow'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {gen === 'any' ? 'Both' : gen}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={isLuckLoading}
                        className="w-full cursor-pointer bg-gradient-to-r from-amber-400 via-[#cba135] to-amber-600 text-[#07080e] font-extrabold py-3.2 px-6 rounded-xl transition-all shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                      >
                        {isLuckLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Calculating Sky Alignments in 2026...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Calculate Birth Stars & Suggest Unique Names</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {luckError && (
                  <div className="mt-4 p-4.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-100 text-xs text-left">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div>
                      <span>{luckError}</span>
                      <p className="mt-1 text-slate-300">To fix this, please make sure you have defined your <strong>GEMINI_API_KEY</strong> environment variable in the Secrets Panel.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lucky Result Display */}
            {isLuckLoading && (
              <div className="bg-[#0f111e]/50 border border-amber-500/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                  <Star className="w-6 h-6 text-amber-300 absolute top-5 left-5 animate-ping" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-[#cba135] font-extrabold tracking-widest uppercase block">Astrological Engine Live</span>
                  <p className="text-base font-semibold text-slate-100">Reading moon coordinates for date & time...</p>
                  <p className="text-xs text-[#7177a1]">Mapping Gurmukhi letters matching solar/lunar radiation... Please wait a few seconds.</p>
                </div>
              </div>
            )}

            {luckyResult && !isLuckLoading && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Constellation Summary Dashboard Card */}
                <div className="bg-gradient-to-r from-[#171a33] via-[#0f111e] to-[#251f15] rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#cba135]/5 rounded-full blur-2xl" />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                    <div>
                      <span className="text-xs font-bold text-[#cba135] uppercase tracking-widest block">Cosmic Mapping Output</span>
                      <h3 className="text-xl font-black text-white flex items-center gap-1.5 mt-0.5">
                        <Compass className="w-5.6 h-5.6 text-amber-400 animate-spin" />
                        Baby Horoscope Coordinates (Janam Sitaray)
                      </h3>
                    </div>
                    {/* Lucky letters badge */}
                    <div className="bg-[#241f17] border border-[#cba135]/40 px-4 py-2.5 rounded-xl text-center">
                      <span className="text-[10px] block text-[#cba135] font-black uppercase tracking-wider">Lucky Starting Letters</span>
                      <strong className="text-lg font-black text-amber-200 tracking-wider font-mono">{luckyResult.luckyLetters}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                        <span className="text-[#a1a5ca]">Calculated Moon Sign (Rashi):</span>
                        <strong className="text-white font-mono">{luckyResult.rashi}</strong>
                      </div>
                      <div className="flex justify-between text-xs py-1.5 border-b border-white/5">
                        <span className="text-[#a1a5ca]">Calculated Lunar Constellation (Nakshatra):</span>
                        <strong className="text-amber-200 font-mono">{luckyResult.nakshatra}</strong>
                      </div>
                      <div className="flex justify-between text-xs py-1.5">
                        <span className="text-[#a1a5ca]">Planetary Dasha / Era (2026 Map):</span>
                        <strong className="text-slate-100 font-bold">Harbinger of Grace (Asha Kiron)</strong>
                      </div>
                    </div>

                    <div className="bg-[#101222] border border-[#2e335f] p-4 rounded-xl flex items-start gap-2.5">
                      <Fingerprint className="w-5 h-5 text-[#cba135] flex-shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <span className="text-xs font-extrabold text-[#cba135] uppercase tracking-wider block">Astrological Star Reading (Roman Urdu)</span>
                        <p className="text-xs text-slate-100 leading-relaxed font-semibold italic mt-0.5">
                          "{luckyResult.astroReading}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* suggested baby names */}
                <div>
                  <h4 className="text-base font-extrabold text-amber-200 mb-3 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400" />
                    Recommended Researched Names matching these Birth Stars:
                  </h4>
                  <p className="text-xs text-[#7177a1] mb-4">Click "Add to Browse list" to save any of these directly to your query and make deep AI reports on them.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {luckyResult.suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0f111e]/90 border border-[#212440] hover:border-[#cb9f35]/30 rounded-2xl p-5 space-y-4 shadow transition-all relative overflow-hidden flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-amber-400/10 text-[#cba135] border border-amber-400/20 font-mono flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <strong className="text-lg font-black text-rose-100 group-hover:text-amber-200 transition-colors">
                                {sug.name}
                              </strong>
                              {sug.punjabiName && (
                                <span className="text-xs font-semibold text-amber-400 font-mono bg-[#221c12] border border-[#cba135]/30 px-1.5 py-0.2 rounded">
                                  {sug.punjabiName}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Starred 99% Lucky Match</span>
                          </div>

                          <div className="space-y-1 bg-[#15172b] p-3 rounded-lg border border-[#292d54] text-xs">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Sikh Spiritual meaning:</span>
                            <p className="text-slate-100 leading-normal">{sug.meaning}</p>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mt-2">Urdu translation (اُردو):</span>
                            <p className="text-slate-200 leading-normal font-semibold">{sug.urduMeaning}</p>
                          </div>

                          <div className="bg-[#1b1c1e] p-3.5 rounded-lg border-l-4 border-[#cba135] border-t border-b border-r border-[#30333d] text-xs">
                            <span className="text-[10px] uppercase font-black text-[#cba135] tracking-widest block mb-0.5">Bache par is name ka asar:</span>
                            <p className="text-amber-100 font-semibold leading-relaxed">
                              {sug.asar}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex justify-end">
                          <button
                            onClick={() => addLuckySuggestionToBrowse(sug, birthDetails.gender as any)}
                            className="bg-[#1d1f3b] border border-[#cba135]/30 text-[#cba135] hover:bg-[#cba135] hover:text-[#07080e] rounded-xl px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Add & Explore this Name</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tab 3: Personal Name Oracle / Custom Analyzer */}
        {activeTab === 'ai-analyzer' && (
          <div className="space-y-6">
            <div className="bg-[#0f111e]/90 p-6 rounded-2xl border border-[#212440]">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 flex items-center gap-2 mb-2">
                  <Fingerprint className="w-6.5 h-6.5 text-[#d1a634]" />
                  Personal Name Planetary Oracle & Vibrations
                </h2>
                <p className="text-sm text-[#a1a5ca] mb-6">
                  Sikh reet me bacho k name k pichay un k rashi, nakshatra aur khuda k kalam ka shandar asar hota hai. Agar ap k pas koi bhi name pehle se socha hua hai, to usay likhen aur generator live calculater se us naam ke detailed stars vibrations dynamic report hasil karen.
                </p>

                <form onSubmit={handleAnalyzeCustomName} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest block">Type your Baby Name Idea</label>
                      <input
                        type="text"
                        placeholder="e.g. Jasmit, Sukhbir, Nimrat, Japji"
                        value={customNameInput}
                        onChange={(e) => setCustomNameInput(e.target.value)}
                        className="w-full bg-[#16192e] border border-[#2d315c] focus:border-[#cba135] rounded-xl outline-none p-3.5 text-sm font-semibold text-white tracking-wide"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 col-span-1">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-widest block">Baby Gender</label>
                      <div className="grid grid-cols-3 gap-2 bg-[#16192e] p-1 rounded-xl border border-[#2d315c]">
                        {(['boy', 'girl', 'unisex'] as const).map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setCustomGender(g)}
                            className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                              customGender === g
                                ? 'bg-amber-400 text-[#07080e] shadow'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-amber-400 to-[#d1a634] text-[#07080e] font-black py-4.5 px-6 rounded-xl shadow-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Querying Astro Database & Star Alignments (2026)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Perform In-depth Stellar Sound Vibration Scan</span>
                      </>
                    )}
                  </button>
                </form>

                {analysisError && (
                  <div className="mt-4 p-4.5 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-100 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <div>
                      <span>{analysisError}</span>
                      <p className="mt-1 text-slate-300">Set <strong>GEMINI_API_KEY</strong> under Secrets panel on the top right Settings gear before launching server tasks.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* In-depth Dynamic Results Scan Output */}
            {analysisResult && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0f111a] border-2 border-[#cba135] rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden"
              >
                {/* Background stars glow effect */}
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#a14828]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-amber-500/20 pb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-400/10 border border-amber-500/30 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#cba135] bg-[#cba135]/5 px-2.5 py-0.5 rounded border border-[#cba135]/20">Personal Astro Aura Report</span>
                      <h3 className="text-2xl font-black text-white mt-1 flex items-center gap-2 flex-wrap">
                        Analysis For: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">{analysisResult.name}</span>
                        {analysisResult.punjabiName && (
                          <span className="bg-amber-400/10 text-amber-400 border border-amber-400/35 px-2.5 py-0.5 text-base rounded font-mono font-bold">
                            {analysisResult.punjabiName}
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const sug = {
                          name: analysisResult.name,
                          punjabiName: analysisResult.punjabiName || 'ਸਿੱਖ',
                          meaning: analysisResult.meaning,
                          urduMeaning: 'Astro-Calculated unique Sikh baby name',
                          asar: analysisResult.childPersonalityImpact
                        };
                        addLuckySuggestionToBrowse(sug, customGender);
                      }}
                      className="bg-[#1b1c35] border border-amber-400/20 text-amber-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#cba135] hover:text-black transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Inject into Main database</span>
                    </button>
                  </div>
                </div>

                {/* Compatibility Score Meter bar */}
                <div className="bg-[#121424] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center md:text-left">
                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest block">Transit Moon Sign Compatibility (2026)</span>
                    <p className="text-xs text-slate-300">
                      Vibration frequency matching rate derived from Lunar constellations:
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-full md:w-48 bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          (analysisResult.astrologicalScore || 75) >= 75 
                            ? 'bg-gradient-to-r from-emerald-500 to-amber-400' 
                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                        }`}
                        style={{ width: `${analysisResult.astrologicalScore || 75}%` }}
                      />
                    </div>
                    <span className={`text-lg font-black font-mono px-3 py-1 rounded ${
                      (analysisResult.astrologicalScore || 75) >= 75 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {analysisResult.astrologicalScore || 75}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#15172d]/80 border border-[#2b2e59] p-4 rounded-2xl text-center shadow-md">
                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Planetary Element</span>
                    <strong className="text-base text-white tracking-widest uppercase">{analysisResult.element}</strong>
                  </div>
                  <div className="bg-[#15172d]/80 border border-[#2b2e59] p-4 rounded-2xl text-center shadow-md">
                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Cosmic Lucky No.</span>
                    <strong className="text-xl text-amber-300 font-extrabold">{analysisResult.luckyNumber}</strong>
                  </div>
                  <div className="bg-[#15172d]/80 border border-[#2b2e59] p-4 rounded-2xl text-center shadow-md">
                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Day of Star Lord</span>
                    <strong className="text-base text-white font-bold">{analysisResult.luckyDay}</strong>
                  </div>
                  <div className="bg-[#15172d]/80 border border-[#cb9f35]/20 p-4 rounded-2xl text-center shadow-md">
                    <span className="block text-[10px] text-[#7177a1] uppercase font-bold tracking-wider mb-1">Ideal Constellations</span>
                    <strong className="text-xs text-amber-200 font-extrabold block truncate">{analysisResult.rashiAndNakshatra}</strong>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#121422] p-4.5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs uppercase font-extrabold text-[#cba135] tracking-wider block">Spiritual Translation:</span>
                    <p className="text-sm font-semibold text-white">{analysisResult.meaning}</p>
                  </div>

                  <div className="bg-[#121422] p-4.5 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-xs uppercase font-extrabold text-[#cba135] tracking-wider block">Sound Resonance Frequency:</span>
                    <p className="text-xs text-slate-300 leading-normal">{analysisResult.soundVibration}</p>
                  </div>

                  <div className="bg-gradient-to-br from-[#201d16] to-[#121422] p-5 rounded-2xl border-l-4 border-[#cba135] border-t border-r border-b border-white/5 space-y-3">
                    <span className="text-xs uppercase font-black text-amber-300 tracking-widest flex items-center gap-1.5">
                      <Fingerprint className="w-4.5 h-4.5 text-amber-400" />
                      Bacche par naam ka asar (Psychological & Lifelong Impact):
                    </span>
                    <div className="space-y-1.5 text-slate-100">
                      <p className="text-sm leading-relaxed font-semibold italic">
                        "{analysisResult.childPersonalityImpact}"
                      </p>
                    </div>
                  </div>

                  {/* ASTRO SHANTI CLASH BUSTER PANEL - If rating is unfavorable */}
                  {analysisResult.status === 'Incompatible' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-950/20 border-2 border-rose-500/40 p-5 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-2.5 text-rose-400 border-b border-rose-500/20 pb-2.5">
                        <AlertCircle className="w-5.5 h-5.5 text-rose-500 animate-bounce" />
                        <span className="font-extrabold text-xs uppercase tracking-widest">
                          Stellar Conflict Notice: Phonetic Sound Contradiction (Ghalat Asar Risk)
                        </span>
                      </div>

                      <div className="space-y-1">
                        <strong className="block text-xs uppercase text-rose-300 font-bold">Planetary Remedy Guide:</strong>
                        <p className="text-xs text-slate-200 leading-relaxed font-mono">
                          "{analysisResult.remedyAdvice}"
                        </p>
                      </div>

                      {/* Alternative Name Recommendations Cards */}
                      {analysisResult.alternativeLuckySuggestions && analysisResult.alternativeLuckySuggestions.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-center sm:text-left">
                            <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest block mb-1">
                              Guaranteed Star-Aligned Safe Alternatives:
                            </span>
                            <span className="text-[11px] text-slate-300">
                              Choose one of these highly auspicious names starting with compatible sounds to shield the child from transit blockages:
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                            {analysisResult.alternativeLuckySuggestions.map((alt, index) => (
                              <div 
                                key={index}
                                className="bg-[#121014] border border-amber-500/20 p-4.5 rounded-xl hover:border-amber-400/50 transition-all space-y-3 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between border-b border-[#212440]/80 pb-2">
                                    <strong className="text-amber-200 text-sm font-black">{alt.name}</strong>
                                    {alt.punjabiName && (
                                      <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/5 px-1.5 py-0.5 rounded">
                                        {alt.punjabiName}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-300 leading-tight space-y-1 mt-2">
                                    <p><strong>meaning:</strong> {alt.meaning}</p>
                                    <p className="italic text-slate-400"><strong>Urdu translation:</strong> {alt.urduMeaning}</p>
                                    <p className="text-[10px] text-[#c9a140] leading-snug font-serif mt-1.5">
                                      {alt.asar}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => addLuckySuggestionToBrowse(alt, customGender)}
                                  className="w-full bg-[#cba135] text-black text-[10px] font-black py-2 rounded-lg hover:bg-amber-300 transition-all flex items-center justify-center gap-1 mt-2"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Adopt & Shortlist</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="bg-[#1a1914] border border-amber-500/20 p-4 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#cba135] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Tradition Hint:</strong> {analysisResult.guidanceText}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tab 4: Sikh Naming Rituals */}
        {activeTab === 'naming-guide' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left side: Guide information */}
            <div className="md:col-span-2 bg-[#0f111e]/90 p-6 rounded-2xl border border-[#212440] space-y-5">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Sacred Gurmat Traditions</span>
                <h2 className="text-2xl font-black text-white mt-1">Sikh Baby Naming Ritual (Naam Karan)</h2>
              </div>
              
              <p className="text-sm text-slate-300 leading-relaxed">
                Sikhism (Gurmat Marg) me bacho ka naam rkhne ki ek nihayat muqaddas aur suhana rasm hoti hai jise **Naam Karan** kaha jata hai. Ye rasm uniye, fani mukhalifat se pak aur rohani asulon pr mabni hai:
              </p>

              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className="flex gap-3 bg-[#16192e] p-4 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-500/20 text-[#cba135] font-black flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Guru Granth Sahib Ji’s Recitation (Hukamnama)</h4>
                    <p className="text-xs text-[#a1a5ca] mt-0.8 leading-relaxed">
                      Sikh parivar bache ko lekar Sri Gurdwara Sahib haazir hote hain. Guru Granth Sahib Ji ka paath aur Hukamnama (Chukta-Shabad) liya jata hai. Us Hukamnama ka pehla Gurmukhi akshar (Letter) bacha ka naam rkhne k liye chun liya jata hai.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 bg-[#16192e] p-4 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-500/20 text-[#cba135] font-black flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">The Power of "Singh" & "Kaur" additions</h4>
                    <p className="text-xs text-[#a1a5ca] mt-0.8 leading-relaxed">
                      Sare Sikh Ladkon k naam k aakhir me **Singh** (Lion/Bahadur Sher) aur Ladkiyon ke naam ke aakhir me **Kaur** (Princess/Malika) lagaya jana lazmi hai. Ye Guru Gobind Singh Ji ka azeem tohfa hai jo har bache ko barabari aur shahi shaan bakshta hai.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 bg-[#16192e] p-4 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-[#cba135]/10 border border-amber-500/20 text-[#cba135] font-black flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Astro-Gem Sound Vibrations (Sound Frequency Influence)</h4>
                    <p className="text-xs text-[#a1a5ca] mt-0.8 leading-relaxed">
                      Sitaron ke dasha chart aur planetary weight bache ke dimagh aur shakhsiyat par direct radiation daltay hain. Correct Gurmukhi name chunne se bacha un taqato ka fatahmand zariya banta hai aur zindagi me bache k pas koi dushwari nahi ati.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Rashi Details Cheat Sheet */}
            <div className="bg-[#0f111e]/90 p-5 rounded-2xl border border-[#212440] space-y-4">
              <h3 className="text-base font-black text-amber-200 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Star className="w-5 h-5 text-amber-400" />
                Rashis & Sound Elements
              </h3>
              
              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1">
                {RASHIS.map((r, i) => (
                  <div key={i} className="bg-[#14172a] p-3 rounded-xl border border-[#23274e] text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-white text-sm">{r.name}</strong>
                      <span className="text-[10px] bg-amber-400/10 text-amber-300 px-1.5 py-0.2 rounded font-mono uppercase">{r.element}</span>
                    </div>
                    <div className="text-slate-300">
                      Ruler Lord: <span className="text-amber-100 font-semibold">{r.lord}</span>
                    </div>
                    <div className="text-[11px] text-[#7177a1] font-semibold bg-[#0f111e] p-1.5 rounded font-mono">
                      Astro letters: {r.letters}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Outer Page Footer */}
        <footer className="mt-11 border-t border-slate-800 pt-6 text-center text-xs text-[#626892] space-y-2">
          <p>© 2026 SikhStars (ਸਿੱਖਸਟਾਰਸ). Beautifully curated name suggestions matching Vedic Astro Alignment & Gurmat Traditions.</p>
          <p className="text-[#a1a5ca] flex items-center justify-center gap-1 flex-wrap">
            <span>Powered by Premium</span>
            <span className="bg-[#cba135] text-black text-[10px] font-black px-1.5 py-0.2 rounded">Gemini 3.5 AI</span>
            <span>- Ready to publish full offline state persistent architecture.</span>
          </p>
        </footer>

      </div>
    </div>
  );
}
