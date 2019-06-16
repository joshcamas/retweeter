exports.Bot = function() 
{
	var self = this;
	
	self.BOT_SEARCH_PHRASE = process.env.BOT_SEARCH_PHRASE;
	self.BOT_CONSUMER_KEY = process.env.BOT_CONSUMER_KEY;
	self.BOT_CONSUMER_SECRET = process.env.BOT_CONSUMER_SECRET;
	self.BOT_ACCESS_TOKEN = process.env.BOT_ACCESS_TOKEN;
	self.BOT_ACCESS_TOKEN_SECRET = process.env.BOT_ACCESS_TOKEN_SECRET;


	self.Twit = require("twit");
	self.TwitterBot = require("node-twitterbot").TwitterBot;

	self.lastscan = -1;

	self.Bot = new self.Twit({
	 consumer_key: self.BOT_CONSUMER_KEY,
	 consumer_secret: self.BOT_CONSUMER_SECRET,
	 access_token: self.BOT_ACCESS_TOKEN,
	 access_token_secret: self.BOT_ACCESS_TOKEN_SECRET
	});

	console.log('Setting up Bot');

	self.RetweetStatus = function(status,onComplete) 
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
		
		self.Bot.post('favorites/create', id, BotFavorited);
		
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

	self.InitiateRetweet = function() {

		console.log('Starting Retweet')

		var query = {
			q: self.BOT_SEARCH_PHRASE,
			result_type: "recent"
		}

		self.Bot.get('search/tweets', query, BotGotLatestTweet);

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
					
					self.RetweetStatus(status,OnTweetComplete);
				}
				
				ScanTweet(0);
			}
		}
	}
		
	
}
