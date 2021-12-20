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

const minMatches:number=3

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
    location:number[]=[0,0];
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
                                console.log(this.beacons[thisi],sc.beacons[sci])
                                console.log("yes",thisNormalized,scNormalized)
                                console.log(this.beacons[thisx].toString(),sc.beacons[scx].toString())
                            }
                        }
                    }
                }
            }
        }
    }
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
scanners[0].matchBeacons(scanners[0])
console.log(ALL_ROTATIONS.length)