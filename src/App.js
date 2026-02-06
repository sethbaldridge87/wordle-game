import './style/style.css';
import LetterSpace from './components/LetterSpace';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

function App() {
  const [myWord, createWord] = useState([]);
  const [attempts, setAttempts] = useState(6);
  const [message, updateMessage] = useState('');
  const [gameOver, updateGame] = useState(false);
  const [letterState, updateLetterState] = useState(false);
  const guessedWordsContainer = document.querySelector('#guessed-words');
  const letterInputs = document.querySelectorAll('.letter-row input');
  const secretWord = 'apple'.split('');
  const mainBody = document.querySelector('body');

  const endGame = () => {
    if (myWord.toString() === secretWord.toString()) {
      updateMessage("You Win!");
    } else {
      updateMessage("You Lose!");
    }
    mainBody.classList.add('modal-reveal');
    letterInputs.disabled = true;
    updateGame(true);
    document.querySelector('#reset').focus();
  }

  const submitWord = () => {
    const section = document.createElement('section');
    myWord.forEach((letter, i) => {
      //need to compare secretWord to myWord
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('word-block');
      if (secretWord.includes(letter)) {
        letterDiv.classList.add('present');
        if (myWord[i] === secretWord[i]) {
          letterDiv.classList.add('match');
        }
      }
      letterDiv.textContent = letter;
      section.appendChild(letterDiv);
    });
    guessedWordsContainer.appendChild(section);
    createWord([]);
    resetLetters();
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

  const resetGame = () => {
    resetLetters();
    createWord([]);
    setAttempts(() => 6);
    guessedWordsContainer.innerHTML = '';
    updateGame(false);
    updateMessage('');
    mainBody.classList.remove('modal-reveal');
  }

  const validWord = myWord.filter(item => typeof item === 'string' && /[a-z]/i.test(item)).length === 5;

  const focusRef = useRef();
  //useEffect allows for side effects in components
  useEffect(() => {
    focusRef.current.focus();
  }, [gameOver])

  useEffect(() => {
    if (validWord) {
      document.querySelector('#submit').focus();
    }
  }, [validWord]);

  useEffect(() => {
    updateLetterState(true);
  }, [])
  
  return (
    <>
      <header>
        <h1>Welcome to My Wordle Game!</h1>
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
          <input id="submit" type="button" value="Submit" className={validWord ? 'show' : ''} onClick={submitWord} />
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
