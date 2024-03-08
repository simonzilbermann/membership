
var countdownDuration = 60;
var countdownElement = document.getElementById('countdown');
var countdownTimer = setInterval(function() {
    countdownDuration--;
    countdownElement.innerText = 'עוברים לדף הבית בעוד: ' + countdownDuration + ' שניות...';
    if (countdownDuration === 0) {
    clearInterval(countdownTimer);
    location.replace('/');
    }
}, 1000);

let order = JSON.parse(sessionStorage.getItem("order"));
let nameElement = document.createElement("p");
nameElement.innerText = "שם: " + order.name;
document.getElementById("detials").appendChild(nameElement);
let orderIdElement = document.createElement("p");
orderIdElement.innerText = "מספר הזמנה: " + order.orderId;
document.getElementById("detials").appendChild(orderIdElement);
let emailElement = document.createElement("p");
emailElement.innerText = "כתובת מייל : " + order.email;
document.getElementById("detials").appendChild(emailElement);
let pdfElement = document.createElement("a");
pdfElement.href = `/public/invoices/invoice_${order.orderId}.pdf`;
pdfElement.innerText = "קישור להורדת הקובץ";
document.getElementById("detials").appendChild(pdfElement);



