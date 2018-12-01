var day = process.argv[2];

if (day) {
  try {

    if (day.length == 1) day = "0" + day;
    const solution = require(`./solutions/solution_${day}`);

    console.log("Part 1:", solution.part1());
    console.log("Part 2:", solution.part2());

  } catch(e) { console.error(e); }

} else console.log("You need to tell me which day to solve (01, 02, ...)");
