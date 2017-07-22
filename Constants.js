/**
 * Created by Ehsan on 16/02/2017.
 */
var allWordsNumber=504;
var welcomingMessage1="سلام. به ربات آموزش لغات کتاب 504 خوش آمدید";
var welcomingMessage2="این ربات به شما کمک می کند تا به روشی علمی و در کمترین زمان لغات کاربردی کتاب مشهور ((۵۰۴ واژه ضروری برای یادگیری زبان انگلیسی)) را یاد بگیرید"
var welcomingMessageSignup="در این ربات، در هر روز به شما تعدادی لغات جدید به علاوه مرور لغات قبلی داده می شود. سیستم به طور خودکار و بر مبنای الگوریتم جعبه لایتنر، لغاتی که باید مرور شوند را انتخاب می کند. شما فقط بلد بودن یا نبودن لغات را مشخص می کنید. هر لغت با تصویر و تلفط و جمله مثال کتاب 504 داده می شود.";
var signupAlert="شما هنوز در این ربات عضو نشده اید. برای عضویت، دکمه عضویت را فشار دهید.";
var signupSuccessMessage="شما عضو شدید";
var signupRejectMessage="باشه ولی اگه پشیمون شدی کلمه start رو به همین ربات بفرست. خداحافظ";
var learnRejectMessage="باشه. خداحافظ";
var maxDailyWordsLimitMessage="شما لغات جدید امروز را فرا گرفتید."
var maxDailyWords=5;
var finishNewWordMessage="پایان یادگیری. هر زمان که مایل به ادامه بودید، دکمه زیر را لمس کنید."
var allWordsFinishMessage="لغت جدیدی برای یادگیری وجود ندارد. شما تمام لغات بانک را خوانده اید. برای مرور، دکمه زیر را لمس کنید."
var allWordsFinishMessage2="لغت جدیدی برای یادگیری وجود ندارد. شما تمام لغات بانک را خوانده اید. برای مرور،فردا مراجعه کرده و دکمه زیر را لمس کنید."
var startReviewMessage="---------------شروع مرور---------------";
var startNewWordMessage="----------شروع یادگیری کلمات جدید----------";
var finishReviewMessage="مرور و لغات جدید امروز تمام شد. برای ادامه فردا مراجعه کنید.";
var finishCourseMessage="تبریک. شما کل این دوره را تمام کرده ای.";
var reviewForgottenMessage="شما این کلمه را فراموش کرده اید. لطفا دوباره آنرا مرور کنید.";
var audioNotExistMessage="فایل صوتی وجود ندارد.";
var EnterEmailMessage="لطفا ایمیل خود را وارد کنید";
var EnterPhoneMessage="لطفا تلفن همراه خود را وارد کنید";
var InvalidEmailMessage="ایمیل وارد شده معتبر نیست.دوباره ایمیل را وارد کنید.";
var InvalidPhoneMessage="شماره تلفن همراه وارده شده معتبر نیست. لطفا شماره را به صورت عددی و با صفر وارد کنید. مثلا 09120000000";
var reviewNewMessage="با زدن دکمه توضیحات بیشتر، معنی این کلمه را یاد بگیرید و برای ادامه دکمه یاد گرفتم را بزنید."
var word_noun_title="معنی(اسم):";
var word_adj_title="معنی(صفت):";
var word_verb_title="معنی(فعل):";
var word_adv_title="معنی(قید):";
var word_slang_title="معنی(اصطلاح):";
var word_comment_title="توضیحات:";
var word_def_title="توصیف کلمه:";
var word_def_fa_title="معنی توصیف انگلیسی:";
var example_title="مثال:";
var example_fa_title="معنی جمله مثال:";
var emojiNew="\u{1F195}";


var box1_days=1;
var box2_days=2;
var box3_days=4;
var box4_days=8;
var box5_days=16;
var box6_days=30;








var reviewQuestionOpt= {
    //reply_to_message_id: message.message_id,
    reply_markup: JSON.stringify({
        keyboard: [
            ['بلدم'],
            ['بلد نیستم'],
            ['پایان مرور']
        ],
        resize_keyboard:true
    }),
    parse_mode: "HTML"
}




var afterMembershipOpt={
    //reply_to_message_id: message.message_id,
    reply_markup:{
        inline_keyboard: [
            [{
                text:'شروع یادگیری',
                callback_data: 'start_learning'
            }]
        ]
    }
};



var learnOpt={
    //reply_to_message_id: message.message_id,
    reply_markup:{
        inline_keyboard: [
            [{
                text:'می خواهم زبان یاد بگیرم',
                callback_data: 'learn_accepted'
            }],
            [{
                text:'نمی خواهم زبان یاد بگیرم',
                callback_data: 'learn_rejected'
            }]
        ]
    }
};

var signupOpt={
    //reply_to_message_id: message.message_id,
    reply_markup:{
        inline_keyboard: [
            [{
                text:'در این ربات عضو می شوم',
                callback_data: 'signup_accepted'
            }],
            [{
                text:'در این ربات عضو نمی شوم',
                callback_data: 'signup_rejected'
            }]
        ]
    }
};

var newWordOpt={
    reply_markup:JSON.stringify({
        keyboard: [
            ['یادگرفتم'],
            ['پایان یادگیری']
        ]
    }),
    parse_mode: "HTML"
}

var forgottenWordOpt={
    reply_markup:JSON.stringify({
        keyboard: [
            ['کلمه را یاد گرفتم.ادامه بده']
        ],
        resize_keyboard:true
    }),
    parse_mode: "HTML"
}

var continueLearningopt={
    reply_markup:{
        inline_keyboard: [
            [{
                text:'ادامه یادگیری',
                callback_data: 'continue_learning'
            }]
        ]
    }
}


var seeMeaningOpt={
    reply_markup:{
        inline_keyboard: [
            [{
                text:'دیدن معنی',
                callback_data: 'see_meaning'
            }]
        ]
    }
}



var removeOpt={
    reply_markup:JSON.stringify({
        keyboard: [
            []
        ]
    }),
    parse_mode: "HTML"
};

