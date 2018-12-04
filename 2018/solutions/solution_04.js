const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_04.txt", "utf8")
  .trim().split("\n");

const pattern = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\] (Guard #(\d+) begins shift|falls asleep|wakes up)/

const duty = new Map();
const guardSchedule = new Map();
const events = [];

for (let i = 0; i < input.length; i++) {
  let match = pattern.exec(input[i]);
  let date = new Date(match[1]);
  if (date.getHours() == 23) date.setHours(24);

  if (match[3]) {
    let guard = parseInt(match[3], 10);
    duty.set(date.toDateString(), guard);
    if (!guardSchedule.has(guard)) guardSchedule.set(guard, [date.toDateString()]);
    else guardSchedule.get(guard).push(date.toDateString());
  } else {
    events.push({
      date: date,
      asleep: match[2].endsWith("asleep")
    });
  }
}

events
.sort((a, b) => a.date - b.date)
.forEach(event => event.guard = duty.get(event.date.toDateString()));

function isSleeping(guard, time) {
  let nextEvent = events.find(e => e.guard == guard && e.date > time);

  if (nextEvent && !nextEvent.asleep) return true;
  else return false;
}

// Part 1
function part1() {
  let sleepPattern = [];
  events.forEach(event => {
    let record = sleepPattern.find(r => r.guard == event.guard);
    if (record) {
      record.timeSlept += event.date.getMinutes() * (event.asleep ? -1: 1);
    } else {
      sleepPattern.push({
        guard: event.guard,
        timeSlept: event.date.getMinutes() * (event.asleep ? -1: 1)
      });
    }
  });

  sleepPattern.sort((a, b) => b.timeSlept - a.timeSlept);

  let sleepiest = sleepPattern[0].guard;
  let record = [];

  for (let i = 0; i < 60; i++) {
    let minute = i.toString();
    if (minute.length == 1) minute = "0" + minute;

    record[i] = guardSchedule.get(sleepiest)
      .reduce((asleep, d) => asleep + (isSleeping(sleepiest, new Date(d + " 00:" + minute)) ? 1 : 0), 0);
  }

  let quiet = record.indexOf(Math.max(...record));

  return quiet * sleepiest;
}

// Part 2
function part2() {

  let guardRecord = new Map();

  guardSchedule.forEach((schedule, guard) => {
    guardRecord.set(guard, {});
    let record = [];
    for (let i = 0; i < 60; i++) {
      let minute = i.toString();
      if (minute.length == 1) minute = "0" + minute;

      record[i] = schedule
        .reduce((asleep, d) => asleep + (isSleeping(guard, new Date(d + " 00:" + minute)) ? 1 : 0), 0);
    }
    let sleeping = record.indexOf(Math.max(...record));
    let times = record[sleeping];
    guardRecord.set(guard, {guard, record, sleeping, times});
  });

  let sleepiest = Array.from(guardRecord.values()).sort((a, b) => b.times - a.times);

  return sleepiest[0].guard * sleepiest[0].sleeping;
}

module.exports = { part1, part2 }
