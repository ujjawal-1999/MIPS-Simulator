import ActionTypes from "../Store/ActionTypes";

class Operations {

    static New(pattern, stateFunctor) {
        pattern = pattern.replace(/#/g, '(.+)')
            .replace(/_/g, '\\s*');
        Operations.Instructions[pattern] = stateFunctor;
    }

    static Nop() {
        return Operations.GetInstruction('nop');
    }

    static GetInstruction(userInput) {
        userInput = userInput.trim();
        const patterns = Object.keys(Operations.Instructions);
        let foundIndex = -1; let currentIndex = 0;

        let patternAsRegex;
        while (foundIndex < 0 && currentIndex < patterns.length) {
            patternAsRegex = new RegExp(patterns[currentIndex]);
            if (patternAsRegex.test(userInput)) { foundIndex = currentIndex; }
            currentIndex++;
        }

        // Replace null with a nop to get Nop when cant recognize instruction
        if (foundIndex < 0) { return Operations.GetInstruction('nop'); }
        // Calling this with the appropriate number of arguments will give us the state mutator
        const args = patternAsRegex.exec(userInput).slice(1).map((x) => x.trim());

        // Function that takes in arguments for an operation and returns a function
        // that takes in a state and mutates it based on the operation
        const stateFunctor = Operations.Instructions[patterns[foundIndex]];
        const valueFunctor = stateFunctor.apply(null, args);

        return {
            type: ActionTypes.INSTRUCTION,
            payload: valueFunctor
        }
        //console.log((stateFunctor("$s0", "$s1", "$s2"))({ registers: { "$s1": 5, "$s2": 7 }}));
        //console.log((stateFunctor.apply(null, args))({ registers: { "$s1": 5, "$s2": 7 }}));
    }

}
Operations.Instructions = {};

///////////////////////////////////////////////////////////////////////
//\\//\\//\\//          HELPER FUNCTIONS                 //\\//\\//\\//
///////////////////////////////////////////////////////////////////////
// add $s0, $s1, $s2
Operations.New(
    'add _#_,_#_,_#_',
    (rd, rs, rt) => {
        return ((state) => {
            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs]) + parseInt(state.registers[rt])
                }
            }
        })
    }
);

// sub $s0, $s1, $s2
Operations.New(
    'sub _#_,_#_,_#_',
    (rd, rs, rt) => {
        return ((state) => {
            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs] - state.registers[rt])
                }
            }
        })
    }
);

//and $s0, $s1, $s2
Operations.New(
    'and _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:parseInt(state.registers[rs] & state.registers[rt])
                }
            }
        })
    }
)
//andi $s0, $s1, $s2
Operations.New(
    'andi _#_,_#_,_#_',
    (rd,rs,immediate)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(immediate);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:(v1 & v2)
                }
            }
        })
    }
)

// add $s0, $s1, 100
Operations.New(
    'addi _#_,_#_,_#_',
    (rt, rs, immediate) => {
        return ((state) => {
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(immediate);

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rt]: (v1 + v2)
                }
            }
        });
    }
);

//or $s0,$s1,$s2
Operations.New(
    'or _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:parseInt(state.registers[rs] | state.registers[rt])
                }
            }
        })
    }
)
//ori $s0,$s1,immediate
Operations.New(
    'ori _#_,_#_,_#_',
    (rd,rs,immediate)=>{
        return((state)=>{
            let v1 = parseInt(immediate);
            let v2 = state.registers[rs];
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 | v2)
                }
            }
        })
    }
)

