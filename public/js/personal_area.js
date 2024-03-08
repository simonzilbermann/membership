
setTimeout(() => {
    

    
    var is_logged = JSON.parse( sessionStorage.getItem("logged"));
    if(is_logged){
        document.getElementById("logout_btn").style.display = "block";
        var membership_acount = JSON.parse(sessionStorage.getItem("member_acount"));
        document.getElementById("name").innerHTML = "שלום&nbsp;"+ membership_acount.Name +" "+membership_acount.Lastname;
        get_orders(membership_acount.Email);
        get_Favorite_prod(membership_acount.Email); 
    }
    else{
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            document.getElementById("rectangles").style.display="none";
        }     
    }
}, 1000);



var orders_btn = document.getElementById("orders_btn");
orders_btn.addEventListener("click",function(){
    var is_logged = JSON.parse( sessionStorage.getItem("logged"));
    if(is_logged){
        document.getElementById("rectangles").style.display="none";
        document.getElementById("orders_member").style.display="block"; 
    }
    else{
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        document.getElementById("all_content_pop_div").innerHTML = "<h1>עליך להתחבר למועדון קודם</h1>";
        openPopup();
    }
    
});
var acount_detials_btn =  document.getElementById("acount_detials_btn");
acount_detials_btn.addEventListener("click",function(){
    var is_logged = JSON.parse( sessionStorage.getItem("logged"));
    if(is_logged){
        document.getElementById("rectangles").style.display="none";
        feed_member_data();
        document.getElementById("member_acount_detials").style.display="block"; 

    }
    else{
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        document.getElementById("all_content_pop_div").innerHTML = "<h1>עליך להתחבר למועדון קודם</h1>";
        openPopup();
    }
});
var favorite_prod_btn = document.getElementById("favorite_prod_btn");
favorite_prod_btn.addEventListener("click",function(){
    var is_logged = JSON.parse( sessionStorage.getItem("logged"));
    if(is_logged){
        document.getElementById("rectangles").style.display="none";
        document.getElementById("favorites_products").style.display="block"; 
    }
    else{
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        document.getElementById("all_content_pop_div").innerHTML = "<h1>עליך להתחבר למועדון קודם</h1>";
        openPopup();
    }
});
function go_back3(){
    document.getElementById("member_acount_detials").style.display="none";
    document.getElementById("rectangles").style.display="flex";
    
}
function go_back2(){
    document.getElementById("favorites_products").style.display="none";
    document.getElementById("rectangles").style.display="flex";
    
}
function go_back(){
    document.getElementById("orders_member").style.display="none";
    document.getElementById("rectangles").style.display="flex";
    
}
function get_orders(email) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("Email", email);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };

    fetch("/member/get_all_member_orders", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        if(data.msg != null){
            var orders = data.msg;
            for(let i=0;i<orders.length;i++){
                let items = orders[i].items;
                let itemsStr="";
                var cardParent = document.getElementById('card');
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body', 'p-4');
                var content = `
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="lead fw-normal mb-0" style="color: #E6A756;">מוצרים</p>
                        <p class="small text-muted mb-0"> מספר הזמנה <span > ${orders[i].orderId} </sapn> </p>
                    </div>`;
                for(let i=0;i<items.length;i++){
                    let pic =  items[i].prodPic;
                    const parts = pic.split("/public");
                    const newUrl = "/public" + parts.pop();
                    itemsStr+='<div class="card shadow-0 border mb-4"><div class="card-body"><div class="row"><div class="col-md-2"><img src="'+newUrl+'"class="img-fluid" ></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0">'+items[i].productName+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">'+items[i].productPrice+'₪</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">מחיר: '+items[i].productSku+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">כמות: '+items[i].quantity+'</p></div><div class="col-md-2 text-center d-flex justify-content-center align-items-center"><p class="text-muted mb-0 small">סה״כ: '+items[i].sum+'₪</p></div></div><hr class="mb-4" style="background-color: #e0e0e0; opacity: 1;"></div></div>';
                }
                cardBody.innerHTML = content+itemsStr+`<hr><h5 class="h2 mb-0 ms-2">סה״כ לתשלום ${orders[i].shipmentcost + orders[i].totalPrice} &nbsp;₪ </h5>`;
                cardParent.appendChild(cardBody);
            }
        } else{
            var cardParent = document.getElementById('card');
            const h4 = document.createElement('h4');
            h4.innerHTML = "לא נמצאו הזמנות";
            cardParent.appendChild(h4);
        }
    });
   
    
    
}

