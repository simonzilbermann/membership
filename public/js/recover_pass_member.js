
function recover(){
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;  
    let pop_result = document.getElementById("all_content_pop_div");
    document.getElementById("ccc").style.backgroundColor="white";
    document.getElementById("ccc").style.textAlign="center";
    if( password1.length < 8 || password2.length < 8)  {
        pop_result.innerHTML = "אורך סיסמא חייב להיות 8 ";
        openPopup();
        return;
    } 
    if(password1 != password2){
        pop_result.innerHTML =  "הסיסמאות צריכות להיות תואמות";
        openPopup();
        return;
    }
    const urlParams = new URLSearchParams(window.location.search); 
    var EmailParam = urlParams.get('Email');
    if(EmailParam){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("Email", EmailParam);
        urlencoded.append("newpass", password1);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        fetch("/member/recover_password", requestOptions).then((res)=>{return res.json()}).then((data)=>{
            console.log(data.msg);
            if(data.msg == 1){  
                pop_result.innerHTML = "סיסמתכם אופסה בהצלחה!!";
                openPopup();
                setTimeout(() => {
                    window.location.replace('/personal_area');
                }, 3000); 
            }
            else{
                pop_result.innerHTML =  "איפוס הסיסמא לא צלח";
                openPopup();
                return;
            }     
        });
    }

}

