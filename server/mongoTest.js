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
    const url = 'mongodb+srv://rootuser:weakpassword@cluster0.luo48.mongodb.net/project?retryWrites=true&w=majority';
 

    const client = new MongoClient(url);
 
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("project");
            /*dbo.createCollection("users", function(err, res) {
                if (err) throw err;
                console.log("Collection created!");
              }); */
            const newUser = {
                username: 'Varun',
                email: 'test',
                password: 'password'
              };
            dbo.collection("users").insertOne(newUser, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
          });
          
          await client.connect();
          await listDatabases(client);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);