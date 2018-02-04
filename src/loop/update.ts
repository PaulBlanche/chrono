import { Game, EntityHandler } from '../types';

// Game simulation engine. Takes previous game state and accumulated
// input during the last frame and output a new game state
export const updater =
    (entity: EntityHandler, timestep: number): Game.Update =>
    (input, game) => {
        // New game object (no mutation);
        const ngame = { ...game };

        // update entities;
        ngame.entities = entity.update(input, game, timestep);

        return ngame;
    };
