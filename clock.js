var bot = require('./bot.js');

var CronJob = require('cron').CronJob;

console.log('Setting up Clock');

var job = new CronJob({
  cronTime: "* * * * * *", // Every minute
  onTick: bot.InitiateRetweet,
  start: true,
  timeZone: "America/Los_Angeles"
});

job.start();
