import * as fs from 'fs';
let filename:string='Day8Input.txt'
let input: string[][][]= fs.readFileSync(filename,'utf8').trim().split('\n').map(x=>x.split(' | ').map(e=>e.split(' ')));
console.log("p1: "+input.reduce((a,x)=>a+x[1].reduce((ac,el)=>ac+=Object.keys(isUnqNumSeg(el)).length!==0?1:0,0),0));
function isUnqNumSeg(input: string):Record<string, Set<string>>{
    switch (input.length) {
        case 2:
            return {"1" : new Set(input)};
        case 3:
            return {"7" : new Set(input)};
        case 4:
            return {"4" : new Set(input)};
        case 7:
            return {"8" : new Set(input)};
        default:
            return {};
    }
}
//p2
/**
 * found a solution that stated it was possible to determine the location of a segment
 * based on how many times it shows up and wanted to test it.
 * 
 *   aaaa 
 *  b    c
 *  b    c
 *   dddd 
 *  e    f
 *  e    f
 *   gggg 
 *
 */
// // // //          1  4    7    8      
// // let knowns="cf bcdf acf abcdefg"
// //          1  2     3     4    5     6      7   8       9      0
// let sample="cf acdeg acdfg bcdf abdfg abdefg acf abcdefg abcdfg abcefg"
// let segmentFrq:Record<string,number>={}
// for(let l of sample.replace(/\s+/g,'')){
//     if(!segmentFrq.hasOwnProperty(l)) segmentFrq[l]=0;
//     segmentFrq[l]++;
// }
// // a couple segments overlap in count, but it seems like it's possible to subtract
// // segments of obvious numbers to make the all unique
// //          4    4    4    4    1  1  1  1
// let knowns="bcdf bcdf bcdf bcdf cf cf cf cf"
// for(let l of knowns.replace(/\s+/g,'')){
//     segmentFrq[l]--;
// }
// console.log(segmentFrq)
// let segInv:Record<number,string>={}
// for(let k in segmentFrq){
//     segInv[segmentFrq[k]]=k
// }
// console.log(segInv)
// // it appears subtracting 4's segments four times and 1's four times give each segment a unique number
// // that looks like this:
// // { c: 0, f: 1, a: 8, d: 3, e: 4, g: 7, b: 2 }
// // should be usable to build a translator


console.log("p2: " +input.reduce((a,[d,c])=>a+solve(d)(c),0))

function solve(a:String[]):Function{
    //set up the known dictonary as a constant
    const segInv:Record<string,number>={ c: 0, f: 1, a: 8, d: 3, e: 4, g: 7, b: 2 }
    //generate the scrambled dictonary from data given
    let segData:Record<string,number>={}
    for(let e of a.join('')){
        if(!segData.hasOwnProperty(e))segData[e]=0
        segData[e]++
    }
    //get the 4's and 1's patterns from scrambled data and subtract them four times to make each segment
    //of the scrambled data's occurence equal to it's counterpart in the known data.
    let oneFour=a.filter(x=>x.length===4||x.length===2).join('')
    for(let e of oneFour.repeat(4)){
        segData[e]--
    }
    // invert the dictionary made from the scrambled data to make for easy translating
    let invData:Record<number,string>={}
    for(let k in segData){
        invData[segData[k]]=k
    }
    // build the string to digit translator
    let babel:Record<string,string>={}
    buildBabel();
    // return the function to use the string to number translator
    return (s:string[]):number=>+s.reduce((a,i)=>a+babel[sortChars(i)],"");
    function sortChars(s:string):string {
        return [...s].sort().join("");
    }
    function buildBabel(){
        let i:number=0;
        for(let x of "abcefg cf acdeg acdfg bcdf abdfg abdefg acf abcdefg abcdfg".split(" ")){
            let s:string=""
            for(let ch of x){
                s+=invData[segInv[ch]]
            }
            babel[sortChars(s)]=i.toString()
            i++;
        }
    }
}