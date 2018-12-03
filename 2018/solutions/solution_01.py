with open("./2018/input/input_01.txt") as f:
    lines = f.read().splitlines()

# Part 1
def part1():
    return sum(list(map(int, lines)))

# Part 2
log = set([0])
def part2(sum = 0):
    for shift in lines:
        sum = sum + int(shift)
        if sum in log:
            return sum
        else:
            log.add(sum)
    return part2(sum)
