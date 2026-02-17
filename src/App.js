import './style/style.css';
import LetterSpace from './components/LetterSpace';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

function App() {
  const [secretWord, setSecretWord] = useState([]);
  const [myWord, createWord] = useState([]);
  const [attempts, setAttempts] = useState(6);
  const [message, updateMessage] = useState('');
  const [gameOver, updateGame] = useState(false);
  const [letterState, updateLetterState] = useState(false);
  const [validWord, setValidWord] = useState(false);
  const [wordData, setwordData] = useState(false);
  const [loading, setLoading] = useState(false);
  const guessedWordsContainer = document.querySelector('#guessed-words');
  const letterInputs = document.querySelectorAll('.letter-row input');
  const mainBody = document.querySelector('body');

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

    // First pass: identify exact matches
    myWord.forEach((letter, i) => {
      if (letter === secretWord[i]) {
        states[i] = 'match';
        available[i] = null;
      }
    });

    // Second pass: identify present letters (not yet claimed)
    myWord.forEach((letter, i) => {
      if (!states[i] && available.includes(letter)) {
        states[i] = 'present';
        available[available.indexOf(letter)] = null;
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
    focusRef.current.focus();
    // 'current' is an object returned by useRef()
    setAttempts((prevCount) => prevCount - 1);
    if (attempts === 1 || myWord.toString() === secretWord.toString()) {
      endGame();
    }
  }

  const updateWord = (position,letter) => {
    let updatedWord = [...myWord];
    updatedWord[position] = letter;
    createWord(updatedWord);
  }

  const handleDataFromLetterSpace = (index) => (data) => {
    //example of a curried function
    updateWord(index, data);
  }

  const resetLetters = () => {
    letterInputs.forEach(input => {
      input.value = '';
    });
    updateLetterState(true);
  }

  const getRandomWord = async () => {
    const res = await fetch("https://random-word-api.herokuapp.com/word?length=5");
    let data = await res.json();
    setSecretWord(data[0].split(''));
  }

  const resetGame = () => {
    resetLetters();
    createWord([]);
    setAttempts(() => 6);
    guessedWordsContainer.innerHTML = '';
    updateGame(false);
    updateMessage('');
    mainBody.classList.remove('modal-reveal');
    getRandomWord();
  }
  
  const validLength = myWord.filter(item => typeof item === 'string' && /[a-z]/i.test(item)).length === 5;

  const focusRef = useRef();

  //useEffect allows for side effects in components. Some examples of side effects are: fetching data, directly updating the DOM, and timers.
  useEffect(() => {
    focusRef.current.focus();
  }, [gameOver]);

  useEffect(() => {
    if (validLength) {
      const wordString = myWord.join('');
      const fetchData = async () => {
        let timer = setTimeout(() => {
          setLoading(true);
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
          setLoading(false);
          setwordData(true);
        }
      };
      fetchData();
    }
  }, [validLength, myWord]);

  useEffect(() => {
    if (validWord) {
      document.querySelector('#submit').focus();
    }
  }, [validWord]);

  useEffect(() => {
    // ensures that the state from the previously guessed word does not linger
    updateLetterState(true);
    getRandomWord();
  }, []);
  
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
      <main>
        <form id="wordSpace">
          <h2>Remaining Attempts: {attempts}</h2>
          <div className="letter-row">
            <LetterSpace letterState={letterState} position={1} sendDataToParent={handleDataFromLetterSpace(0)} disabled={gameOver} ref={focusRef} />
            <LetterSpace letterState={letterState} position={2} sendDataToParent={handleDataFromLetterSpace(1)} disabled={gameOver} />
            <LetterSpace letterState={letterState} position={3} sendDataToParent={handleDataFromLetterSpace(2)} disabled={gameOver} />
            <LetterSpace letterState={letterState} position={4} sendDataToParent={handleDataFromLetterSpace(3)} disabled={gameOver} />
            <LetterSpace letterState={letterState} position={5} sendDataToParent={handleDataFromLetterSpace(4)} disabled={gameOver} />
          </div>
          <p className={loading ? 'loading': ''}>Loading...</p>
          <input id="submit" type="button" value={validWord ? 'Submit' : 'Not a Word'} className={wordData && validLength ? 'show' : ''} onClick={submitWord} disabled={!validWord} />
        </form>
        <aside>
          <h2>Guessed Words:</h2>
          <div id="guessed-words"></div>
        </aside>
      </main>
    </>
  );
}

export default App;
