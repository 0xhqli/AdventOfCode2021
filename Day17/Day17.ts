var fs = require('fs')
let fileName="Day17I.txt"
let input:number[][]=fs.readFileSync(fileName,"utf8").trim().slice(13).split(", ").map((x:string)=>x.slice(2).split("..").map((i:string)=>+i));

let maxDyV=(-input[1][0])-1;
let minDyV=input[1][0];
let minDxV=Math.ceil(Math.sqrt(2*input[0][0]+0.25)-0.5);
let maxDxV=input[0][1];
let options=0;
for(let dx=minDxV; dx<=maxDxV; dx++){
    for(let dy=minDyV; dy<=maxDyV; dy++){
        if(test([dx,dy],input)) options++
    }
}
reverseY(input)
console.log("P2:",options)
function test(vector:number[],boundBox:number[][]):boolean {
    let pos=[0,0]
    while(!inTarget(pos,boundBox)){
        ({vector,pos}=step({pos,vector}));
        if(pos[0]>boundBox[0][1]||pos[1]<boundBox[1][0])return false
    }
    return true
}
function step({pos,vector}:Record<string,number[]>):Record<string,number[]>{
    pos[0]+=vector[0]
    vector[0]+=vector[0]===0?0:(vector[0]>0?-1:1)
    pos[1]+=vector[1]
    vector[1]--
    return {pos,vector}
}
function inTarget(p:number[],bounds:number[][]):boolean{
    return p[0]>=bounds[0][0]&&p[0]<=bounds[0][1]&&p[1]>=bounds[1][0]&&p[1]<=bounds[1][1]
}
function reverseY(data:number[][]){
    let y=data[1][0]
    let yp=Number.NEGATIVE_INFINITY
    let yV=data[1][0]
    while(yp<y){
        yp=y
        y-=yV
        yV++;
    }
    console.log("P1:",y)
}
