/*const sqlite3 = require('sqlite3').verbose();

const DB_NAME = 'usersdb.sqlite';

const db = new sqlite3.Database(DB_NAME, (err) => {
  if (err) {
    // error opening database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE users (
            username text  PRIMARY KEY,
            email text,
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
    (othererr) => {
      if (othererr) {
        // error creating table
        console.error(othererr.message);
      }
    });
  }
});
*/
const {MongoClient} = require('mongodb');

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = 'mongodb+srv://rootuser:weakpassword@cluster0.luo48.mongodb.net/test?retryWrites=true&w=majority';
 

    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();



        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

//module.exports = db;
