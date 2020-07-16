import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import {GetRegisterNumber} from "../Code/RegisterTools"

test('register name translates to index ', ()=>{
    expect(GetRegisterNumber("$zero")).toBe(0);

    // V0 | V1
    for(let i=0; i < 2; i++) {
        expect(GetRegisterNumber(`$v${i}`)).toBe(i+2);
    }

    // A0 to A3
    for(let i=0; i < 4; i++) {
        expect(GetRegisterNumber(`$a${i}`)).toBe(i+4);
    }

    // S0 to S7
    for(let i=0; i < 8; i++) {
        expect(GetRegisterNumber(`$s${i}`)).toBe(i+16);
    }

    // T0 to T9
    for(let i=0; i < 8; i++) {
        expect(GetRegisterNumber(`$t${i}`)).toBe(i+8);
    }
    expect(GetRegisterNumber("$t8")).toBe(24);
    expect(GetRegisterNumber("$t9")).toBe(25);

    // Pointers
    expect(GetRegisterNumber("$gp")).toBe(28);
    expect(GetRegisterNumber("$sp")).toBe(29);
    expect(GetRegisterNumber("$fp")).toBe(30);
    expect(GetRegisterNumber("$ra")).toBe(31);
});
