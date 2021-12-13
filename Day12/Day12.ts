var fs = require('fs')
let fileName="Day12I.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split("\n")

//cave datastructure
class Cave{
    name:string;
    connections:Cave[]=[];
    isSmol:boolean;
    constructor(name:string){
        this.name=name;
        this.isSmol=name.toLowerCase()===name
    }
    //recursively get paths to goal from current cave, filtering out visited small caves. boolean doubleVisited is for if allowed to visit one small cave twice
    getPaths(goal:string,visited:string[],doubleVisited:boolean):string[][]{
        let possibleDirections=this.connections.filter(c=>!c.isEqual('start'))
        let isSmolAndPrevVisited=this.isSmol&&visited.includes(this.name);
        if(doubleVisited||isSmolAndPrevVisited){
            possibleDirections=possibleDirections.filter(c=>!c.isSmol||!visited.includes(c.name)) //p1 filter
        }
        if(this.name===goal){
            return [[...visited,this.name]]
        }
        else if(possibleDirections.length===0)
            return [];
        let res:string[][]=[]
        for(let x of possibleDirections){
            res.push(...x.getPaths(goal,[...visited,this.name],doubleVisited||isSmolAndPrevVisited))
        }
        return res;
    }
    // adds connection to self. boolean twoWay is to tell if the other cave also needs the connection added
    addConnection(newConnection:Cave,twoWay:boolean=true){
        if(!this.connectionsInclude(newConnection)){
            this.connections.push(newConnection)
        }
        if(twoWay){
            newConnection.addConnection(this,false)
        }
    }
    // checks if cave is already in connections
    connectionsInclude(c:Cave):boolean{
        for(let x of this.connections){
            if(x.isEqual(c)) return true
        }
        return false;
    }
    // checks if cave is equal via either the name or the cave object
    isEqual(c:Cave|string):boolean{
        if(!(typeof c === "string")){
            c=c.name
        }
        return c===this.name
    }
}


//find set of caves from input
let caves=new Set<string>(input.reduce((ax:string[],el:string)=>[...ax,...el.split('-')],[]));

//generate caves
let caveDic:Record<string,Cave>={};
for(let c of caves){
    caveDic[c]=new Cave(c)
}
for(let line of input){
    let [a,b]=line.split('-')
    caveDic[a].addConnection(caveDic[b])
}

let resP1=caveDic["start"].getPaths("end",[],true)
console.log("P1: ",resP1.length)

let resP2=caveDic["start"].getPaths("end",[],false)
console.log("p2: ",resP2.length)