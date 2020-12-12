const express = require('express');
const cors = require('cors');
var session = require('express-session');
const cognitoPoolData = require('./cognito');
const url = 'mongodb+srv://rootuser:weakpassword@cluster0.luo48.mongodb.net/cis550?retryWrites=true&w=majority';
const webapp = express();
//HEROKU
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

async function run () {
  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "admin",
      password      : "password",
      connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
    });

    const result = await connection.execute(
      `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
        EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
        AS BIRTHYEAR 
        FROM player 
        WHERE PLAYER_NAME = 'Alexander Merkel')
        SELECT * from elig_players
        LEFT JOIN playerattributes
        ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
        WHERE BIRTHYEAR <= 2000
        AND BIRTHYEAR >= 1990
        AND OVERALL_RATING <= 90
        AND OVERALL_RATING >= 70`
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
  console.log(`GET PLAYERS with: name - ${req.body.name}, attr - ${req.body.attr}, min - ${req.body.min}, max - ${req.body.max}, start - ${req.body.start}, end - ${req.body.end}`);
  /*if (!req.body.requester) {
    console.log(req);
    res.status(400).json({ error: 'missing requester username' });
    return;
  } */
  var min, max, start, end;

  if (!req.body.max) {
    max = 100;
  } else {
    max = req.body.max;
  }

  if (!req.body.min) {
    min = 0;
  } else {
    min = req.body.min;
  }

  if (!req.body.start) {
    start = 1900;
  } else {
    start = req.body.start;
  }

  if (!req.body.end) {
    end = 2020;
  } else {
    end = req.body.end;
  }
  console.log(end);

  async function sql_with_name_with_attr () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, BIRTHDAY, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player 
          WHERE UPPER(PLAYER_NAME) LIKE UPPER(CONCAT('%', CONCAT(:search, '%')))),
          temp_res AS (SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          WHERE BIRTHYEAR <= :edate
          AND BIRTHYEAR >= :sdate
          AND ${req.body.attr} <= :maattr
          AND ${req.body.attr} >= :miattr),
          temp_latest as (SELECT PLAYER_NAME, MAX(TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS')) 
          AS EVAL_DATE FROM temp_res GROUP BY PLAYER_NAME)
          SELECT * FROM temp_res tr JOIN temp_latest tl ON 
          tr.PLAYER_NAME = tl.PLAYER_NAME AND TO_DATE(tr.DATE_EVALUATED,'YYYY-MM-DD HH24:MI:SS') = tl.EVAL_DATE`
      //, name = req.body.name, attr = req.body.attr, end = end, start = start, max = max, min = min);
      //, [req.body.name, end, start, 'overall_rating', max, 'overall_rating', min]);
     , [req.body.name, end, start, max, min]);
      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  async function sql_wo_name_with_attr () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player),
          temp_res as (SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          WHERE BIRTHYEAR <= :edate
          AND BIRTHYEAR >= :sdate
          AND ${req.body.attr} <= :maattr
          AND ${req.body.attr} >= :miattr),
          temp_latest as (SELECT PLAYER_NAME, MAX(TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS')) 
          AS EVAL_DATE FROM temp_res GROUP BY PLAYER_NAME)
          SELECT * FROM temp_res tr JOIN temp_latest tl ON 
          tr.PLAYER_NAME = tl.PLAYER_NAME AND TO_DATE(tr.DATE_EVALUATED,'YYYY-MM-DD HH24:MI:SS') = tl.EVAL_DATE`
      //, name = req.body.name, attr = req.body.attr, end = end, start = start, max = max, min = min);
      //, [req.body.name, end, start, 'overall_rating', max, 'overall_rating', min]);
     , [end, start, max, min]);
      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  async function sql_wo_attr_wo_name () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player),
          temp_res as (SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          WHERE BIRTHYEAR <= :edate
          AND BIRTHYEAR >= :sdate),
          temp_latest as (SELECT PLAYER_NAME, MAX(TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS')) 
          AS EVAL_DATE FROM temp_res GROUP BY PLAYER_NAME)
          SELECT * FROM temp_res tr JOIN temp_latest tl ON 
          tr.PLAYER_NAME = tl.PLAYER_NAME AND TO_DATE(tr.DATE_EVALUATED,'YYYY-MM-DD HH24:MI:SS') = tl.EVAL_DATE`
      //, name = req.body.name, attr = req.body.attr, end = end, start = start, max = max, min = min);
      //, [req.body.name, end, start, 'overall_rating', max, 'overall_rating', min]);
     , [end, start]);
      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  async function sql_wo_attr_with_name () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player
          WHERE UPPER(PLAYER_NAME) LIKE UPPER(CONCAT('%', CONCAT(:search, '%')))),
          temp_res as (SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          WHERE BIRTHYEAR <= :edate
          AND BIRTHYEAR >= :sdate),
          temp_latest as (SELECT PLAYER_NAME, MAX(TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS')) 
          AS EVAL_DATE FROM temp_res GROUP BY PLAYER_NAME)
          SELECT * FROM temp_res tr JOIN temp_latest tl ON 
          tr.PLAYER_NAME = tl.PLAYER_NAME AND TO_DATE(tr.DATE_EVALUATED,'YYYY-MM-DD HH24:MI:SS') = tl.EVAL_DATE`
      //, name = req.body.name, attr = req.body.attr, end = end, start = start, max = max, min = min);
      //, [req.body.name, end, start, 'overall_rating', max, 'overall_rating', min]);
     , [req.body.name,end, start]);
      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  if (!req.body.name && !req.body.attr) {
    sql_wo_attr_wo_name();
  } else if (!req.body.name && req.body.attr) {
    sql_wo_name_with_attr();
  } else if (req.body.name && !req.body.attr) {
    sql_wo_attr_with_name();
  } else {
    sql_with_name_with_attr();
  }

});

