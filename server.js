/**
 * Created by Ehsan on 18/12/2016.
 */
var express=require("express");
var bodyParser=require("body-parser");
var morgan=require("morgan");
var mongoose=require("mongoose");
var fs=require("fs");
autoIncrement = require('mongoose-auto-increment');
var TelegramBot=require('node-telegram-bot-api');
var async=require('async');
var validator=require('validator');
app=express();
oBodyParserJson=bodyParser.json();
oBodyParserUrl=bodyParser.urlencoded({extended:true});
eval(fs.readFileSync(__dirname + '/Constants.js')+'');
eval(fs.readFileSync(__dirname + '/Functions.js')+'');

theBot=new TelegramBot("311263683:AAEuEYz6CKUCNez_IiMWnlboGpYGStZXsCA",{polling:true});

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/wordb");
mongoose.connect("mongodb://botdb-user:polis110@mongodb/botdb");
var db=mongoose.connection;
autoIncrement.initialize(db);
db.on("error",function () {
    console.log("Erron in connecting");
});

db.once("connected",function () {
    console.log("MongoDB is connected");
});


var wordSchema=new mongoose.Schema({
    word_id: Number,
    word : String,
    word_def : String,
    word_def_fa: String,
    example: String,
    example_fa: String,
    word_noun: String,
    word_adj: String,
    word_verb: String,
    word_adv: String,
    word_slang: String,
    word_comment: String
});

var userSchema=new mongoose.Schema({
    userId_inc: Number,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    userId: Number,
    password: String,
    level: Number,
    userType: String,
    dayScore: Number,
    monthScore: Number,
    overallScore: Number,
    maxWordId: Number,
    askedWordId: Number,
    askedRegistering: String,
    userWords: [{wordId: Number,wordBox: Number,lastCheck:Date, newWord: Boolean}]

});


wordSchema.plugin(autoIncrement.plugin,{model:"wordModel",field:"word_id",startAt:1 });
userSchema.plugin(autoIncrement.plugin,{model:"userModel",field:"userId_inc",startAt:1 });
var wordModel=mongoose.model("Words",wordSchema);
var userModel=mongoose.model("Users",userSchema);

app.use(express.static(__dirname+"/static"));
app.use(oBodyParserJson);
app.use(oBodyParserUrl);
app.use(morgan("dev"));


