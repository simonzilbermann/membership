let hasShip = false;
let shipmentcost = 0;
let str_reapet = "";
let totalsum = 0;
let totalprice = 0;
let total_price_after_sales_shipping = 0;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

get_cart();

async function  get_cart(){
  if(!isMobile()){
    document.getElementById("special").style.overflowY = "scroll";
    document.getElementById("special").style.height = "695px";
    document.getElementById("one_").style.maxHeight= "910px"; 
    document.getElementById("two_").style.maxHeight= "910px";
    document.getElementById("three_").style.maxHeight= "910px";
    document.getElementById("three_").style.overflowY = "scroll";
  }

  if (sessionStorage.getItem("logged") === null) {
    sessionStorage.setItem("logged", false);
  }     
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  await fetch("/cart/getcart", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    sessionStorage.setItem("cart",JSON.stringify(data.msg));
    let cart = JSON.stringify(data.msg);
    cart = JSON.parse(cart);
    if(cart.length == 0){
      document.getElementById("repeat").innerHTML = '<h1 style="direction:rtl;" class="fw-bold mb-0 text-black">הסל שלך ריק</h1>';
      document.getElementById('code_coupon').readOnly = true;
      return;
    }
    document.getElementById("len").innerHTML = "מוצרים "+cart.length;
    document.getElementById("len2").innerHTML = "מוצרים "+cart.length;
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
  

    let favorites_on_cart = [];
    if( JSON.parse(sessionStorage.getItem("logged")) == true){

      var membership = JSON.parse(sessionStorage.getItem("member_acount"));
      let Email = membership.Email;
      urlencoded.append("Email", Email);
      var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
      };
      fetch("/member/get_favorites", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        
        favorites_on_cart = data.msg;
        for(let i=0;i<cart.length;i++){
          totalsum += cart[i].sum;
          const productSku = cart[i].productSku;
          const isFavorite = favorites_on_cart.some((favorite) => favorite.Sku === productSku);
          
          let heartClass = 'fa-regular fa-heart';
          if (isFavorite) {
            heartClass = 'fa-solid fa-heart';
          }
          totalprice +=cart[i].productPrice * cart[i].quantity;
          str_reapet+=`
          <div class="cart__product" ><div class="cart__product-image">
            <a href="/product/prodpage?sku=${cart[i].productSku}" ><img src="${cart[i].prodPic}" alt=""></a>
            <div class="cart__product-action">
              <button onclick="deleteprod_fromcart_header('${cart[i].productSku}')" class="cart__product-del"><span>&nbsp;</span></button>
              <button onclick="test('${cart[i].productSku}')" class="cart__product-wish"><i id="${cart[i].productSku}_cart" class="${heartClass}" ></i> </button>
            </div>
          </div>
          <div class="cart__product-details">
            <div>
              <div class="cart__product-name">
                <a href="#">${cart[i].productName}</a>
              </div>
              <div class="cart__product-sku">
                <span>מקט</span><span>${cart[i].productSku}</span>
              </div>
              <div class="cart__product-price">
                <span> מחיר:</span>
                <span id="product-price">${cart[i].productPrice} ₪ </span>
              </div>
              <div class="cart__product-price">
              <span> סה״כ מוצר</span>
              <span >${(cart[i].sum).toFixed(1)} ₪</span>
            </div>
            </div>
            <div class="cart__product-total">
              <div class="cart_qty">
                <button class="cart_qty_btn" onclick="decrementQuantity(this,'${cart[i].productSku}')">
                  <i class="fas fa-minus"></i>
                </button>
                <input class="cart_qty_input" disabled="true" readonly="true" id="form2" name="quantity" min="1" value="${cart[i].quantity}" type="number"  onchange="updateQuantity(this.value, ${i})" />
                <button class="cart_qty_btn" onclick="incrementQuantity(this,'${cart[i].productSku}')">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              
            </div>
          </div>
          </div>`;
        }
        if(JSON.parse(sessionStorage.getItem("state_coupon"))){
          let code = JSON.parse(sessionStorage.getItem("code_cop"));
        document.getElementById('code_coupon').value = code;
        document.getElementById('code_coupon').readOnly = true;
        document.getElementById('coupon_btn').textContent = "בטל קופון";
        update_sales_desc();
        }
     
        document.getElementById("totalprice_old").innerHTML = totalprice +"&nbsp; ₪";
        document.getElementById("totalprice_with_ship").innerHTML = (totalsum+shipmentcost).toFixed(3)+"&nbsp; ₪";
        document.getElementById("totalprice_after_discount").innerHTML = (totalsum+shipmentcost).toFixed(3) +"&nbsp; ₪";
        document.getElementById("repeat").innerHTML = str_reapet;
        total_price_after_sales_shipping = totalsum;
      });  
    }else{

      for(let i=0;i<cart.length;i++){
        totalsum += cart[i].sum;
        let heartClass = 'fa-regular fa-heart';
        totalprice +=cart[i].productPrice * cart[i].quantity;
        str_reapet+=`
        <div class="cart__product" ><div class="cart__product-image">
          <a href="/product/prodpage?sku=${cart[i].productSku}" ><img src="${cart[i].prodPic}" alt=""></a>
          <div class="cart__product-action">
            <button onclick="deleteprod_fromcart_header('${cart[i].productSku}')" class="cart__product-del"><span>&nbsp;</span></button>
            <button onclick="test('${cart[i].productSku}')" class="cart__product-wish"><i id="${cart[i].productSku}_cart" class="${heartClass}" ></i> </button>
          </div>
        </div>
        <div class="cart__product-details">
          <div>
            <div class="cart__product-name">
              <a href="#">${cart[i].productName}</a>
            </div>
            <div class="cart__product-sku">
              <span>מקט</span><span>${cart[i].productSku}</span>
            </div>
            <div class="cart__product-price">
              <span> מחיר:</span>
              <span id="product-price">${cart[i].productPrice} ₪ </span>
            </div>
            <div class="cart__product-price">
              <span> סה״כ מוצר</span>
              <span >${(cart[i].sum).toFixed(1)} ₪</span>
            </div>
          </div>
          <div class="cart__product-total">
          
            <div class="cart_qty" >
              <button class="cart_qty_btn" onclick="decrementQuantity(this,'${cart[i].productSku}')">
                <i class="fas fa-minus"></i>
              </button>
              <input class="cart_qty_input" disabled="true" readonly="true" id="form2" name="quantity" min="1" value="${cart[i].quantity}" type="number"  onchange="updateQuantity(this.value, ${i})" />
              <button class="cart_qty_btn" onclick="incrementQuantity(this,'${cart[i].productSku}')">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          
          </div>
          
        </div>
        </div>`;

      }
      
      if(JSON.parse(sessionStorage.getItem("state_coupon"))){
        let code = JSON.parse(sessionStorage.getItem("code_cop"));
        document.getElementById('code_coupon').value = code;
        document.getElementById('code_coupon').readOnly = true;
        document.getElementById('coupon_btn').textContent = "בטל קופון";
        update_sales_desc();
    
        
      }
      document.getElementById("totalprice_old").innerHTML = totalprice +"&nbsp; ₪";
      
      document.getElementById("totalprice_with_ship").innerHTML = (totalsum).toFixed(3) +"&nbsp; ₪" ;
      document.getElementById("totalprice_after_discount").innerHTML = (totalsum+shipmentcost).toFixed(3) +"&nbsp; ₪";
      document.getElementById("repeat").innerHTML = str_reapet;
      total_price_after_sales_shipping = totalsum;
    }    


  });
  setTimeout(() => {
    const logged = JSON.parse(sessionStorage.getItem("logged"));
    if(logged == true){
      let member_acount = JSON.parse(sessionStorage.getItem("member_acount"));
      document.getElementById("name").value = member_acount.Name +" "+member_acount.Lastname;
      document.getElementById("email").value = member_acount.Email;
      document.getElementById("phone").value = member_acount.Phone;
      update_rules();
    }
  }, 700);

}

