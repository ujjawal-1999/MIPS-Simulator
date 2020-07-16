import Operations from "../Code/Operations";

test('Random', ()=>{

    const res = Operations.GetInstruction("add $s0, $s1, $s2");
    console.log(res);

});