const express = require('express');
const cors = require('cors');
var session = require('express-session');
const cognitoPoolData = require('./cognito');
const url = 'mongodb+srv://rootuser:weakpassword@cluster0.luo48.mongodb.net/cis550?retryWrites=true&w=majority';
const webapp = express();

// enable cors in our express app
webapp.use(cors()); // HEROKU: Add 
// Help with parsing body of HTTP requests
const bodyParser = require('body-parser');

// Server port
const port = process.env.PORT || 8080; // remove process.env for local testing

webapp.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));

webapp.use(cors());
var MongoClient = require('mongodb').MongoClient;

// Import database
//const db = require('./database.js');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const userPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoPoolData);

webapp.use(bodyParser.urlencoded({
  extended: true,
}));

webapp.use(bodyParser.json());

/*var connection = mysql.createConnection({
  host : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com",
  user : "admin",
  password : "password",
  port: "1521",
}); */

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "admin",
      password      : "password",
      connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
    });

    const result = await connection.execute(
      `SELECT *
      FROM COUNTRY`,
    );
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

run();

// Start server
webapp.listen(port, () => {
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (req, res) => {
  res.json({ message: 'Welcome to Rendezvous server' });
});

// Set of users 
const users = new Set();

// *** LOGIN ENDPOINT ***
webapp.post('/login/', (req, res) => {
  //res.setHeader('Access-Control-Allow-Origin', 'https://rendezvous-cis557-client.herokuapp.com');
  console.log('LOGGING in user');
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: req.body.email,
    Password: req.body.password,
  });

  var userData = {
    Username: req.body.email,
    Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      res.json({
        message: 'success',
      })
    },
    onFailure: function (err) {
      if (err) {
        console.log(err);
        res.status(404).json({ error: err });
        return; // WHY is this not returning/terminating before the MONGODB code to get in database if user credentials not correct in cognito
      }
    },

  });
});

// *** CREATE NEW USER (SIGNUP) ENDPOINT *** //
webapp.post('/user/', (req, res) => {
  console.log('CREATE a user');
  if (!req.body.username) {
    console.log(req);
    res.status(400).json({ error: 'missing username' });
    return;
  }

  if (!req.body.email) {
    console.log(req);
    res.status(400).json({ error: 'missing email' });
    return;
  }

  if (!req.body.password) {
    console.log(req);
    res.status(400).json({ error: 'missing password' });
    return;
  }

  if (!req.body.date) {
    console.log(req);
    res.status(400).json({ error: 'missing date' });
    return;
  }
  // create user object
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    favPlayers: [req.body.username],
    favTeams: req.body.date
  };
  
  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");
        dbo.collection("users").insertOne(newUser, function(err) {
            if (err) throw err;
            console.log("user inserted");
            db.close();
        });
      });

      
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }
  
    // inserted into database successfully

    // now sign up with cognito

    const usernameData = {
      Name : 'preferred_username',
      Value : newUser.username
    }

    const usernameAtt = new AmazonCognitoIdentity.CognitoUserAttribute(usernameData);
    userPool.signUp(newUser.email, newUser.password, [usernameAtt], null, function(err, result) {
      if (err) {
          res.status(400).json({ error: 'could not sign up user - email in use' });
          console.log(err);
          return;
      } else {
        res.json({
          message: 'success',
          user: newUser
        });
        console.log(result);
      }
      
    });
    
});

// *** GET ALL USERS ENDPOINT *** //
webapp.post('/users/', (req, res) => {
  console.log('GETTING ALL USERS');
  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");
        //can modify to return more fields than just username
        dbo.collection("users").find({}, {'fields': {_id : 0, username: 1}}).toArray((err, doc) => {
            if (err) throw err;
            console.log(doc);
            res.json({
              message: "success",
              users: doc
            })
            db.close();
        });
      }); 
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }   
});

