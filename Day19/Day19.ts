var fs = require('fs')
let fileName="Day19I.txt"
let input:string[][]=fs.readFileSync(fileName,"utf8").trim().split("\n\n").map((x:string)=>x.split('\n'))

// const ALL_ROTATIONS: Record<string,string>[] = [
//     {x: "x", y: "y", z: "z"},
//     {x: "x", y: "z", z: "-y"},
//     {x: "x", y: "-y", z: "-z"},
//     {x: "x", y: "-z", z: "y"},
//     {x: "-x", y: "-y", z: "z"},
//     {x: "-x", y: "z", z: "y"},
//     {x: "-x", y: "y", z: "-z"},
//     {x: "-x", y: "-z", z: "-y"},
//     {x: "y", y: "z", z: "x"},
//     {x: "y", y: "x", z: "-z"},
//     {x: "y", y: "-z", z: "-x"},
//     {x: "y", y: "-x", z: "z"},
//     {x: "-y", y: "-z", z: "x"},
//     {x: "-y", y: "x", z: "z"},
//     {x: "-y", y: "z", z: "-x"},
//     {x: "-y", y: "-x", z: "-z"},
//     {x: "z", y: "x", z: "y"},
//     {x: "z", y: "y", z: "-x"},
//     {x: "z", y: "-x", z: "-y"},
//     {x: "z", y: "-y", z: "x"},
//     {x: "-z", y: "-x", z: "y"},
//     {x: "-z", y: "y", z: "x"},
//     {x: "-z", y: "x", z: "-y"},
//     {x: "-z", y: "-x", z: "-y"},//end of true rotations
// ]
let ALL_ROTATIONS: Record<string,string>[]=[]
let swaparroos:Record<string,string>[]=[
    {x: "x", y: "y", z: "z"},
    {x: "x", y: "z", z: "y"},
    {x: "y", y: "x", z: "z"},
    {x: "y", y: "z", z: "x"},
    {x: "z", y: "x", z: "y"},
    {x: "z", y: "y", z: "x"},
]
let flips:Record<string,string>[]=[
    {x: "", y: "", z: ""},
    {x: "-", y: "", z: ""},
    {x: "", y: "-", z: ""},
    {x: "", y: "", z: "-"},
    {x: "-", y: "-", z: ""},
    {x: "", y: "-", z: "-"},
    {x: "-", y: "", z: "-"},
    {x: "-", y: "-", z: "-"},
]
for(let swap of swaparroos){
    for(let flip of flips){
        let x=flip.x+swap.x
        let y=flip.y+swap.y
        let z=flip.z+swap.z
        ALL_ROTATIONS.push({x,y,z})
    }
}


const minMatchesThreshold:number=12
let printLogs=false;

