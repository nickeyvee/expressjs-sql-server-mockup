const action = require('./actions');
const express = require('express');
const dbConfig = require('./dbconfig');
const sql = require('mssql');
const app = express();
const port = 3000;

const server = () => app.listen( port, () => console.log( `..listening on port ${ port }`));
//app.use( () => action.getEmp() );
action.estConn( server );

app.get( '/', ( req, res ) => {
    res.write("Hello world!");
    res.end();
})

app.get( '/userinfo', ( req, res ) => {
    action.getTable();
    res.end();
})