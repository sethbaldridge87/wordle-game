import { forwardRef, useState, useRef, useEffect } from 'react';
//forwardRef allows a component to pass a reference to a child
const LetterSpace = forwardRef(({ sendDataToParent, position, disabled, letterState }, ref) => {
    const [character, updateCharacter] = useState('');
    const [invalid, setInvalid] = useState(false);
    // useRef allows a value that can be updated without re-rendering
    const timeoutRef = useRef(null);

    const handleMouseUp = (e) => {
        // prevent mouseup from moving the caret and deselecting
        e.preventDefault();
        e.target.select();
    }

    useEffect(() => {
        if (letterState) {
            updateCharacter('');
            // ensures that the state from the previously guessed word does not linger
        }
    });

    const handleInputChange = (e) => {
        setInvalid(false);
        let letter = e.target.value;
        e.target.select();
        letter = letter.toLowerCase();
        if (letter.match(/[a-z]/i)) {
            updateCharacter(letter);
            sendDataToParent(letter);
            const nextLetter = e.target.nextElementSibling;
            if (nextLetter && typeof nextLetter.focus === 'function') {
                nextLetter.focus();
            } else {
                e.target.blur();
            }
        } else {
            e.target.value = character;
            setInvalid(true);
            // show invalid state briefly
            if (letter !== '') {
                timeoutRef.current = setTimeout(() => {
                    // 'current' is an object returned by useRef()
                    setInvalid(false);
                    timeoutRef.current = null;
                }, 500);
                e.target.select();
                sendDataToParent(character);
            } else {
                setInvalid(false);
            }
        }
    }

    const handleKeyChange = (e) => {
        if (e.code === "Backspace") {
            let letter = e.target.value;
            updateCharacter(letter);
            sendDataToParent(letter);
            // need to update the state so that the submit button remains hidden when a blank space is present
            const prevLetter = e.target.previousElementSibling;
            if (prevLetter && typeof prevLetter.focus === 'function') {
                prevLetter.focus();
            }
        }
    }

    return (
        <input ref={ref} name={position} type="text" maxLength="1" onInput={handleInputChange} onKeyUp={handleKeyChange} onMouseUp={handleMouseUp} disabled={disabled} className={invalid ? 'invalid' : ''} />
    )
});

export default LetterSpace;