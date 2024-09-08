export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type HSL = `hsl(${number}, ${number}%, ${number}%)`;
export type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;
export type Color = RGB | RGBA | HEX | HSL | HSLA;

export type ArcaneRiftColors = 'weave' | 'blossom' | 'threat' | 'success' | 'obsidian' | 'pearl';
