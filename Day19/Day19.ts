var fs = require('fs')
let fileName="Day19S0.txt"
let input:string[][]=fs.readFileSync(fileName,"utf8").trim().split("\n\n").map((x:string)=>x.split('\n'))

const ALL_ROTATIONS: Record<string,string>[] = [
    {x: "x", y: "y", z: "z"},
    {x: "x", y: "z", z: "-y"},
    {x: "x", y: "-y", z: "-z"},
    {x: "x", y: "-z", z: "y"},
    {x: "-x", y: "-y", z: "z"},
    {x: "-x", y: "z", z: "y"},
    {x: "-x", y: "y", z: "-z"},
    {x: "-x", y: "-z", z: "-y"},
    {x: "y", y: "z", z: "x"},
    {x: "y", y: "x", z: "-z"},
    {x: "y", y: "-z", z: "-x"},
    {x: "y", y: "-x", z: "z"},
    {x: "-y", y: "-z", z: "x"},
    {x: "-y", y: "x", z: "z"},
    {x: "-y", y: "z", z: "-x"},
    {x: "-y", y: "-x", z: "-z"},
    {x: "z", y: "x", z: "y"},
    {x: "z", y: "y", z: "-x"},
    {x: "z", y: "-x", z: "-y"},
    {x: "z", y: "-y", z: "x"},
    {x: "-z", y: "-x", z: "y"},
    {x: "-z", y: "y", z: "x"},
    {x: "-z", y: "x", z: "-y"},
    {x: "-z", y: "-x", z: "-y"},
]

const minMatchesThreshold:number=3

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
    }
    toString():string{
        return `${this.name}:${this.beacons.reduce((a:string,x):string=>a+x.toString()+"|","|")}`
    }
    matchBeacons(sc:Scanner){
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
                                let rotationSucesses:Record<string,string>|null=null
                                for(let testRotation=0;testRotation<ALL_ROTATIONS.length;testRotation++){
                                    let r=ALL_ROTATIONS[testRotation]
                                    let rotatedPt=rotate(scNormalized,r)
                                    if(thisNormalized.x===rotatedPt.x&&thisNormalized.y===rotatedPt.y&&thisNormalized.z===rotatedPt.z){
                                        let toTestSc=sc.beacons.filter((_,idx)=>!(idx===scx||idx===sci)).map(x=>rotate(x.normalize(sc.beacons[sci]),r))
                                        let toTestThis=this.beacons.filter((_,idx)=>!(idx===thisx||idx===thisi)).map(x=>x.normalize(this.beacons[thisi]))
                                        console.log("----------------------------------------------")
                                        console.log(this.beacons[thisi],sc.beacons[sci])
                                        console.log("ref",thisi,sci,"comp:",scx)
                                        console.log(toTestSc)
                                        console.log(toTestThis)
                                        console.log(r)
                                        console.log(this.beacons[thisx].toString(),sc.beacons[scx].toString())
                                        let matchCount=2;
                                        for(let ScPt of toTestSc){
                                            for(let ThPt of toTestThis){
                                                if(ThPt.x===ScPt.x&&ThPt.y===ScPt.y&&ThPt.z===ScPt.z)matchCount++;
                                            }
                                        }
                                        if(matchCount>=minMatchesThreshold){
                                            console.log("Match Found")
                                            rotationSucesses=r;
                                            return;
                                        }
                                    }
                                }
                                console.log("Match failed")
                            }
                        }
                    }
                }
            }
        }
    }
}
function rotate(pt:Record<string,number>,rotation:Record<string,string>):Record<string,number>{
    let x=pt[rotation['x'].slice(-1)]*(rotation['x'][0]==="-"?-1:1)
    let y=pt[rotation['y'].slice(-1)]*(rotation['y'][0]==="-"?-1:1)
    let z=pt[rotation['z'].slice(-1)]*(rotation['z'][0]==="-"?-1:1)
    return {x,y,z}
}

let scanners:Scanner[]=[]
for(let s of input){
    let scan=new Scanner(s[0])
    for(let i=1;i<s.length;i++){
        scan.addBeacon(s[i])
    }
    scanners.push(scan)
}
// for(let sc of scanners){
//     console.log(sc.toString())
// }
scanners[0].matchBeacons(scanners[1])