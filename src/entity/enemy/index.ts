import { Spawn, State, InjectableUpdate, Draw } from '../../types';
import { snapToBounds, direction, distance } from '../utils';

export interface EnemyState extends State {
    position: {
        x: number;
        y: number;
    }; // enemy position
    lastdir: {
        x: number;
        y: number;
    };
    radius: number;
    size: {
        width: number;
        height: number;
    };// enemy last dir for inertia
}

// spawn an enemy entity (draw and update functions)
export const spawn: Spawn<EnemyState> =
    (id, destroy, initialState) => {
        return {
            draw,
            update:update(id, destroy, initialState),
        };
    };

// Enemy draw function
const draw: Draw<EnemyState> =
    (context, { position: { x, y }, size: { width, height } }, game) => {
        context.fillStyle = 'red';
        const rx = Math.floor(x - width / 2);
        const ry = Math.floor(y - height / 2);
        context.fillRect(rx, ry, width, height);
    };

// Compute enemy speed given the distance to player
const speed =
    (norm: number, radius: number) => {
        if (norm > radius) { return 0; }
        return (1 - Math.pow(norm / radius, 5)) * 3;
    };

// Update enemy.
const update: InjectableUpdate<EnemyState> =
    (id, destroy, initialState) =>
    (input, game, timestep, self=initialState) => {
        const state = {...self};

        // Get player state
        // FIXME : magic number, have an index in game for types of entity ?
        const player = game.entities[0];

        // distance to player
        const n = distance(self.position, player.position);
        // direction to player (normalized)
        const { x:dx, y:dy } = direction(self.position, player.position);

        // update dir with inertia
        const inertia = 0.95;
        state.lastdir = {
            x: dx * (1 - inertia) + self.lastdir.x * inertia,
            y: dy * (1 - inertia) + self.lastdir.y * inertia,
        };

        // update position given direction and speed
        state.position.x += state.lastdir.x * speed(n, self.radius);
        state.position.y += state.lastdir.y * speed(n, self.radius);

        // Snap player to game bounding box
        state.position = snapToBounds(state.position, game.map.size, self.size);

        return state;
    };
