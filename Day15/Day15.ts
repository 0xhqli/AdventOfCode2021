var fs = require('fs')
var PriorityQueue=require('ts-priority-queue')['default']
let fileName="Day15I.txt"
let input:number[][]=fs.readFileSync(fileName,"utf8").trim().split("\n").map((x:string)=>x.split('').map((n:string)=>+n))


class FrontierNode{
    f:number
    l:Record<string,number>
    constructor(p:Record<string,number>,f:number){
        this.l=p;
        this.f=f;
    }
}

let start={x:0,y:0}
console.log("P1:",a_star(start,{x:input[0].length-1,y:input.length-1},input))
let expandedMap:number[][]=expandY(expandX(input))
console.log("P2:",a_star(start,{x:expandedMap[0].length-1,y:expandedMap.length-1},expandedMap))

function a_star(st:Record<string,number>,goal:Record<string,number>,inputMap:number[][]):number{
    let frontier=new PriorityQueue({ comparator: function(a:FrontierNode, b:FrontierNode) { return a.f- b.f; }});
    frontier.queue(new FrontierNode(st,getF(manhatten(st,goal),0)));
    let cameFrom:Record<string,Record<string,number>|null>={}
    let costSoFar:Record<string,number>={}
    cameFrom[locToString(st)] = null;
    costSoFar[locToString(st)]=0;
    while(frontier.length>0){
        let current=frontier.dequeue()
        if(isGoal(current['l'],goal)){
            return costSoFar[locToString(current['l'])]
        }
        for(let next of genAdjacentLoc(current['l'],inputMap)){
            let nextStr=locToString(next)
            let newCost=costSoFar[locToString(current['l'])]+inputMap[next['y']][next['x']]
            if((!costSoFar.hasOwnProperty(nextStr))||newCost<costSoFar[nextStr]){
                costSoFar[nextStr] = newCost
                let p=getF(manhatten(next,goal),newCost)
                frontier.queue(new FrontierNode(next,p))
                cameFrom[nextStr]=current['l']
            }
        }
    }
    return -1;
}
function isGoal(p:Record<string,number>,goal:Record<string,number>){
    return p.x===goal.x&&p.y===goal.y
}
function locToString({x,y}:Record<string,number>){
    return `${x}_${y}`
}
function getF(h:number,g:number){
    return h+g
}
function manhatten(p:Record<string,number>,goal:Record<string,number>){
    return Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y)
}

function genAdjacentLoc({x,y}:Record<string,number>,inputMap:number[][]):Record<string,number>[]{
    let adj:Record<string,number>[]=[]
    if(LocationExist({x:x-1,y},inputMap))adj.push({x:x-1,y})
    if(LocationExist({x:x+1,y},inputMap))adj.push({x:x+1,y})
    if(LocationExist({x,y:y-1},inputMap))adj.push({x,y:y-1})
    if(LocationExist({x,y:y+1},inputMap))adj.push({x,y:y+1})
    return adj
}
function LocationExist({x,y}:Record<string,number>,inputMap:number[][]):boolean{
    return (y>=0&&y<inputMap.length&&x>=0&&x<inputMap[y].length)
}
function printMap(inputMap:number[][]){
    for(let r of inputMap){
        console.log(r.join(''))
    }
}
function expandX(inputMap:number[][]):number[][]{
    let increase=(x:number)=>x==9?1:x+1
    let res:number[][]=[]
    for(let r of inputMap){
        let x2=r.map(increase)
        let x3=x2.map(increase)
        let x4=x3.map(increase)
        let x5=x4.map(increase)
        res.push([...r,...x2,...x3,...x4,...x5])
    }
    return res
}
function expandY(inputMap:number[][]):number[][]{
    let increase=(x:number)=>x==9?1:x+1
    let res:number[][]=[]
    res.push(...inputMap);
    let c:number[][]=[]
    c.push(...inputMap)
    for(let x=1;x<5;x++){
        c=c.map((x:number[])=>x.map((n:number)=>increase(n)))
        res.push(...c)
    }
    return res
}