import Foundation
let filename="Day5Input.txt"
let contents = try String(contentsOfFile: filename)
// print(contents)
let coords:[[[Int]]]=mkCoordinates(input: contents)
// print(coords)
let minMax=findMinMaxCoords(coords:coords)
// print(minMax)
var field=genField(corners:minMax)
for coord in coords{
    markVent(pos:coord)
}
// printField(field:field)
print(totalOverlap())

func totalOverlap()->Int{
    var count=0;
    for row in field{
        for pt in row{
            if pt>1{
                count+=1
            }
        }
    }
    return count
}

func markVent(pos:[[Int]]){
    if(pos[0][0]==pos[1][0]){
        let minY=min(pos[0][1], pos[1][1])
        let maxY=max(pos[0][1], pos[1][1])
        for y in minY...maxY{
            field[y][pos[0][0]]+=1
        }
    }
    else if(pos[0][1]==pos[1][1]){
        let minX=min(pos[0][0], pos[1][0])
        let maxX=max(pos[0][0], pos[1][0])
        for x in minX...maxX{
            field[pos[0][1]][x]+=1
        }
    }
    else{
        field[pos[1][1]][pos[1][0]]+=1
        var p=pos[0]
        while(!(p==pos[1])){
            field[p[1]][p[0]]+=1
            if(p[1]<pos[1][1]){
                p[1]+=1
            }
            else{
                p[1]-=1
            }
            if(p[0]<pos[1][0]){
                p[0]+=1
            }
            else{
                p[0]-=1
            }
        }
    }
}

func printField(field:[[Int]]){
    for r in field{
        print(r)
    }
}

func genField(corners:[[Int]])->[[Int]]{
    var field=[[Int]]()
    var xy=corners[1]
    xy[0]-=corners[0][0]
    xy[1]-=corners[0][1]
    // print(xy)
    for _ in 0..<xy[1]{
        field.append(Array(repeating:0, count:xy[0]))
    }
    return field;
}
func findMinMaxCoords(coords:[[[Int]]])->[[Int]]{
    var minMaxCoord:[[Int]]=[[0,0],[0,0]]
    for coord in coords{
        for pt in coord{
            if(minMaxCoord[0][0]>pt[0]){
            minMaxCoord[0][0]=coord[0][0]
            }
            if(minMaxCoord[0][1]>pt[1]){
                minMaxCoord[0][1]=coord[0][1]
            }
            if(minMaxCoord[1][0]<pt[0]){
            minMaxCoord[1][0]=coord[0][0]
            }
            if(minMaxCoord[1][1]<pt[1]){
                minMaxCoord[1][1]=coord[0][1]
            }
        }
    }
    minMaxCoord[1][0]+=1
    minMaxCoord[1][1]+=1
    return minMaxCoord
}
func mkCoordinates(input:String)->[[[Int]]]{
    return input.components(separatedBy: "\n").map{ (line) -> [[Int]] in
        line.components(separatedBy: " -> ").map{(point)-> [Int] in
            point.components(separatedBy: ",").map{(x)-> Int in
                Int(x) ?? -1
            }
        }
    }
}