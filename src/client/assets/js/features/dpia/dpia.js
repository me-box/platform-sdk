import { createStructuredSelector, createSelector } from 'reselect';

export const NAME = 'dpia';

const TOGGLE_DPIA = 'iot.red/dpia/TOGGLE_DPIA';

const initialState = {
    show: false
}

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case TOGGLE_DPIA:
            return {
                ...state,
                show: !state.show,
            }

        default:
            return state

    }
}

function toggleDPIA() {
    return {
        type: TOGGLE_DPIA,
    }
}

const show = (state) => state[NAME].show;

export const selector = createStructuredSelector({
    show,
});

export const actionCreators = {
    toggleDPIA,
};