//takes an amount of experience and returns the equivalent level amount
export const levelFormula = (exp) => {
    return Math.floor(Math.sqrt(exp) * 1.2)
}