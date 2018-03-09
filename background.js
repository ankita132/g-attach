//oauth2 auth
chrome.identity.getAuthToken(
    {'interactive': true},
    function(){
        //load Google's javascript client libraries
        window.gapi_onload = authorize;
        loadScript('https://apis.google.com/js/client.js');
    }
);

function loadScript(url){
    var request = new XMLHttpRequest();

    request.onreadystatechange = function(){
        if(request.readyState !== 4) {
            return;
        }

        if(request.status !== 200){
            return;
        }

        eval(request.responseText);
    };

    request.open('GET', url);
    request.send();
}

function authorize(){
    gapi.auth.authorize(
        {
            client_id: '692519634641-0q028cvd90d6s9teen0lg22l6treiqcu.apps.googleusercontent.coms',
            immediate: true,
            scope: 'https://www.googleapis.com/auth/gmail.modify'
        },
        function(){
            gapi.client.load('gmail', 'v1', gmailAPILoaded);
        }
    );
}

function gmailAPILoaded(){

}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello") {
            var request = gapi.client.gmail.users.drafts.list({
                'userId': 'me'
            });
            request.execute(function(resp) {
                console.log(resp);
            });
            sendResponse({farewell: "goodbye"});
        }
    });



