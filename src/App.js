import './style/style.css';
import LetterKey from './components/LetterKey';
import LetterDisplay from './components/LetterDisplay';
import { useState, useEffect } from 'react';

function App() {
  const [secretWord, setSecretWord] = useState([]);
  const [myWord, createWord] = useState([]);
  const [attempts, setAttempts] = useState(6);
  const [message, updateMessage] = useState('');
  const [gameOver, updateGame] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const [wordData, setwordData] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [gameReady, setGameReady] = useState(false);
  const [newWord, setNewWord] = useState(true);
  const guessedWordsContainer = document.querySelector('#guessed-words div');
  const letterInputs = document.querySelectorAll('.letter-row input');
  const mainBody = document.querySelector('body');
  const keyboard = document.querySelector('#keyboard');
  const qwerty = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const endGame = () => {
    if (myWord.toString() === secretWord.toString()) {
      updateMessage("You Win!");
    } else {
      let capitalizedWord = secretWord.join('');
      capitalizedWord = capitalizedWord.charAt(0).toUpperCase() + capitalizedWord.slice(1);
      updateMessage("You Lose! The correct answer was '" + capitalizedWord + "'");
    }
    mainBody.classList.add('modal-reveal');
    letterInputs.disabled = true;
    updateGame(true);
    document.querySelector('#reset').focus();
  }

  const submitWord = () => {
    const section = document.createElement('section');
    // creates a copy of the secretWord array so the original is unaffected
    // Iterates through this copy and takes out letters during the loop
    const available = [...secretWord];
    const states = [];

    const keyboardCheck = (character, keyClass) => {
      const matchedKey = keyboard.querySelector('[data-character="' + character + '"]');
      matchedKey.classList.add(keyClass);
    }

    // First pass: identify exact matches
    myWord.forEach((letter, i) => {
      if (letter === secretWord[i]) {
        states[i] = 'match';
        available[i] = null;
        keyboardCheck(letter, 'match');
      } else {
        keyboardCheck(letter, 'missing');
      }
    });


    // Second pass: identify present letters (not yet claimed)
    myWord.forEach((letter, i) => {
      if (!states[i] && available.includes(letter)) {
        states[i] = 'present';
        available[available.indexOf(letter)] = null;
        keyboardCheck(letter, 'present');
      }
    });

    // Create DOM elements with classes
    myWord.forEach((letter, i) => {
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('word-block');
      if (states[i]) {
        letterDiv.classList.add(states[i]);
      }
      letterDiv.textContent = letter;
      section.appendChild(letterDiv);
    });

    setwordData(false);
    guessedWordsContainer.appendChild(section);
    createWord([]);
    resetLetters();
    setValidWord(false);
    // 'current' is an object returned by useRef()
    setAttempts((prevCount) => prevCount - 1);
    if (attempts === 1 || myWord.toString() === secretWord.toString()) {
      endGame();
    }
  }

  const resetLetters = () => {
    letterInputs.forEach(input => {
      input.value = '';
    });
  }

  const resetGame = () => {
    resetLetters();
    createWord([]);
    setAttempts(() => 6);
    guessedWordsContainer.innerHTML = '';
    updateGame(false);
    updateMessage('');
    mainBody.classList.remove('modal-reveal');
    const allKeys = keyboard.querySelectorAll('[data-character]');
    allKeys.forEach((key) => {
      key.classList.remove('match','present','missing');
    });
    setGameReady(false);
    setNewWord(true);
  }

  const handleLetterClick = (key) => {
    if (myWord.length < 5) {
      createWord([...myWord, key]);
      console.log(myWord);
    }
  }

  const deleteLetter = () => {
    createWord(myWord => myWord.slice(0, -1));
  }
  
  const validLength = myWord.filter(item => typeof item === 'string' && /[a-z]/i.test(item)).length === 5;

  // useEffect allows for side effects in components. Some examples of side effects are: fetching data, directly updating the DOM, and timers.
  // Focuses the cursor on the first letter when the game resets
  useEffect(() => {
    
  }, [gameOver]);
  // Checks if the word input is valid
  useEffect(() => {
    if (validLength) {
      const wordString = myWord.join('');
      const fetchData = async () => {
        let timer = setTimeout(() => {
          setVerifying(true);
        }, 500);
        try {
          const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + wordString);
          if (!response.ok) {
            throw new Error(`HTTP error! status: $(response.status}`);
          }
          const result = await response.json();
          if (result[0].word === wordString) {
            setValidWord(true);
          }
        } catch (error) {
          setValidWord(false);
        } finally {
          clearTimeout(timer);
          setVerifying(false);
          setwordData(true);
        }
      };
      fetchData();
    }
  }, [validLength, myWord]);
  // Focuses the cursor on the submit button if the word is valid
  useEffect(() => {
    if (validWord) {
      document.querySelector('#submit').focus();
    }
  }, [validWord]);
  // Gets a new random secret word
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch("https://random-word-api.herokuapp.com/word?length=5&diff=2");
        if (!res.ok) {
          throw new Error(`HTTP error! status: $(response.status}`);
        }
        let data = await res.json();
        setSecretWord(data[0].split(''));
      } catch (error) {
        const backupWords = ['apple','would','great','chain','stink','jewel','shard','mixed','wring','eagle'];
        const randomIndex = Math.floor(Math.random() * backupWords.length);
        setSecretWord(backupWords[randomIndex].split(''));
      } finally {
        setGameReady(true);
      }
    }
    fetchWord();
    setNewWord(false);
  }, [newWord]);
  
  return (
    <>
      <header>
        <h1>Welcome to My Wordle Game!</h1>
        {/* <h2>Today's random word is: {secretWord}</h2> */}
      </header>
      <div className="modal">
        <h2 className="message">{message}</h2>
        <input id="reset" type="button" value="Reset" onClick={resetGame} />
      </div>
      <h2 className={`load-message ${gameReady ? '' : 'loading'}`}>Loading<span>.</span><span>.</span><span>.</span></h2>
      <main className={gameReady ? 'game-ready': ''}>
        <div id="layout">
          <section id="wordSpace">
            <h2>Remaining Attempts: {attempts}</h2>
            <div className="letter-row">
              <LetterDisplay letterState={myWord} position={0}></LetterDisplay>
              <LetterDisplay letterState={myWord} position={1}></LetterDisplay>
              <LetterDisplay letterState={myWord} position={2}></LetterDisplay>
              <LetterDisplay letterState={myWord} position={3}></LetterDisplay>
              <LetterDisplay letterState={myWord} position={4}></LetterDisplay>
            </div>
          </section>
          <section id="guessed-words">
            <h2>Guessed Words:</h2>
            <div></div>
          </section>
        </div>
        <section id="keyboard">
        {qwerty.map((row, i) => (
          <div key={i} className="keyboard-row">
            {row.map((key) => (
              key !== "m" ? (
                <LetterKey props={key} key={key} onChildClick={() => handleLetterClick(key)}>{key}</LetterKey>
               ) : (
                <>
                  <LetterKey props={key} key={key} onChildClick={() => handleLetterClick(key)}>{key}</LetterKey>
                  {/* onClick function must be written this way so that the function doesn't automatically trigger when the component is rendered. */}
                  <button onClick={() => deleteLetter()} class="word-block" id="backSpace">BKSP</button>
                </>
               )
            ))}
          </div>
        ))}
        <div id="inputField">
          <input id="submit" type="button" value={validWord ? 'Submit' : 'Not a Word'} className={wordData && validLength ? 'show' : ''} onClick={submitWord} disabled={!validWord} />
          <h6 className={verifying ? 'loading': ''}>Loading<span>.</span><span>.</span><span>.</span></h6>
        </div>
      </section>
      </main>
    </>
  );
}

export default App;
