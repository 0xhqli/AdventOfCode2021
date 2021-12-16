var fs = require('fs')
let fileName="Day16I.txt"
let input:string=fs.readFileSync(fileName,"utf8").trim()
//lambda dictionary of what to do for each typeID
const typeDecoder:Record<number,Function>={
    0:(a:number,b:number)=>a+b,
    1:(a:number,b:number)=>a*b,
    2:(a:number,b:number)=>a<b?a:b,
    3:(a:number,b:number)=>a>b?a:b,
    5:(a:number,b:number)=>a>b?1:0,
    6:(a:number,b:number)=>a<b?1:0,
    7:(a:number,b:number)=>a===b?1:0,
}
//data class to hold packet data
class PacketReturns{
    data:number|null=null
    consumed:number=0
    version:number=0
    versionTotal:number=0
    typeID:number=0
}
//decode the input and see what comes out
console.log(decodePacket(toBinary(input)))

//Decode Packet recursively as each packet could have subpackets and only the subpackets know their length
//returns an object containing the data, bit length of the packet, version, total version of it and all subpackets, and typeID
function decodePacket(packet:string):PacketReturns{
    let res:PacketReturns=new PacketReturns()
    let [version,id]:number[]=[parseInt(packet.slice(0,3),2),parseInt(packet.slice(3,6),2)]
    res.version=version
    res.versionTotal=version
    res.typeID=id;
    res.consumed+=6
    let data:string=packet.slice(6)
    if(id===4){//if id is 4, data is literal.
        let d="",next="",n=0//each segment is 5 bits long. The last 4 bits represent data
        do{// First bit signifies if data continues in next segment(1) or if data ends with this segment(0)
            next=data.slice(5*n,5*(1+n++))
            res.consumed+=5;
            d+=next.slice(1)
        }
        while(next[0]==="1")
        res.data=parseInt(d,2)//parse data from binary to decimal after extraction
        return res;
    }
    else{//else it's a operation
        let I=data[0];//figure out how it's telling you how many/long the subpackets are
        data=data.slice(1)
        res.consumed++
        let totalSubpacket=Number.MAX_VALUE
        if(I==="1"){//if it's a 1, the next 11 bits tell you the total number of subpackets
            totalSubpacket=parseInt(data.slice(0,11),2)
            data=data.slice(11)
            res.consumed+=11
        }
        else{//otherwise it's telling you the total length of all the subpackets in bits
            let subpacketLength=parseInt(data.slice(0,15),2)
            data=data.slice(15)
            res.consumed+=15
            data=data.slice(0,subpacketLength)
            
        }
        for(let i=0;i<totalSubpacket&&data.length>0;i++){
            let subData:PacketReturns=decodePacket(data);//based on the results figure out the individual subpackets
            data=data.slice(subData.consumed)
            res.consumed+=subData.consumed
            res.versionTotal+=subData.versionTotal
            res.data=res.data===null?subData.data:typeDecoder[id](res.data,subData.data)//and perform the operation described by the packet typeID
        }
    }
    return res
}

//covert hex string to binary
function toBinary(hex:string):string{
    const binaryConversionDic:Record<string,string>={
        "0":"0000",
        "1":"0001",
        "2":"0010",
        "3":"0011",
        "4":"0100",
        "5":"0101",
        "6":"0110",
        "7":"0111",
        "8":"1000",
        "9":"1001",
        "A":"1010",
        "B":"1011",
        "C":"1100",
        "D":"1101",
        "E":"1110",
        "F":"1111",
    }
    let res=""
    for(let x of hex)
        res+=binaryConversionDic[x];
    return res
}
