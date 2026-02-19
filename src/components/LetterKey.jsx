const LetterKey = (props) => {
    const handleClick = (data) => {
        // console.log(data);
    }
    return (
        <div data-character={props.children} className="word-block" onClick={() => handleClick(props.children)} >{props.children}</div>
        // onClick function must be written this way so that the function doesn't automatically trigger when the component is rendered.
    )
}

export default LetterKey;