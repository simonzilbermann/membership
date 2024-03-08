
function recover(){
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;  
    let pop_result = document.getElementById("all_content_pop_div");
    document.getElementById("ccc").style.backgroundColor="white";
    document.getElementById("ccc").style.textAlign="center";
    if( password1.length < 8 || password2.length < 8)  {
       pop_result.innerHTML ="<h1>אורך סיסמא חייב להיות 8 </h1>";
        openPopup();
        return;
    } 
    if(password1 != password2){
       pop_result.innerHTML ="<h1>הסיסמאות צריכות להיות תואמות</h1>";
        openPopup();
        return;
    }
    const urlParams = new URLSearchParams(window.location.search); 
    var EmailParam = urlParams.get('email');
    if(EmailParam){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("email", EmailParam);
        urlencoded.append("newpass", password1);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        fetch("/managers/recover_password", requestOptions).then((res)=>{return res.json()}).then((data)=>{
            if(data.msg == 1){  
               pop_result.innerHTML ="<h1>סיסמתכם אופסה בהצלחה!!</h1>";
                openPopup();
                setTimeout(() => {
                    window.location.replace('/wm');
                }, 4000); 
            }
            else{
               pop_result.innerHTML ="<h1>איפוס הסיסמא לא צלח</h1>";
                openPopup();
                return;
            }     
        });
    }

}


