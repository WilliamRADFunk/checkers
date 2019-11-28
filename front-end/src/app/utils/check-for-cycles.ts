export function checkForCycles(chain: number[]): boolean {
    const chainClone = chain.slice();
    if (chainClone.length <= 2) {
        return false;
    }
    do {
        if (chainClone[0] === chainClone[2]) {
            return true;
        }
        chainClone.shift();
    } while (chainClone.length > 2);
}
