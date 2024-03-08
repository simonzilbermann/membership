window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search); 
  const EmailParam = urlParams.get('email'); 
  const PassParam = urlParams.get('pass'); 
  if (EmailParam && PassParam) { 
    document.getElementById("Email").value = EmailParam;
    document.getElementById("pass").value = PassParam; 
  }
}

function login(){

  document.getElementById("ccc").style.backgroundColor="white";
  document.getElementById("ccc").style.textAlign="center";

  let popresult = document.getElementById("all_content_pop_div");

  const Email = document.getElementById("Email").value;
  const pass = document.getElementById("pass").value; 
  if(Email.length == 0 || !Email.includes("@")){
    popresult.innerHTML =`<h1 style="color:red">*כתובת המייל ריקה או אינה תקינה</h1>`;
    openPopup();
    return;
  } 

  if(pass.length == 0){
    
    popresult.innerHTML =`<h1 style="color:red">*סיסמא לא יכולה להיות ריקה</h1>`;
    openPopup();
    return;
  } 

  fetch('/member/log',{
    method:'POST',
    body:new URLSearchParams({
      Email,
      pass:pass
    })
  }).then((res)=>{
  return res.json()}).then((data)=>{
    popresult.innerHTML = `<h1 style="color:red">${data.msg}</h1>`;
    openPopup();
  })
      
}
