
export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const IS_TOUCH = IS_BROWSER && 'ontouchstart' in window;

