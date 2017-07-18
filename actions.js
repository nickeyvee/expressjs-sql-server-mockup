const sql = require('mssql');
const dbConfig = require('./dbconfig');

const conn = new sql.ConnectionPool( dbConfig );

module.exports = {

    estConn: ( fn ) => {

        console.log( "Establishing service connection..");

        conn.connect( err => {
            if( err ) {
                return console.log( err );
            } else {
                console.log(`Connected to ${ dbConfig.database }..`);
                fn();
            }
        })
    },

    getEmp: () => {

        console.log( "Establishing service connection..");
        
        let req = new sql.Request(conn);

        conn.connect( err => { 
            if ( err ) {
                return console.log( err );
            }
            req.query("SELECT * FROM dbo.books", ( err, data ) => {
                if ( err ) {
                    console.log( err );
                } else {
                    console.log( data );
                }
                conn.close();
            })

        })
    },

    getTable: () => {

        let req = new sql.Request(conn);
        
        req.query("SELECT * FROM dbo.books", ( err, data ) => {
            if ( err ) {
                console.log( err );
            } else {
                console.log( data );
            }
        })
    },

}