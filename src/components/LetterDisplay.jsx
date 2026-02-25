const LetterDisplay = ({letterState, position}) => {
    return (
        <div data-position={position} className="word-block">{letterState[position]}</div>
    )
};

export default LetterDisplay;