console.log(`Main UI Script`);

// const { io } = require("socket.io-client");

var savethis;
function saveName(userName)
{
    // savethis = userName;
    alert('Click : ', userName?.value)

    console.log(`userName ::: `, userName);
    
}

window.onload = function callMe()
{
    document.getElementById('saveName').addEventListener('click', function saveMe()
    {
        // let s = document.getElementById('userName');
        let userName = document.getElementById('userName').value;

        
        var loc = window.location.href.replace('/index.html','/chat-ui.html');

        console.log(`Loca ::`, window.location.href, loc);
        
        if (userName !='' || userName != ' ')
        {
            fetch('http://localhost:2001/saveName', {
                method:'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({userName, unique_id: `user_${Math.floor(Date.now()/1000)}`})
            }).then(result=>{
                console.log(`Res Fetch :: `, result);
                if(result.status == 200)
                {
                    localStorage.setItem('userName', userName);
                    setTimeout(()=>{
                        // document.getElementById('container').innerHTML = 
                        window.location.href = loc;
                    }, 2000);
                }
            })
            .catch(err=>{
                console.log(`Err Fetch :: `, err);
            })
        }
        
        // alert('Name :: ', JSON.stringify(s));
        console.log(`Made req ::;`, userName);
        
    });

}
