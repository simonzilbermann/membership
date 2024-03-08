
document.getElementById("orderId").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      get_order();
    }
  });
  
function get_order(){
    document.getElementById("ccc").style.backgroundColor="white";
    document.getElementById("ccc").style.textAlign="center";
  
    let popresult = document.getElementById("all_content_pop_div");


    var myHeaders = new Headers();
    const orderId = document.getElementById("orderId").value;
    if(orderId.length == 0){
        document.getElementById("ltlresult").innerHTML = "מספר הזמנה לא יכול להיות ריק";
        return;
    }else{
        document.getElementById("ltlresult").innerHTML = "";
    }
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("orderId", orderId);
    var requestOptions = {
        method: 'POST', 
        headers: myHeaders,
        body: urlencoded.toString(), 
        redirect: 'follow'
    };
    fetch("/order/get_order_by_id", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        let orderdata = data.msg;
        if(orderdata != null){
            document.getElementById("orderdata").style.display = "block";
            document.getElementById("name").innerHTML = orderdata.name;
            document.getElementById("orderId2").innerHTML = orderdata.orderId;
            let items = orderdata.items;
            let itemsStr="";
            for(let i=0;i<items.length;i++){
                let pic =  items[i].prodPic;
                const parts = pic.split("/public");
                const newUrl = "/public" + parts.pop();
                itemsStr+='<div class="card shadow-0 border mb-4"><div class="card-body"><div class="row"><div class="col-md-2"><img src="'+newUrl+'"class="img-fluid" ></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0">'+items[i].productName+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">'+items[i].productPrice+'₪</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">מחיר: '+items[i].productSku+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">כמות: '+items[i].quantity+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">סה״כ: '+items[i].sum+'₪</p></div></div><hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;"></div></div>';
            }
            document.getElementById("itemsorder").innerHTML = itemsStr;
            const progressBar = document.getElementById("progress-bar");
            let percent = 0;       
            if(orderdata.status == 1){
                percent = 0;
            }
            else if(orderdata.status == 2){
                percent = 50;
            }
            else if(orderdata.status == 3){
                percent = 100;
            }
            else if(orderdata.status == 4){
                document.getElementById("itemsorder").innerHTML="";
                document.getElementById("itemsorder").innerHTML="<h1>הזמנה מבוטלת</h1>";
            }
            progressBar.style.width = `${percent}%`;
            progressBar.setAttribute("aria-valuenow", `${percent}`);             
            if(orderdata.shipmentcost > 0){
                document.getElementById("address").style.display="block";
                document.getElementById("address").innerHTML = `כתובת למשלוח: ${orderdata.shipmentAddress}`;
                document.getElementById("shipmentcost").innerHTML = `<span class="fw-bold me-4">עלות שילוח  ${orderdata.shipmentcost}₪</span> `;
            }
            document.getElementById("totalPrice").innerHTML = `<span class="fw-bold me-4">עלות מוצרים:</span> ${orderdata.totalPrice}₪`;
            const createdAt = new Date(orderdata.createdAt);
            const formattedDate = createdAt.toISOString().slice(0,10);
            const formattedTime = createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const formattedDateTime = formattedDate + " " + formattedTime;
            document.getElementById("createdAt").innerHTML = formattedDateTime;
            document.getElementById("grand_total").innerHTML = orderdata.totalPrice +orderdata.shipmentcost+'₪' ;
            if(orderdata.hasPayment){
                document.getElementById("statepay").innerHTML='<i class="fa fa-credit-card" aria-hidden="true"></i>  '+"  הזמנה שולמה!";
            }
            else{
                document.getElementById("statepay").innerHTML='<i class="fa fa-credit-card" aria-hidden="true"></i>  '+"  לא שולמה"; 
            }
            if(orderdata.hasDeliverd){
                document.getElementById("stateshipp").innerHTML='<i class="fa fa-truck" aria-hidden="true"></i>  '+"  הזמנה נמסרה";
            }
            else{
                document.getElementById("stateshipp").innerHTML='<i class="fa fa-truck" aria-hidden="true"></i>   '+"  לא נמסרה"; 
            }
        }
        else {
            document.getElementById("orderdata").style.display = "none";
            if(popresult){
                popresult.innerHTML = `<h1 style="color:red" >הזמנה לא נמצאה במערכת </h1>`;
            }
            openPopup();
            setTimeout(() => {
                closePopup();
            }, 900);
            return;
        } 
    });
}
