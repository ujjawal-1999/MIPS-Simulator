import { createStore } from "redux";
import RootReducer from "./RootReducer";
import ProgramStates from "../Code/ProgramStates";

const initialStoreState = {
    registers: {
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
    },
    instructions: [],
    jumpTable: [],
    programCounter: 0,
    stepHistory: [],
    currentState: ProgramStates.None
};

const store = createStore(RootReducer, initialStoreState,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default store;