class Beacon{
    location:Record<string,number>;
    constructor(location:string){
        let [x,y,z]=location.split(',').map((s:string)=>+s)
        this.location={x,y,z}
    }
    toString():string{
        return `x:${this.location.x},y:${this.location.y},z:${this.location.z}`;
    }
    manhatten_dist(ref:Beacon):number{
        return Math.abs(ref.location.x-this.location.x)+Math.abs(ref.location.y-this.location.y)+Math.abs(ref.location.z-this.location.z)
    }
    normalize(ref:Beacon):Record<string,number>{
        return {x:this.location.x-ref.location.x,y:this.location.y-ref.location.y,z:this.location.z-ref.location.z}
    }
    rotateBeacon(rotation:Record<string,string>){
        let x=this.location[rotation['x'].slice(-1)]*(rotation['x'][0]==="-"?-1:1)
        let y=this.location[rotation['y'].slice(-1)]*(rotation['y'][0]==="-"?-1:1)
        let z=this.location[rotation['z'].slice(-1)]*(rotation['z'][0]==="-"?-1:1)
        this.location={x,y,z}
        return this;
    }
    translateBeacon(translationV:Record<string,number>){
        let x=this.location.x+translationV.x
        let y=this.location.y+translationV.y
        let z=this.location.z+translationV.z
        this.location={x,y,z}
        return this;
    }
}
class Scanner{
    beacons:Beacon[]=[];
    location:Record<string,number>={x:0,y:0,z:0};
    name:string;
    constructor(name:string){
        this.name=name;
    }
    addBeacon(location:string){
        this.beacons.push(new Beacon(location));
        return this;
    }
    toString():string{
        return `${this.name}|Loc:${this.location.x},${this.location.y},${this.location.z}|Beacons:${this.beacons.reduce((a:string,x):string=>a+x.toString()+"|","|")}`
    }
    matchBeacons(sc:Scanner):boolean{
        for(let thisi=0;thisi<this.beacons.length;thisi++){
            for(let sci=0;sci<sc.beacons.length;sci++){
                for(let thisx=0;thisx<this.beacons.length;thisx++){
                    for(let scx=0;scx<sc.beacons.length;scx++){
                        if(thisi!=thisx||sci!=scx){
                            let manhattenthis=this.beacons[thisx].manhatten_dist(this.beacons[thisi])
                            let manhattensc=sc.beacons[scx].manhatten_dist(sc.beacons[sci])
                            if(manhattenthis===manhattensc){
                                let thisNormalized=this.beacons[thisx].normalize(this.beacons[thisi])
                                let scNormalized=sc.beacons[scx].normalize(sc.beacons[sci])
                                for(let testRotation=0;testRotation<ALL_ROTATIONS.length;testRotation++){
                                    let r=ALL_ROTATIONS[testRotation]
                                    let rotatedPt=rotate(scNormalized,r)
                                    if(thisNormalized.x===rotatedPt.x&&thisNormalized.y===rotatedPt.y&&thisNormalized.z===rotatedPt.z){
                                        let toTestSc=sc.beacons.filter((_,idx)=>!(idx===scx||idx===sci)).map(x=>rotate(x.normalize(sc.beacons[sci]),r))
                                        let toTestThis=this.beacons.filter((_,idx)=>!(idx===thisx||idx===thisi)).map(x=>x.normalize(this.beacons[thisi]))
                                        let matchCount=2;
                                        for(let ScPt of toTestSc){
                                            for(let ThPt of toTestThis){
                                                if(ThPt.x===ScPt.x&&ThPt.y===ScPt.y&&ThPt.z===ScPt.z)matchCount++;
                                            }
                                        }
                                        if(matchCount>=minMatchesThreshold){
                                            let refRotated=rotate(sc.beacons[sci].location,r)
                                            sc.location={
                                                x:this.beacons[thisi].location.x-refRotated.x,
                                                y:this.beacons[thisi].location.y-refRotated.y,
                                                z:this.beacons[thisi].location.z-refRotated.z
                                            }
                                            sc.beacons.map(x=>x.rotateBeacon(r).translateBeacon(sc.location))
                                            let setOfBeaconsInThis=new Set(this.beacons.map(x=>x.toString()))
                                            let newBeacons=sc.beacons.filter(x=>!setOfBeaconsInThis.has(x.toString()))
                                            this.beacons.push(...newBeacons)
                                            return true;
                                        }
                                    }
                                }
                                if(printLogs){
                                    console.log("Match failed")
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
    manhatten_dist(ref:Scanner):number{
        return Math.abs(ref.location.x-this.location.x)+Math.abs(ref.location.y-this.location.y)+Math.abs(ref.location.z-this.location.z)
    }
}
function rotate(pt:Record<string,number>,rotation:Record<string,string>):Record<string,number>{
    let x=pt[rotation['x'].slice(-1)]*(rotation['x'][0]==="-"?-1:1)
    let y=pt[rotation['y'].slice(-1)]*(rotation['y'][0]==="-"?-1:1)
    let z=pt[rotation['z'].slice(-1)]*(rotation['z'][0]==="-"?-1:1)
    return {x,y,z}
}

let resScanner=new Scanner(input[0][0])
for(let i=1;i<input[0].length;i++){
    resScanner.addBeacon(input[0][i])
}

let scanners:Scanner[]=[];
let unknown:Scanner[]=[];
for(let s of input){
    let scan=new Scanner(s[0])
    for(let i=1;i<s.length;i++){
        scan.addBeacon(s[i])
    }
    scanners.push(scan)
    unknown.push(scan)
}
unknown.shift();
let res:boolean=false;
while(unknown.length>0){
    let tryMatch:Scanner=unknown.shift()!;
    res=resScanner.matchBeacons(tryMatch)
    if(!res){
        unknown.push(tryMatch)
    }
}
console.log("P1:",resScanner.beacons.length)
let l:number=0;
for(let i=0;i<scanners.length;i++){
    for(let j=i+1;j<scanners.length;j++){
        let m=scanners[i].manhatten_dist(scanners[j])
        if(m>l)l=m
    }
}
console.log('P2:',l)
