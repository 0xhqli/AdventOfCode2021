var fs = require('fs')
let fileName="Day13I.txt"
let input=fs.readFileSync(fileName,"utf8").trim().split("\n\n").map((x:string)=>x.split("\n"))
let points:number[][]=input[0].map((x:string)=>x.split(',').map((x:string)=>+x))
let instruct:string[]=input[1].map((x:string)=>x.substring(11))

//get max x and max y of the points given and generate paper
let dotMap:string[][]=[];
let paperSize:number[]=getLargestCoords(points)
for(let i=0; i<paperSize[1];i++){
    dotMap.push(Array(paperSize[0]).fill('.'))
}
//plot the dots as described by the input
for(let p of points){
    dotMap[p[1]][p[0]]="#"
}
// fold x or y as instructed. 
for(let x of instruct){
    dotMap=x[0]==="y"?foldY(dotMap):dotMap=foldX(dotMap)
    countDot(dotMap);//print visible dots after each fold. first one is p1 solution
}
//print final result for code in p2 solution
printMap(dotMap)

//functions

//fold along y. found that fold line is always perfectly centered, so following the KISS principle, 
//implemented foldX so it folds along the center as a default. 
function foldY(paper:string[][],line:number=Math.floor(paper.length/2)):string[][]{
    let res:string[][]=[]
    for(let i=0;i<line;i++){
        let l1=paper[i];
        let l2=paper[paper.length-i-1]
        for(let x=0; x<l1.length;x++){
            if(l2[x]==="#"){
                l1[x]="#"
            }
        }
        res.push(l1)
    }
    return res
}
//fold along x. found that fold line is always perfectly centered, so following the KISS principle, 
//implemented foldX so it folds along the center as a default. 
function foldX(paper:string[][],line:number=Math.floor(paper[0].length/2)):string[][]{
    let res:string[][]=[]
    for(let x of paper){
        let r=[]
        for(let i=0;i<line;i++){
            r.push((x[i]==="#"||x[x.length-i-1]==="#")?"#":".")
        }
        res.push(r)
    }
    return res
}
//find largest coords to generate paper size
function getLargestCoords(input:number[][]):number[]{
    let res=input.reduce((ax:number[],x:number[])=>[ax[0]>x[0]?ax[0]:x[0],ax[1]>x[1]?ax[1]:x[1]],[0,0])
    res[0]++;
    res[1]++;
    return res
}
//print 2D array
function printMap(map:string[][]){
    for(let x of map)console.log(x.join('').replace(/\./g,' ').replace(/#/g,'█'))
}
//print number of visible #
function countDot(map:string[][]){
    console.log("Visible dots: ",map.reduce((a:number,e:string[])=>a+e.reduce((ax:number,el:string)=>ax+(el==="#"?1:0),0),0))
}