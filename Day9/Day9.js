var fs = require('fs')
let fileName="Day9Input.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split("\n").map(x=>x.split(''))

//p1
let lowpoints=mapLowPoints(input)
console.log("p1: "+getRisk())

function getRisk(){
    return lowpoints.reduce((a,c)=>a+c.h+1,0)
}
function mapLowPoints(inputMap){
    let res=[]
    for(let y=0;y<inputMap.length;y++){
        for(let x=0;x<inputMap[y].length;x++){
            if(isLowPoint(x,y,inputMap)){
                res.push({x,y,"h":+inputMap[y][x]})
            }
        }
    }
    return res
}
function isLowPoint(x,y,inputMap){
    let h=inputMap[y][x]
    if(inputMap[y][x-1]){
        if(inputMap[y][x-1]<=h)return false
    }
    if(inputMap[y][x+1]){
        if(inputMap[y][x+1]<=h)return false
    }
    if(inputMap[y-1]){
        if(inputMap[y-1][x]<=h)return false
    }
    if(inputMap[y+1]){
        if(inputMap[y+1][x]<=h)return false
    }
    return true;
}



//p2
let l1=0;
let l2=0;
let l3=0;
for(let lowPt of lowpoints){
    let s=findBasin(lowPt,input).length
    if(s>l1){
        l3=l2
        l2=l1
        l1=s
    }
    else if(s>l2){
        l3=l2
        l2=s
    }
    else if(s>l3){
        l3=s
    }
}
console.log("p2: "+l1*l2*l3)

function findBasin(l,inputMap){
    let {x,y}=l
    let basin=[]
    basin.push({x,y})
    let toCheck=[]
    toCheck.push(...genAdjacentLoc(l,inputMap))
    let nextLoc=toCheck.pop()
    while(nextLoc){
        if(!is9(nextLoc,inputMap)){
            basin.push(nextLoc)
            let adj=filteredLocs(genAdjacentLoc(nextLoc,inputMap),[...basin,...toCheck])
            toCheck.push(...adj)
        }
        nextLoc=toCheck.pop()
    }
    return basin;
}

function filteredLocs(adjLoc,exc){
    let res=[]
    for (let loc of adjLoc){
        let inc=true
        for(let l of exc){
            if(l.x===loc.x&&l.y===loc.y)inc=false;
        }
        if(inc){
            res.push(loc)
        }
    }
    return res
}
function genAdjacentLoc(loc,inputMap){
    let {x,y}=loc
    let adj=[]
    if(LocationExist(x-1,y,inputMap))adj.push({x:x-1,y})
    if(LocationExist(x+1,y,inputMap))adj.push({x:x+1,y})
    if(LocationExist(x,y-1,inputMap))adj.push({x,y:y-1})
    if(LocationExist(x,y+1,inputMap))adj.push({x,y:y+1})
    return adj
}
function is9(loc,inputMap){
    return inputMap[loc.y][loc.x]==9
}
function LocationExist(x,y,inputMap){
    if(y<0)return false
    if(y>=inputMap.length)return false
    if(x<0)return false
    if(x>=inputMap[y].length) return false
    return true
}

