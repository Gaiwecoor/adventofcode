import sys
from importlib import import_module

if len(sys.argv) > 1:
    day = sys.argv[1]
    if len(day) == 1:
        day = "0" + day

    sol = import_module("solutions.solution_" + day)
    print("Part 1: " + str(sol.part1()))
    print("Part 2: " + str(sol.part2()))

else:
    print("You need to tell me which day to solve (01, 02, ...)")
