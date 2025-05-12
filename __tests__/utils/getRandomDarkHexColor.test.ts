import { getRandomDarkHexColor } from '@/utils/getRandomDarkHexColor';

describe('getRandomDarkHexColor', () => {
  it('returns a valid hex color string', () => {
    const color = getRandomDarkHexColor();
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/); 
  });

  it('returns a dark color (RGB values less than 156)', () => {
    const color = getRandomDarkHexColor();
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    expect(r).toBeLessThan(156); 
    expect(g).toBeLessThan(156);
    expect(b).toBeLessThan(156); 
  });

  it('generates different colors on multiple calls', () => {
    const color1 = getRandomDarkHexColor();
    const color2 = getRandomDarkHexColor();
    expect(color1).not.toEqual(color2)
  });
});