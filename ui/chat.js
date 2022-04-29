console.log(`Chat ui called`);

var messages = [];


window.onload = function chatUi()
{
    chrome.runtime.connect({ name: "chat" });


    var name = localStorage.getItem('userName');
    var roomId = localStorage.getItem('roomId');

    fetch(`http://localhost:2001/getRoomMessages/${roomId}`,{
    method:'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    }).then(res=>{
        // console.log(`Resss :::: `, res.json());
        return res.json()
    }).then(data=>{
        console.log(`Data ::: `, data);
        messages = data.data;
        if(messages?.length > 0)
        {
            renderMessagesToUI(messages);
        }
        
    })
    .catch(err=>{console.log("Err getting messages :: ", err)});


    chrome.runtime.onMessage.addListener((request, sender) => {
        console.log(`All messages ::: `, request, request.allMsgs);
        if(request && request?.allMsgs)
        {
            messages = request.allMsgs;
            renderMessagesToUI(messages);
        }
    });

    console.log(`Name ::::: `, name);
    

    if(name && roomId)
    {
        let userNameDiv = document.getElementById('userNameDiv');

        let p = `<h1 id="heading" style="color:black; font-size:25px;" class="text-center">Hi <span style="color:blueviolet;"><b>${name+' '} &#128075;</b></span><span style="font-size:15px;">, Welcome to ${roomId}</span></h1>`

        userNameDiv.insertAdjacentHTML('afterend', p);
    }

    document.getElementById('sendMessage').onclick = function(){
        var message = document.getElementById('message').value;

        console.log(`Message chat-ui ::: `, message);

        if(message && (message !='' || message != ' '))
        {
            chrome.runtime.sendMessage({ userName: name, msg: message, roomId:roomId, at:Date.now() });
    
            messages.push({ from: name, msg: message, roomId:roomId, at:Date.now() });
    
            console.log(`Messages Array ::: `, messages);
            
            renderMessagesToUI(messages);
        }

        document.getElementById('message').value = '';
    }

    function renderMessagesToUI(msgs)
    {
        var outgoing = document.getElementsByClassName('input-group mt-2');
        var incoming = document.getElementsByClassName('input-group w-35');
        var span = document.getElementsByClassName('text-center p');

        console.log(`OUT :::: `, outgoing);

        while(outgoing?.length > 0)
        {
            outgoing[0].parentNode.removeChild(outgoing[0]);
        }
        while(incoming?.length > 0)
        {
            incoming[0].parentNode.removeChild(incoming[0]);
        }
        while(span?.length > 0)
        {
            span[0].parentNode.removeChild(span[0]);
        }

        var mainDiv = document.querySelector('#msgHolder');

        for(let m of msgs)
        {
            let template;
            console.log(`Current USer :: `, name, " m.userName :: ", m.userName, m.userName==name);
            
            if(m.from == name)
            {
                console.log(`IN IF`);

                template = `
                <div class="input-group mt-2" style="margin-right: -340px;" id="outgoing">
                    <div class="input-group w-35" style="background-color: #42ba96;border-radius: 5px; width: 186px; margin-left: 340px;margin-top: 15px; word-break: break-word;">
                        <span style="color: black; margin-left: 5px;" class="text-center">${m.msg}</span>
                    </div>
                    <div style="margin-left: 340px;">
                        <span style="color: black; font-size:12px" class="text-center">You</span>
                        <span style="color: black; font-size:9px" class="text-center"> sent at ${new Date(m.at).toLocaleString()}</span>
                    </div>
                </div>`;
            }
            else
            {
                console.log(`IN ELSE`);
                
                template = `
                <div style="margin-top: 12px; margin-left: 20px;">
                    <span style="color: black; margin-left: 5px; font-size:12px" class="text-center p">${m.from.split(' ')[0]}</span>
                    <span style="color: black; margin-left: 5px; font-size:9px" class="text-center p"> sent at ${new Date(m.at).toLocaleString()}</span>
                </div>
                <div class="input-group w-35" style="background-color: #24a0ed; border-radius: 5px; width: 186px; margin-left:20px; word-break: break-word;">
                    <span style="color: black; margin-left: 5px;" class="text-center">${m.msg}</span>
                </div>`;
            }

            console.log(`Template ::: `, m, template);
            
            mainDiv.insertAdjacentHTML('beforeend', template);

        }
    }
}
