var fs = require('fs')
let fileName="Day18I.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split('\n')

//sum up all the inputs from file for Part 1 solution
let total=input[0];
for(let i=1;i<input.length;i++){
    total=sum(total,input[i])
}
console.log("p1:",getMagnitude(parseSnailNumber(total)))

//test all permutations of the sum of two inputs for Part 2 solution
let l=0
for(let a=0;a<input.length;a++){
    for(let b=0;b<input.length;b++){
        if(a!==b){
            let n=getMagnitude(parseSnailNumber(sum(input[a],input[b])))
            if(n>l)l=n;
        }
    }
}
console.log("p2:",l)

//sum two snailfish numbers. Check for explosions. If no explosions left, check for splits.
//if a split happens, check for explosions again. Repeat till no more explosions or splits.
//then return the sum.
function sum(n1,n2){
    let newNumber="["+n1+","+n2+"]"
    let {spl,splIndex}=doesItSplit(newNumber)
    let explosionIndex=doesItExplode(newNumber)
    while(splIndex>-1||explosionIndex>-1){
        while(explosionIndex>-1){
            newNumber=explode(newNumber,explosionIndex)
            explosionIndex=doesItExplode(newNumber)
        }
        ({spl,splIndex}=doesItSplit(newNumber))
        if(splIndex>-1){
            newNumber=split(newNumber,splIndex,spl)
        }
        explosionIndex=doesItExplode(newNumber)
    }
    return newNumber
}
//Check if snail fish number splits. If a number is two digits or more, it splits
//leftmost goes first. Returns splitting number and it's index if it exist, else 
//-1 and a empty string
function doesItSplit(snailfishNumber){
    let t=snailfishNumber.match(/\d{2,}/),spl="",splIndex=-1;
    if(t){
        spl=t[0]
        splIndex=snailfishNumber.indexOf(spl)
    }
    return {spl,splIndex}
}
//taking in a snail fish number, the index of the spliting element, and the spliting index itself
//performs the split and returns the resulting snail fish number
function split(snailfishNumber,splIndex,spl){
    let s=+spl
    s=[Math.floor(s/2),Math.ceil(s/2)]
    let [strL,strR]=[snailfishNumber.slice(0,splIndex),snailfishNumber.slice(splIndex+spl.length)];
    return strL+'['+s+']'+strR
}
//Checks if snail fish number explodes from left to right.
//If it does, returns the left most index at which it explodes. Otherwise, -1
function doesItExplode(snailfishNumber){
    let n=0;
    for(let i=0;i<snailfishNumber.length;i++){
        if(snailfishNumber[i]==="[")n++;
        if(snailfishNumber[i]==="]")n--;
        if(n>4)return i;
    }
    return -1
}
//Performs the explosion operation based off a given index and returns the results
function explode(snailfishNumber, explosionIndex){
    let l=snailfishNumber.slice(explosionIndex),r;
    let pairEnd=explosionIndex+l.indexOf(']');
    [l,r]=snailfishNumber.slice(explosionIndex+1,pairEnd).split(",");
    let [strL,strR]=[snailfishNumber.slice(0,explosionIndex),snailfishNumber.slice(pairEnd+1)];
    //left start
    let t=[...strL.matchAll(/\d+/g)],digit="",idx=-1;
    if(t.length>0){
        digit=t[t.length-1][0]
        idx=strL.lastIndexOf(digit)
        strL=strL.slice(0,idx)+((+digit)+(+l))+strL.slice(idx+digit.length)
    }
    //left end
    //right start
    t=strR.match(/\d+/),digit="",idx=-1;
    if(t){
        digit=t[0]
        idx=strR.indexOf(digit)
        strR=strR.slice(0,idx)+((+digit)+(+r))+strR.slice(idx+digit.length)
    }
    //right end
    return strL+0+strR
}
//converts a snailfish number from string to array
function parseSnailNumber(snailfishNumber){
    return JSON.parse(snailfishNumber)
}
//gets the magnitude of the snail fish number
//recursively gets the magnitude of smaller elements in the snail fish number
// if it's another pair
function getMagnitude(snailfishNumber){
    let l=snailfishNumber[0]
    let r=snailfishNumber[1]
    if(Array.isArray(l)){
        l=getMagnitude(l)
    }
    if(Array.isArray(r)){
        r=getMagnitude(r)
    }
    return 3*l+2*r
}