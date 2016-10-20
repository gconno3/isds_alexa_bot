"use strict";
module.change_code = 1;
var _ = require("lodash");
var Skill = require("alexa-app");
var ISDSbot = new Skill.app("ISDSbot");
var ConsultHelp = require('./consultant_helper.js');

var facts = {
    students:   [
            "we have the tallest and arguably nicest phd students of the whole business school",
            "we love to work from home during weekends",
            "the business school is our second home",
            "we pretend to know about computers and business",
            "the I.S.D.S students get good jobs",
            "the I.S.D.S students get the highest salary in the business school"],
    professors: [
            "I.S.D.S professors publish a lot",
            "I.S.D.S professors love to teach",
            "I.S.D.S professors engage in very interesting projects",
            "I.S.D.S professors like to work with students one on one",
            "I.S.D.S professors are fun people",
            "I.S.D.S professors work hard and play harder"],
    courses: [
            "I.S.D.S courses prepare you for a great career",
            "idsds courses are challenging but fun",
            "many students from other departments take I.S.D.S courses ",
            "I.S.D.S courses are hands on and provide with grat skills",
            "I.S.D.S courses are both technical and strategic",
            "I.S.D.S courses will get you a job"]
    };


//var MadlibHelper = require("./madlib_helper");

//on launch intent
ISDSbot.launch(function(request, response) {
    var speechOutput = "Hi there! I'm the the I.S.D.S assistant. I'm here to help you. What's your name?";
    var repromptOutput = "Sorry, I didn't catch that. Say, my name is";

    response.say(speechOutput).shouldEndSession(false);
    response.reprompt(repromptOutput).shouldEndSession(false);

});

//skill's intentes

//catch user's name
ISDSbot.intent("sayName", {
  "slots": {
    "NAME": "AMAZON.US_FIRST_NAME"
  },
  "utterances": ["{My|They|I|begin|build} {|name|call|am|go|} {|by|is|me|called} {-|NAME}", 
  //"{-|NAME}"
  ]
},
  function(request, response) {
    var name = request.slot("NAME");
    if(name) {
      var speechOutput = "Hi " + name + ". My knowledge is limited at the moment, but i can give you give you information about I.S.D.S courses, or i can give you general facts";
    }else {
      var speechOutput = "Hi!. My knowledge is limited at the moment, but i can give you give you information about I.S.D.S courses, or i can give you general facts";
    }
  	
  	var repromptOutput = "Ask me for courses' advice, or for general information";
    
    response.session("name", name);
    response.say(speechOutput).shouldEndSession(false);
    }
);

//manage general info requests
ISDSbot.intent("generalInfo", {
  "slots": {
    "INFOCAT": "INFOCAT"
  },
  "utterances": [
   "{give me| tell me | } {a| }  {fun | nice | interesting |} {fact} {about| } {-|INFOCAT}", 
   "{give me| tell me | } {a| } {-|INFOCAT} {fact}",
   "{-|INFOCAT}",
   "what can you tell me",
   ]
},
  function(request, response) {
    //call the info function
    return generalInfo(request,response);
    }
);

//course advisor intent
ISDSbot.intent("courseAdvisor", {
  "slots": {
    "NAME": "NONE"
  },
  "utterances": ["{give|suggest|offer} {me|us} {advice|counceling|suggestions}"]
},
  function(request, response) {
    return courseAdvisor(getConsultHelp(request), request, response);
    }
);

ISDSbot.intent("courseInfo", {
  "slots": {
    "COURSE": "COURSE"
  },
  "utterances": ["{what | tell} {is} {course} {-|COURSE}",
  "{tell | give} {the } {description | information} {about | of} {courses | course } {-|COURSE}"]
},
  function(request, response) {

    }
);

//Amazon built in YES intent
ISDSbot.intent("AMAZON.YesIntent", 
  {},
  function(request, response) {
    var jsonRequest = request.data;
    var isBachelor = jsonRequest.session.attributes.isBachelor
    var likeMath = jsonRequest.session.attributes.likeMath
    var likeFinance = jsonRequest.session.attributes.likeFinance

    if(isBachelor === " ") {
      var isBachelor = 1
      response.session("isBachelor", isBachelor)
      return courseAdvisor(request, response);
    }

    if(likeMath === " "){
      var likeMath = 1
      response.session("likeMath", likeMath)
      return courseAdvisor(request, response)
    }

    if(likeFinance === " "){
      var likeFinance = 1
      response.session("likeFinance", likeFinance)
      return selectCourse(request, response)
    }

    //response.say(speechOutput).shouldEndSession(false);
    }
);

