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
app=express();
oBodyParserJson=bodyParser.json();
oBodyParserUrl=bodyParser.urlencoded({extended:true});
eval(fs.readFileSync(__dirname + '/Constants.js')+'');
eval(fs.readFileSync(__dirname + '/Functions.js')+'');

theBot=new TelegramBot("311263683:AAEuEYz6CKUCNez_IiMWnlboGpYGStZXsCA",{polling:true});

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/wordb");
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
    userId: Number,
    password: String,
    level: Number,
    userType: String,
    dayScore: Number,
    monthScore: Number,
    overallScore: Number,
    maxWordId: Number,
    askedWordId: Number,
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



theBot.on("text",function (message) {

    ///////////////////////////////////////////////////Membering
    if (message.text=="start" || message.text=="/start" || message.text=="Start") {
        userModel.find({userId:message.from.id},function (err,foundUser) {
            if (err) {throw err}
            else if(foundUser.length){

                theBot.sendMessage(message.chat.id,"To Ozvi ke");
                //now=new Date();
                //var lastcheck=new Date(Date.UTC(2017,1,23,0,0));
                //console.log(lastcheck);
                //var result=isTheTime(lastcheck,1);
                //
                // console.log(result);
            }

            else {
                var photo=__dirname+"/img/welcome1.jpg";
                var result=theBot.sendPhoto(message.chat.id,photo);
                result.then(function (val) {
                    theBot.sendMessage(message.chat.id,welcomingMessage1);
                    theBot.sendMessage(message.chat.id,welcomingMessage2,learnOpt);
                });
            }

        });
    }

    /////////////////////////////////////////////////////////////Review Response
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    if (message.text==JSON.parse(reviewQuestionOpt.reply_markup).keyboard[0][0]) {     /////////////// I Know the word
        userModel.findOne({userId:message.from.id},function (err,theUser) {
            if (theUser) {
                if (theUser.askedWordId) {
                    function findWordInArray1(word) {
                        return word.wordId == theUser.askedWordId;
                    }

                    var foundWordInArray = theUser.userWords.find(findWordInArray1);
                    if (foundWordInArray) {
                        if (foundWordInArray.wordBox < 8) {
                            foundWordInArray.wordBox++;
                        }

                        console.log(theUser.userWords.indexOf(foundWordInArray));
                        foundWordInArray.lastCheck = new Date();
                        foundWordInArray.newWord = false;
                        theUser.save();
                    }
                }




                function findWordInArray2(word) {
                    return (word.wordBox == 6)&&(isTheTime(word.lastCheck,box6_days));
                }

                var foundWordInArray = theUser.userWords.find(findWordInArray2);
                if (foundWordInArray){
                    wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                        theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                            ,reviewQuestionOptWithMeaning);

                        theUser.askedWordId=foundWord.word_id;
                        //theBot.sendMessage(message.chat.id,"aaaa",seeMeaningOpt);

                        theUser.save();
                    });

                }
                else {
                    function findWordInArray3(word) {
                        return (word.wordBox == 5)&&(isTheTime(word.lastCheck,box5_days));
                    }

                    var foundWordInArray = theUser.userWords.find(findWordInArray3);
                    if (foundWordInArray){
                        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                            theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                ,reviewQuestionOptWithMeaning);

                            theUser.askedWordId=foundWord.word_id;
                            //theBot.sendMessage(message.chat.id,"aaaa",seeMeaningOpt);
                            theUser.save();
                        });

                    }
                    else {
                        function findWordInArray4(word) {
                            return (word.wordBox == 4)&&(isTheTime(word.lastCheck,box4_days));
                        }

                        var foundWordInArray = theUser.userWords.find(findWordInArray4);
                        if (foundWordInArray){
                            wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                    ,reviewQuestionOptWithMeaning);

                                theUser.askedWordId=foundWord.word_id;
                                //theBot.sendMessage(message.chat.id,"aaaa",seeMeaningOpt);
                                theUser.save();
                            });

                        }
                        else {
                            function findWordInArray5(word) {
                                return (word.wordBox == 3)&&(isTheTime(word.lastCheck,box3_days));
                            }

                            var foundWordInArray = theUser.userWords.find(findWordInArray5);
                            if (foundWordInArray){
                                wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                    theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                        ,reviewQuestionOptWithMeaning);

                                    theUser.askedWordId=foundWord.word_id;
                                   // theBot.sendMessage(message.chat.id,"aaaa",seeMeaningOpt);
                                    theUser.save();
                                });

                            }
                            else {
                                function findWordInArray6(word) {
                                    return (word.wordBox == 2)&&(isTheTime(word.lastCheck,box2_days));
                                }

                                var foundWordInArray = theUser.userWords.find(findWordInArray6);
                                if (foundWordInArray){
                                    wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                        theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                            ,reviewQuestionOptWithMeaning);

                                        theUser.askedWordId=foundWord.word_id;
                                        ///theBot.sendMessage(message.chat.id,"aaaa",seeMeaningOpt);
                                        theUser.save();
                                    });

                                }
                                else {
                                    function findWordInArray7(word) {
                                        return (word.wordBox == 1)&&(isTheTime(word.lastCheck,box1_days));
                                    }

                                    var foundWordInArray = theUser.userWords.find(findWordInArray7);
                                    if (foundWordInArray){
                                        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                            theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                                ,reviewQuestionOptWithMeaning);

                                            theUser.askedWordId=foundWord.word_id;
                                            //theBot.sendMessage(message.chat.id,null,seeMeaningOpt);
                                            theUser.save();
                                        });

                                    }
                                    else {

                                        var newWordCount = 0;
                                        if (theUser.maxWordId >= maxDailyWords) {
                                            for (i = 0; i < maxDailyWords; i++) {
                                                function findWordInArray8(word) {
                                                    return (word.wordId == (theUser.maxWordId - i))&&(word.newWord==true);
                                                }

                                                var foundWordInArray = theUser.userWords.find(findWordInArray8);
                                                if(foundWordInArray) {
                                                    if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                                                        newWordCount++;
                                                    }
                                                }
                                            }
                                        }

                                        if (newWordCount < maxDailyWords) {
                                            if (theUser.maxWordId<allWordsNumber) {
                                                theBot.sendMessage(message.chat.id, startNewWordMessage,removeOpt);
                                                wordModel.findOne({word_id: (theUser.maxWordId + 1)}, function (err, pickedNewWord) {


                                                    async.series([
                                                        function (callback) {
                                                            var result=theBot.sendMessage(message.chat.id, "<strong>" + pickedNewWord.word + "</strong>"
                                                                , newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_noun.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                                                    pickedNewWord.word_noun, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_adj.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                                                    pickedNewWord.word_adj, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_verb.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                                                    pickedNewWord.word_verb, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_adv.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                                                    pickedNewWord.word_adv, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_slang.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                                                    pickedNewWord.word_slang, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_comment.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                                                    pickedNewWord.word_comment, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                                                pickedNewWord.word_def, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                                                pickedNewWord.word_def_fa, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + example_title + "</pre>" +
                                                                pickedNewWord.example, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                                                pickedNewWord.example_fa, newWordOpt);


                                                            result.then(function (val) {
                                                                callback(null);
                                                            })
                                                        }


                                                    ]);


                                                    theUser.userWords.push({wordId: pickedNewWord.word_id, wordBox: 1, lastCheck: new Date(), newWord:true});
                                                    theUser.maxWordId = pickedNewWord.word_id;
                                                    theUser.save();

                                                });
                                            }
                                            else {
                                                function findWordInArray9(word) {
                                                    return (word.wordBox == 1)||(word.wordBox==2)||(word.wordBox==3)||
                                                        (word.wordBox==4)||(word.wordBox==5)||(word.wordBox==6);
                                                }

                                                var foundWordInArray = theUser.userWords.find(findWordInArray9);

                                                if (foundWordInArray) {

                                                    theBot.sendMessage(message.chat.id, allWordsFinishMessage2, continueLearningopt);

                                                }
                                                else {
                                                    theBot.sendMessage(message.chat.id, finishCourseMessage);

                                                }
                                            }
                                        }
                                        else {
                                            theBot.sendMessage(message.chat.id, finishReviewMessage,continueLearningopt);

                                        }

                                    }
                                }
                            }
                        }
                    }
                }





            }
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    else if (message.text==JSON.parse(reviewQuestionOpt.reply_markup).keyboard[1][0]) {    ///////I don't Know the word
        userModel.findOne({userId:message.from.id},function (err,theUser) {
            if (theUser){
                if (theUser.askedWordId) {
                    function findWordInArray1(word) {
                        return word.wordId == theUser.askedWordId;
                    }

                    var foundWordInArray = theUser.userWords.find(findWordInArray1);
                    if (foundWordInArray) {
                        if (foundWordInArray.wordBox < 8) {
                            foundWordInArray.wordBox=1;
                        }


                        wordModel.findOne({word_id: foundWordInArray.wordId}, function (err, forgottenWord) {

                            //console.log(theUser.userWords.indexOf(foundWordInArray));
                            ///////display forgotten word
                            async.series([
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, reviewForgottenMessage
                                        , forgottenWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });

                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<strong>" + forgottenWord.word + "</strong>"
                                        , forgottenWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });

                                },
                                function (callback) {
                                    if (forgottenWord.word_noun.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                            forgottenWord.word_noun, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (forgottenWord.word_adj.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                            forgottenWord.word_adj, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (forgottenWord.word_verb.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                            forgottenWord.word_verb, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (forgottenWord.word_adv.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                            forgottenWord.word_adv, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (forgottenWord.word_slang.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                            forgottenWord.word_slang, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (forgottenWord.word_comment.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                            forgottenWord.word_comment, forgottenWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                        forgottenWord.word_def, forgottenWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                        forgottenWord.word_def_fa, forgottenWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + example_title + "</pre>" +
                                        forgottenWord.example, forgottenWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                        forgottenWord.example_fa, forgottenWordOpt);


                                    result.then(function (val) {
                                        callback(null);
                                    })
                                }


                            ]);
                        });
                        ///////////////end display forgotten word
                        foundWordInArray.lastCheck = new Date();
                        foundWordInArray.newWord = false;
                        theUser.save();


                    }
                }
            }
        });
    }
    else if (message.text==JSON.parse(reviewQuestionOpt.reply_markup).keyboard[2][0]) {
        theBot.sendMessage(message.chat.id,finishNewWordMessage,continueLearningopt);

    }
    ////////////////////////////////////////////////////////////newWord
