var bot = require('./bot.js').Bot;
var CronJob = require('cron').CronJob;

var botInstance = new bot();

console.log('Setting up Clock');

function onTick() {
	console.log('Tick');
	botInstance.InitiateRetweet()
}

var job = new CronJob({
  cronTime: "* * * * *", // Every minute
  onTick: onTick,
  timeZone: "America/Los_Angeles",
  runOnInit: true
});

console.log('Starting Clock');

job.start();
