import {writable} from 'svelte/store';

export const stateStore = writable({state: '', start: -1})
export const shapesStore = writable({shapes: []});
export const pledgeStore = writable(0);
export const questionsStore = writable({
    answers : [
        //responses
    ]
});
export const subscribeStore = writable("");