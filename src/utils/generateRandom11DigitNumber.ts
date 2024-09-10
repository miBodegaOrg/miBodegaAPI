export function generateRandom11DigitNumber(): string {
  let randomNumber = '';
  while (randomNumber.length < 11) {
    randomNumber += Math.floor(Math.random() * 10).toString();
  }
  return randomNumber;
}
