async function  AddContent(){
    document.getElementById("ccc").style.backgroundColor="white";
    document.getElementById("ccc").style.textAlign="center";
  
    let popresult = document.getElementById("all_content_pop_div");


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    try{
        let name = document.getElementById("FirstName").value;
        let lname = document.getElementById("LastName").value;
        let mail = document.getElementById("Email").value;
        let phone = document.getElementById("Phone").value;
        let content = document.getElementById("Content").value;


        // בדיקת תקינות של הקלטים
        if (name.length < 2 || lname.length < 2) {
            popresult.innerHTML = "שם ושם משפחה חייבים להיות לפחות באורך 2 תווים";
            openPopup();
            return; // חוזרים מהפונקציה במידה והתקלות לא עברו את הבדיקה
        }

        if (!validateEmail(mail)) {
            popresult.innerHTML = "כתובת המייל אינה תקינה";
            openPopup();
            return;
        }

        if (phone.length < 10 || !phone.startsWith("05")) {
            popresult.innerHTML ="מספר הטלפון חייב להיות לפחות באורך 10 תווים ולהתחיל ב-05";
            openPopup();
            return;
        }

        if (content.length < 10) {
            popresult.innerHTML ="תוכן חייב להיות לפחות באורך 10 תווים";
            openPopup();
            return;
        }
        var urlencoded = new URLSearchParams();
        urlencoded.append("name", name);
        urlencoded.append("lname", lname);
        urlencoded.append("mail", mail);
        urlencoded.append("phone", phone);
        urlencoded.append("content", content);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };
        
        await fetch("/content/add", requestOptions).then((res)=>{return res.json()}).then((data)=>{
            popresult.innerHTML = `<h6> <span style="font-size: 20px; font-weight:600">פניי תך התקבלה </span></h6>
            <h6> <span style="font-size: 20px; font-weight:600">מעקב פנייה והמשך התכתבות במייל אנו נחזור אליך בהקדם </span></h6> `;
            openPopup();
            document.getElementById('FirstName').value = "";
            document.getElementById('LastName').value = "";
            document.getElementById('Email').value = "";
            document.getElementById('Phone').value = "";
            document.getElementById('Content').value = "";
        });
    }catch(error){
        console.error(error);
    }


    function validateEmail(email) {
        // פונקציה פנימית לבדיקת תקינות כתובת המייל
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
      
}