function update_rules(){
  
  const logged = JSON.parse(sessionStorage.getItem("logged"));
  

  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  let state_coupon = JSON.parse(sessionStorage.getItem("state_coupon")) || false;
  if(!state_coupon){
    fetch("/cart/core_of_rules", requestOptions).then((res)=>{return res.json()}).then((data)=>{
      let cart  = data.msg;
      if(!logged ) return;
      var sales_desc = document.getElementById("sales_desc");
      var rules_in_cart = data.rules_names;
      rules_in_cart.forEach(rule=>{
        var i_element = document.createElement("i");
        i_element.innerHTML = rule.name;
        sales_desc.appendChild(i_element);
        sales_desc.appendChild(document.createElement("br"));
      });
      
      var i_element = document.createElement("i");
      i_element.innerHTML = "זכאות להנחות מועדון של מוצרים";
      sales_desc.appendChild(i_element);
      sales_desc.innerHTML+=`</br>`;
      let totalsum = 0;
      cart.forEach(ct=>{
        totalsum+=ct.sum;
      });
      document.getElementById("X_disc").style.display="none";
      let div = document.getElementById("disc_precent");
      let i = document.createElement("i");
      i.className="fas fa-check fa-2xl";
      i.style.color="green";
      div.appendChild(i);
      document.getElementById("totalprice_after_discount").innerHTML= (totalsum+shipmentcost).toFixed(3) +"&nbsp; ₪";
      document.getElementById("totalprice_with_ship").innerHTML = (totalsum+shipmentcost).toFixed(3)+"&nbsp; ₪";
      total_price_after_sales_shipping =totalsum;
    });
  }

}
function decrementQuantity(button,sku) {
  const quantityInput = document.getElementById("form2");
  quantityInput.stepDown();
  console.log(quantityInput.value);
  updateQuantityDec(quantityInput.value, sku);
}
function incrementQuantity(button,sku) {
  const quantityInput =  document.getElementById("form2");
  quantityInput.stepUp();
  updateQuantityInc(quantityInput.value, sku);
}
function getIndex(button) {
  const row = button.closest('.row');
  const rows = Array.from(row.parentNode.children);
  return rows.indexOf(row);
}
function updateQuantityInc(quantity, sku) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("sku", sku);
  urlencoded.append("quantity", 1);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/cart/add_to_quantity", requestOptions);
  location.reload();
}
function updateQuantityDec(quantity, sku) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("sku", sku);
  urlencoded.append("quantity", 1);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/cart/remove_from_quantity", requestOptions);
  location.reload();
}