//////////////////////////////////////////////////////////////////////////////////////////////////
    if (message.text==JSON.parse(newWordOpt.reply_markup).keyboard[0][0]) {  ////////// I Learned

        userModel.findOne({userId:message.from.id},function (err,theUser) {

            var newWordCount = 0;
            if (theUser) {
                if (theUser.maxWordId >= maxDailyWords) {
                    for (i = 0; i < maxDailyWords; i++) {
                        function findWordInArray(word) {
                            return (word.wordId == (theUser.maxWordId - i))&&(word.newWord==true);
                        }

                        var foundWordInArray = theUser.userWords.find(findWordInArray);
                        if (foundWordInArray) {
                            if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                                newWordCount++;
                            }
                        }
                    }
                }

                if (newWordCount < maxDailyWords) {
                    if (theUser.maxWordId<allWordsNumber) {
                        wordModel.findOne({word_id: (theUser.maxWordId + 1)}, function (err, pickedNewWord) {

                            console.log(pickedNewWord);

                            async.series([
                                function (callback) {
                                    var result=theBot.sendMessage(message.chat.id, "<strong>" + pickedNewWord.word + "</strong>"
                                        , newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });

                                },
                                function (callback) {
                                    if (pickedNewWord.word_noun.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                            pickedNewWord.word_noun, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (pickedNewWord.word_adj.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                            pickedNewWord.word_adj, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_verb.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                            pickedNewWord.word_verb, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_adv.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                            pickedNewWord.word_adv, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_slang.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                            pickedNewWord.word_slang, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (pickedNewWord.word_comment.length > 1) {
                                        var result = theBot.sendMessage(message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                            pickedNewWord.word_comment, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                        pickedNewWord.word_def, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                        pickedNewWord.word_def_fa, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + example_title + "</pre>" +
                                        pickedNewWord.example, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                        pickedNewWord.example_fa, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    })
                                }


                            ]);


                            theUser.userWords.push({wordId: pickedNewWord.word_id, wordBox: 1, lastCheck: new Date(), newWord:true});
                            theUser.maxWordId = pickedNewWord.word_id;
                            theUser.save();

                        });
                    }
                    else {
                        theBot.sendMessage(message.chat.id, allWordsFinishMessage,continueLearningopt);
                    }
                }
                else {
                    theBot.sendMessage(message.chat.id, maxDailyWordsLimitMessage,continueLearningopt);
                }
            }
            else {
                theBot.sendMessage(message.chat.id, "Error:User not found");
            }
        });
    }
    else if (message.text==JSON.parse(newWordOpt.reply_markup).keyboard[1][0]) { ////////////////Finish
        theBot.sendMessage(message.chat.id,finishNewWordMessage,continueLearningopt);
    }

    else if (message.text==JSON.parse(forgottenWordOpt.reply_markup).keyboard[0][0]) { //// I've learned forgotten word
        userModel.findOne({userId:message.from.id},function (err,theUser) {
            if (theUser) {

                function findWordInArray2(word) {
                    return (word.wordBox == 6)&&(isTheTime(word.lastCheck,box6_days));
                }

                var foundWordInArray = theUser.userWords.find(findWordInArray2);
                if (foundWordInArray){
                    wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                        theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                            ,reviewQuestionOptWithMeaning);

                        theUser.askedWordId=foundWord.word_id;
                        theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                        theUser.save();
                    });

                }
                else {
                    function findWordInArray3(word) {
                        return (word.wordBox == 5)&&(isTheTime(word.lastCheck,box5_days));
                    }

                    var foundWordInArray = theUser.userWords.find(findWordInArray3);
                    if (foundWordInArray){
                        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                            theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                ,reviewQuestionOptWithMeaning);

                            theUser.askedWordId=foundWord.word_id;
                            theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                            theUser.save();
                        });

                    }
                    else {
                        function findWordInArray4(word) {
                            return (word.wordBox == 4)&&(isTheTime(word.lastCheck,box4_days));
                        }

                        var foundWordInArray = theUser.userWords.find(findWordInArray4);
                        if (foundWordInArray){
                            wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                    ,reviewQuestionOptWithMeaning);

                                theUser.askedWordId=foundWord.word_id;
                                theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                                theUser.save();
                            });

                        }
                        else {
                            function findWordInArray5(word) {
                                return (word.wordBox == 3)&&(isTheTime(word.lastCheck,box3_days));
                            }

                            var foundWordInArray = theUser.userWords.find(findWordInArray5);
                            if (foundWordInArray){
                                wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                    theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                        ,reviewQuestionOptWithMeaning);

                                    theUser.askedWordId=foundWord.word_id;
                                    theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                                    theUser.save();
                                });

                            }
                            else {
                                function findWordInArray6(word) {
                                    return (word.wordBox == 2)&&(isTheTime(word.lastCheck,box2_days));
                                }

                                var foundWordInArray = theUser.userWords.find(findWordInArray6);
                                if (foundWordInArray){
                                    wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                        theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                            ,reviewQuestionOptWithMeaning);

                                        theUser.askedWordId=foundWord.word_id;
                                        theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                                        theUser.save();
                                    });

                                }
                                else {
                                    function findWordInArray7(word) {
                                        return (word.wordBox == 1)&&(isTheTime(word.lastCheck,box1_days));
                                    }

                                    var foundWordInArray = theUser.userWords.find(findWordInArray7);
                                    if (foundWordInArray){
                                        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                            theBot.sendMessage(message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                                ,reviewQuestionOptWithMeaning);

                                            theUser.askedWordId=foundWord.word_id;
                                            theBot.sendMessage(message.chat.id,"",seeMeaningOpt);
                                            theUser.save();
                                        });

                                    }
                                    else {

                                        var newWordCount = 0;
                                        if (theUser.maxWordId >= maxDailyWords) {
                                            for (i = 0; i < maxDailyWords; i++) {
                                                function findWordInArray8(word) {
                                                    return (word.wordId == (theUser.maxWordId - i))&&(word.newWord==true);
                                                }

                                                var foundWordInArray = theUser.userWords.find(findWordInArray8);
                                                if(foundWordInArray) {
                                                    if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                                                        newWordCount++;
                                                    }
                                                }
                                            }
                                        }

                                        if (newWordCount < maxDailyWords) {
                                            if (theUser.maxWordId<allWordsNumber) {
                                                theBot.sendMessage(message.chat.id, startNewWordMessage,removeOpt);
                                                wordModel.findOne({word_id: (theUser.maxWordId + 1)}, function (err, pickedNewWord) {


                                                    async.series([
                                                        function (callback) {
                                                            var result=theBot.sendMessage(message.chat.id, "<strong>" + pickedNewWord.word + "</strong>"
                                                                , newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_noun.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                                                    pickedNewWord.word_noun, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_adj.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                                                    pickedNewWord.word_adj, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_verb.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                                                    pickedNewWord.word_verb, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_adv.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                                                    pickedNewWord.word_adv, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }
                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_slang.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                                                    pickedNewWord.word_slang, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            if (pickedNewWord.word_comment.length > 1) {
                                                                var result = theBot.sendMessage(message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                                                    pickedNewWord.word_comment, newWordOpt);
                                                                result.then(function (val) {
                                                                    callback(null);
                                                                });
                                                            }
                                                            else {
                                                                callback(null);
                                                            }

                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                                                pickedNewWord.word_def, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                                                pickedNewWord.word_def_fa, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + example_title + "</pre>" +
                                                                pickedNewWord.example, newWordOpt);
                                                            result.then(function (val) {
                                                                callback(null);
                                                            });
                                                        },
                                                        function (callback) {
                                                            var result = theBot.sendMessage(message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                                                pickedNewWord.example_fa, newWordOpt);


                                                            result.then(function (val) {
                                                                callback(null);
                                                            })
                                                        }


                                                    ]);


                                                    theUser.userWords.push({wordId: pickedNewWord.word_id, wordBox: 1, lastCheck: new Date(), newWord:true});
                                                    theUser.maxWordId = pickedNewWord.word_id;
                                                    theUser.save();

                                                });
                                            }
                                            else {
                                                function findWordInArray9(word) {
                                                    return (word.wordBox == 1)||(word.wordBox==2)||(word.wordBox==3)||
                                                        (word.wordBox==4)||(word.wordBox==5)||(word.wordBox==6);
                                                }

                                                var foundWordInArray = theUser.userWords.find(findWordInArray9);

                                                if (foundWordInArray) {

                                                    theBot.sendMessage(message.chat.id, allWordsFinishMessage2, continueLearningopt);

                                                }
                                                else {
                                                    theBot.sendMessage(message.chat.id, finishCourseMessage);

                                                }
                                            }
                                        }
                                        else {
                                            theBot.sendMessage(message.chat.id, finishReviewMessage,continueLearningopt);

                                        }

                                    }
                                }
                            }
                        }
                    }
                }





            }
        });
    }



    //////////////////////Sign up
    /*else if (message.text==JSON.parse(signupOpt.reply_markup).keyboard[0][0] ||
        JSON.parse(signupOpt.reply_markup).keyboard[1][0]) {
        ////////////////////////////////Sign Up Accepted
        if (message.text==JSON.parse(signupOpt.reply_markup).keyboard[0][0]) {

            var newUser=userModel
            theBot.sendMessage(message.chat.id,signupSuccessMessage);
        }
        ///////////////////////////////Sign Up Rejected
        else if (message.text==JSON.parse(signupOpt.reply_markup).keyboard[1][0]) {
            theBot.sendMessage(message.chat.id,signupRejectMessage);
        }
    }*/


});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Callback Queries///////////////////////////////////////////////////

