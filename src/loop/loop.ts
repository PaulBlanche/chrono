import { Game } from '../types';
import { A_SECOND } from '../const';
import { input } from '../input';

// Game loop
// Closure around loop function to allow injection of before, after, update ...
export const looper = (
        before: Game.Before, update: Game.Update, draw: Game.Draw,
        after: Game.After, game: Game, { maxFps, timestep }: Game.Config,
        canvas: HTMLCanvasElement,
    ): Game.Loop => {
    //define "global" loop variables (updated on loop run)
    let lastFrame = 0; // timestamp of the last frame.
    let delta = 0; // unsimulated time;
    const loop: Game.Loop = timestamp => {
        // if loop is called before a full game frame, schedule the loop for
        // next browser frame and exit
        if (timestamp < lastFrame + Math.floor(A_SECOND / maxFps)) {
            requestAnimationFrame(loop);
            return;
        }

        // Run the before hook.
        game = before(timestamp, game);

        // capture inputs
        const inpt = input();

        // Handle pause.
        // If pause state changed at this frame, toggle the display of the
        // canvas as paused.
        if (inpt.pause.edge) {
            canvas.classList.toggle('paused');
        }
        // If in pause, schedcule the loop for next browser frame and exit.
        if (inpt.pause.state) {
            requestAnimationFrame(loop);
            return;
        }
        // If pause state changed at this frame (on unpause since last block
        // did not exit), reset unsimulated time and lastFrame time.
        if (inpt.pause.edge) {
            delta = timestep;
            lastFrame = timestamp;
        }

        // Update unsimulated time by adding time spent since last frame.
        delta += timestamp - lastFrame;
        lastFrame = timestamp;

        // Run simulation on unsimulated time by block on timestep. Remaining
        // time is kept in delta.
        while (delta >= timestep) {
            game = update(inpt, game);
            delta -= timestep;
        }

        // Once simulation is done, display the game state
        draw(game);

        // Run the after hook.
        after();

        // Schedule loop for next browser frame.
        requestAnimationFrame(loop);
    };
    return loop;
};