ISDSbot.intent("AMAZON.NoIntent", 
  {},
  function(request, response) {
    var jsonRequest = request.data;
    var isBachelor = jsonRequest.session.attributes.isBachelor
    var likeMath = jsonRequest.session.attributes.likeMath
    var likeFinance = jsonRequest.session.attributes.likeFinance

    if(isBachelor === " ") {
      var isBachelor = 0
      response.session("isBachelor", isBachelor)
      return courseAdvisor(request, response);
    }

    if(likeMath === " "){
      var likeMath = 0
      response.session("likeMath", likeMath)
      return courseAdvisor(request, response)
    }

    if(likeFinance === " "){
      var likeFinance = 0
      response.session("likeFinance", likeFinance)
      return selectCourse(request, response)
    }

    //response.say(speechOutput).shouldEndSession(false);
    }
);


ISDSbot.intent("AMAZON.StartOverIntent", 
  {},
  function(request, response) {
      


    }
);


//application functions

function generalInfo(request, response) {
//var name = request.session("NAME");
  var infocat = request.slot("INFOCAT");
    
  if (infocat == "students" || infocat == "professors" || infocat == "courses") {
    var speechOutput = facts[infocat][randomNumber(6)];

    response.session("INFOCAT", infocat).shouldEndSession(false);
    response.say(speechOutput);
    var repromptOutput = "Do you want to hear another fact about " + infocat + "?";
    response.reprompt(repromptOutput).shouldEndSession(false);
        
    } 
  if (infocat == "random") {
    var outputCat = Object.keys(facts)[randomNumber(3)];
    var speechOutput = facts[outputCat][randomNumber(6)]; 

    response.session("INFOCAT", infocat).shouldEndSession(false);
    response.say(speechOutput);
    var repromptOutput = "Do you want to hear another " + infocat + " fact?";
    response.reprompt(repromptOutput).shouldEndSession(false);
    }
  if (!infocat) {
    var speechOutput = "You can ask me about students, professors, and the department";
    var repromptOutput = "Try asking me a random fact maybe";
    response.say(speechOutput);
    response.reprompt(repromptOutput);
  }
};


var getConsultHelp = function(request) {
  var consultHelperData = request.session("CONSULT_DATA");
  if (consultHelperData === undefined) {
    consultHelperData = {};
  }
  return new ConsultHelp(consultHelperData);
};

function courseAdvisor(consultHelp,request, response) { 
  
  var name = request.session("name");
  var advisorInit = request.session("advisorInit");
  var isBachelor = request.session("isBachelor");
  var likeMath = request.session("likeMath");
  var likeFinance = request.session("likeFinance");

  //response.session("startedAdvisor", startedAdvisor)
  var stepValue = consultHelp.currentStep;
  var stepLength = consultHelp.consultant[0].steps.length;

  if(consultHelp.started == false) {
    consultHelp.started = true;
    consultHelp.index = 10;
    var speechOutput = consultHelp.consultant[0].init;
    response.say(speechOutput);
    response.session("CONSULT_DATA",consultHelp)
  }
  
  if(consultHelp.started == true && stepValue <= stepLength-1) {
    var speechOutput = consultHelp.consultant[0].steps[stepValue].promt
    var repromptOutput = "Sorry, I didn't catch that. " + consultHelp.consultant[0].steps[stepValue].promt
    response.say(speechOutput)
    response.reprompt(repromptOutput)
    consultHelp.currentStep ++
    response.session("CONSULT_DATA",consultHelp)
  }

  if(consultHelp.started == true && stepValue == stepLength) {
    var speechOutput = consultHelp.consultant[0].steps[stepValue].promt
    var repromptOutput = "Sorry, I didn't catch that. " + consultHelp.consultant[0].steps[stepValue].promt
    response.say(speechOutput)
    response.reprompt(repromptOutput)
    consultHelp.currentStep ++
    response.session("CONSULT_DATA",consultHelp)
  }

  //if(consultHelp.started == true)

};


function selectCourse(request, response) {
  var jsonRequest = request.data
  var isBachelor = request.session("isBachelor");
  var likeMath = request.session("likeMath");
  var likeFinance = request.session("likeFinance")
  var name = request.session("name")
  if(isBachelor && likeMath && likeFinance) {
    response.say(name + ", you seem to like everything, you should do a P.H.D")
  }
};



function randomNumber(max) {
	var randomNum = Math.floor(Math.random() * max);
	return randomNum
};


//export the ISDSbot module
var test = 1
module.exports = ISDSbot;