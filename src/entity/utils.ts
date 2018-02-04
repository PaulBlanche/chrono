import { Vector, Size } from '../types';

export const snapToBounds =
    ({ x, y }: Vector, mapSize: Size, entitySize: Size): Vector => {
        if (y < Math.floor(entitySize.height / 2)) {
            y = Math.floor(entitySize.height / 2);
        }
        if (y > mapSize.height - Math.ceil(entitySize.height / 2)) {
            y = mapSize.height - Math.ceil(entitySize.height / 2);
        }
        if (x < Math.floor(entitySize.width / 2)) {
            x = Math.floor(entitySize.width / 2);
        }
        if (x > mapSize.width - Math.ceil(entitySize.width / 2)) {
            x = mapSize.width - Math.ceil(entitySize.width / 2);
        }
        return { x, y };
    };

export const norm =
    ({ x, y }: Vector): number =>
        Math.sqrt(x ** 2 + y ** 2);

export const distance =
    ({ x:x1, y:y1 }: Vector, { x:x2, y:y2 }: Vector): number =>
        norm({ x:x2 - x1, y:y2 - y1 });

export const direction =
    (v1: Vector, v2: Vector): Vector => {
        const d = distance(v1, v2);
        if (d === 0) { return { x:0, y:0 }; }
        return {
            x:(v2.x - v1.x) / d,
            y:(v2.y - v1.y) / d,
        };
    };
