var bot = require('./bot.js');

var CronJob = require('cron').CronJob;

console.log('Setting up Clock');

var job = new CronJob({
  cronTime: "* * * * * *", // Every minute
  onTick: bot.InitiateRetweet,
  timeZone: "America/Los_Angeles"
});

console.log('Starting Clock');

job.start();
