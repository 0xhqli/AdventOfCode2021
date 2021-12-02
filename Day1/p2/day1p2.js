/*
Considering every single measurement isn't as useful as you expected: there's just too much noise in the data.

Instead, consider sums of a three-measurement sliding window. Again considering the above example:

199  A      
200  A B    
208  A B C  
210    B C D
200  E   C D
207  E F   D
240  E F G  
269    F G H
260      G H
263        H

Start by comparing the first and second three-measurement windows. The measurements in the first window are marked A (199, 200, 208); their sum is 199 + 200 + 208 = 607. The second window is marked B (200, 208, 210); its sum is 618. The sum of measurements in the second window is larger than the sum of the first, so this first comparison increased.

Your goal now is to count the number of times the sum of measurements in this sliding window increases from the previous sum. So, compare A with B, then compare B with C, then C with D, and so on. Stop when there aren't enough measurements left to create a new three-measurement sum.

In the above example, the sum of each three-measurement window is as follows:

A: 607 (N/A - no previous sum)
B: 618 (increased)
C: 618 (no change)
D: 617 (decreased)
E: 647 (increased)
F: 716 (increased)
G: 769 (increased)
H: 792 (increased)

In this example, there are 5 sums that are larger than the previous sum.

Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?
*/

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


