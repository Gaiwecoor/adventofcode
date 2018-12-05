import re

with open("./2018/input/input_05.txt") as f:
    input = f.read().strip()

alpha = "abcdefghijklmnopqrstuvwxyz"
pattern = []

for i in alpha:
    pattern.append(i + i.upper())
    pattern.append(i.upper() + i)

pattern = re.compile("|".join(pattern))

def react(poly):
    out = re.sub(pattern, "", poly)
    while out != poly:
        poly = out
        out = re.sub(pattern, "", poly)
    return out

# Part 1
def part1():
    return len(react(input))

# Part 2
def part2():
    reduced = []
    for i in alpha:
        letter = re.compile(f"{i}|{i.upper()}");
        reducePoly = re.sub(letter, "", input)
        reduced.append(len(react(reducePoly)))
    return min(reduced)
