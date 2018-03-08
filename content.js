setTimeout(function(){$(".TK").append('\
<div class="aim">\
    <div class="TO" id=":i5">\
        <div class="TN bzz aHS-bnw" style="margin-left:0px">\
            <div class="qj qr">\
            </div>\
            <div class="aio UKr6le">\
                <span class="nU "><a href="https://mail.google.com/mail/u/0/#starred" target="_top" class="J-Ke n0" title="Starred" tabindex="-1" id="attachments">Attachments</a></span>\
            </div>\
            <div class="nL aif">\
            </div>\
        </div>\
    </div>\
</div>');
$("#attachments").on('click', function(){
    $(".AO").children().hide();
});
$(".J-Ke.n0").on('click', function(){
    $(".AO").children().show();
    console.log("Showing");
});
}, 6000);
