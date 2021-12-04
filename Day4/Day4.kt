import java.io.File
import java.util.Arrays

class Board(val bingoBoard:Array<Array<Int>>){
    var last=-1;
    override fun toString(): String = Arrays.deepToString(bingoBoard).replace("], ","]\n ")+"\n";
    fun checkNumber(n: Int){
        chk@for ((x,ar) in bingoBoard.withIndex()){
            for ((y,num) in ar.withIndex()){
                if(num==n){
                    last=num;
                    bingoBoard[x][y]=-1;
                    break@chk;
                }
            }
        }
    }
    fun bingoCheck(): Boolean {
        // val rows=bingoBoard.fold(false, { acc,ar -> acc || ar.reduce{ ac,b -> ac+b }==-5})
        var rows=false
        var d1=true
        var d2=true
        var cols=IntArray(bingoBoard[0].size)
        for ((idx,ar) in bingoBoard.withIndex()){
            var rchk=true;
            for ((i,n) in ar.withIndex()){
                rchk=rchk&&n==-1;
                cols[i]+=n;
            }
            rows=rows||rchk
            d1=d1&&ar[idx]==-1
            d2=d2&&ar[ar.size-idx-1]==-1
        }
        return rows||cols.contains(-5)//||d1||d2 Why do diagonals not count?
    }
    fun getEndSum():Int{
        return bingoBoard.fold(0,{acc,ar -> acc+ar.fold(0, {ac,b -> ac+( if (b==-1) 0 else b )})})
    }
}

var numbers: Array<Int> =arrayOf();
val boards: MutableList<Board> =mutableListOf();

fun main() {
    generateGame("Day4Input.txt")
    var w:Int;
    for(number in numbers){
        chkBoards(number)
        w=chkWin()
        while(w>-1){
            println(w)
            println(boards.get(w))
            var resp1=boards.get(w).getEndSum()
            println(resp1)
            println(number)
            println(resp1*number)
            boards.removeAt(w)
            println("\n********************\n\n")
            w=chkWin()
        }
    }
}

fun printBoards(){
    boards.forEach{println(it)}
}
fun chkBoards(n:Int){
    boards.forEach{it.checkNumber(n)}
}
fun chkWin():Int{
    for((i,bboard) in boards.withIndex()){
        if(bboard.bingoCheck()) return i;
    }
    return -1;
}

fun generateGame(fileName:String){
    fun List<String>.toIntArray() = this.map { it.toInt() }.toTypedArray()
    var file=File(fileName).bufferedReader()
    numbers=file.readLine().split(",").toIntArray()
    var next:String?=""
    var b: MutableList<Array<Int>> =mutableListOf();
    while(next!=null){
        next=file.readLine()
        if(next==""||next==null){
            if(b.size>0){
                boards.add(Board(b.toTypedArray()))
                b=mutableListOf()
            }
        }
        else{
            b.add(next.trim().split("\\s+".toRegex()).toIntArray())
        }
    }
}

