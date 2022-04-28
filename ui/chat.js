console.log(`Chat ui called`);

var messages = [];

window.onload = function chatUi()
{
    chrome.runtime.onMessage.addListener((request, sender) => {
        console.log(`All messages ::: `, request, request.allMsgs);
        if(request && request?.allMsgs)
        {
            messages = request.allMsgs;
            renderMessagesToUI(messages);
        }
    });

    var name = localStorage.getItem('userName');

    if(name)
    {
        const para = document.createElement("h1");
       
        const classes = ['text-center'];

        para.classList.add(...classes);

        const node = document.createTextNode(`Hi ${name}, Welcome`);

        para.appendChild(node);

        const element = document.getElementById("userNameDiv");
        
        element.appendChild(para);
    }

    document.getElementById('sendMessage').onclick = function(){
        var message = document.getElementById('message').value;

        console.log(`Message chat-ui ::: `, message);

        chrome.runtime.sendMessage({ userName: name, msg: message });

        messages.unshift({ from: name, msg: message });

        console.log(`Messages Array ::: `, messages);
        
        renderMessagesToUI(messages);
    }

    function renderMessagesToUI(msgs)
    {
        var outgoing = document.getElementsByClassName('input-group mt-2');
        var incoming = document.getElementsByClassName('input-group w-35');

        console.log(`OUT :::: `, outgoing);

        while(outgoing?.length > 0)
        {
            outgoing[0].parentNode.removeChild(outgoing[0]);
        }
        while(incoming?.length > 0)
        {
            incoming[0].parentNode.removeChild(incoming[0]);
        }
        
        var mainDiv = document.querySelector('#msgHolder');

        for(let m of msgs)
        {
            let template;
            console.log(`Current USer :: `, name, " m.userName :: ", m.userName, m.userName==name);
            
            if(m.from == name)
            {
                console.log(`IN IF`);

                template = `<div class="input-group mt-2" style="margin-right: -340px;" id="outgoing">
                <div class="input-group w-35" style="background-color: #42ba96;border-radius: 5px; width: 186px; margin-left: 340px; word-break: break-word;">
                    <span style="color: black; margin-left: 5px;" class="text-center">${m.msg}</span>
                    </div>
                </div>`;
            }
            else
            {
                console.log(`IN ELSE`);
                
                template = `<div class="input-group w-35" style="background-color: #24a0ed; border-radius: 5px;margin-top:5px; width: 186px; word-break: break-word;">
                <span style="color: black; margin-left: 5px;" class="text-center">${m.msg}</span>
                </div>`;
            }

            console.log(`Template ::: `, m, template);
            
            mainDiv.insertAdjacentHTML('beforeend', template);

        }
    }
}