// *** ADD USER ENDPOINT *** //
webapp.post('/add_user/', (req, res) => {
  console.log('ADD contact');
  if (!req.body.requester) {
    console.log(req);
    res.status(400).json({ error: 'missing requester username' });
    return;
  }

  if (!req.body.target) {
    console.log(req);
    res.status(400).json({ error: 'missing target username' });
    return;
  }

  //AddToSet already intrinsically disallows duplicate values (will not add username again if already a contact)
  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");          
        dbo.collection("users").updateOne({"username": req.body.requester}, {$addToSet: {contacts: req.body.target}})
        .then((result) => {
          const { matchedCount, modifiedCount} = result;
          if (matchedCount && modifiedCount) {
            console.log('SUCCESS ADD contact');
            res.json({
              message: 'success',
              added: req.body.target,
            });
          } else {
            res.status(400).json({error: 'Target user already contact'});
          }
        });
      }); 
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }   

});

// *** REMOVE USER ENDPOINT ** //
webapp.post('/rem_user/', (req, res) => {
  console.log(`REMOVE ${req.body.target} as contact FROM ${req.body.requester}`);
  if (!req.body.requester) {
    console.log(req);
    res.status(400).json({ error: 'missing requester username' });
    return;
  }

  if (!req.body.target) {
    console.log(req);
    res.status(400).json({ error: 'missing target username' });
    return;
  }

  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");
        dbo.collection("users").updateOne({"username": req.body.requester}, {$pull: {contacts: req.body.target}})
        .then((result) => {
          const { matchedCount, modifiedCount} = result;
          if (matchedCount && modifiedCount) {
            console.log('SUCCESS REMOVE contact');
            res.json({
              message: 'success',
              removed: req.body.target,
            });
          } else {
            res.status(400).json({error: 'Failed to modify'});
          }
        });
      }); 
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }   

});

// *** GET CONTACTS ENDPOINT *** //

webapp.post('/get_contacts/', (req, res) => {
  console.log(`GET contacts of user: ${req.body.requester}`);
  if (!req.body.requester) {
    console.log(req);
    res.status(400).json({ error: 'missing requester username' });
    return;
  }

  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");
        //console.log(req);
        dbo.collection("users").find({"username": req.body.requester}).toArray((err, doc) => {
            if (err) throw err;
            console.log(doc[0].contacts);
            res.json({
              message: "success",
              contacts: doc[0].contacts
            })
            db.close();
        });
      }); 
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }   
});

/*** GET USER DETAILS ENDPOINT ***/
webapp.post('/get_user/', (req, res) => {
    console.log(`Getting user ${req.body.requester}`);
    if (!req.body.requester) {
      console.log(req);
      res.status(400).json({ error: 'missing requester username' });
      return;
    }
  
    try {
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("cis550");
          //console.log(req);
          dbo.collection("users").find({"username": req.body.requester}).toArray((err, doc) => {
              if (err) throw err;
              console.log(doc[0]);
              res.json({
                message: "success",
                result: doc[0]
              })
              db.close();
          });
        }); 
    } catch (error) {
      res.status(400).json({ error: err.message });
      return;
    }   
});

/*** GET USERNAME FROM EMAIL ENDPOINT ***/

webapp.post('/get_name/', (req, res) => {
  console.log(`Getting name from email: ${req.body.email}`);
  if (!req.body.email) {
    console.log(req);
    res.status(400).json({ error: 'missing email' });
    return;
  }

  try {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cis550");
        //console.log(req);
        dbo.collection("users").find({"email": req.body.email}).toArray((err, doc) => {
            if (err) throw err;
            console.log(doc[0].username);
            res.json({
              message: "success",
              username: doc[0].username
            })
            db.close();
        });
      }); 
  } catch (error) {
    res.status(400).json({ error: err.message });
    return;
  }   
});
  
/*** GET PLAYERS ENDPOINT ***/
webapp.post('/get_players/', (req, res) => {
  console.log(`GET PLAYERS with: ${req.body.name}, ${req.body.attr}, ${req.body.min}, ${req.body.max}, ${req.body.start}, ${req.body.end}`);
  /*if (!req.body.requester) {
    console.log(req);
    res.status(400).json({ error: 'missing requester username' });
    return;
  } */
  

});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});
