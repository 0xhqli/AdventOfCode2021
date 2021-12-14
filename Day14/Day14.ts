var fs = require('fs')
let fileName="Day14I.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split("\n\n").map((x:string)=>x.split("\n").map(n=>n.split(' -> ')))

// get the starting polymer out of the input
let start:string=input[0][0][0]
// split the rules in a dictionary of the current pair and an array of what it splits into on the next step
let rules:Record<string,string[]>=input[1].reduce((ax:Record<string,string[]>,el:string[])=>{let x=el[0].split('');ax[el[0]]=[x[0]+el[1],el[1]+x[1]];return ax},{})
//create a map of each possible pair and leave there current count as zero, then iterate through the starting
//polymer to get an inital count of pairs
let curPairs:Record<string,number>={}
for(let k in rules){
    curPairs[k]=0;
}
for(let i=1;i<start.length;i++){
    curPairs[start[i-1]+start[i]]++
}
//take ten steps, and get a count of each letter.
//then get counts for the letters with the least occurences and most occurences
//and subtract for the answer to part 1
let steps=10
for(let i=0;i<steps;i++)curPairs=step(curPairs,rules)
let countL=countLetters(curPairs,start)
let minMax=Object.values(countL).reduce((ax:number[],el:number)=>{if(el<ax[0])ax[0]=el;if(el>ax[1])ax[1]=el;return ax},[Infinity,0])
console.log("P1:", minMax[1]-minMax[0])
//take 30 more steps,
//and repeat the previous instructions to get the answer to part 2
steps=30
for(let i=0;i<steps;i++)curPairs=step(curPairs,rules)
countL=countLetters(curPairs,start)
minMax=Object.values(countL).reduce((ax:number[],el:number)=>{if(el<ax[0])ax[0]=el;if(el>ax[1])ax[1]=el;return ax},[Infinity,0])
console.log("P2:", minMax[1]-minMax[0])

//functions

//generate a count of the pairs in the next step
//each pair in the current step splits into two new pairs based on the rules
//Figure out what it splits to, add them*number of occurences into a new pair count to find the
//amount of occurences in the next step.
function step(currentPairCounts:Record<string,number>, rule:Record<string,string[]>):Record<string,number>{
    let res:Record<string,number>={};
    for(let key in rules){
        res[key]=0;
    }
    for(let key in currentPairCounts){
        let spawn=rule[key]
        res[spawn[0]]+=currentPairCounts[key]
        res[spawn[1]]+=currentPairCounts[key]
    }
    return res
}
//get a count of all the letters in the chain. 
//if we could store the chain as a string, that be nice, but we run out of memory really quick
//so we only store it as a count of the relevent pairs
//Using the fact that the first letter in the polymer is always the same,
//the second letter of a pair is always the one that needs to be counted.
//so the number of times a letter occurs in the polymer is the total of the times it appears as
//the second letter of a pair, except for the first letter of the polymer, which is 1 plus the total
//of the times it appears as the second letter of a pair
function countLetters(currentPairCounts:Record<string,number>,startString:string):Record<string,number>{
    let res:Record<string,number>={}
    res[startString[0]]=1;
    for(let l in currentPairCounts){
        if(currentPairCounts[l]>0){
            let letter=l[1];
            if(!res.hasOwnProperty(letter))res[letter]=0;
            res[letter]+=currentPairCounts[l];
        }
    }
    return res
}