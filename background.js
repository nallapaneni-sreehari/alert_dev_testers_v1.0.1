console.log(`Background js`);

var socket = io('http://localhost:2001',{withCredentials: true});


chrome.runtime.onMessage.addListener((request, sender) => {
    console.log(`request ::: `, request);
    
    if(request?.userName && request?.msg)
    {
        socket.emit('message', {from:request.userName, msg:request.msg, at:request.at});
    }

});

socket.on('msg-received', data=>{
    console.log(`Msg Receive from server ::: `, data);
    chrome.runtime.sendMessage(data);
})
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     console.log("Received");
//     if (request[0] == "updateStatus") {
//         console.log(request[1])
//     }
//     socket.send({"Title": "Title", "Author": "Author", "Album": "Album"})
// });

// if(Object.keys(message))
// {
//     socket.emit('message', {text:'Hello guys', from:"Sreehari"});
// }