function deleteprod_fromcart(sku) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("sku", sku);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/cart/delfromcart", requestOptions);
  location.reload(); 
}

const selectElement = document.getElementById("select");
selectElement.addEventListener('change', (event) => {
  const selectedValue = parseInt(event.target.value);


  if(selectedValue != 0){
    hasShip= true;
    var h5_ship_cost =  document.createElement("h5");
    shipmentcost = selectedValue;
    if(totalsum >= 300) {
      shipmentcost = 0;
      h5_ship_cost.style.textDecoration = "line-through";
      h5_ship_cost.style.color = "red";
    }
    h5_ship_cost.innerHTML = `עלות שילוח ${selectedValue}₪`;
    document.getElementById("shipp_cost_label").style.display ="block";
    document.getElementById("shipp_cost_label").innerHTML ="";
    document.getElementById("shipp_cost_label").appendChild(h5_ship_cost);
    document.getElementById("addressdiv").style.display = "block"; 
  }else{
    hasShip =false;
    document.getElementById("shipp_cost_label").style.display ="none";
    document.getElementById("addressdiv").style.display = "none";
  }
  let tmp = total_price_after_sales_shipping;
  tmp += shipmentcost;
  document.getElementById("totalprice_with_ship").innerHTML = tmp+"&nbsp;₪";
});

