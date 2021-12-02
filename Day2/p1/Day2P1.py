course=open("Day2Input.txt",'r')
position=[0,0]
def parse_command(c):
    x=c.split(" ")
    if x[0]=="forward":
        return [int(x[1]),0]
    elif x[0]=="up":
        return [0,-1*int(x[1])]
    return [0,int(x[1])]
def go(d):
    vector=parse_command(d)
    print(d+":",vector,position)
    position[0]+=vector[0]
    position[1]+=vector[1]
for command in course:
    # print(command.strip())
    go(command.strip())
print(position)
print(position[0]*position[1])

