define([
 'postmonger'
], function(
 Postmonger
) {
 'use strict';

 var connection = new Postmonger.Session();
 var authTokens = {};
 var payload = {};
 

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

  if (true) {
   //    payload['arguments'].execute.inArguments[0].inputTextBox = webHookURlValue;
	    payload['arguments'].execute.inArguments = [{
            "webHookURl": webHookURlValue,
            "tokens": authTokens,
            "emailAddress": "{{Contact.Attribute.CustomJB.EmailAddress}}",
            "firstName": "{{Contact.Attribute.CustomJB.FirstName}}",
            "lastName": "{{Contact.Attribute.CustomJB.LastName}}",
            "city": "{{Contact.Attribute.CustomJB.City}}",
            "country": "{{Contact.Attribute.CustomJB.Country}}"
        }];
	  
  }
  if (webHookURlValue.length == 0) {

   errMsg = 'Error: WebHook URl cannot be blank.';
   console.error(errMsg);
   $('#errorMsgConfig').text(errMsg);
   $('#errorMsgConfig').show();
   connection.trigger('ready');
  } else {
   console.log('Updated Connection Activity');
   console.log('payload------>' + JSON.stringify(payload));
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
