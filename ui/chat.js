console.log(`Chat ui called`);

window.onload = function chatUi()
{
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
}
