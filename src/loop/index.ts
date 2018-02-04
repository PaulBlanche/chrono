import { Game } from '../types';
import { init } from '../fps';
import { spawn as player, PlayerState } from '../entity/player';
import { spawn as enemy, EnemyState } from '../entity/enemy';
import { entityHandler } from '../entity';
import { A_SECOND } from '../const';

import { updater } from './update';
import { drawer } from './draw';
import { beforer } from './before';
import { afterer } from './after';
import { looper } from './loop';

// define a game config
const GAME_CONFIG: Game.Config = {
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
    let game: Game = {
        entities: {},
        fps:0,
        timestamp:0,
        map : {
            size : {
                width:400,
                height:400,
            },
        },
    };

    // spaw player and enemey
    game = entity.spawn<PlayerState>(game, player, {
        type:'player',
        position: { x:0, y:0 },
        life:10,
        size: { width: 20, height: 20 },
    });
    game = entity.spawn<EnemyState>(game, enemy, {
        type:'enemy',
        position: { x:400, y:400 },
        dir: { x:0, y:0 },
        size: { width: 20, height: 20 },
        radius: 100,
    });

    // Create all engine function (update, draw, before ....) and inject them
    // in loop function.
    const update = updater(entity, GAME_CONFIG.timestep);
    const draw = drawer(entity, fps, context, screenSize);
    const before = beforer(fps);
    const after = afterer();
    const loop = looper(before, update, draw, after, game, GAME_CONFIG, canvas);

    // start the engine.
    requestAnimationFrame(loop);
};
