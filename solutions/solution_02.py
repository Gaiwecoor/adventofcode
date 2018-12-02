def getInput():
    return open("./input/input_02.txt")

# Part 1
def part1():
    input = getInput()

    double = 0
    triple = 0

    for line in input:
        values = {}
        for letter in line:
            if letter in values:
                values[letter] = values[letter] + 1
            else:
                values[letter] = 1
        if 2 in values.values():
            double = double + 1
        if 3 in values.values():
            triple = triple + 1

    return double * triple

# Part 2
def part2():
    input = getInput()
    codes = [x.strip() for x in input]

    i = 0
    while i < len(codes) - 1:
        j = i + 1
        while j < len(codes):
            a = codes[i]
            b = codes[j]
            diff = 0
            same = ""
            for k in range(len(a)):
                if a[k] == b[k]:
                    same = same + a[k]
                else:
                    diff = diff + 1
                if diff > 1:
                    break
            if diff == 1:
                return same
            j = j + 1
        i = i + 1
