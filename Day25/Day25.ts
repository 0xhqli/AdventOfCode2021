var fs = require('fs')
let fileName="Day25S3.txt"
let cucumberMap:string[][]=fs.readFileSync(fileName,"utf8").trim().split('\n').map((s:string)=>s.split(''))
let preCuMap:string[][]|null=null;
let curCuMap:string[][]=cucumberMap;
let nextPoint:Record<string,Function>={
    ">":({x,y}:Point,mapData:string[][]):Point=>({y,x:(x+1)%mapData[y].length}),
    "v":({x,y}:Point,mapData:string[][]):Point=>({y:(y+1)%mapData.length,x})
}
type Point={x:number,y:number};

let i=0;
while(!mapsEqual(preCuMap,curCuMap)){
    preCuMap=curCuMap;
    curCuMap=step(curCuMap)
    i++
}
console.log(i)

//checks if 2 2D representations of the map are equal.
function mapsEqual(prev:string[][]|null,curr:string[][]):boolean{
    if(prev===null) return false;
    for(let y=0;y<curr.length;y++){
        if(prev[y].join('')!==curr[y].join(''))return false;
    }
    return true;
}
//simulate next step in a deep copy of the 2D array. return a 2D array of what the map looks like when all individual
//take their potential next step
function step(mapData:string[][]):string[][]{
    let mapDeepCopy:string[][]=[]
    for(let l of mapData){
        mapDeepCopy.push([...l])
    }
    mapData=stepToNextSpace(mapDeepCopy,">");
    return stepToNextSpace(mapDeepCopy,"v");
}
//returns a 2D array of a specific herd taking their next step.
function stepToNextSpace(mapData:string[][],dir:string):string[][]{
    let movable:Point[]=canMoveToNextSpace(mapData,dir)
    for(let {x,y} of movable){
        let nextPt=nextPoint[dir]({x,y},mapData)
        mapData[y][x]='.'
        mapData[nextPt.y][nextPt.x]=dir
    }
    return mapData
}
//returns the locations of individuals of a specific herd who can take their next step.
function canMoveToNextSpace(mapData:string[][],dir:string):Point[]{
    let movable:Point[]=[]
    for(let y=0;y<mapData.length;y++){
        for(let x=0;x<mapData[y].length;x++){
            if(mapData[y][x]===dir){
                if(canMove(nextPoint[dir]({x,y},mapData),mapData)){
                    movable.push({x,y})
                }
            }
        }
    }
    return movable
}
//checks if location specified is open for movement
function canMove({x,y}:Point,mapData:string[][]):boolean{
    return mapData[y][x]==="."
}
//prints out 2D representation of map data
function printMap(mapData:string[][]|null){
    if(mapData===null)return;
    for(let line of mapData){
        console.log(line.join(''))
    }
}