/*** GET PLAYER DATA ENDPOINT ***/
webapp.post('/get_player_data/', (req, res) => {
  console.log(`GETTING PLAYER DATA FOR ${req.body.name}`);

  if(!req.body.name) {
    console.log(req);
    res.status(400).json({ error: 'missing name' });
    return;
  }

  async function sql () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player
          WHERE UPPER(PLAYER_NAME) LIKE UPPER(CONCAT('%', CONCAT(:search, '%'))))
          SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          ORDER BY TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS') DESC`
      //, name = req.body.name, attr = req.body.attr, end = end, start = start, max = max, min = min);
      //, [req.body.name, end, start, 'overall_rating', max, 'overall_rating', min]);
     , [req.body.name]);

      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  sql();

});

/*** GET PLAYER DATA ID ENDPOINT ***/
webapp.post('/get_player_data_id/', (req, res) => {
  console.log(`GETTING PLAYER DATA FROM ID ${req.body.player_id}`);

  if(!req.body.player_id) {
    console.log(req);
    res.status(400).json({ error: 'missing id' });
    return;
  }

  async function sql () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
      console.log(req.body.date);
      const result = await connection.execute(
        `WITH elig_players as (SELECT PLAYER_NAME, PLAYER_API_ID, 
          EXTRACT(year FROM TO_DATE(BIRTHDAY, 'YYYY-MM-DD HH24:MI:SS')) 
          AS BIRTHYEAR 
          FROM player
          WHERE PLAYER_API_ID = ${req.body.player_id})
          SELECT * from elig_players
          LEFT JOIN playerattributes
          ON playerattributes.PLAYER_API_ID = elig_players.PLAYER_API_ID
          WHERE TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS') < TO_DATE(:eval, 'YYYY-MM-DD HH24:MI:SS')
          ORDER BY TO_DATE(DATE_EVALUATED, 'YYYY-MM-DD HH24:MI:SS') DESC` // LIMIT 1 NOT WORKING WHY?
          , [req.body.date]);

      console.log(result.rows[0]);
      res.json({message: 'success', data: result.rows[0]});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  sql();

});

/*** GET FORMATION NDPOINT ***/
webapp.post('/get_formation/', (req, res) => {
  console.log(`GETTING FORMATION FOR TEAM ID ${req.body.team_api_id} IN SEASON ${req.body.season}`);

  if(!req.body.team_api_id || !req.body.season) {
    console.log(req);
    res.status(400).json({ error: 'missing id/season' });
    return;
  }

  async function sql () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });

      const result = await connection.execute(
        `
        WITH matches AS (
          SELECT * FROM MATCH WHERE (HOME_TEAM_API_ID = ${req.body.team_api_id} OR AWAY_TEAM_API_ID = ${req.body.team_api_id}) AND SEASON = :season),
          homes AS (
          SELECT matches.*, TEAM.TEAM_LONG_NAME AS HOME_TEAM_NAME FROM matches JOIN TEAM ON matches.HOME_TEAM_API_ID = TEAM.TEAM_API_ID),
          aways AS (
          SELECT homes.*, TEAM.TEAM_LONG_NAME AS AWAY_TEAM_NAME FROM homes JOIN TEAM ON homes.AWAY_TEAM_API_ID = TEAM.TEAM_API_ID)
          SELECT aways.*, COUNTRY.NAME AS COUNTRY_NAME FROM aways JOIN COUNTRY ON aways.COUNTRY_ID = COUNTRY.COUNTRY_ID ORDER BY STAGE
        `
      , [req.body.season]);

      console.log(result.rows);
      res.json({message: 'success', data: result.rows});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  sql();

});

