console.log(`Background js`);
var status;

var socket = io('http://localhost:2001',{withCredentials: true});


chrome.runtime.onMessage.addListener((request, sender) => {
    console.log(`request ::: `, request);
    
    if(request?.userName && request?.msg)
    {
        socket.emit('message', {from:request.userName, msg:request.msg,roomId:request.roomId, at:request.at});
    }

});

socket.on('msg-received', async (data)=>{
    console.log(`Msg Receive from server ::: `, data);
    chrome.runtime.sendMessage(data);

    var userName = localStorage.getItem('userName');
    var roomId = localStorage.getItem('roomId');

    var status = await readStatus(userName);

    console.log(`status :::: `, status);
    
    if((userName != data.sender) && (data.allMsgs[0].roomId?.toLowerCase() == roomId?.toLowerCase()) && status != 'open')
    {
        chrome.notifications.create(
            "New Message",
            {
              type: "basic",
              iconUrl: "notification.png",
              title: "New Message",
              message: `Hey ${userName} You received a new message from ${data.sender} in ${roomId} room`,
            }
        );
    }

});

chrome.runtime.onConnect.addListener(function(port) {
    console.log(`Port ::: `, port);
    
    let status = {};

    if (port.name === "chat") {

        status.port = port.name;
        status.user = localStorage.getItem('userName');
        status.status = 'open';
        status.at = Date.now();
        
        updateStatus(status);

        port.onDisconnect.addListener(function() {
           console.log("chat has been closed");

           status.status = 'away';

           updateStatus(status);

        });
    }

});

function updateStatus(status)
{
    console.log(`Sending Status ::: `, status);
    
    fetch('http://localhost:2001/updateStatus',{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(status)
    })
    .then(res=>{return res.json()})
    .then(data=>{console.log(`Data ::: `, data);
    })
    .catch(err=>console.log(`Err ::: `, err));
}

async function readStatus(user)
{
    return new Promise((resolve, reject)=>{

        console.log(`Reading Status ::: `, user);
    
        fetch(`http://localhost:2001/readStatus/${user}`,{
            method:'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(`Data ::: `, data);
            if(data.data?.length>0)
            {
                resolve(data.data[0]?.status);
            }
            else
            {
                resolve(undefined);
            }
        })
        .catch(err=>{
            console.log(`Err ::: `, err); 
            resolve(undefined);
        });
    });
}