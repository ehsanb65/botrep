/**
 * Created by Ehsan on 19/12/2016.
 */
$(document).ready(function () {
    var errorBox=$("div.alert-danger");
    var successBox=$("div.alert-success");
    $("#edit").hide();
    $("#save").show();


    $("#save").click(function () {
        $.post("/save", {
            word: $("#word").val(),
            word_def: $("#word_def").val(),
            word_def_fa: $("#word_def_fa").val(),
            example: $("#example").val(),
            example_fa: $("#example_fa").val(),
            word_noun: $("#word_noun").val(),
            word_adj: $("#word_adj").val(),
            word_verb: $("#word_verb").val(),
            word_adv: $("#word_adv").val(),
            word_slang: $("#word_slang").val(),
            word_comment: $("#word_comment").val()
        },function (data) {
            //$("#info").append("<p>"+data.status+"||"+data.msg+"</p>");
            if(data.status) {
                successBox.slideUp(1);
                errorBox.slideUp(1);
                successBox.html(data.msg).slideDown(500);
                resetForm();
            }
            else{
                successBox.slideUp(1);
                errorBox.slideUp(1);
                errorBox.html(data.msg).slideDown(500);
            }
        });
    });
    
    
    $("#showWords").click(function () {
        $.post("/showWords",{},function (data) {
            $("#savedWords").html("<tr><td width='2%' style='font-weight: bold'>ID</td><td width='5%'" +
                " style='font-weight: bold'>Word</td><td width='12%' style='font-weight: bold'>Word Definition</td>" +
                "<td width='12%' style='font-weight: bold'>Word Definition Farsi</td><td width='15%' " +
                "style='font-weight: bold'>Example</td><td width='15%' style='font-weight: bold'>Example Farsi</td>" +
                "<td width='5%' style='font-weight: bold'>Noun</td><td width='5%' style='font-weight: bold'>Adjective" +
                "</td><td width='5%' style='font-weight: bold'>Verb</td><td width='5%' style='font-weight: bold'>" +
                "Adverb</td><td width='10%' style='font-weight: bold'>Slang</td><td width='10%' style=" +
                "'font-weight: bold'>Comment</td></tr>") ;
            data.forEach(function (word , index) {
                console.log(index , word) ;
                $("#savedWords").append("<tr><td><strong> " + word.word_id +
                    " </strong></td><td style='font-size: x-small'>"+ word.word +
                    "</td><td style='font-size: x-small'>"+word.word_def+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.word_def_fa+
                    "</td><td style='font-size: x-small'>"+ word.example+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.example_fa+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.word_noun+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+ word.word_adj+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.word_verb+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.word_adv+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+ word.word_slang+
                    "</td><td style='font-family: Tahoma;font-size: x-small'>"+word.word_comment+"</td></tr>") ;
            });

            $("#savedWords").find("td").click(function () {
                var clickedId=$(this).siblings(":first").text();
                $.post("/getWord",{idToEdit:parseInt(clickedId)},function (data) {

                    $("#word").val(data.word);
                    $("#word_def").val(data.word_def);
                    $("#word_def_fa").val(data.word_def_fa);
                    $("#example").val(data.example);
                    $("#example_fa").val(data.example_fa);
                    $("#word_noun").val(data.word_noun);
                    $("#word_adj").val(data.word_adj);
                    $("#word_verb").val(data.word_verb);
                    $("#word_adv").val(data.word_adv);
                    $("#word_slang").val(data.word_slang);
                    $("#word_comment").val(data.word_comment);
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $("#pageTitle").html("You are editing the word with ID: ");
                    $("#idToEdit").html(data.word_id);
                    $("#pageTitle").attr("style","color:red");
                    $("#idToEdit").attr("style","color:blue");
                    $("#edit").show();
                    $("#save").hide();

                });
            });
        });
    });

    $("#edit").click(function () {
        $.post("/edit",
        {
            word_id: parseInt($("#idToEdit").text()),
            word: $("#word").val(),
            word_def: $("#word_def").val(),
            word_def_fa: $("#word_def_fa").val(),
            example: $("#example").val(),
            example_fa: $("#example_fa").val(),
            word_noun: $("#word_noun").val(),
            word_adj: $("#word_adj").val(),
            word_verb: $("#word_verb").val(),
            word_adv: $("#word_adv").val(),
            word_slang: $("#word_slang").val(),
            word_comment: $("#word_comment").val()
        }, function (data) {
                if(data.status) {
                    successBox.slideUp(1);
                    errorBox.slideUp(1);
                    successBox.html(data.msg).slideDown(500);
                    resetForm();
                }
                else{
                    successBox.slideUp(1);
                    errorBox.slideUp(1);
                    errorBox.html(data.msg).slideDown(500);
                }
            });

    });



/*    $("#logout").click(function () {
        console.log("logout clicked");
        $("#commentBox").empty();
        $.post("/logout",function (data) {
            //$("#info").append("<p>"+data.status+"||"+data.msg+"</p>");
            if (data.status) {
                successBox.slideUp(1);
                errorBox.slideUp(1);
                successBox.html(data.msg).slideDown(500);
                getInfo();
            }
            else{
                successBox.slideUp(1);
                errorBox.slideUp(1);
                errorBox.html(data.msg).slideDown(500);
            }
        });
    });


    $("#signup").click(function () {
        $.post("/signup",{name:$("#signupName").val(),username:$("#signupUser").val(), password:$("#signupPass").val(),
            email:$("#signupEmail").val()}, function (data) {
            //$("#info").append("<p>"+data.status+"||"+data.msg+"</p>");
            if (data.status) {
                successBox.slideUp(1);
                errorBox.slideUp(1);
                successBox.html(data.msg).slideDown(500);
            }
            else {
                successBox.slideUp(1);
                errorBox.slideUp(1);
                errorBox.html(data.msg).slideDown(500);
            }
        });
    });




   $("#sendComment").click(function () {
       $.post("/submitComment", {msg: $("#msg").val()}, function (data) {
           console.log(data);
           //$("#info").append("<p>" + data.status + "||" + data.msg + "</p>");
           if (data.status) {
               successBox.slideUp(1);
               errorBox.slideUp(1);
               successBox.html(data.msg).slideDown(500);
           }
           else {
               successBox.slideUp(1);
               errorBox.slideUp(1);
               errorBox.html(data.msg).slideDown(500);
           }
           getComment();

       });
   });

   var getComment = function () {
       $.post("/getComment",{},function (data) {
           $("#commentBox").empty();
           data.forEach(function (cm,index) {
               $("#commentBox").append("<li style='padding: 1.5%' class='list-group-item list-group-item-info'><strong>"
                   +cm.user+"  : </strong>"+cm.text+"<button style='float:right' class='btn btn-primary' type='button'>"
                   +"Likes <span class='badge'>" +cm.like+"</span> </button> </li>");
           });


       });

   };

   var getInfo= function () {
       $.post("/getInfo", function (data) {
           if (data.auth) {
               $("#login_signup").empty();
               $("#authInfo").html(data.auth.username);
               //$("#info").append("<p> you are already login </p>" +"<p>Hello "+data.auth.username+"</p>");
               $("#sendComment_div").append("<button id='logout' class='btn btn-success'>Logout</button>");

               getComment();
               $("#logout").click(function () {
                   console.log("logout clicked");
                   $.post("/logout",function (data) {
                       $("#commentBox").empty();
                       $("#sendComment_div").empty();
                       $("#authInfo").html("Unknown User");
                       if (data.status) {
                           successBox.slideUp(1);
                           errorBox.slideUp(1);
                           successBox.html(data.msg).slideDown(500);
                       }
                       else {
                           successBox.slideUp(1);
                           errorBox.slideUp(1);
                           errorBox.html(data.msg).slideDown(500);
                       }
                       //$("#info").append("<p>"+data.status+"||"+data.msg+"</p>");
                   });
               });
           }
       });
   };

   getInfo();*/


var resetForm=function() {
    $("#word").val("");
    $("#word_def").val("");
    $("#word_def_fa").val("");
    $("#example").val("");
    $("#example_fa").val("");
    $("#word_noun").val("")
    $("#word_adj").val("");
    $("#word_verb").val("");
    $("#word_adv").val("");
    $("#word_slang").val("");
    $("#word_comment").val("");

    $("#word_noun_check").prop("checked", false);
    $("#word_adj_check").prop("checked", false);
    $("#word_verb_check").prop("checked", false);
    $("#word_adv_check").prop("checked", false);
    $("#word_slang_check").prop("checked", false);
    $("#word_comment_check").prop("checked", false);


    $("#word_noun").attr("disabled", "disabled");
    $("#word_adj").attr("disabled", "disabled");
    $("#word_verb").attr("disabled", "disabled");
    $("#word_adv").attr("disabled", "disabled");
    $("#word_slang").attr("disabled", "disabled");
    $("#word_comment").attr("disabled", "disabled");

    $("#edit").hide();
    $("#save").show();

    $("#pageTitle").html("Enter New Word Information:");
    $("#idToEdit").html("");
    $("#pageTitle").attr("style","color:black");
    $("#idToEdit").attr("style","color:black");

    $("#savedWords").html("");

}


/////////////////////////////////////////////////////////////////Check Box
    $("#word_noun_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_noun").removeAttr("disabled");
            $("#word_noun").focus();
        } else {
            $("#word_noun").attr("disabled", "disabled");
            $("#word_noun").val("");
        }
    });

    $("#word_adj_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_adj").removeAttr("disabled");
            $("#word_adj").focus();
        } else {
            $("#word_adj").attr("disabled", "disabled");
            $("#word_adj").val("");
        }
    });

    $("#word_verb_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_verb").removeAttr("disabled");
            $("#word_verb").focus();
        } else {
            $("#word_verb").attr("disabled", "disabled");
            $("#word_verb").val("");
        }
    });

    $("#word_adv_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_adv").removeAttr("disabled");
            $("#word_adv").focus();
        } else {
            $("#word_adv").attr("disabled", "disabled");
            $("#word_adv").val("");
        }
    });

    $("#word_slang_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_slang").removeAttr("disabled");
            $("#word_slang").focus();
        } else {
            $("#word_slang").attr("disabled", "disabled");
            $("#word_slang").val("");
        }
    });

    $("#word_comment_check").click(function () {
        if ($(this).is(":checked")) {
            $("#word_comment").removeAttr("disabled");
            $("#word_comment").focus();
        } else {
            $("#word_comment").attr("disabled", "disabled");
            $("#word_comment").val("");
        }
    });


});




