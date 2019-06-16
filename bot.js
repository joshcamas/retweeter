
Twit = require("twit");

BOT_SEARCH_PHRASE = process.env.BOT_SEARCH_PHRASE;
BOT_CONSUMER_KEY = process.env.BOT_CONSUMER_KEY;
BOT_CONSUMER_SECRET = process.env.BOT_CONSUMER_SECRET;
BOT_ACCESS_TOKEN = process.env.BOT_ACCESS_TOKEN;
BOT_ACCESS_TOKEN_SECRET = process.env.BOT_ACCESS_TOKEN_SECRET;

exports.Bot = function() 
{
	var self = this;
	
	self.lastscan = -1;

	self.Bot = new Twit({
	 consumer_key: BOT_CONSUMER_KEY,
	 consumer_secret: BOT_CONSUMER_SECRET,
	 access_token: BOT_ACCESS_TOKEN,
	 access_token_secret: BOT_ACCESS_TOKEN_SECRET
	});

	console.log('Setting up Bot');

	self.RetweetStatus = function(status,onComplete) 
	{
		console.log("Trying to retweet " + status.id_str)
		
		
		var id = {
			id : status.id_str
		}
		
		console.log("Favorited: " + status.favorited + ", Retweeted: " + status.retweeted);
		
		//Check if status has already been favorited or retweeted
		if(status.favorited || status.retweeted) {
			console.log("Already favorited or retweeted.")
			onComplete(false);
			return;
		}
			
		self.Bot.post('favorites/create', id, BotFavorited);
		
		function BotFavorited(error,response) 
		{
			if (error) {
				console.log('Bot could not favorite, : ' + error);
			}
			else {
				console.log('Bot favorited : ' + id.id);
			}
				
			self.Bot.post('statuses/retweet/:id', id, BotRetweeted);
			
			function BotRetweeted(error, response) {
				if (error) {
					console.log('Bot could not retweet, : ' + error);
				}
				else {
					console.log('Bot retweeted : ' + id.id);
				}
				
				onComplete(true);
				return;
			}	
		}
	}

	self.InitiateRetweet = function() {

		console.log('=================Starting Retweet=================')

		var query = {
			q: BOT_SEARCH_PHRASE,
			result_type: "recent",
			count: 5
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
