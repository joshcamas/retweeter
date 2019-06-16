exports.Bot = function() 
{
	this.BOT_SEARCH_PHRASE = process.env.BOT_SEARCH_PHRASE;
	this.BOT_CONSUMER_KEY = process.env.BOT_CONSUMER_KEY;
	this.BOT_CONSUMER_SECRET = process.env.BOT_CONSUMER_SECRET;
	this.BOT_ACCESS_TOKEN = process.env.BOT_ACCESS_TOKEN;
	this.BOT_ACCESS_TOKEN_SECRET = process.env.BOT_ACCESS_TOKEN_SECRET;


	this.Twit = require("twit");
	this.TwitterBot = require("node-twitterbot").TwitterBot;

	this.lastscan = -1;

	this.Bot = new this.Twit({
	 consumer_key: this.BOT_CONSUMER_KEY,
	 consumer_secret: this.BOT_CONSUMER_SECRET,
	 access_token: this.BOT_ACCESS_TOKEN,
	 access_token_secret: this.BOT_ACCESS_TOKEN_SECRET
	});

	console.log('Setting up Bot');

	this.RetweetStatus = function(status,onComplete) 
	{
		var id = {
			id : status.id_str
		}
		
		//Check if status has already been favorited or retweeted
		if(status.favorited || status.retweeted) {
			onComplete(false);
			return;
		}
			
		console.log(status.text)
		
		this.Bot.post('favorites/create', id, BotFavorited);
		
		function BotFavorited(error,response) 
		{
			if (error) {
				console.log('Bot could not favorite, : ' + error);
				onComplete(false);
				return
			}
			else {
				console.log('Bot favorited : ' + id.id);
			}
				
			Bot.post('statuses/retweet/:id', id, BotRetweeted);
			
			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet, : ' + error);
					onComplete(false);
					return
				}
				else {
					console.log('Bot retweeted : ' + id.id);
					onComplete(true);
					return	
				}
			}	
		}
	}

	this.InitiateRetweet = function() {

		console.log('Starting Retweet')

		var query = {
			q: this.BOT_SEARCH_PHRASE,
			result_type: "recent"
		}

		this.Bot.get('search/tweets', query, BotGotLatestTweet);

		function BotGotLatestTweet (error, data, response) {
			if (error) {
				console.log('Bot could not find latest tweet, : ' + error);
			}
			else {

				function ScanTweet(index) {
					
					if(index >= data.statuses.length)
						return;
						
					var status = data.statuses[index];
					
					function OnTweetComplete(success) {
						if(success) 
							ScanTweet(index+1);
						else
							return;
					}
					
					this.RetweetStatus(status,OnTweetComplete);
				}
				
				ScanTweet(0);
			}
		}
	}
		
	
}