function closeorder(){
  document.getElementById("ccc").style.backgroundColor="white";
  document.getElementById("ccc").style.textAlign="center";

  let popresult = document.getElementById("all_content_pop_div");

  let address = "";
  let num_house = "";
  if(hasShip){
    address = document.getElementById("autocomplete-input").value;
    num_house = document.getElementById("numhouse").value;
  }
    
  if (hasShip ==true && address.length ==0) {
    popresult.innerHTML = `<h1 style="color:red">אנא בחרו רחוב</h1>`;
    openPopup();
    return;
  }
  if (hasShip ==true && num_house.length == 0) {
    popresult.innerHTML = `<h1 style="color:red">אנא הזינו מספר בית</h1>`;
    openPopup();
    return;
  }
  address = address.trim();
  address += `,${num_house}`;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  if (name.trim() === '') {
    popresult.innerHTML = `<h1 style="color:red">אנא הכניסו שם מלא</h1>`;
    openPopup();
    return;
  }
  if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    popresult.innerHTML = `<h1 style="color:red">אנא הכניסו כתובת מייל תקינה</h1>`;
    openPopup();
    return;
  }
  phone = phone.replace(/-/g, ''); // Remove dashes
  if (!phone.match(/^05\d{8}$/)) {
    popresult.innerHTML = `<h1 style="color:red">טלפון חייב להכיל 10 ספרות</h1>`;
    openPopup();
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("name", name);
  urlencoded.append("phone", phone);
  urlencoded.append("shipmentAddress", address);
  urlencoded.append("email", email);
  urlencoded.append("shipmentcost",shipmentcost );
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/order/add", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let msgdata = data.msg;
    setTimeout(() => {
      if(msgdata == 1){
        sessionStorage.clear();
        let orderdata = JSON.stringify(data.order);
        sessionStorage.setItem("order",orderdata);
        location.replace('/success');
      }else{
        popresult.innerHTML = `<h1 style="color:red">ניתן לבצע הזמנה בטווח של 30 דק׳ בין הזמנה להזמנה</h1>`;
        openPopup();
      }
      }, 2000);
    });
}

const city = 'אשקלון';
fetch(`https://data.gov.il/api/3/action/datastore_search?resource_id=1b14e41c-85b3-4c21-bdce-9fe48185ffca&q=${city}&limit=100000`).then(response => response.json()).then(data => {
  const streets = data.result.records.map(record => record.street_name.trim().replace(/\s+/g, ' '));
  const collator = new Intl.Collator('he');
  const addedStreets = []; // array to keep track of added streets
  streets.sort(collator.compare);
  const input = document.getElementById('autocomplete-input');
  const results = document.getElementById('autocomplete-results');
  function autocomplete(value) {
    if (value.trim() === '') {
      results.innerHTML = '';
      return;
    }
    results.innerHTML = '';
    const filteredStreets = streets.filter(street => street.toLowerCase().includes(value.toLowerCase()));
    filteredStreets.forEach(street => {
      const li = document.createElement('li');
      li.addEventListener('click', event => {
        input.value = street;
        results.innerHTML = '';
      });
      li.textContent = street;
      results.appendChild(li);
    });
  }
  input.addEventListener('input', event => {
    autocomplete(event.target.value);
  });
});

