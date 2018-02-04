import { Game } from '../types';

// Pause handling. To avoid key events autorepeat (event fired multiple time if
// key is kept down), we need to keep track of the state of the escape key.
let wasEscapeDown = false;
export const pause =
    (map: Map<string, boolean>, { state }: Game.Pause): Game.Pause => {
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
