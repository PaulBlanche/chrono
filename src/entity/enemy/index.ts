import { Entity } from '../../types';
import { snapToBounds, direction, distance } from '../utils';

export interface EnemyState extends Entity.State {
    readonly type: 'enemy';
    readonly position: {
        readonly x: number;
        readonly y: number;
    }; // enemy position
    readonly dir: {
        readonly x: number;
        readonly y: number;
    };
    readonly radius: number;
    readonly size: {
        readonly width: number;
        readonly height: number;
    };// enemy last dir for inertia
}

// spawn an enemy entity (draw and update functions)
export const spawn: Entity.Spawn<EnemyState> =
    (id, destroy) => {
        return {
            draw,
            update:update(id, destroy),
        };
    };

// Enemy draw function
const draw: Entity.Draw<EnemyState> =
    ({ context }, { position: { x, y }, size: { width, height } }) => {
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
const update: Entity.InjectableUpdate<EnemyState> =
    (id, destroy) =>
    ({ game }, self) => {

        // Get player state
        // FIXME : magic number, have an index in game for types of entity ?
        const player = game.entities[0];

        // distance to player
        const n = distance(self.position, player.position);
        // direction to player (normalized)
        const { x:dx, y:dy } = direction(self.position, player.position);

        // update dir with inertia
        const inertia = 0.95;
        const dir = {
            x: dx * (1 - inertia) + self.dir.x * inertia,
            y: dy * (1 - inertia) + self.dir.y * inertia,
        };

        // update position given direction and speed
        let position = {
            x: self.position.x + dir.x * speed(n, self.radius),
            y: self.position.y + dir.y * speed(n, self.radius),
        };
        // Snap player to game bounding box
        position = snapToBounds(position, game.map.size, self.size);

        return { ...self, dir, position };
    };
