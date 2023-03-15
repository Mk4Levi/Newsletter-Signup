
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        },
      ],
    };

    let jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/5d205ebd0b";

    const options = {
      method: "POST",
      auth: "manthank:095cf6917b2226c1e2c6fd444a699ff6-us21",
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        };

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

    app.post("/success", function(req, res) {
        res.redirect("/");
    });

    app.post("/failure", function(req, res) {
        res.redirect("/");
    });

    // console.log(firstName, lastName);
    // console.log(email);
    
    console.log("");
});

app.listen(port, function() {
    console.log("Server is running on port : " + port);
});




// Mailchimp MKP API key :-
// 095cf6917b2226c1e2c6fd444a699ff6-us21

// Mailchimp MKP Audience(List) ID :-
// 5d205ebd0b