//sll $s0,$s1,immediate
Operations.New(
    'sll _#_,_#_,_#_',
    (rd,rt,immediate)=>{
        return((state)=>{
            let v1 = parseInt(immediate);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v2 << v1)
                }
            }
        })
    }
)
//sllv $s0,$s1,$s2
Operations.New(
    'sllv _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 << v2)
                }
            }
        })
    }
)
//srl $s0,$s1,immediate
Operations.New(
    'srl _#_,_#_,_#_',
    (rd,rt,immediate)=>{
        return((state)=>{
            let v1 = parseInt(immediate);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v2 >> v1)
                }
            }
        })
    }
)
//srlv $s0,$s1,$s2
Operations.New(
    'srlv _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 >> v2)
                }
            }
        })
    }
)
//xor $s0,$s1,$s2
Operations.New(
    'xor _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:parseInt((v1 | v2) - (v1 & v2))
                }
            }
        })
    }
)
//xor $s0,$s1,immediate
Operations.New(
    'xori _#_,_#_,_#_',
    (rd,rs,immediate)=>{
        return((state)=>{
            let v1 = parseInt(immediate);
            let v2 = parseInt(state.registers[rs])
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:((v2 | v1) - (v2 & v1))
                }
            }
        })
    }
)
//nor $s0,$s1,$s2
Operations.New(
    'nor _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]:(~(state.registers[rs] | state.registers[rt]))
                }
            }
        })
    }
)

//slt $s0,$s1,$s2
Operations.New(
    'slt _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 < v2) ? 1 : 0
                }
            }
        })
    }
)
//slti $s0,$s1,immediate
Operations.New(
    'slti _#_,_#_,_#_',
    (rd,rs,immediate)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(immediate);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 < v2) ? 1 : 0
                }
            }
        })
    }
)

// li $t0, 100
Operations.New(
    'li _#_,_#_',
    (rd, immediate) => {
        return ((state) => {

            immediate = parseInt(immediate);
            immediate = isNaN(immediate) ? 0: immediate;

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: immediate
                }
            }

        });
    }
);