/*** GET TEAMS ENDPOINT ***/
webapp.post('/get_teams/', (req, res) => {
  console.log(`GETTING TEAMS FOR ${req.body.name}`);

  if(!req.body.name) {
    console.log(req);
    res.status(400).json({ error: 'missing name' });
    return;
  }

  async function sql () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const result = await connection.execute(
        `SELECT * FROM TEAM WHERE UPPER(TEAM_LONG_NAME) 
        LIKE UPPER(CONCAT('%', CONCAT(:search, '%'))) 
        ORDER BY TEAM_LONG_NAME ASC
        `,
        [req.body.name]);

      var out = result.rows;

        console.log(`GETTING RATINGS FOR TEAMS SEARCHED WITH ${req.body.name}`);

      for (var id = 0; id < out.length; id++) {

        const val = await connection.execute(
          `WITH home_temp AS (
            SELECT TEAM.TEAM_LONG_NAME, MATCH.* FROM TEAM JOIN MATCH ON TEAM.TEAM_API_ID = MATCH.HOME_TEAM_API_ID WHERE UPPER(TEAM_LONG_NAME) = :search),
            pivot_home_ids as (select MATCH_API_ID, PLAYER_ID
            from home_temp
            Unpivot (player_id for pid in (HOME_PLAYER_1, HOME_PLAYER_2, HOME_PLAYER_3, HOME_PLAYER_4, HOME_PLAYER_5, HOME_PLAYER_6, HOME_PLAYER_7, HOME_PLAYER_8, HOME_PLAYER_9, HOME_PLAYER_10, HOME_PLAYER_11))),
            home_avgs as (select MATCH_API_ID, AVG(OVERALL_RATING) as avg_player_rating
            from pivot_home_ids JOIN PLAYERATTRIBUTES PA ON PA.PLAYER_API_ID = pivot_home_ids.player_id
            group by match_api_id),
            away_temp AS (
            SELECT TEAM.TEAM_LONG_NAME, MATCH.* FROM TEAM JOIN MATCH ON TEAM.TEAM_API_ID = MATCH.AWAY_TEAM_API_ID WHERE TEAM_LONG_NAME = :search),
            pivot_away_ids as (select MATCH_API_ID, PLAYER_ID
            from away_temp
            Unpivot (player_id for pid in (AWAY_PLAYER_1, AWAY_PLAYER_2, AWAY_PLAYER_3, AWAY_PLAYER_4, AWAY_PLAYER_5, AWAY_PLAYER_6, AWAY_PLAYER_7, AWAY_PLAYER_8, AWAY_PLAYER_9, AWAY_PLAYER_10, AWAY_PLAYER_11))),
            away_avgs as (select MATCH_API_ID, AVG(OVERALL_RATING) as avg_player_rating
            from pivot_away_ids JOIN PLAYERATTRIBUTES PA ON PA.PLAYER_API_ID = pivot_away_ids.player_id
            group by match_api_id),
            all_matches as (
            SELECT *
            FROM home_avgs
            UNION ALL
            SELECT *
            FROM away_avgs)
            SELECT avg(avg_player_rating) as avg_alltime_rating
            FROM all_matches`,
            [out[id].TEAM_LONG_NAME, out[id].TEAM_LONG_NAME]);

              console.log(val);
        out[id].OVERALL_RATING = parseInt(val.rows[0].AVG_ALLTIME_RATING);
      }

      console.log(out);
      res.json({message: 'success', data: out});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  sql();

});

