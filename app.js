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
// Twitter API docs help you here.
// max_id: XXX is the last printed tweet out there
// take out to reset to latest timeline, put in to start limiting.
// 200 count is the max twitter allows in one unique call
client.get('/statuses/user_timeline',{max_id: 500000000000000,screen_name: "jordanfish", exclude_replies: true, count: 200}, function(error, params, response){

    for (tweet in params){
        //console.log(params[tweet]);
        if(params[tweet].text.indexOf("@") === -1 ){
        var tweetText = params[tweet].text;
        // clean out new lines
        tweetText = tweetText.replace(/(\r\n|\n|\r)/gm,"");
        //take out url links
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        tweetText = tweetText.replace(urlRegex,"");
        // now try
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
                        } else {
                            console.log("ERRORED CALL");
                        }
                    });
                }
            });
            
        }
    }
});

