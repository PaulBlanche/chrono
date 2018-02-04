import { Game } from '../types';
import { pause } from './pause';
import { direction } from './direction';
import { walking } from './walking';

// Data structure keeping tracks of key down/up events.
type InputMap = Map<string, boolean>;

// Data structure for game events based on inputs.
const INITIAL_INPUT: Game.Input = {
    walking: false,
    direction: Game.Direction.Right,
    pause: { state:false, edge:false },
};

// Initialize the input map.
const MAP: InputMap = new Map<string, boolean>();

// Listen to keydown/keyup events. Update the input map accordingly (true for
// down, false for up). Prevent default action of the event.
document.addEventListener('keydown', evt => {
    const key = evt.key;
    MAP.set(key, true);
    evt.preventDefault();
});
document.addEventListener('keyup', evt => {
    const key = evt.key;
    MAP.set(key, false);
    evt.preventDefault();
});

// keep track of previous state for long runing events
let currentInput = INITIAL_INPUT;

// build the game event datastructure on demand
export const input = (): Game.Input => {
    currentInput = {
        direction: direction(MAP, currentInput.direction),
        walking: walking(MAP, currentInput.walking),
        pause: pause(MAP, currentInput.pause),
    };
    return currentInput;
};
