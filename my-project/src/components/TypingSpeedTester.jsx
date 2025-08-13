import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Settings, Timer, Target, Zap, Clock, Palette, Play } from 'lucide-react';

const TypingSpeedTester = () => {
  const [words] = useState([
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "this", "is", 
    "test", "typing", "speed", "accuracy", "keyboard", "practice", "improve", "skills",
    "fast", "slow", "better", "good", "great", "excellent", "perfect", "amazing",
    "wonderful", "beautiful", "simple", "complex", "easy", "difficult", "challenge",
    "focus", "concentrate", "relax", "breathe", "steady", "rhythm", "flow", "smooth"
  ]);
  
  const [displayWords, setDisplayWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [wordStates, setWordStates] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [testDuration, setTestDuration] = useState(30);
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [showSetup, setShowSetup] = useState(true);
  const inputRef = useRef(null);

  
  const themes = {
    modern: {
      name: "Modern",
      description: "Clean and minimal",
      bg: "bg-gray-900",
      text: "text-gray-300",
      accent: "text-yellow-500",
      correct: "text-green-400",
      incorrect: "text-red-400",
      cursor: "bg-yellow-500",
      container: "bg-gray-800",
      font: "font-mono"
    },
    cyberpunk: {
      name: "Cyberpunk",
      description: "Neon-lit future",
      bg: "bg-black",
      text: "text-cyan-300",
      accent: "text-pink-500",
      correct: "text-cyan-400",
      incorrect: "text-red-400",
      cursor: "bg-pink-500",
      container: "bg-gray-900 border border-cyan-500",
      font: "font-mono"
    },
    typewriter: {
      name: "Typewriter",
      description: "Classic vintage feel",
      bg: "bg-amber-50",
      text: "text-amber-900",
      accent: "text-amber-800",
      correct: "text-green-700",
      incorrect: "text-red-700",
      cursor: "bg-amber-800",
      container: "bg-amber-100 border-2 border-amber-300",
      font: "font-serif"
    },
    terminal: {
      name: "Terminal",
      description: "Green on black hacker style",
      bg: "bg-black",
      text: "text-green-400",
      accent: "text-green-300",
      correct: "text-green-200",
      incorrect: "text-red-400",
      cursor: "bg-green-400",
      container: "bg-gray-900 border border-green-500",
      font: "font-mono"
    }
  };

  const timeOptions = [15, 30, 60, 120];
  const currentTheme = themes[selectedTheme];

  
  useEffect(() => {
    const generateWords = () => {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 50);
      setDisplayWords(selected);
      setWordStates(new Array(selected.length).fill('untyped'));
    };
    generateWords();
  }, [words]);

  
  useEffect(() => {
    let interval = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);
        
        if (elapsed >= testDuration) {
          finishTest();
        } else {
          
          const minutes = elapsed / 60;
          const wordsTyped = correctChars / 5;
          setWpm(minutes > 0 ? Math.round(wordsTyped / minutes) : 0);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime, correctChars, testDuration, isFinished]);

  
  const [typewriterKey, setTypewriterKey] = useState(0);

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    
    setTypewriterKey(prev => prev + 1);
    
    
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      setIsActive(true);
    }
    
    setUserInput(value);
    
    
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const currentWord = displayWords[currentWordIndex];
      
      
      const newWordStates = [...wordStates];
      if (typedWord === currentWord) {
        newWordStates[currentWordIndex] = 'correct';
        setCorrectChars(prev => prev + currentWord.length + 1);
      } else {
        newWordStates[currentWordIndex] = 'incorrect';
      }
      setWordStates(newWordStates);
      setTotalChars(prev => prev + currentWord.length + 1);
      
      
      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      setUserInput('');
      
      
      const correct = correctChars + (typedWord === currentWord ? currentWord.length + 1 : 0);
      const total = totalChars + currentWord.length + 1;
      setAccuracy(total > 0 ? Math.round((correct / total) * 100) : 100);
      
    } else {
      setCurrentCharIndex(value.length);
      
      if (totalChars > 0) {
        const tempCorrect = correctChars + (value.split('').filter((char, i) => 
          i < displayWords[currentWordIndex]?.length && char === displayWords[currentWordIndex][i]
        ).length);
        const tempTotal = totalChars + value.length;
        setAccuracy(Math.round((tempCorrect / tempTotal) * 100));
      }
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setShowSetup(true);
    }
  };

  
  const finishTest = () => {
    setIsActive(false);
    setIsFinished(true);
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(finalAccuracy);
  };

  
  const resetTest = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setUserInput('');
    setStartTime(null);
    setTimeElapsed(0);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalChars(0);
    setIsFinished(false);
    setWordStates(new Array(displayWords.length).fill('untyped'));
    
    
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 50);
    setDisplayWords(selected);
    setWordStates(new Array(selected.length).fill('untyped'));
    
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  
  const startTest = () => {
    setShowSetup(false);
    resetTest();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  
  const getWordStyle = (wordIndex, charIndex) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
    const word = displayWords[wordIndex];
    const wordState = wordStates[wordIndex];
    
    if (wordState === 'correct') {
      return currentTheme.correct;
    } else if (wordState === 'incorrect') {
      return currentTheme.incorrect;
    } else if (isCurrentWord) {
      if (charIndex < userInput.length) {
        return userInput[charIndex] === word[charIndex] 
          ? `${currentTheme.correct} ${selectedTheme === 'typewriter' ? 'bg-amber-200' : 'bg-gray-700'}` 
          : `${currentTheme.incorrect} ${selectedTheme === 'typewriter' ? 'bg-red-200' : 'bg-red-900'}`;
      } else if (isCurrentChar) {
        return `${currentTheme.cursor} ${selectedTheme === 'typewriter' ? 'text-white' : 'text-black'} animate-pulse`;
      } else {
        return 'text-gray-500';
      }
    } else {
      return wordIndex < currentWordIndex ? 'text-gray-600' : 'text-gray-500';
    }
  };

  
  if (showSetup) {
    return (
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font}`}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Zap className={currentTheme.accent} size={48} />
              <h1 className={`text-5xl font-bold ${selectedTheme === 'typewriter' ? 'text-amber-800' : 'text-white'}`}>
                TypeMaster
              </h1>
            </div>
            <p className="text-xl opacity-80">Customize your typing experience</p>
          </div>

          
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className={`text-2xl font-bold mb-6 text-center ${currentTheme.accent}`}>
              <Palette className="inline mr-2" size={24} />
              Choose Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(themes).map(([key, theme]) => (
                <div
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`${theme.container} p-6 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedTheme === key ? 'ring-4 ring-opacity-50' : ''
                  }`}
                  style={{
                    ringColor: selectedTheme === key ? (theme.accent.includes('yellow') ? '#eab308' : 
                               theme.accent.includes('pink') ? '#ec4899' : 
                               theme.accent.includes('amber') ? '#d97706' : '#22d3ee') : ''
                  }}
                >
                  <div className={`${theme.text} ${theme.font}`}>
                    <h3 className={`text-lg font-bold mb-2 ${theme.accent}`}>{theme.name}</h3>
                    <p className="text-sm opacity-80 mb-4">{theme.description}</p>
                    <div className="text-sm">
                      <span className={theme.correct}>correct </span>
                      <span className={theme.incorrect}>error </span>
                      <span className={`${theme.cursor} px-1`}>cursor</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className={`text-2xl font-bold mb-6 text-center ${currentTheme.accent}`}>
              <Clock className="inline mr-2" size={24} />
              Test Duration
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {timeOptions.map(time => (
                <button
                  key={time}
                  onClick={() => setTestDuration(time)}
                  className={`${currentTheme.container} p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                    testDuration === time 
                      ? `ring-4 ring-opacity-50 ${currentTheme.accent}` 
                      : 'hover:bg-opacity-80'
                  }`}
                >
                  <div className={`text-2xl font-bold ${testDuration === time ? currentTheme.accent : currentTheme.text}`}>
                    {time}s
                  </div>
                </button>
              ))}
            </div>
          </div>

          
          <div className="text-center">
            <button
              onClick={startTest}
              className={`inline-flex items-center space-x-3 px-12 py-4 ${currentTheme.container} hover:bg-opacity-80 rounded-xl text-xl font-bold transition-all duration-200 hover:scale-105 ${currentTheme.accent}`}
            >
              <Play size={24} />
              <span>Start Typing Test</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font}`}>
      
      <style jsx>{`
        @keyframes typewriter-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        .typewriter-effect {
          animation: typewriter-shake 0.1s ease-in-out;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-2">
            <Zap className={currentTheme.accent} size={32} />
            <h1 className={`text-2xl font-bold ${selectedTheme === 'typewriter' ? currentTheme.accent : 'text-white'}`}>
              TypeMaster
            </h1>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => setShowSetup(true)}
              className={`flex items-center space-x-2 px-4 py-2 ${currentTheme.container} rounded-lg hover:bg-opacity-80 transition-colors`}
            >
              <Settings size={16} />
              <span>Setup</span>
            </button>
            <div className={`flex items-center space-x-2 ${currentTheme.text} opacity-60`}>
              <Timer size={16} />
              <span>{testDuration}s</span>
            </div>
          </div>
        </div>

       
        <div className="flex justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className={`text-3xl font-bold ${currentTheme.accent}`}>{wpm}</div>
            <div className="text-sm opacity-60">wpm</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${selectedTheme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-400'}`}>
              {accuracy}%
            </div>
            <div className="text-sm opacity-60">acc</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${currentTheme.correct}`}>
              {testDuration - timeElapsed}
            </div>
            <div className="text-sm opacity-60">time</div>
          </div>
        </div>

        
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className={`h-1 ${selectedTheme === 'typewriter' ? 'bg-amber-200' : 'bg-gray-700'} rounded-full overflow-hidden`}>
            <div 
              className={`h-full ${currentTheme.cursor} transition-all duration-200`}
              style={{ width: `${(timeElapsed / testDuration) * 100}%` }}
            />
          </div>
        </div>

        
        <div className="max-w-4xl mx-auto">
          {!isFinished ? (
            <>
              
              <div 
                className={`text-2xl leading-relaxed mb-8 h-32 overflow-hidden flex flex-wrap content-start ${
                  selectedTheme === 'typewriter' ? 'typewriter-effect' : ''
                }`}
                key={typewriterKey}
              >
                {displayWords.slice(0, 30).map((word, wordIndex) => (
                  <div key={wordIndex} className="mr-4 mb-2">
                    {word.split('').map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className={`${getWordStyle(wordIndex, charIndex)} transition-all duration-75 ${
                          selectedTheme === 'typewriter' ? 'text-shadow-sm' : ''
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              
              <div className="relative max-w-2xl mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-none outline-none text-2xl ${
                    selectedTheme === 'typewriter' ? currentTheme.text : 'text-white'
                  } caret-transparent`}
                  placeholder={!startTime ? "Click here or press any key to start..." : ""}
                  disabled={isFinished}
                  autoFocus
                  style={{
                    caretColor: currentTheme.cursor.includes('yellow') ? '#eab308' : 
                               currentTheme.cursor.includes('pink') ? '#ec4899' : 
                               currentTheme.cursor.includes('amber') ? '#d97706' : '#22d3ee'
                  }}
                />
                <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                  selectedTheme === 'typewriter' ? 'bg-amber-200' : 'bg-gray-700'
                }`}>
                  <div className={`h-full ${currentTheme.cursor} transition-all duration-200`} style={{ width: '0%' }} />
                </div>
              </div>
            </>
          ) : (
            
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-8">
                <div className={`text-6xl font-bold ${currentTheme.accent} mb-2`}>{wpm}</div>
                <div className="text-xl opacity-60">WPM</div>
              </div>
              
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${selectedTheme === 'cyberpunk' ? 'text-cyan-400' : 'text-blue-400'}`}>
                    {accuracy}%
                  </div>
                  <div className="opacity-60">accuracy</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${currentTheme.correct}`}>
                    {Math.round(correctChars / 5)}
                  </div>
                  <div className="opacity-60">correct words</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${currentTheme.incorrect}`}>
                    {Math.round((totalChars - correctChars) / 5)}
                  </div>
                  <div className="opacity-60">incorrect words</div>
                </div>
              </div>
            </div>
          )}

          
          <div className="text-center mt-12">
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={resetTest}
                className={`inline-flex items-center space-x-2 px-6 py-3 ${currentTheme.container} hover:bg-opacity-80 rounded-lg font-semibold transition-colors duration-200`}
              >
                <RotateCcw size={18} />
                <span>restart test</span>
              </button>
              
              <button
                onClick={() => setShowSetup(true)}
                className={`inline-flex items-center space-x-2 px-6 py-3 ${currentTheme.container} hover:bg-opacity-80 rounded-lg font-semibold transition-colors duration-200`}
              >
                <Settings size={18} />
                <span>setup</span>
              </button>
            </div>
            
            <div className="text-sm opacity-60">
              <span className="mr-4">tab - restart test</span>
              <span>esc - setup menu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingSpeedTester;