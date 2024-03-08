

document.getElementById("accessibility-btn").addEventListener("click", function() {
    document.getElementById("accessibility_menu").style.display="block";
    
});
document.getElementById("accessibility_close").addEventListener("click", function() {
    document.getElementById("accessibility_menu").style.display="none";
});
document.getElementById("accessibility_font_odd").addEventListener("click", function() {
    increaseTextSize();
});
document.getElementById("accessibility_font_minus").addEventListener("click", function() {
    decreaseTextSize();
});
document.getElementById("accessibility_font_reset").addEventListener("click", function() {
    ResetTextSize();
});


//---

document.getElementById("accessibility_font_readable").addEventListener("click", function() {
    ReadableTextFont();
    
  func(0);
});



document.getElementById("accessibility_contrast_dark").addEventListener("click", function() {
    ContrastDarkBackground();
    func(1);
});

document.getElementById("accessibility-contrast-gray").addEventListener("click", function() {
    ContrastGrayBackground();
    func(2);
});

document.getElementById("accessibility-links").addEventListener("click", function() {
    LinksAccessibility();
    func(3);
});

document.getElementById("accessibility-header").addEventListener("click", function() {
    AccessibilityHeader();
    func(4);
    
});
//---




document.getElementById("accessibility-keyboard").addEventListener("click", function() {
    AccessibilityKeyboard();
});

document.getElementById("accessibility-reset").addEventListener("click", function() {
    AccessibilityReset();
});


function func(num){
    let user_configuration_accessibility =JSON.parse(sessionStorage.getItem("user_configuration_accessibility"));
    if( user_configuration_accessibility[num])
        user_configuration_accessibility[num] =false;
    else  user_configuration_accessibility[num] = true;
    sessionStorage.setItem("user_configuration_accessibility",JSON.stringify(user_configuration_accessibility));
}




setTimeout(() => {
    var user_configuration_accessibility = JSON.parse(sessionStorage.getItem("user_configuration_accessibility"));
    if(user_configuration_accessibility!=null){
        
      if(user_configuration_accessibility[0] == true){
        ReadableTextFont();
      }
      if(user_configuration_accessibility[1] == true  ){
        ContrastDarkBackground();
      }
      if(user_configuration_accessibility[2] == true){
        ContrastGrayBackground();
      }
      if(user_configuration_accessibility[3] == true){
        LinksAccessibility();

      }
      if(user_configuration_accessibility[4] == true){
        AccessibilityHeader();
      }
    }else{
        var user_configuration_accessibility = [false,false,false,false,false];
        sessionStorage.setItem("user_configuration_accessibility",JSON.stringify(user_configuration_accessibility));
    }
}, 1000);



function AccessibilityKeyboard() {
    var elements = document.querySelectorAll("a, button, input, select, textarea");
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute("tabindex", "0");
    }
}

function AccessibilityReset() {
    var user_configuration_accessibilit = [false,false,false,false,false];
    sessionStorage.setItem("user_configuration_accessibility",JSON.stringify(user_configuration_accessibilit));
    // Reset font size
    var allElements = document.getElementsByTagName("*");
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        element.style.fontSize = null;
    }

    // Reset text font
    document.body.style.fontFamily = null;

    // Reset contrast and grayscale
    document.body.classList.remove("dark-contrast");
    document.body.classList.remove("bright-contrast");
    document.body.classList.remove("gray-contrast");

    // Reset link highlighting
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("highlight-link");
    }

    // Reset header highlighting
    var headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (var i = 0; i < headers.length; i++) {
        headers[i].classList.remove("highlight-header");
    }

    // Reset keyboard navigation
    var elements = document.querySelectorAll("a, button, input, select, textarea");
    for (var i = 0; i < elements.length; i++) {
        elements[i].removeAttribute("tabindex");
    }
}



function AccessibilityHeader() {
    var headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    for (var i = 0; i < headers.length; i++) {
        headers[i].classList.toggle("highlight-header");
    }
}


function LinksAccessibility() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].classList.toggle("highlight-link");
    }
}


function ContrastGrayBackground() {
    var body = document.body;
    body.classList.toggle("gray-contrast"); 
}
    


function ContrastDarkBackground() {
    var body = document.body;
    body.classList.toggle("dark-contrast"); 
}



function ReadableTextFont() {
    var allElements = document.getElementsByTagName("*");
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        element.style.fontFamily = "Arial, sans-serif"; 
    }
}



function increaseTextSize(){
    var allElements = document.getElementsByTagName("*");
    for(var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        var fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        var newSize = parseInt(fontSize) + 2 + "px";
        element.style.fontSize = newSize;
    }
}
function decreaseTextSize() {
    var allElements = document.getElementsByTagName("*");
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        var fontSize = window.getComputedStyle(element, null).getPropertyValue("font-size");
        var newSize = parseInt(fontSize) - 2 + "px";
        element.style.fontSize = newSize;
    }
}
function ResetTextSize() {
    var allElements = document.getElementsByTagName("*");
    for (var i = 0; i < allElements.length; i++) {
        var element = allElements[i];
        element.style.fontSize = ""; 
    }
}


document.getElementById("accessibility-statement").addEventListener("click", function() {

    document.getElementById("all_content_pop_div").innerHTML = "";
    document.getElementById("accessibility_menu").style.display="none";
    let element = document.getElementById("ccc");
    element.style.width = "80%";
    element.style.marginBottom = "5%";
    element.style.marginTop = "4%";
    element.style.marginLeft = "10%";
    document.getElementById("all_content_pop_div").innerHTML = `<div>
    <h3>איך זה עובד?</h3> 
    <p>לאתר מוצמד תפריט נגישות בחלקו הימני או השמאלי של האתר הנפתח בלחיצה על האייקון נגישות
        או על-ידי לחיצה על מקש F9.
      </p>
        <br>
     <h3>מה האפשרויות?</h3> 
        <ul>
            <li>
                <n>1</n>  הגדלה והקטנה של הגופן באתר
            </li>
            <li>
                <n>2</n>  גופן קריא - החלפת גופן האתר בגופן קריא וברור
            </li>
            <li>
                <n>3</n>  התאמה לכבדי ראיה - רקע שחור עם טקסט לבן
            </li>
            <li>
                <n>4</n>  התאמה לכבדי ראיה - רקע לבן עם טקסט שחור
            </li>
            <li>
                <n>5</n>  התאמה לעיוורי צבעים - מבטל צבעוניות באתר
            </li>
            <li>
                <n>6</n>  הדגשת קישורים - הדגשת הקישורים בצבע אדום והוספת קו מתחת
            </li>
            <li>
                <n>7</n>  הדגשת כותרות - הדגשת הכותרות בצבע שחור והוספת קו מתחת
            </li>
            <li>
                <n>8</n>  ניווט מקלדת
            </li>
            <li>
                <n>9</n>  תצוגה רגילה - איפוס כל אפשרויות הנגישות באתר וגלישה במצב רגיל
            </li>
            <li>
                <n>10</n>  הצהרת נגישות - חלון זה
            </li>
            
        </ul>
        <br>
        <h3>הבהרה</h3>
        <div>
            על אף המאמצים לאפשר גלישה נגישה עבור הדפים באתר זה, יתכן ויתגלו דפים באתר שטרם הונגשו במלואם
            , או שטרם נמצא פתרון טכנולוגי מתאים להנגשתם.
             אנו ממשיכים במאמצים לשפר את נגישות האתר, ככל האפשר
            , וזאת מתוך אמונה ומחויבות מוסרית לאפשר שימוש באתר לכלל האוכלוסייה לרבות אנשים עם מוגבלויות.
        </div>
        <br>
        <h3>פניות בנושא נגישות</h3>
        <div>
            בכל שאלה או בעיה בנושא נגישות האתר ניתן לפנות ישירות לרכז הנגישות דרך טופס הצור קשר באתרנו.
        </div>
          
</div>`;
    openPopup();
    });


const popup = document.getElementById("popup");
const btnClose = document.getElementById("close");
btnClose.addEventListener("click",closePopup);

function openPopup() {
    popup.style.display = "block";
    document.getElementsByTagName("body")[0].classList.add("hide-scroll");
}
    
function closePopup() {
    popup.style.display = "none";
    popup.classList.remove("hidden");
    document.getElementsByTagName("body")[0].classList.remove("hide-scroll");
    
}
window.onload = function() {
    let flag = JSON.parse(sessionStorage.getItem('one_time_popup'));
    if (flag != null ) {   
       return; 
    }else{
        sessionStorage.setItem('one_time_popup', JSON.stringify(true));
        document.getElementById("all_content_pop_div").innerHTML = "";
        document.getElementById("all_content_pop_div").innerHTML = `
            <div style="text-align: center;">
                <h2>מכירת מוצרי טבק וכלי עישון או אלכוהול אסורה למי שטרם מלאו לו 18 שנים!!</h2>
                <h3>לקבל הטבות ומחירים בלעדים</h3>
                <a href="/register" class="btn btn-outline-dark mt-auto">הצטרפו עכשיו</a>
            </div>
            `;
            openPopup();
            setTimeout(() => {
                closePopup();
            }, 5000);
        
    }
  };