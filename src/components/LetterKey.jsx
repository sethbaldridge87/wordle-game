const LetterKey = ({props, onChildClick}) => {
    const handleClick = (props) => {
        onChildClick('some-data');
    }
    return (
        <button onClick={handleClick} data-character={props} className="word-block" >{props}</button>
    )
};

export default LetterKey;