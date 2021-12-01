var fs = require('fs')
var input='./Day1/day1input'

fs.readFile(input+".txt", 'utf8', function (err,data) {
    if (err) {
        fs.writeFile(input+".txt","",err=>console.log(err));
        return console.log(err);
    }
    let readings=data.trim().split('\n').map(x=>parseInt(x))
    var prev=readings[0];
    var counter=0;
    for(let i=1;i<readings.length;i++){
        if(prev<readings[i]){
            counter++;
        }
        prev=readings[i];
    }
    console.log(counter)
})

