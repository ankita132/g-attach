
setTimeout(function(){
    $(".TK:first").append('\
    <div class="aim">\
        <div class="TO" id=":i5">\
            <div class="TN bzz aHS-bnw" style="margin-left:0px">\
                <div class="qj qr">\
                </div>\
                <div class="aio UKr6le">\
                    <span class="nU ">\
                        <a href="https://mail.google.com/mail/u/0/#starred" target="_top" class="J-Ke n0" title="Starred" tabindex="-1" id="attachments">Attachments</a>\
                    </span>\
                </div>\
                <div class="nL aif">\
                </div>\
            </div>\
        </div>\
    </div>');
    $("#attachments").on('click', function(){
        $(".AO").children().hide();
        var wrapper = "<div class='attach-wrap'></div>";
        //$(".AO").html(wrapper);
        chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
            console.log(response.farewell);
        });
    });
    $(".J-Ke.n0").not("#attachments").on('click', function(){
        $(".AO").children().show();
    });
}, 6000);
