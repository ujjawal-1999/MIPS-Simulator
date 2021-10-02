import ActionTypes from "../Store/ActionTypes";
import Operations from "./Operations";

const labelMatcher = /\s*(\w+):\s*/;

class Assembler {

    static validateCode = (line) => {
        return line.replace(/(#.+)/g, "").trim();
    };

    static Assemble = (linesOfCode) => {
        // Currently a line of strings
        let instructions = linesOfCode.map((x) => Assembler.validateCode(x));
        let parsedInstruction = [];
        let jumpTable = {};

        let instructionCount = 0;
        for (let i=0; i < instructions.length; i++) {
            const currentInstruction = instructions[i];

            // If the instruction is a label, add it to the jump table
            const label = labelMatcher.exec(currentInstruction);
            if (label !== null && label !== undefined) {
                jumpTable[label[1]] = instructionCount;
                // Every label is treated as a nop
                parsedInstruction.push(Operations.Nop());
                instructionCount++;
            } else {
                parsedInstruction.push(Operations.GetInstruction(currentInstruction));
                instructionCount++;
            }
        }

        return {
            type: ActionTypes.PROGRAM_ASSEMBLE,
            payload: {
                instructions: parsedInstruction,
                jumpTable: jumpTable
            }
        }
    };

}

export default Assembler;