/**
 * Created by Ehsan on 29/06/2017.
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////newWord
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


                        if (pickedNewWord){
                            sendWordInfo(pickedNewWord,newWordOpt,message.chat.id);
                        }


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
///////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////seeMore

if (callbackQuery.data=="see_more"){
    theBot.answerCallbackQuery(callbackQuery.id);
    userModel.findOne({userId: callbackQuery.from.id}, function (err,theUser) {
        if (theUser){
            if (theUser.maxWordId){
                wordModel.findOne({word_id:theUser.maxWordId}, function (err,foundword) {
                    sendWordInfo(foundword,reviewQuestionOpt,callbackQuery.message.chat.id);
                });
            }
        }
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var newWordQuestionOpt={
    //reply_to_message_id: message.message_id,

};