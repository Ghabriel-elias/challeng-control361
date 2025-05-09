export function getRandomDarkHexColor() {
  const getHex = () => Math.floor(Math.random() * 156).toString(16).padStart(2, '0');
  const r = getHex();
  const g = getHex();
  const b = getHex();
  return `#${r}${g}${b}`;
}
