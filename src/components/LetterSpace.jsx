import { forwardRef, useState, useRef, useEffect } from 'react';
//forwardRef allows a component to pass a reference to a child
const LetterSpace = forwardRef(({ sendDataToParent, position, disabled, letterState }, ref) => {
    const [character, updateCharacter] = useState('');
    const [invalid, setInvalid] = useState(false);
    // useRef allows a value that can be updated without re-rendering
    const timeoutRef = useRef(null);

    const handleClick = (e) => {
        e.target.select();
    }

    useEffect(() => {
        if (letterState) {
            updateCharacter('');
            // ensures that the state from the previously guessed word does not linger
        }
    });

    const handleKeyChange = (e) => {
        setInvalid(false);
        let letter = e.target.value;
        e.target.select();
        if (letter.match(/[a-z]/i)) {
            letter = letter.toLowerCase();
            updateCharacter(letter);
            sendDataToParent(letter);
            const nextLetter = e.target.nextElementSibling;
            if (nextLetter && typeof nextLetter.focus === 'function') {
                nextLetter.focus();
            }
        } else {
            e.target.value = character;
            setInvalid(true);
            // show invalid state briefly
            timeoutRef.current = setTimeout(() => {
                // 'current' is an object returned by useRef()
                setInvalid(false);
                timeoutRef.current = null;
            }, 500);
            e.target.select();
            sendDataToParent(character);
        }
    }
    return (
        <input onClick={handleClick} ref={ref} name={position} type="text" maxLength="1" onChange={handleKeyChange} disabled={disabled} className={invalid ? 'invalid' : ''} />
    )
});

export default LetterSpace;