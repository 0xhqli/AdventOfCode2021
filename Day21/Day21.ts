var fs = require('fs')
let fileName="Day21I.txt"
let positions:number[]=fs.readFileSync(fileName,"utf8").trim().split("\n").map((x:string)=>+x.slice(-1))

type GameState={
    pos:number[],
    sc:number[],
    winNo:number,
    turn:number,
    isWon:boolean
}
function gameTurn({pos,sc,winNo,turn,isWon}:GameState,r1:number,r2:number,r3:number):GameState{
    let roll=r1+r2+r3
    pos[turn]+=roll
    let s=pos[turn]%10
    pos[turn]=s===0?10:s
    sc[turn]+=pos[turn]
    isWon=sc[turn]>=winNo
    turn=(turn+1)%2
    return {pos,sc,winNo,turn,isWon};
}
let stateString=(gState:GameState,r1:number,r2:number,r3:number)=>`pos:${gState.pos},sc:${gState.sc},t:${gState.turn},rolls:${r1},${r2},${r3}`
let memo:Record<string,number[]>={}
function DiracGame(gState:GameState,r1:number,r2:number,r3:number):number[]{
    let asString=stateString(gState,r1,r2,r3);
    let turn=gameTurn(gState,r1,r2,r3);
    let w=[0,0];
    if(turn.isWon){
        w[(turn.turn+1)%2]++;
    }
    else{
        for(let nR1=1; nR1<=3;nR1++){
            for(let nR2=1; nR2<=3;nR2++){
                for(let nR3=1; nR3<=3;nR3++){
                    let nextString=stateString(turn,nR1,nR2,nR3)
                    if(memo.hasOwnProperty(nextString)){
                        let x=memo[nextString]
                        w[0]+=x[0]
                        w[1]+=x[1]
                    }
                    else{
                        let x=DiracGame({pos:[...turn.pos],sc:[...turn.sc],winNo:turn.winNo,turn:turn.turn,isWon:turn.isWon},nR1,nR2,nR3)
                        w[0]+=x[0]
                        w[1]+=x[1]
                    }
                }
            }
        }
    }
    memo[asString]=w;
    return w;
}

const DETERMINISTIC_DICE=(()=>{
    let counter=0;
    let roll=()=>counter++%100+1;
    let rollCounter=()=>counter;
    return {roll,rollCounter};
})()
let Game1:GameState={
    pos:[...positions],
    sc:[0,0],
    winNo:1000,
    turn:0,
    isWon:false
}
while(!Game1.isWon){
    let roll1=DETERMINISTIC_DICE.roll()
    let roll2=DETERMINISTIC_DICE.roll()
    let roll3=DETERMINISTIC_DICE.roll()
    Game1=gameTurn(Game1,roll1,roll2,roll3)
}
console.log(Game1)
console.log("P1:",Math.min(...Game1.sc)*DETERMINISTIC_DICE.rollCounter())

let wCount:number[]=[0,0]
for(let nR1=1; nR1<=3;nR1++){
    for(let nR2=1; nR2<=3;nR2++){
        for(let nR3=1; nR3<=3;nR3++){
            let res=DiracGame({pos:[...positions],sc:[0,0],winNo:21,turn:0,isWon:false},nR1,nR2,nR3)
            wCount[0]+=res[0]
            wCount[1]+=res[1]
        }
    }
}
console.log(wCount)
console.log("P2:",Math.max(...wCount))