

// https://github.com/aceakash/string-similarity
export function getStringDifference(first: string, second: string) {
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')

    if (first === second) return 1; // identical or empty
    if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

    let firstBigrams = new Map();
    for (let i = 0; i < first.length - 1; i++) {
        const bigram = first.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram) + 1
            : 1;

        firstBigrams.set(bigram, count);
    };

    let intersectionSize = 0;
    for (let i = 0; i < second.length - 1; i++) {
        const bigram = second.substring(i, i + 2);
        const count = firstBigrams.has(bigram)
            ? firstBigrams.get(bigram)
            : 0;

        if (count > 0) {
            firstBigrams.set(bigram, count - 1);
            intersectionSize++;
        }
    }

    return (2.0 * intersectionSize) / (first.length + second.length - 2);
}

/**
 * Helper function that maps all strings to a score with async iteration so that it doesn't block the UI
 * @param mainString 
 * @param targetStrings 
 * @returns an array with the score of each string in the array
 */
export async function getStringScores(baseString: string, stringLst: string[]): Promise<number[]> {
    // start
    let startT = performance.now();

    baseString = baseString.toLowerCase();

    // Calculate starts with score
    let scores: number[] = stringLst.map(curStr => {
        curStr = curStr.toLocaleLowerCase();
        if (curStr === baseString) {
            return Number.MAX_SAFE_INTEGER;
        }
        if (curStr.startsWith(baseString)) {
            return Number.MAX_SAFE_INTEGER - 1;
        }
        return getStringDifference(baseString, curStr);
    });

    // end
    console.log("Time taken: " + (performance.now() - startT));
    return scores;
}