theBot.on("callback_query", function onCallbackQuery(callbackQuery) {
    if (callbackQuery.data=="learn_accepted" || callbackQuery.data=="learn_rejected") {
        if (callbackQuery.data=="learn_accepted") {
            theBot.sendMessage(callbackQuery.message.chat.id,welcomingMessageSignup);
            theBot.sendMessage(callbackQuery.message.chat.id,signupAlert,signupOpt);
            theBot.answerCallbackQuery(callbackQuery.id);
        }
        else if (callbackQuery.data=="learn_rejected") {
            theBot.sendMessage(callbackQuery.message.chat.id,learnRejectMessage);
            theBot.answerCallbackQuery(callbackQuery.id);
        }
    }


    else if (callbackQuery.data=="signup_accepted" || callbackQuery.data=="signup_rejected") {
        if (callbackQuery.data=="signup_accepted"){
            var newUser=new userModel({
                firstName: callbackQuery.from.first_name,
                lastName: callbackQuery.from.last_name,
                userId: callbackQuery.from.id,
                password: null,
                level: 0,
                userType: "beginner",
                dayScore: 0,
                monthScore: 0,
                overallScore: 0,
                maxWordId: 0,
                askedWordId: 0,
                userWords: []
            });
            newUser.save();
            theBot.sendMessage(callbackQuery.message.chat.id,signupSuccessMessage,afterMembershipOpt);
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
        userModel.findOne({userId:callbackQuery.from.id},function (err,theUser) {

            var newWordCount = 0;
            if (theUser) {
                if (theUser.maxWordId >= maxDailyWords) {
                    for (i = 0; i < maxDailyWords; i++) {
                        function findWordInArray(word) {
                            return (word.wordId == (theUser.maxWordId - i))&&(word.newWord==true);
                        }

                        var foundWordInArray = theUser.userWords.find(findWordInArray);
                        if(foundWordInArray) {
                            if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                                newWordCount++;
                            }
                        }
                    }
                }

                if (newWordCount < maxDailyWords) {
                    if (theUser.maxWordId<allWordsNumber) {
                        theBot.sendMessage(callbackQuery.message.chat.id, startNewWordMessage,removeOpt);
                        console.log(newWordCount);
                        wordModel.findOne({word_id: (theUser.maxWordId + 1)}, function (err, pickedNewWord) {

                            console.log(pickedNewWord);

                            async.series([
                                function (callback) {
                                    var result=theBot.sendMessage(callbackQuery.message.chat.id, "<strong>" + pickedNewWord.word + "</strong>"
                                        , newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });

                                },
                                function (callback) {
                                    if (pickedNewWord.word_noun.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                            pickedNewWord.word_noun, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (pickedNewWord.word_adj.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                            pickedNewWord.word_adj, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_verb.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                            pickedNewWord.word_verb, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_adv.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                            pickedNewWord.word_adv, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }
                                },
                                function (callback) {
                                    if (pickedNewWord.word_slang.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                            pickedNewWord.word_slang, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    if (pickedNewWord.word_comment.length > 1) {
                                        var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                            pickedNewWord.word_comment, newWordOpt);
                                        result.then(function (val) {
                                            callback(null);
                                        });
                                    }
                                    else {
                                        callback(null);
                                    }

                                },
                                function (callback) {
                                    var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                        pickedNewWord.word_def, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                        pickedNewWord.word_def_fa, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + example_title + "</pre>" +
                                        pickedNewWord.example, newWordOpt);
                                    result.then(function (val) {
                                        callback(null);
                                    });
                                },
                                function (callback) {
                                    var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                        pickedNewWord.example_fa, newWordOpt);
                                    theBot.answerCallbackQuery(callbackQuery.id);

                                    result.then(function (val) {
                                        callback(null);
                                    })
                                }


                            ]);


                            theUser.userWords.push({wordId: pickedNewWord.word_id, wordBox: 1, lastCheck: new Date(), newWord: true});
                            theUser.maxWordId = pickedNewWord.word_id;
                            theUser.save();

                        });
                    }
                    else {
                        theBot.sendMessage(callbackQuery.message.chat.id, allWordsFinishMessage,continueLearningopt);
                        theBot.answerCallbackQuery(callbackQuery.id);
                    }
                }
                else {
                    theBot.sendMessage(callbackQuery.message.chat.id, maxDailyWordsLimitMessage,continueLearningopt);
                    theBot.answerCallbackQuery(callbackQuery.id);
                }
            }
            else {
                theBot.sendMessage(callbackQuery.message.chat.id, "Error:User not found");
                theBot.answerCallbackQuery(callbackQuery.id);
            }
        });
    }


 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////Continue Learning////////////////////////////////////////////////////


    if (callbackQuery.data=="continue_learning") {
        result=theBot.sendMessage(callbackQuery.message.chat.id,startReviewMessage,removeOpt);
        theBot.answerCallbackQuery(callbackQuery.id);
        result.then(function (val) {


        userModel.findOne({userId:callbackQuery.from.id},function (err,theUser) {
           if (theUser){
               function findWordInArray(word) {
                   return (word.wordBox == 6)&&(isTheTime(word.lastCheck,box6_days));
               }

               var foundWordInArray = theUser.userWords.find(findWordInArray);
               if (foundWordInArray){
                   wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                       theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                           ,reviewQuestionOptWithMeaning);

                       theUser.askedWordId=foundWord.word_id;
                       //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                       theUser.save();
                   });

               }
               else {
                   function findWordInArray(word) {
                       return (word.wordBox == 5)&&(isTheTime(word.lastCheck,box5_days));
                   }

                   var foundWordInArray = theUser.userWords.find(findWordInArray);
                   if (foundWordInArray){
                       wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                           theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                               ,reviewQuestionOptWithMeaning);

                           theUser.askedWordId=foundWord.word_id;
                           //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                           theUser.save();
                       });

                   }
                   else {
                       function findWordInArray(word) {
                           return (word.wordBox == 4)&&(isTheTime(word.lastCheck,box4_days));
                       }

                       var foundWordInArray = theUser.userWords.find(findWordInArray);
                       if (foundWordInArray){
                           wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                               theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                   ,reviewQuestionOptWithMeaning);

                               theUser.askedWordId=foundWord.word_id;
                               //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                               theUser.save();
                           });

                       }
                       else {
                           function findWordInArray(word) {
                               return (word.wordBox == 3)&&(isTheTime(word.lastCheck,box3_days));
                           }

                           var foundWordInArray = theUser.userWords.find(findWordInArray);
                           if (foundWordInArray){
                               wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                   theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                       ,reviewQuestionOptWithMeaning);

                                   theUser.askedWordId=foundWord.word_id;
                                   //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                                   theUser.save();
                               });

                           }
                           else {
                               function findWordInArray(word) {
                                   return (word.wordBox == 2)&&(isTheTime(word.lastCheck,box2_days));
                               }

                               var foundWordInArray = theUser.userWords.find(findWordInArray);
                               if (foundWordInArray){
                                   wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                       theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                           ,reviewQuestionOptWithMeaning);

                                       theUser.askedWordId=foundWord.word_id;
                                       //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                                       theUser.save();
                                   });

                               }
                               else {
                                   function findWordInArray(word) {
                                       return (word.wordBox == 1)&&(isTheTime(word.lastCheck,box1_days));
                                   }

                                   var foundWordInArray = theUser.userWords.find(findWordInArray);
                                   if (foundWordInArray){
                                       wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                           theBot.sendMessage(callbackQuery.message.chat.id,"<strong>"+foundWord.word+" ??</strong>"
                                               ,reviewQuestionOptWithMeaning);

                                           theUser.askedWordId=foundWord.word_id;
                                           //theBot.sendMessage(callbackQuery.message.chat.id,"",seeMeaningOpt);
                                           theUser.save();
                                       });

                                   }
                                   else {

                                       var newWordCount = 0;
                                       if (theUser.maxWordId >= maxDailyWords) {
                                           for (i = 0; i < maxDailyWords; i++) {
                                               function findWordInArray(word) {
                                                   return (word.wordId == (theUser.maxWordId - i))&&(word.newWord==true);
                                               }

                                               var foundWordInArray = theUser.userWords.find(findWordInArray);
                                               if(foundWordInArray) {
                                                   if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                                                       newWordCount++;
                                                   }
                                               }
                                           }
                                       }

                                       if (newWordCount < maxDailyWords) {
                                           if (theUser.maxWordId<allWordsNumber) {
                                               result = theBot.sendMessage(callbackQuery.message.chat.id, startNewWordMessage, removeOpt);
                                               result.then(function (val) {


                                               wordModel.findOne({word_id: (theUser.maxWordId + 1)}, function (err, pickedNewWord) {


                                                   async.series([
                                                       function (callback) {
                                                           var result = theBot.sendMessage(callbackQuery.message.chat.id, "<strong>" + pickedNewWord.word + "</strong>"
                                                               , newWordOpt);
                                                           result.then(function (val) {
                                                               callback(null);
                                                           });

                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_noun.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_noun_title + "</pre>" +
                                                                   pickedNewWord.word_noun, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }

                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_adj.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_adj_title + "</pre>" +
                                                                   pickedNewWord.word_adj, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }
                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_verb.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_verb_title + "</pre>" +
                                                                   pickedNewWord.word_verb, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }
                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_adv.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_adv_title + "</pre>" +
                                                                   pickedNewWord.word_adv, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }
                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_slang.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_slang_title + "</pre>" +
                                                                   pickedNewWord.word_slang, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }

                                                       },
                                                       function (callback) {
                                                           if (pickedNewWord.word_comment.length > 1) {
                                                               var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_comment_title + "</pre>" +
                                                                   pickedNewWord.word_comment, newWordOpt);
                                                               result.then(function (val) {
                                                                   callback(null);
                                                               });
                                                           }
                                                           else {
                                                               callback(null);
                                                           }

                                                       },
                                                       function (callback) {
                                                           var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_def_title + "</pre>" +
                                                               pickedNewWord.word_def, newWordOpt);
                                                           result.then(function (val) {
                                                               callback(null);
                                                           });
                                                       },
                                                       function (callback) {
                                                           var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + word_def_fa_title + "</pre>" +
                                                               pickedNewWord.word_def_fa, newWordOpt);
                                                           result.then(function (val) {
                                                               callback(null);
                                                           });
                                                       },
                                                       function (callback) {
                                                           var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + example_title + "</pre>" +
                                                               pickedNewWord.example, newWordOpt);
                                                           result.then(function (val) {
                                                               callback(null);
                                                           });
                                                       },
                                                       function (callback) {
                                                           var result = theBot.sendMessage(callbackQuery.message.chat.id, "<pre>" + example_fa_title + "</pre>" +
                                                               pickedNewWord.example_fa, newWordOpt);
                                                           theBot.answerCallbackQuery(callbackQuery.id);

                                                           result.then(function (val) {
                                                               callback(null);
                                                           })
                                                       }


                                                   ]);


                                                   theUser.userWords.push({
                                                       wordId: pickedNewWord.word_id,
                                                       wordBox: 1,
                                                       lastCheck: new Date(),
                                                       newWord: true
                                                   });
                                                   theUser.maxWordId = pickedNewWord.word_id;
                                                   theUser.save();

                                               });
                                           });
                                           }
                                           else {
                                               function findWordInArray(word) {
                                                   return (word.wordBox == 1)||(word.wordBox==2)||(word.wordBox==3)||
                                                       (word.wordBox==4)||(word.wordBox==5)||(word.wordBox==6);
                                               }

                                               var foundWordInArray = theUser.userWords.find(findWordInArray);

                                               if (foundWordInArray) {

                                                   theBot.sendMessage(callbackQuery.message.chat.id, allWordsFinishMessage2, continueLearningopt);
                                                   theBot.answerCallbackQuery(callbackQuery.id);
                                               }
                                               else {
                                                   theBot.sendMessage(callbackQuery.message.chat.id, finishCourseMessage);
                                                   theBot.answerCallbackQuery(callbackQuery.id);
                                               }
                                           }
                                       }
                                       else {
                                           theBot.sendMessage(callbackQuery.message.chat.id, finishReviewMessage,continueLearningopt);
                                           theBot.answerCallbackQuery(callbackQuery.id);
                                       }

                                   }
                               }
                           }
                       }
                   }
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
               console.log(newWord);
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








app.listen(8000);
console.log("Server is running on port 8000");