=begin
    
rescue => exception
    
end
class LanternFish
    @@school = Array.new
    def self.school
        @@school
    end
    attr_accessor :days_till_spawn
    def initialize(days=9)
        @days_till_spawn = days
        @@school << self
    end
    def next_day()
        if @days_till_spawn>0
            @days_till_spawn-=1
        else
            LanternFish.new
            @days_till_spawn=6
        end
    end
end

def next_day()
    for fish in LanternFish.school
        fish.next_day
    end
end


input= File.read("Day6Input.txt").split(",")
for x in input
    LanternFish.new Integer(x)
end
days_to_sim=256
for _ in 1..days_to_sim
    next_day
end
p LanternFish.school.length

# brute force/modeling the thing works great in part 1. murders memory in part 2... they got me on this one, lol.
=end


def total(arr)
    arr.reduce(0){|sum,num| sum+num}
end
def age(arr)
    to_spawn=arr[0]
    for x in 1..arr.length-1
        arr[x-1]=arr[x]
    end
    arr[arr.length-1]=to_spawn
    arr[6]+=to_spawn
    return arr
end
spawn_counters=Array.new(9,0)
input= File.read("Day6Input.txt").split(",")
for x in input
    spawn_counters[Integer(x)]+=1
end
p spawn_counters
p total(spawn_counters)
days_to_sim=256
for _ in 1..days_to_sim
    spawn_counters=age(spawn_counters)
end
p spawn_counters
p total(spawn_counters)