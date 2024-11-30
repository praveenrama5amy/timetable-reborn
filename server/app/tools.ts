export const genRandomDigit = (digit: number = 6) => {
    do {
        var randNum = (Math.random() * (10 ** digit)).toFixed()
    } while (String(randNum).length != digit)
    return Number(randNum)
}

export const genHash = (length: number = 16) => {
    let hash = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        hash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return hash;
}


export const toDbTimeStamp = (time: Date) => {
    return time.toISOString().slice(0, 19).replace('T', ' ')
}