function add_to_wish(sku){

  var is_logged_header = JSON.parse(sessionStorage.getItem("logged"));
  var membership_header = JSON.parse(sessionStorage.getItem("member_acount"));
    if(is_logged_header){
        membership_header = JSON.parse(sessionStorage.getItem("member_acount"));
        var favorites_header = membership_header.Favorite;
        if(favorites_header.includes(sku)){
          flag_fav_header = true;
          document.getElementById(`${sku}_cart`).classList.add("fa-solid");
        }
      
    }else {
        document.getElementById("ccc").style.backgroundColor="white";
        document.getElementById("ccc").style.textAlign="center";
        
        document.getElementById("all_content_pop_div").innerHTML = "צריך להתחבר למועדון כדי להוסיף למועדפים";
        openPopup();
      
      return;
    }
    if (flag_fav_header) {
      remove_prod_from_favorite_header(sku);
    } else {
      
      add_prod_to_favorite_header(sku);
    }
  
}


let btn_coupons = document.getElementById('coupon_btn');
btn_coupons.addEventListener('click', function() {
  let code_coupon = document.getElementById('code_coupon').value;
  let state_coupon = JSON.parse(sessionStorage.getItem("state_coupon")) || false;
  if(code_coupon.length == 0){
    document.getElementById("ccc").style.backgroundColor = "white";
    document.getElementById("ccc").style.textAlign = "center";

    document.getElementById("all_content_pop_div").innerHTML = `<h1 style="color:red;">ערך לא יכול להיות ריק</h1>`;
    openPopup();
    return;
  } 
  if(!state_coupon){
    sessionStorage.setItem("code_cop",JSON.stringify(code_coupon));
    console.log(code_coupon.length);
    fetch('/cart/apply_coupon_on_cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CouponCode: code_coupon }) 
    }).then((res) => res.json()).then((data) => {
        if(data.msg == null){
          document.getElementById("ccc").style.backgroundColor = "white";
          document.getElementById("ccc").style.textAlign = "center";
          document.getElementById("all_content_pop_div").innerHTML = `<h1 style="color:red;">הקופון לא נמצא או לא פעיל  </h1>`;
          openPopup();
          return;
        }
        else{
          sessionStorage.setItem("state_coupon",JSON.stringify(!state_coupon));
          let cart = data.msg;
          document.getElementById("ccc").style.backgroundColor = "white";
          document.getElementById("ccc").style.textAlign = "center";
          let tot = 0;
          for(let i = 0; i < cart.length; i++){
            tot += cart[i].sum; 
          }
          document.getElementById("all_content_pop_div").innerHTML = `<h1 style="color:red;">הקופון הופעל  </h1>`;
          openPopup();
          sessionStorage.setItem('cart', cart);
          setTimeout(() => {
            location.reload();
          }, 1200);
        }
      });

      
  }else{
    document.getElementById("ccc").style.backgroundColor = "white";
    document.getElementById("ccc").style.textAlign = "center";
    document.getElementById("code_coupon").value = "";
    document.getElementById('code_coupon').readOnly = false;
    document.getElementById("all_content_pop_div").innerHTML = `<h1 style="color:red;"> הקופון בוטל </h1>`;
    openPopup();
    cancel_coupon();

    sessionStorage.setItem("state_coupon",JSON.stringify(!state_coupon));
    btn_coupons.textContent = "הפעל קופון";
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
 
});
function cancel_coupon(){
 var myHeaders = new Headers();
 var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow'
 };
 fetch("/cart/cancel_coupon", requestOptions).then((res)=>{return res.json()}).then((data)=>{
  sessionStorage.setItem("cart",JSON.stringify(data.msg));
  setTimeout(() => {
    location.reload();
  }, 500);
  
 });

}


function update_sales_desc() {
  var sales_desc = document.getElementById("sales_desc");
  fetch('/coupon/get_coupon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ CouponCode: JSON.parse(sessionStorage.getItem("code_cop")) }) 
  }).then((res) => res.json()).then((data) => {
    let coupon  = data.msg;
      if(coupon != null)
        sales_desc.innerHTML += `<i>קופון - ${coupon.name}  `;
      
    })
}
