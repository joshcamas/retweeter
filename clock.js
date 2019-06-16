var bot = require('./bot.js');

var CronJob = require('cron').CronJob;

console.log('Setting up Clock');

function onTick() {
	console.log('Tick');
	bot.InitiateRetweet()
}

var job = new CronJob({
  cronTime: "* * * * *", // Every minute
  onTick: onTick,
  timeZone: "America/Los_Angeles"
});

console.log('Starting Clock');

job.start();
