const bodyParser = require('body-parser');
const dbConfig = require('./dbconfig');
const action = require('./actions');
const express = require('express');
const path = require('path');
const sql = require('mssql');
const app = express();
const port = 3000;


function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

app.use( errorHandler );
app.use( express.static( __dirname + "/public") );
app.use( bodyParser.json() );   // to support JSON-encoded bodies.
app.use( bodyParser.urlencoded({ // to support URL-encoded bodies.
  extended: true
})); 

const server = () => app.listen( port, () => console.log( `..listening on port ${ port }`));

action.estConn( server );     // <=== Open connection pool on server start.


// --- GET LATEST ARTICLE SENTIMENT BY STOCK NAME ---

app.get( '/search', ( req, res ) => {

    let stockName = req.query.stock_name;

    let callback = ( data ) => {
      if( null ) {

        console.log( "Error finding record")
      } else {

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify( data ));
      }
    }
    action.getLatest( stockName, callback );

})

// --- ADD NEW STOCK SENTIMENT INFO ---

app.get( '/store', ( req, res ) => {
  
    let sentimentScore = req.query.sentiment_score;
    let stockUrl = req.query.stock_url;
    let stockName = req.query.stock_name;

    let callback = ( data ) => {
      if ( null ) {

        res.send( "Error adding record");
      } else {  

        res.send( "Added record.");
      }
    }
    action.addNewSentiment( sentimentScore, stockUrl, stockName, callback );
})

// --- VIEW DB TABLE ---

app.get( '/all', ( req ,res ) => {

  let callback = ( data ) => {
      if ( null ) {

        res.send( "Error displaying records" );
      } else {  

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify( data ));
      }
    }
    action.getAll( callback );
})