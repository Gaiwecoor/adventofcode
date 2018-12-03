import re

ID = 0
X = 1
Y = 2
W = 3
H = 4

with open("./input/input_03.txt") as f:
    lines = f.read().splitlines()

#pattern = re.compile("#(\d+) @ (\d+),(\d+): (\d+)x(\d+)")

def parse(claim):
    match = re.match(r"#(\d+) @ (\d+),(\d+): (\d+)x(\d+)", claim)
    return (
        match[1],
        int(match[2]),
        int(match[3]),
        int(match[4]),
        int(match[5])
    )

def parseRyn(claim):
    s1, remaining = claim.split(' @ ')
    s2, s3 = remaining.split(': ')
    id = int(s1[1:])
    x, y = list(map(int, s2.split(',')))
    w, h = list(map(int, s3.split('x')))
    return (id, x, y, w, h)

claims = list(map(parse, lines))

sheet = {}

# Part 1
def part1():
    for claim in claims:
        for x in range(claim[X], claim[X] + claim[W]):
            for y in range(claim[Y], claim[Y] + claim[H]):
                if (x, y) in sheet:
                    sheet[(x, y)] = sheet[(x, y)] + 1
                else:
                    sheet[(x, y)] = 1

    multi = len(list(filter((lambda i: i > 1), sheet.values())))
    return multi

# Part 2
def part2():
    for claim in claims:
        soleClaim = True
        for x in range(claim[X], claim[X] + claim[W]):
            for y in range(claim[Y], claim[Y] + claim[H]):
                if sheet[(x, y)] > 1:
                    soleClaim = False
                    break
            if not soleClaim:
                break
        if soleClaim:
            return claim[ID]
