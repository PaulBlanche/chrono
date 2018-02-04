import { Input, Direction } from '../types';

// Data structure keeping tracks of key down/up events.
type InputMap = Map<string, boolean>;

// Data structure for game events based on inputs.
const initialInput: Input = {
    walking: false,
    direction: Direction.Right,
    pause: { state:false, edge:false },
};

interface PauseState {
    state: boolean;
    edge: boolean;
}

// Initialize the input map.
const map: InputMap = new Map<string, boolean>();

// Listen to keydown/keyup events. Update the input map accordingly (true for
// down, false for up). Prevent default action of the event.
document.addEventListener('keydown', evt => {
    const key = evt.key;
    map.set(key, true);
    evt.preventDefault();
});
document.addEventListener('keyup', evt => {
    const key = evt.key;
    map.set(key, false);
    evt.preventDefault();
});

// keep track of previous state for long runing events
let currentInput = initialInput;

// build the game event datastructure on demand
export const input = () => {
    currentInput = {
        direction: direction(map, currentInput.direction),
        walking: walking(map, currentInput.walking),
        pause: pause(map, currentInput.pause),
    };
    return currentInput;
};

// Pause handling. To avoid key events autorepeat (event fired multiple time if
// key is kept down), we need to keep track of the state of the escape key.
let wasEscapeDown = false;
const pause =
    (map: InputMap, { state }: PauseState): PauseState => {
        // If escape is pressed ...
        if (map.get('Escape')) {
            // and escape was not pressed last check
            if (!wasEscapeDown) {
                // Then the game needs to be paused and pause state changed, so
                // edge is true.
                wasEscapeDown = true;
                return { edge:true, state:!state };
            }
        } else {
            // register for next check that escape was not pressed.
            wasEscapeDown = false;
        }
        // Escape pressed for second time or not pressed, pause state does not
        // change, edge is false.
        return { edge:false, state };
    };

// Direction handling. Check is done to set oldDirection if no inputs or
// contradicting inputs are registered (up + down or left + right). Diagonal
// direction are allowed
const direction =
    (map: InputMap, oldDirection: Direction): Direction => {
        let direction = 0;
        if (map.get('ArrowUp')) {
            direction += Direction.Up;
        }
        if (map.get('ArrowRight')) {
            direction += Direction.Right;
        }
        if (map.get('ArrowDown')) {
            direction += Direction.Down;
        }
        if (map.get('ArrowLeft')) {
            direction += Direction.Left;
        }
        const lr = Direction.Left + Direction.Right;
        const ud = Direction.Up + Direction.Down;
        if ((direction & lr) === lr || (direction & ud) === ud) {
            direction = 0;
        }
        if (direction === 0) {
            direction = oldDirection;
        }
        return direction;
    };

// Walking handling. Check is done for contradicting inputs
const walking =
    (map: InputMap, oldWalking: boolean): boolean => {
        let sx = 0;
        let sy = 0;
        if (map.get('ArrowUp')) {
            sy += 1;
        }
        if (map.get('ArrowDown')) {
            sy += 1;
        }
        if (map.get('ArrowLeft')) {
            sx += 1;
        }
        if (map.get('ArrowRight')) {
            sx += 1;
        }

        const noInput = sx === 0 && sy === 0;
        const conflictInput = sx === 2 || sy === 2;
        return !noInput && !conflictInput;
    };
