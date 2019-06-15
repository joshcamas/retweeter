var bot = require('./bot.js');

var CronJob = require('cron').CronJob;

new CronJob({
  cronTime: "* * * * * *", // Every minute
  onTick: bot.InitiateRetweet(),
  start: true,
  timeZone: "America/Los_Angeles"
});
