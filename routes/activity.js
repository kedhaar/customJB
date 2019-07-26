'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var util = require('util');
var https = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( 'Activity.js edit route Sai' );
    
       var request = require('request');
            var url = 'https://enog659hxmys.x.pipedream.net/'
            
            request({
                url: url,
                method: "POST",
                json: '{ "name": "Edit" }'
            }, function(error, response, body){
                if(!error){
                    console.log(body);
            }
            });
    
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( 'Activity.js save route Sai' );
    
       var request = require('request');
            var url = 'https://enog659hxmys.x.pipedream.net/'
            
            request({
                url: url,
                method: "POST",
                json: '{ "name": "Save" }'
            }, function(error, response, body){
                if(!error){
                    console.log(body);
            }
            });
    
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
console.log( 'Activity.js execute route Sai' );
    // example on how to decode JWT
    JWT(req.body, process.env.jwtSecret, (err, decoded) => {

        // verification error -> unauthorized request
        if (err) {
            console.error(err);
            return res.status(401).end();
        }

        var aArgs = req.body.inArguments;
	    var oArgs = {};
	    for (var i=0; i<aArgs.length; i++)
        {  
		    for (var key in aArgs[i])
            { 
			    oArgs[key] = aArgs[i][key]; 
		    }
	    }

        var action = 'claim'
        var winid = oArgs.winid;
        var zone = oArgs.zone;
        
        var post_data = '';				
        var options = 
        {
            'hostname': 'https://pub.s6.exacttarget.com'
            ,'path': '/pxrz1zpoprs?action'+action+'WIN_ID='+winid+'Zone='+zone 
            ,'method': 'POST'
            /*,'headers': {
                'Accept': 'application/json' 
                ,'Content-Type': 'application/json'
                ,'Content-Length': post_data.length
                ,'Authorization': 'Basic ' + activityUtils.deskCreds.token
            },*/
        };
        
        var httpsCall = https.request(options, function(response) {
		var data = ''
			,redirect = ''
			,error = ''
			;
		response.on( 'data' , function( chunk ) {
			data += chunk;
		} );				
		response.on( 'end' , function() 
            {
			    if (response.statusCode == 201)
                {
				    data = JSON.parse(data);
				    console.log('onEND createCustomer',response.statusCode,data.id);
                    /*if (data.id)
                    {
                        next(response.statusCode, 'createCustomer', {id: data.id});
                    }
                    else
                    {
                        next( response.statusCode, 'createCustomer', {} );
                    }*/
			    }
            
                /*else
                {
                    next( response.statusCode, 'createCustomer', {} );
                }	*/			
		    });								

	});
	httpsCall.on( 'error', function( e ) {
		console.error(e);
		//next(500, 'createCustomer', {}, { error: e });
	});				
	
	//httpsCall.write(post_data);
	httpsCall.end();
        
    });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( 'Activity.js publish route Sai' );
    
    var request = require('request');
            var url = 'https://enog659hxmys.x.pipedream.net/'
            
            request({
                url: url,
                method: "POST",
                json: '{ "name": "Publish" }'
            }, function(error, response, body){
                if(!error){
                    console.log(body);
            }
            });
    
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( 'Activity.js validate route Sai' );
    
       var request = require('request');
            var url = 'https://enog659hxmys.x.pipedream.net/'
            
            request({
                url: url,
                method: "POST",
                json: '{ "name": "validate" }'
            }, function(error, response, body){
                if(!error){
                    console.log(body);
            }
            });
    
    logData(req);
    res.send(200, 'Validate');
};
