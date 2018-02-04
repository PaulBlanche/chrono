import { Game, EntityHandler, Size } from '../types';

// Rendering engine. Takes a game state and renders it
export const drawer = (
        entity: EntityHandler, fps: Game.Fps, context: CanvasRenderingContext2D,
        { width, height }: Size,
    ): Game.Draw =>
    game => {
        // Clear drawing context
        context.clearRect(0, 0, width, height);

        // draw fps indicator and entities
        fps.draw();
        entity.draw(game);
    };
