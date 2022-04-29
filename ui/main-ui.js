console.log(`Main UI Script`);

// const { io } = require("socket.io-client");

var savethis;

window.onload = function callMe()
{
    chrome.runtime.connect({ name: "main" });

    var url;
    
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        console.log(`tabs ::: `, tabs);
        
        url = tabs[0].url;
        // use `url` here inside the callback because it's asynchronous!

        console.log(`Current URL ::: `, url);
        
    });

    var userName = localStorage.getItem('userName');

    console.log(`userName ::: `, userName);
    
    if(userName && (userName != '' || userName != ' '))
    {
        let loc = window.location.href.replace('/index.html','/chat-ui.html');
        window.location.href = loc;
    }
    else
    {
        console.log(`In else`);

        document.getElementById('joinRoom').addEventListener('click', function saveMe()
        {
            // let s = document.getElementById('userName');
            let userName = document.getElementById('userName').value;
            let roomId = document.getElementById('roomId').value;
    
            
            var loc = window.location.href.replace('/index.html','/chat-ui.html');
    
            console.log(`Loca ::`, window.location.href, loc);
            
            if (userName && (userName !='' || userName != ' '))
            {
                console.log(`roomId ::: `, roomId, typeof roomId);
                
                if(roomId && (roomId !='' || roomId != ' '))
                {
                    fetch('http://localhost:2001/joinRoom', {
                    method:'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify({userName, roomId, unique_id: `user_${Math.floor(Date.now()/1000)}`})
                    }).then(data=>{
                        return data.json();
                    })
                    .then(result=>{
                        console.log(`Res Fetch :: `, result);
                        if(result.status == 'success')
                        {
                            localStorage.setItem('userName', userName);
                            localStorage.setItem('roomId', roomId);
                            
                            setTimeout(()=>{
                                // document.getElementById('container').innerHTML = 
                                window.location.href = loc;
                            }, 2000);
                        }
                        else
                        {
                            console.log(`result :: `, result);

                            let rowDiv = document.getElementById('mainRow');

                            var pExist = document.getElementById('error');

                            if(pExist)
                            {
                                pExist.remove();
                            }

                            let p = `<p id="error" style="color:red;">${result.message}</p>`

                            rowDiv.insertAdjacentHTML('afterend', p);

                        }
                    })
                    .catch(err=>{
                        console.log(`Err Fetch :: `, err);
                    });
                }
                else
                {
                    
                    let rowDiv = document.getElementById('mainRow');

                    var pExist = document.getElementById('error');

                    if(pExist)
                    {
                        pExist.remove();
                    }

                    let p = `<p id="error" style="color:red;">Room id should be a number</p>`

                    rowDiv.insertAdjacentHTML('afterend', p);
                }
                
            }
            else
            {
                let rowDiv = document.getElementById('nameDiv');

                var pExist = document.getElementById('error');

                if(pExist)
                {
                    pExist.remove();
                }

                let p = `<p id="error" style="color:red;">Name field is required</p>`

                rowDiv.insertAdjacentHTML('afterend',p);
            }
            
            // alert('Name :: ', JSON.stringify(s));
            console.log(`Made req ::;`, userName);
            
        });

        document.getElementById('createRoom').addEventListener('click', function saveMe()
        {
            // let s = document.getElementById('userName');
            let userName = document.getElementById('userName').value;
            let roomId = document.getElementById('roomId').value;
    
            
            var loc = window.location.href.replace('/index.html','/chat-ui.html');
    
            console.log(`Loca ::`, window.location.href, loc);
            
            if (userName && (userName !='' || userName != ' '))
            {
                console.log(`roomId ::: `, roomId, typeof roomId);
                
                if(roomId && (roomId !='' || roomId != ' '))
                {
                    let params = {
                        id:roomId,
                        owner:userName
                    };

                    fetch('http://localhost:2001/createRoom', {
                    method:'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                    body: JSON.stringify(params)
                    }).then(data=>{
                        return data.json();
                    })
                    .then(result=>{
                        console.log(`Create Room:: `, result);
                        if(result.status == 'success')
                        {
                            localStorage.setItem('userName', userName);
                            localStorage.setItem('roomId', roomId);
                            
                            setTimeout(()=>{
                                // document.getElementById('container').innerHTML = 
                                window.location.href = loc;
                            }, 2000);
                        }
                        else
                        {
                            console.log(`Create Room result :: `, result);

                            let rowDiv = document.getElementById('mainRow');

                            var pExist = document.getElementById('error');

                            if(pExist)
                            {
                                pExist.remove();
                            }

                            let p = `<p id="error" style="color:red;">${result.message}</p>`

                            rowDiv.insertAdjacentHTML('afterend', p);

                        }
                    })
                    .catch(err=>{
                        console.log(`Err Fetch :: `, err);
                    });
                }
                else
                {
                    
                    let rowDiv = document.getElementById('mainRow');

                    var pExist = document.getElementById('error');

                    if(pExist)
                    {
                        pExist.remove();
                    }

                    let p = `<p id="error" style="color:red;">Room id should be a number</p>`

                    rowDiv.insertAdjacentHTML('afterend', p);
                }
                
            }
            else
            {
                let rowDiv = document.getElementById('nameDiv');

                var pExist = document.getElementById('error');

                if(pExist)
                {
                    pExist.remove();
                }

                let p = `<p id="error" style="color:red;">Name field is required</p>`

                rowDiv.insertAdjacentHTML('afterend',p);
            }
            
            
        });
    }

}
