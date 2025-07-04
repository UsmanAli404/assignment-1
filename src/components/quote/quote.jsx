
function Quote({quote}){
    let quoteObj = quote || {};

    return(
        <div className="p-[20px] flex flex-col items-center text-center">
        <p className="text-3xl leading-relaxed">
            <span className="text-5xl align-top">“</span>
            <span className="px-2">{quoteObj.text}</span>
            <span className="text-5xl align-bottom">”</span>
        </p>
        <p className="text-xl mt-3">- {quoteObj.author}</p>
        </div>
    )
}

export default Quote;