// beq $s0, $s1, label
Operations.New(
    'beq _#_,_#_,_#_',
    (rs,rt, label) => {
        return ((state) => {
            let shouldBranch = (state.registers[rs] === state.registers[rt]);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);

// bgtz $s0, label
Operations.New(
    'bgtz _#_,_#_',
    (rs,label) => {
        return ((state) => {
            let shouldBranch = (parseInt(state.registers[rs]) > 0);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);
// bltz $s0, label
Operations.New(
    'bltz _#_,_#_',
    (rs,label) => {
        return ((state) => {
            let shouldBranch = (parseInt(state.registers[rs]) < 0);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);
// blez $s0, label
Operations.New(
    'blez _#_,_#_',
    (rs,label) => {
        return ((state) => {
            let shouldBranch = (parseInt(state.registers[rs]) <= 0);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);
// bgez $s0, label
Operations.New(
    'bgez _#_,_#_',
    (rs,label) => {
        return ((state) => {
            let shouldBranch = (parseInt(state.registers[rs]) >= 0);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);
//bne $s0, $s1, label
Operations.New(
    'bne _#_,_#_,_#_',
    (rs,rt, label) => {
        return ((state) => {
            let shouldBranch = (state.registers[rs] !== state.registers[rt]);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);

// nop
Operations.New(
    'nop',
    () => {
        return ((state) => {
            return {...state};
        })
    }
);

// j loop
Operations.New(
    'j _#_',
    (label) => {
        return ((state) => {
            return {
                ...state,
                programCounter: state.jumpTable[label]
            }
        });
    }
);

// jal loop
Operations.New(
    'jal _#_',
    (label) => {
        return ((state) => {
            return {
                ...state,
                programCounter: state.jumpTable[label],
                registers: {
                    ...state.registers,
                    "$ra": state.programCounter
                }
            }
        })
    }
);

// Extra Functions (that are not generally available)
Operations.New(
    'rem _#_, _#_, _#_',
    (rd,rs,rt) => {
        return ((state) => {

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs] % state.registers[rt])
                }
            }

        });
    }
);

//move $s0,$s1
Operations.New(
    'move _#_, _#_',
    (rd, rs) => {
        return ((state) => {

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs])
                }
            }

        });
    }
);

// Mimics
Operations.New(
    'addu _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return ((state) =>{
            let shouldAdd = (parseInt(state.registers[rs]) >= 0 && parseInt(state.registers[rt]) >= 0);
            if(shouldAdd){
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        [rd]: parseInt(state.registers[rs]+ state.registers[rt])
                    }
                }
            }
            else{
                return{
                    ...state,
                    registers:{
                        ...state.registers
                    }
                }
            }
            
        })
    }
)
Operations.New(
    'addiu _#_,_#_,_#_',
    (rt,rs,immediate)=>{
        return ((state) =>{
            let shouldAdd = (parseInt(state.registers[rs]) >= 0 && parseInt(immediate) >= 0);
            if(shouldAdd){
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        [rt]: parseInt(state.registers[rs])+ parseInt(immediate)
                    }
                }
            }
            else{
                return{
                    ...state,
                    registers:{
                        ...state.registers
                    }
                }
            }
            
        })
    }
)
Operations.New(
    'subu _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return ((state) =>{
            let shouldSub = (parseInt(state.registers[rs]) >= 0 && parseInt(state.registers[rt]) >= 0);
            if(shouldSub){
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        [rd]: parseInt(state.registers[rs] - state.registers[rt])
                    }
                }
            }
            else{
                return{
                    ...state,
                    registers:{
                        ...state.registers
                    }
                }
            }
            
        })
    }
)
Operations.New(
    'mult _#_,_#_',
    (rs,rt,hi=0,lo=0)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            let res = a*b;
            let resString = res.toString().length;
            return{
                ...state,
                registers:{
                    ...state.registers,
                    hi: (Math.floor(res/Math.pow(10,resString-Math.floor(resString/2)))),
                    lo: (Math.floor(res%Math.pow(10,Math.floor(resString/2))))
                }
            }
        })

    }
)
Operations.New(
    'multu _#_,_#_',
    (rs,rt,hi=0,lo=0)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            let res = a*b;
            let resString = res.toString().length;
            let shouldMult = (parseInt(state.registers[rs]) >= 0 && parseInt(state.registers[rt]) >= 0);
            if(shouldMult){
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        hi: (Math.floor(res/Math.pow(10,resString-Math.floor(resString/2)))),
                        lo: (Math.floor(res%Math.pow(10,Math.floor(resString/2))))
                    }
                }
            }
            else{
                return{
                    ...state,
                    registers:{
                        ...state.registers
                    }
                }
            }
        })

    }
)
Operations.New(
    'mul _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            let res = a*b;
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        [rd]:parseInt(res)
                    }
                }    
        })

    }
)
Operations.New(
    'div _#_,_#_',
    (rs,rt,hi=0,lo=0)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    hi: (Math.floor(a%b)),
                    lo: (Math.floor(a/b))
                }
            }
        })

    }
)
Operations.New(
    'divu _#_,_#_',
    (rs,rt,hi=0,lo=0)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            let shouldDiv = (parseInt(state.registers[rs]) >= 0 && parseInt(state.registers[rt]) >= 0);
            if(shouldDiv){
                return{
                    ...state,
                    registers:{
                        ...state.registers,
                        hi: (Math.floor(a%b)),
                        lo: (Math.floor(a/b))
                    }
                }
            }
            else{
                return{
                    ...state,
                    registers:{
                        ...state.registers
                    }
                }
            }
        })

    }
)
Operations.New(
    'divd _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let a = parseInt(state.registers[rs]);
            let b = parseInt(state.registers[rt]);
            return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (Math.floor(a/b))
                }
            }
        })

    }
)
//sltu $s0,$s1,$s2
Operations.New(
    'sltu _#_,_#_,_#_',
    (rd,rs,rt)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(state.registers[rt]);
            let shouldSet = (parseInt(state.registers[rs]) >= 0 && parseInt(state.registers[rt]) >= 0);
            if(shouldSet){
                return{
                ...state,
                registers:{
                    ...state.registers
                    }
                }
            }
            else{
                return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 < v2) ? 1 : 0
                    }
                }
            }
        })
    }
)
//slti $s0,$s1,immediate
Operations.New(
    'sltiu _#_,_#_,_#_',
    (rd,rs,immediate)=>{
        return((state)=>{
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(immediate);
            let shouldSet = (parseInt(state.registers[rs]) >= 0 && parseInt(immediate) >= 0);
            if(shouldSet){
                return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 < v2) ? 1 : 0
                }
             }
            }
            else{
                return{
                ...state,
                registers:{
                    ...state.registers,
                    [rd]: (v1 < v2) ? 1 : 0
                    }
                }
            }  
        })
    }
)

export default Operations;