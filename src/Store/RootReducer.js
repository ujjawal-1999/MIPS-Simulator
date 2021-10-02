import ActionTypes from "./ActionTypes";
import ProgramStates from "../Code/ProgramStates";
// import Store from "./Store";

const defaultRegisters = {
    "$zero": 0,
    "$at": 0,
    "$v0": 0,
    "$v1": 0,
    "$a0": 0,
    "$a1": 0,
    "$a2": 0,
    "$a3": 0,
    "$t0": 0,
    "$t1": 0,
    "$t2": 0,
    "$t3": 0,
    "$t4": 0,
    "$t5": 0,
    "$t6": 0,
    "$t7": 0,
    "$s0": 0,
    "$s1": 0,
    "$s2": 0,
    "$s3": 0,
    "$s4": 0,
    "$s5": 0,
    "$s6": 0,
    "$s7": 0,
    "$t8": 0,
    "$t9": 0,
    "$k0": 0,
    "$k1": 0,
    "$gp": 0,
    "$sp": 0,
    "$fp": 0,
    "$ra": 0
};


const RootReducer = (state, action) => {

    switch (action.type) {
        case ActionTypes.RUN_PROGRAM:
            if (state.instructions === null || state.instructions.length === 0) {
                return state;
            }
            // Start running the program from the current counter
            let currentProgramCounter = state.programCounter;
            let currentState = state;
            let shouldContinue = true;

            if (currentProgramCounter > state.instructions.length) {
                shouldContinue = false;
            }

            while(shouldContinue) {
                let nextState = (state.instructions[currentProgramCounter]).payload(currentState);
                // If program counter wasn't manually changed, update it
                if (nextState.programCounter === currentState.programCounter) {
                    nextState.programCounter += 1;
                }
                // If the incremented program counter is the last instruction, do nothing
                if (nextState.programCounter === currentState.instructions.length) {
                    shouldContinue = false;
                    // console.log('current',currentState);
                    // return{...currentState};
                }
                // if(!shouldContinue) { return; }

                nextState.stepHistory = [...state.stepHistory, nextState.programCounter];
                nextState.currentState = ProgramStates.Completed;
                currentState = nextState;
            }

            return {...currentState};
            // break;
        case ActionTypes.STEP_INSTRUCTION:

            // If there are no instructions or the program has completed, don't do anything
            if (
                state.instructions === null
                || state.instructions.length === 0
                || state.currentState === ProgramStates.Completed
            ) {
                return state;
            }
            // console.log(state);
            // If the instruction being executed is out of range, do nothing
            if (state.programCounter >= state.instructions.length) {
                return {
                    ...state,
                    stepHistory: [...state.stepHistory, "halt"],
                    currentState: ProgramStates.Completed
                }
            }

            // The next state is decided by the operation done on the current state by the
            // next instruction being executed
            console.debug(`Executing Instruction: ${state.programCounter}`, state.instructions[state.programCounter]);
            let nextState = (state.instructions[state.programCounter]).payload(state);

            // If program counter wasn't manually changed, go to the next instruction
            if (nextState.programCounter === state.programCounter) {
                nextState.programCounter += 1;
            }

            nextState.stepHistory = [...state.stepHistory, nextState.programCounter];
            nextState.currentState = ProgramStates.Running;

            return nextState;
        case ActionTypes.INSTRUCTION:
            // We want payload to be a function that takes in state and returns
            // the new state
            return action.payload(state);
        case ActionTypes.PROGRAM_ASSEMBLE:
            return {
                ...state,
                instructions: action.payload.instructions,
                jumpTable: action.payload.jumpTable,
                currentState: ProgramStates.Assembled,
                programCounter: 0,
                lastProgramCounter: state.programCounter,
                registers: {...defaultRegisters}
            };
        default:
            return state;
    }
};

export default RootReducer;