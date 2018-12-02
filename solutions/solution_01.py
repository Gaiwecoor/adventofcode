def getInput():
    return open("./input/input_01.txt")

# Part 1
def part1():
    input = getInput()
    shifts = 0
    for shift in input:
        shifts = shifts + int(shift)
    return shifts

# Part 2
log = {"0" : True}
def part2(sum = 0):
    input = getInput()
    for shift in input:
        sum = sum + int(shift)
        if str(sum) in log:
            return sum
        else:
            log[str(sum)] = True
    return part2(sum)