function get_Favorite_prod(Email){
  console.log("Fsdfds");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("Email", Email);

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
    };
    document.getElementById("rrr").innerHTML = "";
    fetch("/member/get_favorites", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        console.log(data.msg.length);
        if(data.msg.length > 0){
            var array = data.msg;
            var stringinner = '';
            for(let i=0;i<array.length;i++){
                stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+array[i].Price+'₪ </h6><button onclick="remove_prod_from_favorite(`'+array[i].Sku+'`)" class="Favorite_btn"><i id="heart" class="fa-solid fa-heart" ></i></button></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <div class="d-flex flex-column mb-4"> <span>מבצע מועדון:'+array[i].Sale+'</span></div> <div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">'+array[i].Description+'</h5></div><a class="btn btn-outline-dark mt-auto" href="/product/prodpage?sku='+array[i].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
                document.getElementById("rrr").innerHTML += stringinner;
            }
        } else{
            var cardParent = document.getElementById('rrr');
            const h4 = document.createElement('h4');
            h4.innerHTML = "לא נמצאו מוצרים מועדפים";
            cardParent.appendChild(h4);
        }
        
    });
}

function forgetmypass(){
    var emailforget = document.getElementById("emailforget").value;
    if (!emailforget.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        document.getElementById("all_content_pop_div").innerHTML = "אנא הכניסו כתובת מייל תקינה";
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("Email", emailforget);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("/member/forget", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        document.getElementById("resultlbl").innerHTML = data.msg;

    });
}
function remove_prod_from_favorite(sku){
    var membership = JSON.parse(sessionStorage.getItem("member_acount"));
    let email = membership.Email;
    var allsku = membership.Favorite;
    allsku =  allsku.replace(","+sku," ");
    membership.Favorite = allsku;
    sessionStorage.setItem("member_acount",JSON.stringify(membership));
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("sku", allsku);
    urlencoded.append("email", email);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("/member/remove_favorite_member", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        if(data.msg > 0){
        document.getElementById("heart").classList.add("fa-regular");
        flag_fav = false;
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        document.getElementById("all_content_pop_div").innerHTML = "<h4>המוצר הוסר בהצלחה</h4>";
        get_Favorite_prod(email);
        openPopup();
        setTimeout(() => {
            closePopup();
        }, 2500);
        }
    });
}
function feed_member_data(){
    var membership_data = JSON.parse(sessionStorage.getItem("member_acount"));
    document.getElementById("dob").value = membership_data.Dob ;
    document.getElementById("address").value = membership_data.Address;
    document.getElementById("phone").value = membership_data.Phone;
    document.getElementById("email_acount").value = membership_data.Email;
    document.getElementById("lastname").value = membership_data.Lastname;
    document.getElementById("firstname").value = membership_data.Name;
    document.getElementById("fullname").innerHTML = membership_data.Name +" "+membership_data.Lastname;
    document.getElementById("emailiner").innerHTML = membership_data.Email;
}
function update_membership_data(){

    var Dob = document.getElementById("dob").value;
    var Address =  document.getElementById("address").value;
    var Phone = document.getElementById("phone").value;
    var Email = document.getElementById("email_acount").value;
    var Lastname = document.getElementById("lastname").value;
    var Name = document.getElementById("firstname").value;
    var membership_data = JSON.parse(sessionStorage.getItem("member_acount"));
    membership_data.Dob = Dob;
    membership_data.Address = Address;
    membership_data.Phone = Phone;
    membership_data.Email = Email;
    membership_data.Lastname = Lastname;
    membership_data.Name = Name;
    sessionStorage.setItem("member_acount",JSON.stringify(membership_data));
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("Dob", Dob);
    urlencoded.append("Address", Address);
    urlencoded.append("Phone", Phone);
    urlencoded.append("Email", Email);
    urlencoded.append("Lastname", Lastname);
    urlencoded.append("Name", Name);
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    fetch("/member/update_membership_data", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        if(data.msg > 0){
            document.getElementById("ccc").style.backgroundColor="white";
            document.getElementById("ccc").style.textAlign="center";
            document.getElementById("all_content_pop_div").innerHTML = "המועדון עודכן";
            openPopup();
        }else{
            document.getElementById("ccc").style.backgroundColor="white";
            document.getElementById("ccc").style.textAlign="center";
            document.getElementById("all_content_pop_div").innerHTML = "הכל מעודכן כבר";
            openPopup();
        }
        
    })

}

function logout(){
document.getElementById("logout_btn").style.display = "none";
sessionStorage.setItem("logged",false);
location.replace('/');

}