var day = process.argv[2];

if (day) {
  try {

    if (day.length == 1) day = "0" + day;
    console.time("Complete");
    const solution = require(`./solutions/solution_${day}`);
    console.log(`Advent of Code - Day ${day} (Node)`);
    console.time("Part 1");
    console.log("Part 1:", solution.part1());
    console.timeEnd("Part 1");

    console.time("Part 2");
    console.log("Part 2:", solution.part2());
    console.timeEnd("Part 2");
    console.timeEnd("Complete");
  } catch(e) { console.error(e); }

} else console.log("You need to tell me which day to solve (01, 02, ...)");
