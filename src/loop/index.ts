import { Game, Input, Size, EntityHandler } from '../types';
import { input } from '../input';
import { init, Fps } from '../fps';
import { spawn as player } from '../entity/player';
import { spawn as enemy } from '../entity/enemy';
import { entityHandler } from '../entity';
import { A_SECOND } from '../const';

interface GameConfig {
    maxFps: number; // maximum fps of the rendering engine
    timestep: number; // length of a tick of the game simulation engine
}

// Game simulation engine. Takes previous game state and accumulated
// input during the last frame and output a new game state
type Update = (input: Input, game: Game) => Game;
const updater =
    (entity: EntityHandler, timestep: number): Update =>
    (input, game) => {
        // New game object (no mutation);
        const ngame = { ...game };

        // update entities;
        ngame.entities = entity.update(input, game, timestep);

        return ngame;
    };

// Rendering engine. Takes a game state and renders it
type Draw = (game: Game) => void;
const drawer = (
        entity: EntityHandler, fps: Fps, context: CanvasRenderingContext2D,
        { width, height }: Size,
    ): Draw =>
    game => {
        // Clear drawing context
        context.clearRect(0, 0, width, height);

        // draw fps indicator and entities
        fps.draw();
        entity.draw(game);
    };

// Hook called the start of the game loop (on each frame)
type Before = (timestamp: number, game: Game) => Game;
const beforer = (fps: Fps): Before => (timestamp, game) => {
    // update fps indicator
    game.fps = fps.update(timestamp);
    return game;
};

// Hook called at the end of the game loop (on each frame)
type After = () => void;
const afterer = (): After => () => {};

// Game loop
type Loop = (timestamp: number) => void;
// Closure around loop function to allow injection of before, after, update ...
const looper = (
        before: Before, update: Update, draw: Draw, after: After, game: Game,
        { maxFps, timestep }: GameConfig, canvas: HTMLCanvasElement,
    ): Loop => {
    //define "global" loop variables (updated on loop run)
    let lastFrame = 0; // timestamp of the last frame.
    let delta = 0; // unsimulated time;
    const loop: Loop = timestamp => {
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

// define a game config
const config: GameConfig = {
    maxFps: 60,
    timestep: A_SECOND / 60,
};

// Main function
export const run = () => {

    // Get ui, canvas and rendering context.
    // TODO : better error handling.
    const canvas = document.querySelector('canvas');
    if (canvas === null) { throw new Error('ERROR ERROR ABORT ABORT'); }
    const context = canvas.getContext('2d');
    if (context === null) { throw new Error('ERROR ERROR ABORT ABORT'); }
    const ui = document.querySelector('.ui');
    if (ui === null) { throw new Error('ERROR ERROR ABORT ABORT'); }

    const screenSize = {
        width: canvas.width,
        height: canvas.height,
    };

    // Initialize fps indicator
    const fps = init(ui);
    // Initialize entity handler
    const entity = entityHandler(context);

    // Initial game state
    const game: Game = {
        entities: [],
        fps:0,
        timestamp:0,
        map : {
            size : {
                width:400,
                height:400,
            },
        },
    };

    // Create all engine function (update, draw, before ....) and inject them
    // in loop function.
    const update = updater(entity, config.timestep);
    const draw = drawer(entity, fps, context, screenSize);
    const before = beforer(fps);
    const after = afterer();
    const loop = looper(before, update, draw, after, game, config, canvas);

    // spaw player and enemey
    entity.spawn(game, player, {
        position: { x:0, y:0 },
        life:10,
        size: { width: 20, height: 20 },
    });
    entity.spawn(game, enemy, {
        position: { x:400, y:400 },
        lastdir: { x:0, y:0 },
        size: { width: 20, height: 20 },
        radius: 100,
    });

    // start the engine.
    requestAnimationFrame(loop);
};
