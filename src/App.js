import './style/style.css';
import Header from './components/Header';
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

  const endGame = () => {
    if (myWord.toString() === secretWord.toString()) {
      updateMessage("You Win!");
    } else {
      updateMessage("You Lose!");
    }
    letterInputs.disabled = true;
    updateGame(true);
  }

  const submitWord = () => {
    const section = document.createElement('section');
    myWord.forEach((letter, i) => {
      //need to compare secretWord to myWord
      const letterDiv = document.createElement('div');
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
    inputRef.current.focus();
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
  }

  const validWord = myWord.every(item => typeof item === 'string' && item.length === 1 && item.match(/[a-z]/i)) && myWord.length === 5;

  const inputRef = useRef();
  //useEffect allows for side effects in components
  useEffect(() => {
    inputRef.current.focus();
  }, [gameOver])

  useEffect(() => {
    if (validWord) {
      const submitButton = document.querySelector('#submit');
      submitButton.focus();
    }
  }, [validWord]);

  useEffect(() => {
    updateLetterState(true);
  }, [])
  
  return (
    <>
      <Header />
      <br />
      <h2 className="message">{message}</h2>
      <main>
        <form id="wordSpace">
          <h2>Remaining Attemps: {attempts}</h2>
          <div className="letter-row">
            <LetterSpace letterState={letterState} position={1} sendDataToParent={handleDataFromLetterSpace(0)} disabled={gameOver} ref={inputRef} />
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
      <input id="reset" type="button" value="Reset" className={gameOver == true ? 'show' : ''} onClick={resetGame} />
    </>
  );
}

export default App;
