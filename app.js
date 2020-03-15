const express = require("express");
const bodyParser = require("body-parser");
const requestMod = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000, function(){
  console.log("Well that was easy!");
});

app.use(express.static("public"));

app.get("/" , function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  console.log( firstName, lastName, email);
  var data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  var jsonData = JSON.stringify(data);
  var url = "https://us19.api.mailchimp.com/3.0/lists/ff45eb82c6";
  var options = {
    method: "POST",
    auth: "logan:zz11737cf06be26a6d4d043bd98ee01d27-us19"
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req,res){
  res.redirect("/");
});

// 11737cf06be26a6d4d043bd98ee01d27-us19

// audience id:  ff45eb82c6
