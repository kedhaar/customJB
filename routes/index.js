'use strict';

// Deps
var activity = require('./activity');

/*
 * GET home page.
 */
exports.index = function(req, res){
    console.log( 'Get Home Page');
    if( !req.session.token ) {
        res.render( 'index', {
            title: 'Unauthenticated',
            errorMessage: 'This app may only be loaded via Salesforce Marketing Cloud',
        });
    } else {
        res.render( 'index', {
            title: 'Custom Journey Builder Activity',
            results: activity.logExecuteData,
        });
    }
};

exports.login = function( req, res ) {
      console.log( 'Get Home Page login');
    console.log( 'req.body: ', req.body );
    res.redirect( '/' );
};

exports.logout = function( req, res ) {
      console.log( 'Get Home Page logout');
    req.session.token = '';
};
