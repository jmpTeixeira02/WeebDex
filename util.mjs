async function tryCatchHandler(handler, ...uri){
    try{
        const data = await handler.apply(this, uri)
        return [data, null]
    }
    catch(e){
        return [null, e]
    }
}  

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export {tryCatchHandler, sleep}