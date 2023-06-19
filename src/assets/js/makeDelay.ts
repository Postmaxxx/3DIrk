



const makeDelay = (delay: number = 0): Promise<string> => {
    return new Promise((res) => {
        setTimeout(() => res(`Timeout ${delay}ms has been finished`), delay)
    })    
}

export {makeDelay}