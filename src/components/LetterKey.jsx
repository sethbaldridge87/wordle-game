const LetterKey = ({props, onChildClick}) => {
    const handleClick = () => {
        onChildClick();
    }
    return (
        <button onClick={handleClick} data-character={props} className="word-block" >{props}</button>
    )
};

export default LetterKey;