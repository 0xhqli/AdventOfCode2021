var fs = require('fs')
let fileName="Day20I.txt"
let input:string[]=fs.readFileSync(fileName,"utf8").trim().split("\n\n")
let enhanceKey:string=input[0]
let inputImage:string[][]=input[1].split('\n').map((x:string)=>x.split(""))

let {getOutOfBoundsPx,flip}=(()=>{
    let x="."
    return {getOutOfBoundsPx:()=>x,flip:()=>x=x==="."?"#":"."}
})()
let r=inputImage;
const iterations=50
for(let c=0;c<iterations;c++){
    r=enhance(r,enhanceKey,getOutOfBoundsPx())
    if(enhanceKey[0]==="#"&&getOutOfBoundsPx()!=="#"){
        flip()
    }
    else if(enhanceKey[enhanceKey.length-1]==="."&&getOutOfBoundsPx()!=="."){
        flip()
    }
}
// printImg(r)
console.log(countLit(r))

function enhance(image:string[][],key:string,getOutOfBoundsPx:string):string[][]{
    let res:string[][]=[]
    let originaly=image.length
    let originalx=originaly===0?0:image[0].length
    for(let y=-1; y<=image.length; y++){
        let row:string[]=[]
        for(let x=-1; x<=originalx; x++){
            row.push(getEnhancedPixel({x,y},image,getOutOfBoundsPx,key))
        }
        res.push(row)
    }
    return res
}
function getEnhancedPixel(pt:Record<string,number>,image:string[][],outofBoundsPx:string,key:string):string{
    return key[parseInt(pixelsToBinary(ptToPixelArray(pt,image,outofBoundsPx)),2)]
}
function ptToPixelArray({x,y}:Record<string,number>,image:string[][],outofBoundsPx:string):string[]{
    let res=[]
    for(let dy=y-1; dy<=y+1; dy++){
        for(let dx=x-1; dx<=x+1; dx++){
            let pt={x:dx,y:dy}
            if(isInBounds(pt,image)){
                res.push(image[pt.y][pt.x])
            }
            else{
                res.push(outofBoundsPx)
            }
        }
    }
    return res
}
function isInBounds({x,y}:Record<string,number>,image:string[][]):boolean{
    return y>=0&&y<image.length&&x>=0&&x<image[y].length
}
function pixelsToBinary(data:string[]):string{
    return data.map((x:string)=>x==="#"?1:0).join('')
}
function countLit(img:string[][]):number{
    let c=0;
    for(let r of img){
        for(let x of r){
            if(x==='#')c++
        }
    }
    return c
}
function printImg(img:string[][]){
    for(let r of img){
        console.log(r.join(''));
    }
}