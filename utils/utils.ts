export const hexToRGBA = (hex: string, alpha: number): string => {
    let cleanHex = hex.replace(/^#/, '');

    if (cleanHex.length === 3) {
        cleanHex = cleanHex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    // parse hex to RGB
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};