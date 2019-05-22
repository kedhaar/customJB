define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    /** variable to hold tokens for fuel-sdk  received on call to connection.on('requestTokens') **/
    var authTokens = {};
    var payload = {};
    /** variable to hold journey schema response received on call to connection.on('requestedSchema') **/
    var jsonSchemaObject = {};

    var steps = [{
        "label": "Configure WebHook",
        "Key": "step1"
    }];

    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);

    function onRender() {
        console.log('On render');
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        //var deDefKey;
        //var deFieldsKey = [];
        connection.trigger('requestSchema');
        connection.on('requestedSchema', function(data) {
            // save schema
            jsonSchemaObject = data['schema'];
            /** for (var i = 0; i < deDefKey.length; i++) {
                 var obj = deDefKey[0].key;
                 deFieldsKey.push(obj);
             }**/
            console.log('*** Schema ***', jsonSchemaObject);
            // console.log('*** key elements ***', deDefKey.length);
            // console.log('*** key elements ***', deDefKey[0].key);
        });
        // console.log('*** DE Fields schema ***', JSON.stringify(deFieldsKey));

    }

    function initialize(data) {
        console.log('On initialize');

        console.log(data);
        if (data) {
            payload = data;
        }

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );
        console.log('hasinArguments--->' + hasInArguments);
        /*var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                
                console.log(in each block);
            });
        });*/

        if (hasInArguments && payload['arguments'].execute.inArguments[0].webHookURl) {
            $('#inputTextBox').val(payload['arguments'].execute.inArguments[0].webHookURl);
        }

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        $('#errorMsgPreview').text('');
        console.log('customActivity.js ----->  clicked on save');

        var webHookURlValue = $('#inputTextBox').val();
        var errMsg;

        console.log(webHookURlValue);

        var hasInArguments = Boolean(payload['arguments'] && payload['arguments'].execute && payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0);
        var inArgs = {};
        inArgs.webHookURl = webHookURlValue;
        inArgs.tokens = authTokens;
        jsonSchemaObject.forEach(function(item) {
            var deArgs = item.key;
            var jsonSplit = deArgs.split(".");
            var jsonkey = jsonSplit[jsonSplit.length - 1];

            inArgs[jsonkey] = deArgs;
        });
        console.log('In Args payload' + JSON.stringify(inArgs));
        if (hasInArguments) {
            //    payload['arguments'].execute.inArguments[0].inputTextBox = webHookURlValue;
            payload['arguments'].execute.inArguments = JSON.stringify(inArgs);

            /** [{
                "webHookURl": webHookURlValue,
                "tokens": authTokens,
                "emailAddress": "{{Contact.Attribute.CustomJB.EmailAddress}}",
                "firstName": "{{Contact.Attribute.CustomJB.FirstName}}",
                "lastName": "{{Contact.Attribute.CustomJB.LastName}}",
                "city": "{{Contact.Attribute.CustomJB.City}}",
                "country": "{{Contact.Attribute.CustomJB.Country}}"
            }];**/

        }
        if (webHookURlValue.length == 0) {

            errMsg = 'Error: WebHook URl cannot be blank.';
            console.error(errMsg);
            $('#errorMsgConfig').text(errMsg);
            $('#errorMsgConfig').show();
            connection.trigger('ready');
        } else {
            console.log('Updated Connection Activity');

            payload['metaData'].isConfigured = true;
            connection.trigger('updateActivity', payload);
        }

        /*payload['arguments'].execute.inArguments = [{
                  "webHookURl": webHookURlValue,
                  "tokens": authTokens,
                  "emailAddress": "{{Contact.Attribute.PostcardJourney.EmailAddress}}",
                  "firstName": "{{Contact.Attribute.CustomActivity.FirstName}}",
                  "lastName": "{{Contact.Attribute.CustomActivity.LastName}}",
                  "city": "{{Contact.Attribute.CustomActivity.City}}",
                  "country": "{{Contact.Attribute.CustomActivity.Country}}"
              }];
              
              payload['metaData'].isConfigured = true;

              console.log(payload);
              connection.trigger('updateActivity', payload);*/
    }

});
