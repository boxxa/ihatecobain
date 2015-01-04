var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

var PythonShell = require('python-shell');
var request = require("request");
var pyshell = null;
client.get('/statuses/user_timeline',{max_id: 534849425622204400,screen_name: "cryptocobain", exclude_replies: true, trim_user: true, count: 500}, function(error, params, response){

    for (tweet in params){
        if(params[tweet].text.indexOf("@") === -1 && params[tweet].text.indexOf("http://") === -1){
        var tweetText = params[tweet].text;
        tweetText = tweetText.replace(/(\r\n|\n|\r)/gm,"");
        var count = 1;
        while(tweetText.indexOf(" ") != -1){
            tweetText = tweetText.replace(" ",count);
            count++;
        }
            console.log(params[tweet].id + " | " + tweetText);
            var options = { args: [tweetText] };
            PythonShell.run('brainwallet_check.py',options, function (err, results) {
            if (err) throw err;
                if(results != null) {
                    console.log("Fetching balance for: " + results[0]); 
                    var url = "https://blockchain.info/q/addressbalance/" + results[0];
                    // This could be cleaner since blockchain supports address,address,address and can group this into one HTTP call
                    request({
                        url: url,
                        json: false
                    }, function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            console.log("Balance: " + body + " | " + url); 
                        }
                    });
                }
            });
            
        }
    }
});

