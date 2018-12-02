#! /usr/bin/python
import sys
from importlib import import_module
from time import time

if len(sys.argv) > 1:
    day = sys.argv[1]
    if len(day) == 1:
        day = "0" + day

    t = time()
    sol = import_module("solutions.solution_" + day)
    t1 = time()
    print("Part 1: " + str(sol.part1()))
    print("Part 1: %fms" % (1000 * (time() - t1)))
    t2 = time()
    print("Part 2: " + str(sol.part2()))
    print("Part 2: %fms" % (1000 * (time() - t2)))
    print("Complete: %fms" % (1000 * (time() - t)))

else:
    print("You need to tell me which day to solve (01, 02, ...)")
