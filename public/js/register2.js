
const dobInput = document.getElementById('dob');
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const maxDateString = maxDate.toISOString().slice(0, 10);
dobInput.max = maxDateString;
dobInput.value = dobInput.max;

function reg(){
  document.getElementById("ccc").style.backgroundColor="white";
  document.getElementById("ccc").style.textAlign="center";

  let popresult = document.getElementById("all_content_pop_div");


  const  LastName = document.getElementById('LastName').value; 
  const  FirstName = document.getElementById('FirstName').value;
  const  Email = document.getElementById('Email').value;
  const  Phone = document.getElementById('Phone').value;
  const  Address = document.getElementById('Address').value;
  const Dob = document.getElementById("dob").value;

  if(FirstName.length == 0){
    popresult.innerHTML ="*שם לא יכול להיות ריק";
    openPopup();
    return;
  } 

  if(LastName.length == 0){
    popresult.innerHTML = "*שם משפחה לא יכול להיות ריק";
    openPopup();
    return;
  } 

  if(Email.length == 0 || !Email.includes("@")){
    popresult.innerHTML ="*כתובת המייל ריקה או אינה תקינה";
    openPopup();
    return;
  } 

  if(Phone.length < 10){
    popresult.innerHTML = "*טלפון חייב להכיל 10 ספרות";
    openPopup();
    return;
  } 

  if(Address.length == 0){
    popresult.innerHTML ="*כתובת לא יכולה להיות ריקה";
    openPopup();
    return;
  } 

  if(Dob == ""){
    popresult.innerHTML ="*תאריך לידה לא יכול להיות ריק ";
    openPopup();
    return;
  } 

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("Email", Email);
  urlencoded.append("Name", FirstName);
  urlencoded.append("Lastname", LastName);
  urlencoded.append("Phone", Phone);
  urlencoded.append("Address", Address);
  urlencoded.append("Dob", Dob);
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/member/reg", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    if(data.msg==1){
      popresult.innerHTML = `<h6> <span style="font-size: 20px; font-weight:600"> סיסמא לאימות נשלחה במייל  </span></h6>
      <h6> <span style="font-size: 20px; font-weight:600">רק אחרי אימות החשבון שלכם תוכלו להנות ממבצעים והנחות </span></h6> `;
      openPopup();
      setTimeout(() => {
        location.replace('/loginMember');
      }, 5500);
    }
    else{
        popresult.innerHTML = "קיים חבר מועדון עם מייל זה";
        openPopup();
    } 
  });
}

  
      

     