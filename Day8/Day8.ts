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
console.log("p2: " +input.reduce((a,[d,c])=>a+solve(new Set(d))(c),0))

function solve(a:Set<string>|null):Function{
    //Making 2 dictionaries 
    //1)Num->Set
    //Figuring out which set of letters goes to a digit feels easier to handle using sets,
    //but it's more costly to decode with, so its only useful for mapping out the values
    //2)SortedString->num
    //This one will be used to decode after everything is mapped out. Just sort the input string
    //and it'll map it to a digit.
    let rosettaStone:Record<string, Set<string>>|null={}
    let babel:Record<string,string>={}
    //solve and remove all the easy digits(1,7,4,8) first, so we can use them to figure out the rest
    for(let el of a!){
        let res=isUnqNumSeg(el)
        let resKeys=Object.keys(res)
        if(resKeys.length) newDecoded(resKeys[0],el,res[resKeys[0]]);
    }
    //of the ones remaining, in the 5 chars numbers, 1 diff 3 will leave nothing
    //and in the 6 char nums, only 1 diff 6 has anything remaining
    //can also capture top right char to decode 2 at a later stage
    let topRight:Set<string>|null;
    for(let el of a!){
        let sEl=new Set(el);
        let res=difference(rosettaStone["1"],sEl)
        if(sEl.size===6){
            if(res.size===1){
                newDecoded("6",el,sEl);
                topRight=res
            }
        }
        else{
            if(res.size===0) newDecoded("3",el,sEl)
        }
    }
    // for the remaining 6 chars, 3 diff 0 has 1 remaining while 9 has 0
    // for the remaining 5 chars, 2 has something on the top right, while 5 has nothing
    for(let el of a!){
        let sEl=new Set(el);
        if(sEl.size===6){
            let res=difference(rosettaStone["3"],sEl)
            if(res.size===1)newDecoded("0",el,sEl);
            else newDecoded("9",el,sEl);
        }
        else{
            let res=difference(topRight!,sEl)
            if(res.size===0) newDecoded("2",el,sEl)
            else newDecoded("5",el,sEl)
        }
    }
    //free up unneed variables
    rosettaStone=null;
    a=null;
    topRight=null;
    return (s:string[]):number=>+s.reduce((a,i)=>a+babel[sortChars(i)],"");
    function newDecoded(num:string,alp:string,s:Set<string>){
        rosettaStone![num]=s
        babel[sortChars(alp)]=num
        a!.delete(alp)
    }
    function sortChars(s:string):string {
        return [...s].sort().join("");
    }
}


//set functions borrowed from Mozilla at:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// thought I would need more of them, but...
function difference<Type>(setA:Set<Type>, setB:Set<Type>):Set<Type> {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function setEqual<Type>(setA:Set<Type>, setB:Set<Type>):boolean{
    if(setA.size!=setB.size) return false;
    for(let el of setA) if(!setB.has(el))return false; 
    return true
}

function union<Type>(setA:Set<Type>, setB:Set<Type>):Set<Type> {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function intersection<Type>(setA:Set<Type>, setB:Set<Type>):Set<Type> {
    let _intersection = new Set<Type>()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function symmetricDifference<Type>(setA:Set<Type>, setB:Set<Type>):Set<Type> {
    let _difference = new Set(setA)
    for (let elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem)
        } else {
            _difference.add(elem)
        }
    }
    return _difference
}