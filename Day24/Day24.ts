var fs = require('fs')
let fileName="Day24I.txt"
let instructions:string[][]=fs.readFileSync(fileName,"utf8").trim().split('\n').map((s:string)=>s.split(" "))

let instruction:Record<string,Function>={"inp":inp,"add":add,"mul":mul,"div":div,"mod":mod,"eql":eql}
let mem:Set<string>=new Set()

type ProgramState={
    registers:Record<string,number>
    CIR:number;
    previousDigits:string;
}

// inp(instructions[0][1],9,{registers:{w:0,x:0,y:0,z:0},CIR:1,previousDigits:""},true) //p1
inp(instructions[0][1],9,{registers:{w:0,x:0,y:0,z:0},CIR:1,previousDigits:""},false) //p2 

console.log("no match found")

function inp(a:string,input:number,state:ProgramState,decreasing:boolean){
    let s=`${state.registers['z']}|${state.previousDigits.length}|${input}`
    if(mem.has(s)){
        return;
    }
    state.registers[a]=input
    state.previousDigits+=input;
    let next=instructions[state.CIR++]
    while(next&&next[0]!=="inp"){
        state=instruction[next[0]](next[1],next[2],state)
        next=instructions[state.CIR++]
    }
    if(state.previousDigits.length===14){
        if(state.registers["z"]===0){
            console.log("success:",state.previousDigits);
            process.exit(0);
        }
    }
    else if(next[0]==='inp'){
        if(decreasing){
            for(let n=9;n>0;n--){
                inp(next[1],n,{...state,registers:{...state.registers}},decreasing)
            }
        }
        else{
            for(let n=1;n<10;n++){
                inp(next[1],n,{...state,registers:{...state.registers}},decreasing)
            }
        }
    }
    try{
        mem.add(s)
    }
    catch(e){
        console.log(state.previousDigits);
        mem=new Set()
        mem.add(s)
    }
}
function add(a:string, b:string,state:ProgramState){
    let n:number=+b;
    if(isNaN(n)){
        n=state.registers[b]
    }
    state.registers[a]=state.registers[a]+n
    return state;
}
function mul(a:string, b:string,state:ProgramState){
    let n:number=+b;
    if(isNaN(n)){
        n=state.registers[b]
    }
    state.registers[a]=state.registers[a]*n
    return state;
}
function div(a:string, b:string,state:ProgramState){
    let n:number=+b;
    if(isNaN(n)){
        n=state.registers[b]
    }
    if(n===0)return state;
    state.registers[a]=Math.floor(state.registers[a]/n)
    return state;
}
function mod(a:string, b:string,state:ProgramState){
    let n:number=+b;
    if(isNaN(n)){
        n=state.registers[b]
    }
    if(n<=0||state.registers[a]<0)return state
    state.registers[a]=state.registers[a]%n
    return state;
}
function eql(a:string, b:string,state:ProgramState){
    let n:number=+b;
    if(isNaN(n)){
        n=state.registers[b]
    }
    state.registers[a]=state.registers[a]===n?1:0
    return state;
}