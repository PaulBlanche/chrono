import { Game } from '../types';

// Hook called at the end of the game loop (on each frame)
export const afterer = (): Game.After => () => void 0;
