import { Game } from '../types';

// Direction handling. Check is done to set oldDirection if no inputs or
// contradicting inputs are registered (up + down or left + right). Diagonal
// direction are allowed
export const direction =
    (map: Map<string, boolean>, oldDir: Game.Direction): Game.Direction => {
        let dir = 0;
        if (map.get('ArrowUp')) {
            dir += Game.Direction.Up;
        }
        if (map.get('ArrowRight')) {
            dir += Game.Direction.Right;
        }
        if (map.get('ArrowDown')) {
            dir += Game.Direction.Down;
        }
        if (map.get('ArrowLeft')) {
            dir += Game.Direction.Left;
        }
        const lr = Game.Direction.Left + Game.Direction.Right;
        const ud = Game.Direction.Up + Game.Direction.Down;
        if ((dir & lr) === lr || (dir & ud) === ud) {
            dir = 0;
        }
        if (dir === 0) {
            dir = oldDir;
        }
        return dir;
    };