theBot.on("text", function (message) {

    ///////////////////////////////////////////////////Membering
    if (message.text == "start" || message.text == "/start" || message.text == "Start") {
        userModel.find({userId: message.from.id}, function (err, foundUser) {
            if (err) {
                throw err
            }
            else if (foundUser.length) {
                theBot.sendMessage(message.chat.id, "To Ozvi ke");
            }

            else {
                var photo = __dirname + "/img/welcome1.jpg";
                var result = theBot.sendPhoto(message.chat.id, photo);
                result.then(function (val) {
                    theBot.sendMessage(message.chat.id, welcomingMessage1);
                    theBot.sendMessage(message.chat.id, welcomingMessage2, learnOpt);
                });
            }
        });
    }
    else {
        userModel.findOne({userId: message.from.id}, function (err, theUser) {
            if (err) {
                throw err;
            }
            else if (theUser) {
                if (theUser.askedRegistering == "Registered") {
                    if (message.text == JSON.parse(reviewQuestionOpt.reply_markup).keyboard[0][0]) {     /////////////// I Know the word
                        if (theUser.askedWordId) {
                            function findWordInArray1(word) {
                                return word.wordId == theUser.askedWordId;
                            }

                            var foundWordInArray = theUser.userWords.find(findWordInArray1);
                            if (foundWordInArray) {
                                if (foundWordInArray.wordBox < 8) {
                                    foundWordInArray.wordBox++;
                                }
                                theUser.askedWordId = 0;
                                foundWordInArray.lastCheck = new Date();
                                foundWordInArray.newWord = false;
                                theUser.save();
                            }
                        }
                        if (theUser.maxWordId) {
                            function findWordInArray1(word) {
                                return word.wordId == theUser.maxWordId;
                            }

                            var foundWordInArray = theUser.userWords.find(findWordInArray1);
                            if (foundWordInArray) {
                                if (foundWordInArray.wordBox == 0) {
                                    foundWordInArray.wordBox = 2;
                                    theUser.save();
                                }
                            }
                        }
                        var result = reviewWords(theUser, message.chat.id);
                        if (result == false) {
                            newWords(theUser, message.chat.id);
                        }
                    }
                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    else if (message.text == JSON.parse(reviewQuestionOpt.reply_markup).keyboard[1][0]) {    ///////I don't Know the word
                        if (theUser.askedWordId) {
                            function findWordInArray1(word) {
                                return word.wordId == theUser.askedWordId;
                            }

                            var foundWordInArray1 = theUser.userWords.find(findWordInArray1);
                            if (foundWordInArray1) {
                                if (foundWordInArray1.wordBox < 8) {
                                    foundWordInArray1.wordBox = 1;
                                }
                                theUser.askedWordId = 0;
                                wordModel.findOne({word_id: foundWordInArray1.wordId}, function (err, forgottenWord) {
                                    ///////display forgotten word
                                    var result = theBot.sendMessage(message.chat.id, reviewForgottenMessage
                                        , forgottenWordOpt);
                                    result.then(function (val) {
                                        sendWordInfo(forgottenWord, forgottenWordOpt, message.chat.id);
                                    });
                                });
                                ///////////////end display forgotten word
                                foundWordInArray1.lastCheck = new Date();
                                foundWordInArray1.newWord = false;
                                theUser.save();
                            }
                        }
                        if (theUser.maxWordId) {
                            function findWordInArray1(word) {
                                return word.wordId == theUser.maxWordId;
                            }

                            var foundWordInArray1 = theUser.userWords.find(findWordInArray1);
                            if (foundWordInArray1) {
                                if (foundWordInArray1.wordBox == 0) {
                                    foundWordInArray1.wordBox = 1;
                                    theUser.save();
                                    wordModel.findOne({word_id: foundWordInArray1.wordId}, function (err, forgottenWord) {
                                        ///////display forgotten word
                                        sendWordInfo(forgottenWord, forgottenWordOpt, message.chat.id);
                                    });
                                }
                            }
                        }
                    }
                    ////////////////////////////////////////////////////////////newWord
//////////////////////////////////////////////////////////////////////////////////////////////////
                    if (message.text == JSON.parse(reviewQuestionOpt.reply_markup).keyboard[2][0]) { ////////////////Finish
                        function findWordInArray(word) {
                            return word.wordId == (theUser.maxWordId);
                        }

                        var foundWordInArray = theUser.userWords.find(findWordInArray);
                        if (foundWordInArray) {
                            if (foundWordInArray.wordBox == 0) {
                                foundWordInArray.remove();
                                if (theUser.maxWordId > 0) {
                                    theUser.maxWordId--;
                                }
                                theUser.save();
                            }
                        }
                        theBot.sendMessage(message.chat.id, finishNewWordMessage, continueLearningopt);
                    }

                    else if (message.text == JSON.parse(forgottenWordOpt.reply_markup).keyboard[0][0]) { //// I've learned forgotten word
                        var result = reviewWords(theUser, message.chat.id);
                        if (result == false) {
                            newWords(theUser, message.chat.id);
                        }
                    }
                }
                else if (theUser.askedRegistering=="Email"){
                    var res=validator.isEmail(message.text);
                    if (res==true) {
                        theUser.email=message.text;
                        theUser.askedRegistering="Phone";
                        theUser.save();
                        theBot.sendMessage(message.chat.id,EnterPhoneMessage);
                    }
                    else{
                        theBot.sendMessage(message.chat.id,InvalidEmailMessage);
                    }
                }
                else if (theUser.askedRegistering=="Phone"){
                    var res=validator.isNumeric(message.text);
                    if (res==true&&message.text.length==11) {
                        theUser.phone=message.text;
                        theUser.askedRegistering="Registered";
                        theUser.save();
                        theBot.sendMessage(message.chat.id,signupSuccessMessage,afterMembershipOpt);
                    }
                    else
                        theBot.sendMessage(message.chat.id,InvalidPhoneMessage);
                }
            }
        });
        /////////////////////////////////////////////////////////////Review Response
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Callback Queries///////////////////////////////////////////////////

theBot.on("callback_query", function onCallbackQuery(callbackQuery) {
    if (callbackQuery.data=="learn_accepted" || callbackQuery.data=="learn_rejected") {
        if (callbackQuery.data=="learn_accepted") {
            var result=theBot.sendMessage(callbackQuery.message.chat.id,welcomingMessageSignup);
            result.then(function (val) {
                theBot.sendMessage(callbackQuery.message.chat.id,signupAlert,signupOpt);
                theBot.answerCallbackQuery(callbackQuery.id);
            });

        }
        else if (callbackQuery.data=="learn_rejected") {
            theBot.sendMessage(callbackQuery.message.chat.id,learnRejectMessage);
            theBot.answerCallbackQuery(callbackQuery.id);
        }
    }


    else if (callbackQuery.data=="signup_accepted" || callbackQuery.data=="signup_rejected") {
        if (callbackQuery.data=="signup_accepted"){
            userModel.findOne({userId:callbackQuery.from.id},function (err,theUser) {
                if (theUser) {
                    if (theUser.askedRegistering=="Email") {
                        theBot.sendMessage(callbackQuery.message.chat.id,EnterEmailMessage);
                    }
                    else if(theUser.askedRegistering=="Phone"){
                        theBot.sendMessage(callbackQuery.message.chat.id,EnterPhoneMessage);
                    }
                }
                else {
                    theBot.sendMessage(callbackQuery.message.chat.id, EnterEmailMessage);
                    var newUser = new userModel({
                        firstName: callbackQuery.from.first_name,
                        lastName: callbackQuery.from.last_name,
                        email: "",
                        phone: "",
                        userId: callbackQuery.from.id,
                        password: null,
                        level: 0,
                        userType: "beginner",
                        dayScore: 0,
                        monthScore: 0,
                        overallScore: 0,
                        maxWordId: 0,
                        askedWordId: 0,
                        askedRegistering: "Email",
                        userWords: []
                    });
                    newUser.save();
                }
            });
            theBot.answerCallbackQuery(callbackQuery.id);
        }
        else if (callbackQuery.data=="signup_rejected") {
            theBot.sendMessage(callbackQuery.message.chat.id,signupRejectMessage);
            theBot.answerCallbackQuery(callbackQuery.id);
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////Start Learning///////////////////////////////////
    if (callbackQuery.data=="start_learning") {
        theBot.answerCallbackQuery(callbackQuery.id);
        userModel.findOne({userId:callbackQuery.from.id},function (err,theUser) {

            var newWordCount = 0;
            if (theUser) {
                newWords(theUser,callbackQuery.message.chat.id);
            }
            else {
                theBot.sendMessage(callbackQuery.message.chat.id, "Error:User not found");
                theBot.answerCallbackQuery(callbackQuery.id);
            }
        });
    }


 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////Continue Learning////////////////////////////////////////////////////


    if (callbackQuery.data == "continue_learning") {
        result = theBot.sendMessage(callbackQuery.message.chat.id, startReviewMessage, removeOpt);
        theBot.answerCallbackQuery(callbackQuery.id);
        result.then(function (val) {
            userModel.findOne({userId: callbackQuery.from.id}, function (err, theUser) {
                if (theUser) {
                    var result = reviewWords(theUser, callbackQuery.message.chat.id);
                    if (result == false) {
                        newWords(theUser,callbackQuery.message.chat.id);
                    }
                }
                else {
                    theBot.sendMessage(callbackQuery.message.chat.id, "Error:User not found");
                }
            });
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////see Meaning
    if (callbackQuery.data=="see_meaning") {

        theBot.answerCallbackQuery(callbackQuery.id);
        userModel.findOne({userId: callbackQuery.from.id}, function (err, theUser) {
            if (theUser) {
                if (theUser.askedWordId) {
                    wordModel.findOne({word_id:theUser.askedWordId},function (err,foundWord) {
                        // theBot.sendMessage(callbackQuery.message.chat.id, "<strong>" + foundWord.word + " : </strong>"+
                        //         foundWord.word_noun+"-"+
                        //         foundWord.word_adj+"-"+
                        //         foundWord.word_adv+"-"+
                        //         foundWord.word_verb+"-"
                        //     , reviewQuestionOpt);
                        theBot.sendMessage(callbackQuery.message.chat.id, "<strong>" + foundWord.word + " : </strong>"+
                                foundWord.word_def_fa, reviewQuestionOpt);

                    });
                }
            }
        });
    }
});


















app.get("/",function (req,resp,next) {
    console.log("get-home");
    resp.send("This is Home Page");

});

app.get("/db_creator",function (req,resp,next) {
    resp.sendFile(__dirname+"/static/db_creator.html");
    console.log("db_creator:  get");

});

app.post("/save",function (req,resp,next) {
    myWord={
        word_id: 0,
        word : req.body.word,
        word_def : req.body.word_def,
        word_def_fa: req.body.word_def_fa,
        example: req.body.example,
        example_fa: req.body.example_fa,
        word_noun: req.body.word_noun,
        word_adj: req.body.word_adj,
        word_verb: req.body.word_verb,
        word_adv: req.body.word_adv,
        word_slang: req.body.word_slang,
        word_comment: req.body.word_comment
    };
    if ((myWord.word.length && myWord.word_def.length && myWord.word_def_fa.length &&
        myWord.example.length && myWord.example_fa.length) && (myWord.word_noun.length || myWord.word_adj.length ||
        myWord.word_verb.length || myWord.word_adv.length || myWord.word_slang.length || myWord.word_comment.length)) {

        wordModel.find({word:myWord.word},function (err,foundItem) {
           if (err) {throw err}
           else if (foundItem.length) {
               resp.json({status:false, msg:"This word is exist"});
           }
           else {
               var newWord=new wordModel({
                   word:myWord.word,
                   word_def:myWord.word_def,
                   word_def_fa:myWord.word_def_fa,
                   example:myWord.example,
                   example_fa:myWord.example_fa,
                   word_noun:myWord.word_noun,
                   word_adj:myWord.word_adj,
                   word_verb:myWord.word_verb,
                   word_adv:myWord.word_adv,
                   word_slang:myWord.word_slang,
                   word_comment:myWord.word_comment

               });
               newWord.save();
               resp.json({status:true, msg:"New word saved successfully"});
           }
        });
    }
    else {
        resp.json({status:false, msg:"Word information is not sufficient"});
    }
    //console.log(myWord);
});

app.post("/showWords", function (req,resp,next) {

    wordModel.find({}, function (err, words) {
        if (err) {
            throw err
        }
        else {
            resp.json(words);
        }

    });

});


app.post("/getWord", function (req,resp,next) {
    wordModel.findOne({word_id:req.body.idToEdit},function (err,foundWord) {
        if (err) {
            throw err
        }
        else {
            resp.json(foundWord);
        }

    });

});

app.post("/edit",function (req,resp,next) {

    if (req.body.word_id>0 && req.body.word_id<10000) {
        wordModel.findOne({word_id:req.body.word_id},function (err,foundWord) {
            if (err) {
                throw err
            }
            else {
                foundWord.word=req.body.word;
                foundWord.word_def=req.body.word_def;
                foundWord.word_def_fa=req.body.word_def_fa;
                foundWord.example=req.body.example;
                foundWord.example_fa=req.body.example_fa;
                foundWord.word_noun=req.body.word_noun;
                foundWord.word_adj=req.body.word_adj;
                foundWord.word_verb=req.body.word_verb;
                foundWord.word_adv=req.body.word_adv;
                foundWord.word_slang=req.body.word_slang;
                foundWord.word_comment=req.body.word_comment;
                foundWord.save();
                resp.json({status:true, msg:"Word updated successfully"});
            }
        });
    }
    else {
        resp.json({status:false, msg:"No word is selected"});
    }

});





var server_port = process.env.NODEJS_MONGO_PERSISTENT_SERVICE_PORT_WEB || 8080;

var server_ip_address = process.env.NODEJS_MONGO_PERSISTENT_SERVICE_HOST || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {

    console.log( "Listening on " + server_ip_address + ", server_port " + server_port  );

});
