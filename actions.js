const sql = require('mssql');
const dbConfig = require('./dbconfig');

const pool1 = new sql.ConnectionPool( dbConfig );

module.exports = {

    sentiment_data: '',

    // --- OPEN CONNECTION POOL ON SERVER START ---

    estConn: ( fn ) => {

        console.log( "Establishing service connection..");

        pool1.connect( err => {
            if( err ) {
                return console.log( err );
            } else {
                console.log(`Connected to ${ dbConfig.database }..`);
                fn();
            }
        })
    },

    // --- RETURN LATEST TIMESTAMP BY STOCK NAME ---

    getLatest: ( stock_name, callback ) => {

        const req = new sql.Request( pool1 )

        req.input('stock_name', sql.NVarChar, stock_name )

        req.execute('dbo.getLatest', ( err, result ) => {

            if( err ) {
                console.log( err ) 
            } else {
                callback( result );
            }
        })
    },

    // --- ADD SENTIMENT TO DB ---

    addNewSentiment: ( sentiment_score, stock_url, stock_name, callback ) => {
        const req = new sql.Request( pool1 )

        req.input( 'sentiment_score', sql.Int, sentiment_score )        // <=== Sets proceedure parameters
        req.input( 'stock_url', sql.NVarChar, stock_url )   
        req.input( 'stock_name', sql.NVarChar, stock_name )

        req.execute('dbo.addSentiment', ( err, result ) => {            // <=== Executes stored proceedure

            if( err ) {
                console.log( err );
                callback( null ); 
            
            } else {
                callback( result );
            }
        })
    },

    // --- DISPLAY ALL RECORDS ---

    getAll: ( callback ) => {
        const req = new sql.Request( pool1 )

        req.execute( 'dbo.getAll', ( err, result ) => {
            if( err ) {
                console.log( err );
                callback( null ); 
            
            } else {
                callback( result );
            }
        })
    }
}