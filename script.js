$(document).ready(function() {
    handleClientLoad();
    $('#s').keyup(function(){
        var valThis = $(this).val().toLowerCase();
        $('.attachment-container>li').each(function(){
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) > -1) ? $(this).show() : $(this).hide();
            $('.image-container').hide();
            $('.office-container').hide();
            $('.pdf-container').hide();
            $('.other-container').hide();
            $('.text').hide();

            if(valThis == ''){
                $('.image-container').show();
                $('.office-container').show();
                $('.pdf-container').show();
                $('.other-container').show();
                $('.text').show();
            }
        });
    });
    $(".dialog").before("<div class='dialogBlack'></div>");
    $(".dialog").prepend('<div id="close">☒</div>');
    $(".dialog #close, .dialog #okButton").click(function() {
        $('.dialogBlack').css("opacity", "1");
        $(".dialog p, .dialog h2").css("opacity", "0");
        $(".dialogBlack").css("opacity", "0");
        $(".dialogBlack").css("z-index", "-5");
        $("#close").css("opacity", "0");
        $("#okButton").css("opacity", "0");
        $(".dialog").css("height", "0px");
        $(".dialog").css("width", "0px");
        $(".dialog").css("margin-left", "174.5px");
        $(".dialog").css("padding", "0px");
        setTimeout(function() {
            $(".dialog").css("opacity", "0");
        }, 400);
    });
});
var c = 0, newc = 0;
var imageext = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'bmp', 'svg', 'raw'];
var officeext = ['doc', 'dot', 'wbk', 'docm', 'dotx', 'dotm', 'docb', 'docx', 'xls', 'xlt', 'xlm', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xla', 'xlam', 'xll', 'xlw', 'ppt', 'pot', 'pps', 'pptx', 'pptm', 'potx', 'potm', 'ppam', 'ppsx', 'ppsm', 'sldx', 'sldm', 'odt', 'ott', 'xml', 'wpd', 'rtf', 'txt', 'csv', 'ods', 'ots', 'odp', 'odg', 'otp'];
function signedInSuccess(){
    listMessage('me', 50,  listHandler);
}
function signedOutSuccess(){
    $('.attachment-container').html("");
    $('.image-container').html("");
    $('.office-container').html("");
    $('.pdf-container').html("");
    $('.other-container').html("");
    c = 0;
    newc = 0;
    attachmentlist = new Array();
}
function listMessage(userId, maxResults, callback)
{
    var request = gapi.client.gmail.users.messages.list({
        'userId': userId,
        'maxResults': maxResults
    });
    request.execute(function(resp){
        callback(resp);
    })
}
function listHandler(list)
{
    list = list.messages;
    console.log(list);
    for(var i = 0; i < list.length; i++)
    {
        getMessage('me', list[i].id, getAttachmentsHandler);
    }
}
function getMessage(userId, messageId, callback) {
    var request = gapi.client.gmail.users.messages.get({
        'userId': userId,
        'id': messageId
    });
    request.execute(callback);
}
function getDatefromMs(datems){
    var dateobj = new Date(datems);
    var hours = dateobj.getHours() < 10 ? "0" + dateobj.getHours() : dateobj.getHours();
    var mins = dateobj.getMinutes() < 10 ? "0" + dateobj.getMinutes() : dateobj.getMinutes();
    var date = dateobj.getDate() + "/" + (dateobj.getMonth() + 1) + "/" + dateobj.getFullYear() + "   " + hours + ":" + mins;
    return date;
}
function getAttachmentsHandler(message) {
    if((message.labelIds.indexOf("CATEGORY_SOCIAL") > -1) || (message.labelIds.indexOf("CATEGORY_PROMOTIONS") > -1) || (message.labelIds.indexOf("INBOX") == -1))
        return;
    console.log(message);
    getAttachment('me', message, fillAttachment);
}
function getAttachment(userId, message, callback) {
    if(!message.payload.parts)
        return;
    var parts = message.payload.parts;
    var internalDate = message.internalDate;
    var datems = parseFloat(internalDate);
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part.filename && part.filename.length > 0) {
            var attachId = part.body.attachmentId;
            var request = gapi.client.gmail.users.messages.attachments.get({
                'id': attachId,
                'messageId': message.id,
                'userId': userId
            });
            (function(filename,  mimeType) {
                request.execute(function(attachment) {
                    callback(filename, mimeType, attachment, datems);
                });
            })(part.filename, part.mimeType);
        }
    }
}
var attachmentlist = new Array();

function fillAttachment(filename, mimeType, attachment, datems) {
    var dataBase64Rep = attachment.data.replace(/-/g, '+').replace(/_/g, '/');
    var blob = b64toBlob(dataBase64Rep, mimeType, attachment.size);
    var blobUrl = URL.createObjectURL(blob);
    date = getDatefromMs(datems);
    var link = '<li><a href="' + blobUrl + '"  id="download-attach' + c + '" download="' + filename + '">'+filename+'<span class="date" id="date-' + c + '">' + date + '</span></a><button class="save od-' + c + '"><img src="google_drive.png" width="30" height="30"/></button></div></li>';
    var attachment = {
        'datems': datems,
        'link': link
    };
    var ext = filename.split('.').pop().toLowerCase();
    if(imageext.indexOf(ext) > -1)
        attachment.type = 'image';
    else if(officeext.indexOf(ext) > -1)
        attachment.type = 'office';
    else if(ext == 'pdf')
        attachment.type = 'pdf';
    else
        attachment.type = 'other';
    attachmentlist.push(attachment);
    c++;
}

setInterval(function(){
    if(newc != c){
        console.log(attachmentlist);
        newc = c;
        showAttachments();
    }
}, 1000);
function showAttachments() {
    $(".attachment-container").empty();
    $(".image-container").empty();
    $(".office-container").empty();
    $(".pdf-container").empty();
    $(".other-container").empty();
    newlist = new Array();
    keys = new Array();
    attachmentlist.sort(function (a, b) {
        var keya = a.datems, keyb = b.datems;
        if(keya < keyb) return 1;
        else if(keya > keyb) return -1;
        else return 0;
    });
    console.log(attachmentlist);
    for (var i = 0; i < attachmentlist.length; i++) {
        var link = attachmentlist[i].link;
        var type = attachmentlist[i].type;
        $(".attachment-container").append(link);
        if (type=='image')
            $('.image-container').append(link);
        else if (type=='office')
            $('.office-container').append(link);
        else if (type == 'pdf')
            $('.pdf-container').append(link);
        else
            $('.other-container').append(link);
        $('.od-' + c).on('click', function () {
            insertFile(filename, mimeType, dataBase64Rep, '')
        });
    }
}
function insertFile(filename, mimeType, dataBase64Rep, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var contentType = mimeType || 'application/octet-stream';
    var metadata = {
        'title': filename,
        'mimeType': contentType
    };

    var base64Data = dataBase64Rep;
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
        callback = function(file) {
            console.log(file)
        };
    }
    request.execute(callback);
    $('.dialogBlack').css("opacity", "0.5");
    $(".dialog").css("display", "block");
    $(".dialogBlack").css("opacity", "0.5");
    $(".dialogBlack").css("z-index", "250");
    $(".dialog p, .dialog h2").css("opacity", "1");
    $("#close").css("opacity", "1");
    $("#okButton").css("opacity", "1");
    $(".dialog").css("height", "185px");
    $(".dialog").css("width", "300px");
    $(".dialog").css("padding", "15px");
    $(".dialog").css("margin-left", "-174.5px");
    setTimeout(function() {
      $(".dialog").css("opacity", "1");
    }, 400);
}
