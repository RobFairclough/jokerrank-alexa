/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const http = require('http');

function getJoke() {
  return new Promise((resolve, reject) => {
    var options = {
      host: 'www.jokerrank.co.uk',
      path: '/api/jokes/random',
      method: 'GET'
    };

    const request = http.request(options, response => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', chunk => {
        returnData += chunk;
      });

      response.on('end', () => {
        const joke = JSON.parse(returnData);
        resolve(JSON.parse(returnData).joke);
      });

      response.on('error', error => {
        reject(error);
      });
    });
    request.end();
  });
}

// const launchHandler = {
//   canHandle(handlerInput) {

//     const request = handlerInput.requestEnvelope.request;

//     return request.type === 'LaunchRequest'

//       ||

//     (request.type === 'IntentRequest' && request.intent.name === 'GetNewFactIntent');

// },
// }

const GetRandomJokeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      (request.type === 'IntentRequest' &&
        request.intent.name === 'GetRandomJokeIntent') ||
      request.type === 'LaunchRequest'
    );
  },
  async handle(handlerInput) {
    const response = await getJoke();

    console.log(response);

    return handlerInput.responseBuilder
      .speak('Okay. Here is one for you: ' + response)
      .reprompt('What would you like?')
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(STOP_MESSAGE).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  }
};

const SKILL_NAME = 'joker rank';
const GET_FACT_MESSAGE = "Here's one for you: ";
const HELP_MESSAGE =
  'You can ask for a joke, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRandomJokeHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
