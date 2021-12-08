use std::fs;
use std::collections::HashMap;
fn main() {
    let data = fs::read_to_string("Day7Input.txt")
        .expect("No File Found");
    let mut input:Vec<i32>=data.split(",")
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .map(|s| s.parse().unwrap())
        .collect();
    println!("input: {:?}",input);
    input.sort();
    let mid = input.len() / 2;
    let median:i32=input[mid];
    println!("median: {}",median);
    let fuelp1: i32=input.iter().fold(0, |total,x| total+i32::abs(median-x));
    println!("p1: {}",fuelp1);
    println!("p2: {}",p2(&mut input));
}
fn p2(crabs: &mut Vec<i32>)-> i32{
    let mut min_fuel=i32::MAX;
    let min:i32=i32::from(*crabs.iter().min().unwrap());
    let max:i32=i32::from(*crabs.iter().max().unwrap());
    println!("crabs: {:?}",crabs);
    println!("min: {}",min);
    println!("max: {}",max);
    let mut crab_locations= HashMap::new();
    for crab in crabs {
        let count = crab_locations.entry(crab).or_insert(0);
        *count += 1;
    }
    println!("crabs locations: {:?}",crab_locations);
    for final_location in min..=max {
        let mut fuel:i32=0;
        for (start, num_crabs)in &crab_locations{
            let dif=(final_location-i32::from(**start)).abs();
            fuel+=((dif*(dif+1))/2)*num_crabs
        }
        // println!("{}",fuel);
        min_fuel=min_fuel.min(fuel);
    }
    return min_fuel;
}