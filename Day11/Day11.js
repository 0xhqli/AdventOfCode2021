var fs = require('fs');
let fileName="Day11Input.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split("\n").map(x=>x.split(''))

let p1=0;
let p2=0;
let steps=350;
let c=0
let octoCount=input.reduce((a,x)=>a+x.length,0)
for(let i=1;i<=steps;i++){
    let f=step(input)
    c+=f;
    if(i==100)p1=c
    if(f==octoCount&&p2==0)p2=i
}
console.log("flashes:",c)
console.log("p1:",p1)
console.log("p2:",p2)

function step(inputMap){
    let toCheck=[];
    for(let y=0;y<inputMap.length;y++){
        for(let x=0;x<inputMap[y].length;x++){
            inputMap[y][x]++
            if(ninePlus({x,y},inputMap)){
                toCheck.push({x,y})
            }
        }
    }
    return flash(toCheck,inputMap);
}
function flash(toCheck,inputMap){
    let count=0;
    let currLoc=toCheck.pop()
    while(currLoc){
        count++;
        inputMap[currLoc.y][currLoc.x]=0;
        let adj=genAdjacentLoc(currLoc,inputMap)
        for(let loc of adj){
            inputMap[loc.y][loc.x]++;
            if(ninePlus(loc,inputMap)){
                toCheck.push(loc)
            }
        }
        currLoc=toCheck.pop()
    }
    return count;
}
function ninePlus(loc,inputMap){
    return inputMap[loc.y][loc.x]>9
}
function include(loc,inputMap){
    return inputMap[loc.y][loc.x]>0&&inputMap[loc.y][loc.x]<10
}
function LocationExist({x,y},inputMap){
    if(y<0)return false
    if(y>=inputMap.length)return false
    if(x<0)return false
    if(x>=inputMap[y].length) return false
    return true
}
function genAdjacentLoc(loc,inputMap){
    let {x,y}=loc
    let adj=[]
    for(let xm=-1;xm<2;xm++){
        for(let ym=-1;ym<2;ym++){
            if(xm!=0||ym!=0){
                let g={x:x+xm,y:y+ym}
                if(LocationExist(g,inputMap)&&include(g,inputMap))adj.push(g)
            }
        }
    }
    return adj
}