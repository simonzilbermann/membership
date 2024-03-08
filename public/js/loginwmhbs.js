
window.onload = function() {
    sessionStorage.setItem('one_time_popup', JSON.stringify(true));
};
document.getElementById("username").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      funclog();
    }
  });
  
  document.getElementById("password").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      funclog();
    }
  });
  
  document.getElementById("emailforget").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      forgetmypass();
    }
  });
  
function forgetmypass(){
    let popresult = document.getElementById("all_content_pop_div");
    let div_element =  document.getElementById("ccc");
    div_element.style.backgroundColor="white";
    div_element.style.textAlign="center";
    var emailforget = document.getElementById("emailforget").value;
    if (!emailforget.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        popresult.innerHTML =  "אנא הכניסו כתובת מייל תקינה";
        openPopup();
        return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("email", emailforget);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("/managers/forget", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        popresult.innerHTML = data.msg;
        openPopup();
        setTimeout(() => {
            window.location.replace('/wm');
        }, 2700);
    });
}
function funclog(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    let popresult = document.getElementById("all_content_pop_div");
    let div_element =  document.getElementById("ccc");
    div_element.style.backgroundColor="white";
    div_element.style.textAlign="center";
    if (username.trim() == '') {
        popresult.innerHTML = "שם משתמש לא יכול להיות ריק ";
        openPopup();
        return;
    }
    if(password.trim() === ''){
            popresult.innerHTML = "הסיסמא לא יכולה להיות ריקה";
            openPopup();
        return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("username", username);
    urlencoded.append("pass", password);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("/managers/login", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        if(data.msg != null){
            popresult.innerHTML =  "התחברתם בהצלחה!!";
            openPopup();
            let managerDetials = data.msg;
            managerDetials = `מזהה מנהל: ${managerDetials.mid} אימייל: ${managerDetials.email} שם מנהל: ${managerDetials.username}`;
            sessionStorage.setItem("managerDetials",managerDetials);
           
            setTimeout(() => {
                window.location.replace('/wm');
            }, 2000); 
        }
        else{
            popresult.innerHTML = "שם משתמש או סיסמא לא נכונים";
            openPopup();
            return;
        }     
    });
}

