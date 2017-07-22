/**
 * Created by Ehsan on 24/02/2017.
 */
function isTheTime(lastDate,days) {
    var now=new Date();
    var theTime=lastDate;
    theTime.setUTCHours(0,0,1,0); //based on 3:30 morning of Iran
    if((now.valueOf()-theTime.valueOf())>days*1000*60*60*24) {
        return true;
    }
    else {
        return false;
    }


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendWordInfo(inWord,inOpt,inChatId) {
    async.series([
        function (callback) {
            var result = theBot.sendMessage(inChatId, "<strong>" + inWord.word + "</strong>" +
                "\n\n"+"<pre>--" + word_def_title + "</pre>"+
                    "\n"+inWord.word_def+
                    "\n"+ inWord.word_def_fa+
                    "\n\n"+"<pre>--" + example_title + "</pre>"+
                    "\n"+ inWord.example+
                    "\n"+ inWord.example_fa
                , inOpt);
            result.then(function (val) {
                callback(null);
            });

        }
        // function (callback) {
        //     if (inWord.word_noun.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_noun_title + "</pre>" +
        //             inWord.word_noun, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        //
        // },
        // function (callback) {
        //     if (inWord.word_adj.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_adj_title + "</pre>" +
        //             inWord.word_adj, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        // },
        // function (callback) {
        //     if (inWord.word_verb.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_verb_title + "</pre>" +
        //             inWord.word_verb, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        // },
        // function (callback) {
        //     if (inWord.word_adv.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_adv_title + "</pre>" +
        //             inWord.word_adv, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        // },
        // function (callback) {
        //     if (inWord.word_slang.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_slang_title + "</pre>" +
        //             inWord.word_slang, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        //
        // },
        // function (callback) {
        //     if (inWord.word_comment.length > 1) {
        //         var result = theBot.sendMessage(inChatId, "<pre>" + word_comment_title + "</pre>" +
        //             inWord.word_comment, inOpt);
        //         result.then(function (val) {
        //             callback(null);
        //         });
        //     }
        //     else {
        //         callback(null);
        //     }
        //
        // },
        // function (callback) {
        //     var result = theBot.sendMessage(inChatId, "<pre>" + word_def_title + "</pre>" +
        //         inWord.word_def, inOpt);
        //     result.then(function (val) {
        //         callback(null);
        //     });
        // },
        // function (callback) {
        //     var result = theBot.sendMessage(inChatId, "<pre>" + word_def_fa_title + "</pre>" +
        //         inWord.word_def_fa, inOpt);
        //     result.then(function (val) {
        //         callback(null);
        //     });
        // },
        // function (callback) {
        //     var result = theBot.sendMessage(inChatId, "<pre>" + example_title + "</pre>" +
        //         inWord.example, inOpt);
        //     result.then(function (val) {
        //         callback(null);
        //     });
        // },
        // function (callback) {
        //     var result = theBot.sendMessage(inChatId, "<pre>" + example_fa_title + "</pre>" +
        //         inWord.example_fa, inOpt);
        //
        //
        //     result.then(function (val) {
        //         callback(null);
        //     })
        // }


    ]);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function askWord(inWord,inChatId) {
    theBot.sendMessage(inChatId,"<strong>"+inWord.word+" ??</strong>"
        ,reviewQuestionOpt);
    var audio=__dirname+"/audio/"+inWord.word+".mp3";
    if (fs.existsSync(audio)){
        theBot.sendAudio(inChatId,audio,seeMeaningOpt);
    }
    else{
        theBot.sendMessage(inChatId,audioNotExistMessage,seeMeaningOpt);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function reviewWords(inUser,inChatId) {
    function findWordInArray2(word) {
        return (word.wordBox == 6)&&(isTheTime(word.lastCheck,box6_days));
    }

    var foundWordInArray = inUser.userWords.find(findWordInArray2);
    if (foundWordInArray){
        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
            askWord(foundWord,inChatId);
            inUser.askedWordId=foundWord.word_id;
            inUser.save();
        });
        return true;

    }
    else {
        function findWordInArray3(word) {
            return (word.wordBox == 5)&&(isTheTime(word.lastCheck,box5_days));
        }

        var foundWordInArray = inUser.userWords.find(findWordInArray3);
        if (foundWordInArray){
            wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                askWord(foundWord,inChatId);
                inUser.askedWordId=foundWord.word_id;
                inUser.save();
            });
            return true;

        }
        else {
            function findWordInArray4(word) {
                return (word.wordBox == 4)&&(isTheTime(word.lastCheck,box4_days));
            }

            var foundWordInArray = inUser.userWords.find(findWordInArray4);
            if (foundWordInArray){
                wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                    askWord(foundWord,inChatId);
                    inUser.askedWordId=foundWord.word_id;
                    inUser.save();
                });
                return true;

            }
            else {
                function findWordInArray5(word) {
                    return (word.wordBox == 3)&&(isTheTime(word.lastCheck,box3_days));
                }

                var foundWordInArray = inUser.userWords.find(findWordInArray5);
                if (foundWordInArray){
                    wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                        askWord(foundWord,inChatId);
                        inUser.askedWordId=foundWord.word_id;
                        inUser.save();
                    });
                    return true;

                }
                else {
                    function findWordInArray6(word) {
                        return (word.wordBox == 2)&&(isTheTime(word.lastCheck,box2_days));
                    }

                    var foundWordInArray = inUser.userWords.find(findWordInArray6);
                    if (foundWordInArray){
                        wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                            askWord(foundWord,inChatId);
                            inUser.askedWordId=foundWord.word_id;
                            inUser.save();
                        });
                        return true;

                    }
                    else {
                        function findWordInArray7(word) {
                            return (word.wordBox == 1)&&(isTheTime(word.lastCheck,box1_days));
                        }

                        var foundWordInArray = inUser.userWords.find(findWordInArray7);
                        if (foundWordInArray){
                            wordModel.findOne({word_id:foundWordInArray.wordId},function (err,foundWord) {
                                askWord(foundWord,inChatId);
                                inUser.askedWordId=foundWord.word_id;
                                inUser.save();
                            });
                            return true;
                        }
                        else{
                            return false;
                        }

                    }
                }
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function newWords(inUser,inChatId) {
    var newWordCount = 0;
    if (inUser.maxWordId >= maxDailyWords) {
        for (i = 0; i < maxDailyWords; i++) {
            function findWordInArray(word) {
                return (word.wordId == (inUser.maxWordId - i)) && (word.newWord == true);
            }

            var foundWordInArray = inUser.userWords.find(findWordInArray);
            if (foundWordInArray) {
                if (isTheTime(foundWordInArray.lastCheck, 1) == false) {
                    newWordCount++;
                }
            }
        }
    }

    if (newWordCount < maxDailyWords) {
        if (inUser.maxWordId < allWordsNumber) {

            ////////send initial message
            if (inUser.maxWordId==0){
                theBot.sendMessage(inChatId, startNewWordMessage, reviewQuestionOpt);
            }
            else {

                function findWordInArray(word) {
                    return (word.wordId == inUser.maxWordId);
                }

                var foundWordInArray = inUser.userWords.find(findWordInArray);
                if (foundWordInArray) {
                    if (foundWordInArray.newWord == false) {
                        theBot.sendMessage(inChatId, startNewWordMessage, reviewQuestionOpt);
                    }
                }
            }
            ////////////////////////////////
            wordModel.findOne({word_id: (inUser.maxWordId + 1)}, function (err, pickedNewWord) {
                if (pickedNewWord) {
                    theBot.sendMessage(inChatId, "<strong>" + pickedNewWord.word + emojiNew + "??</strong>"
                        , reviewQuestionOpt);
                    var audio = __dirname + "/audio/" + pickedNewWord.word + ".mp3";
                    if (fs.existsSync(audio)) {
                        theBot.sendAudio(inChatId, audio, reviewQuestionOpt);
                    }
                    else {
                        theBot.sendMessage(inChatId, audioNotExistMessage, reviewQuestionOpt);
                    }
                }
                inUser.userWords.push({
                    wordId: pickedNewWord.word_id,
                    wordBox: 0,
                    lastCheck: new Date(),
                    newWord: true
                });
                inUser.maxWordId = pickedNewWord.word_id;
                inUser.save();

            });
        }
        else {
            function findWordInArray9(word) {
                return (word.wordBox == 1) || (word.wordBox == 2) || (word.wordBox == 3) ||
                    (word.wordBox == 4) || (word.wordBox == 5) || (word.wordBox == 6);
            }

            var foundWordInArray = inUser.userWords.find(findWordInArray9);

            if (foundWordInArray) {
                theBot.sendMessage(inChatId, allWordsFinishMessage2, continueLearningopt);
            }
            else {
                theBot.sendMessage(inChatId, finishCourseMessage);
            }
        }
    }
    else {
        theBot.sendMessage(inChatId, finishReviewMessage, continueLearningopt);
    }
}