/*** GET TEAM DATA ENDPOINT ***/
webapp.post('/get_team_data/', (req, res) => {
  console.log(`GETTING TEAM DATA FOR ${req.body.team_api_id}`);

  if(!req.body.team_api_id) {
    console.log(req);
    res.status(400).json({ error: 'missing team_api_id' });
    return;
  }

  async function sql () {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "admin",
        password      : "password",
        connectString : "cis450finalproject.cw89abu33cyf.us-east-1.rds.amazonaws.com/SoccerDB"
      });
  
      const wins = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = :search),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = :search),
          wins AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL > AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL < AWAY_TEAM_GOAL)
          SELECT COUNT(*) AS win
          from wins
        `, [req.body.team_api_id]);

      const draws = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id}),
          draws AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL = AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL = AWAY_TEAM_GOAL)
          SELECT COUNT(*) AS draw
          from draws          
        `
      );

      const losses = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id}),
          losses AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL < AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL > AWAY_TEAM_GOAL)
          SELECT COUNT(*) AS loss
          from losses               
        `
      );

      const goals_scored = await connection.execute(
        `WITH temp(goals) AS (
          SELECT HOME_TEAM_GOAL FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}
          UNION ALL
          SELECT AWAY_TEAM_GOAL FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id})
          SELECT avg(goals) as average_goals from temp
        `
      );
        
      const goals_conceded = await connection.execute(
        `WITH temp(goals) AS (
          SELECT AWAY_TEAM_GOAL FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}
          UNION ALL
          SELECT HOME_TEAM_GOAL FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id})
          SELECT avg(goals) as average_goals from temp
        `
      );
          
      const goals_conceded_season = await connection.execute(
        `WITH temp AS (
          SELECT AWAY_TEAM_GOAL as goal, SEASON FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}
          UNION ALL
          SELECT HOME_TEAM_GOAL as goal, SEASON FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id})
          SELECT SEASON, avg(goal) as average_goals from temp GROUP BY SEASON ORDER BY SEASON DESC
        `
      );

      const wins_season = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id}),
          wins AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL > AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL < AWAY_TEAM_GOAL)
          SELECT SEASON, COUNT(*) AS win
          from wins GROUP BY SEASON ORDER BY SEASON DESC
        `);

      const draws_season = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id}),
          draws AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL = AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL = AWAY_TEAM_GOAL)
          SELECT SEASON, COUNT(*) AS draw
          from draws GROUP BY SEASON ORDER BY SEASON DESC         
        `
      );

      const losses_season = await connection.execute(
        `WITH home_temp AS (
          SELECT * FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}),
          away_temp as (SELECT * FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id}),
          losses AS (
          SELECT * FROM home_temp WHERE HOME_TEAM_GOAL < AWAY_TEAM_GOAL
          UNION ALL
          SELECT * FROM away_temp WHERE HOME_TEAM_GOAL > AWAY_TEAM_GOAL)
          SELECT SEASON, COUNT(*) AS loss
          from losses GROUP BY SEASON ORDER BY SEASON DESC              
        `
      );

      const goals_scored_season = await connection.execute(
        `WITH temp AS (
          SELECT HOME_TEAM_GOAL as goal, SEASON FROM MATCH WHERE HOME_TEAM_API_ID = ${req.body.team_api_id}
          UNION ALL
          SELECT AWAY_TEAM_GOAL as goal, SEASON FROM MATCH WHERE AWAY_TEAM_API_ID = ${req.body.team_api_id})
          SELECT SEASON, avg(goal) as average_goals from temp GROUP BY SEASON ORDER BY SEASON DESC
        `
      );

      const formation = await connection.execute(
        `
        WITH matches AS (
          SELECT * FROM MATCH WHERE (HOME_TEAM_API_ID = ${req.body.team_api_id} OR AWAY_TEAM_API_ID = ${req.body.team_api_id}) AND SEASON = '2015/2016' ORDER BY STAGE),
          homes AS (
          SELECT matches.*, TEAM.TEAM_LONG_NAME AS HOME_TEAM_NAME FROM matches JOIN TEAM ON matches.HOME_TEAM_API_ID = TEAM.TEAM_API_ID),
          aways AS (
          SELECT homes.*, TEAM.TEAM_LONG_NAME AS AWAY_TEAM_NAME FROM homes JOIN TEAM ON homes.AWAY_TEAM_API_ID = TEAM.TEAM_API_ID)
          SELECT aways.*, COUNTRY.NAME AS COUNTRY_NAME FROM aways JOIN COUNTRY ON aways.COUNTRY_ID = COUNTRY.COUNTRY_ID ORDER BY STAGE
        `
      );
      /*
      const season_rating = await connection.execute(
        `
        `
      ); Query to get overall rating of team for each season using only matches from that season.
      */
      

      var total = wins.rows[0].WIN + draws.rows[0].DRAW + losses.rows[0].LOSS;

      var out = {win: parseInt(wins.rows[0].WIN / total * 100), draw: parseInt(draws.rows[0].DRAW / total * 100), loss: parseInt(losses.rows[0].LOSS / total * 100), goals_scored: Math.round(goals_scored.rows[0].AVERAGE_GOALS * 100) / 100, goals_conceded: Math.round(goals_conceded.rows[0].AVERAGE_GOALS * 100) / 100};
      var outSeason = {win: wins_season.rows, draw: draws_season.rows, loss: losses_season.rows, goals_scored: goals_scored_season.rows, goals_conceded: goals_conceded_season.rows, OVERALL_RATING: [ 90, 90, 90, 90, 90, 90, 90, 90]};

      console.log(out);
      res.json({message: 'success', data: {stats: out, season: outSeason, formation: formation.rows}});
      //res.json({message: 'success'});
    } catch (err) {
      console.error(err);
      res.status(400).json({err: err});
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

  sql();

});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});
