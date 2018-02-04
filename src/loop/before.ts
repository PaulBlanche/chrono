import { Game } from '../types';

// Hook called the start of the game loop (on each frame)
export const beforer =
    (fps: Game.Fps): Game.Before =>
    (timestamp, game) => {
        // update fps indicator
        return { ...game, fps:fps.update(timestamp) };
    };
