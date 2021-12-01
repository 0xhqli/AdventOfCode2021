var fs = require('fs')
var input='./Day1/day1input'
// var input='./Day1/samplep2'


fs.readFile(input+".txt", 'utf8', function (err,data) {
    if (err) {
        fs.writeFile(input+".txt","",err=>console.log(err));
        return console.log(err);
    }
    let readings=data.trim().split('\n').map(x=>parseInt(x))
    let counter=depth_increases(readings,3)
    console.log(counter)
})

function depth_increases(data,scanning_window){
    let buffer=data.slice(0,scanning_window)
    // console.log(buffer)
    var prev=buffer.reduce((p,c)=>p+c);
    console.log(buffer ,prev)
    // console.log(prev)
    var counter=0;
    for(let i=scanning_window;i<data.length;i++){
        buffer[i%scanning_window]=data[i];
        let s=buffer.reduce((p,c)=>p+c);
        console.log(buffer ,s)
        if(prev<s){
            counter++;
        }
        prev=s;
    }
    return counter
}


