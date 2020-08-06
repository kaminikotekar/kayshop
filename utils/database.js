
// If not using sequelize then creating pool
/* const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user: 'root',
    database: 'Nodeshop',
    password: ''
});

module.exports= pool.promise();
*/
/*
const Sequelize = require('sequelize');
const sequelize= new Sequelize('Nodeshop','root','',{
    dialect:'mysql',
    host:'localhost'

});

module.exports = sequelize;
*/

 const mongodb = require('mongodb');
 const MongoClient = mongodb.MongoClient;

 let _db;
 
const mongoConnect = callback =>
{
 MongoClient.connect('mongodb+srv://kaminiNode:IHwtVlfQ1Qjz0viX@shop-bm6k7.mongodb.net/shop?retryWrites=true&w=majority')
 .then(client=>{
    console.log("connection succesful");
    _db = client.db();
    callback(client);
 })
 .catch(err=>
    { 
        console.log(err);
        throw err;

    });
 
};

const getdb = () =>  {
if(_db){
    return _db;

}
throw 'No database Connection';

};

module.exports = {
                    'mongoConnect': mongoConnect,
                    'getDb': getdb}

// Use Read write any database access for username and password.