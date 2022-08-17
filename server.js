const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/tryAgain",function(req,res){
  res.redirect("/");
});

app.post("/",function(req,res){

  var url = "https://api.weatherapi.com/v1/current.json?";
  var apiKey = "99ac6b6a7b48439194f162511221608";

  var query = req.body.cityName;

  url = url + "key=" + apiKey + "&q=" + query;

  https.get(url, function(resonse){

    resonse.on("data",function(data){
      var weatherData = JSON.parse(data);
      const temp_c = weatherData.current.temp_c;
      const location = weatherData.location.name;
      const imageUrl = "https://" + weatherData.current.condition.icon;
      res.write("<body style='text-align: center'>");
      res.write("<h1>Current Temperature in "+ location +" : " + temp_c + " Celcius.</h1>");
      res.write("<img src=" + imageUrl + " alt='Current weather image'>");
      res.write("<form action='/tryAgain' method='post'> <button type='submit' name='tryAgain'>Try Again</button> </form> </body>");
      res.send();
    });

  });

});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on 3000");
});
