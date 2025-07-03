
function Quote({quote}){
    let quoteObj = quote || {};

    return(
        <div className="p-[10px] flex">
            <p className="text-5xl relative">
                “
            </p>
            <p className="text-3xl">
                {quoteObj.text}
            </p>
            <p className="text-5xl flex flex-row-reverse">
                ”
            </p>
            <p className="flex flex-row-reverse text-xl">- {quoteObj.author}</p>
        </div>
    )
}

export default Quote;