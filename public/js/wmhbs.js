let title_of_banner = "";
let category_id ;
let title_of_banner_prods = "";
let category_id_prods ;
let title_of_banner_rashi = "";
let category_id_banner_rashi ;
let category_href_banner_rashi ;
let all_catogroy_configuration = [];
let str_alert =  ` <h1 id="the_alert_sure"> האם אתם בטוחים ?</h1>
<input type="text" style="display: none;" id="run_id">
<button class="btn btn-primary" id="confirm-btn">המשך בכל זאת </button>`;
window.onload = function() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  document.getElementById("setteings_items").addEventListener('click',close_panell2);
  if(isMobile){
    close_panell();
  }

  // hide_display(12);
  const submitBtn = document.getElementById('upload-btn');
  submitBtn.disabled = true;
}

function toggleSection(id) {
  
  var section = document.getElementById(id);
  const ols = document.getElementsByTagName("ol");
  const btns =  document.querySelectorAll(".toggle-btn");
  var button = section.querySelector('.toggle-btn');
  var ol = section.querySelector('ol');

  for(let i=0;i<ols.length;i++){
    btns[i].innerHTML ='<i class="fa fa-plus" aria-hidden="true"></i>' ; 
    if(ols[i] != ol){
      ols[i].style.display = "none";
    }
  }
  if (ol.style.display === 'none') {
    ol.style.display = 'block';
    button.innerHTML = '<i class="fa fa-minus" aria-hidden="true"></i>';
  } else {
    ol.style.display = 'none';
    button.innerHTML = '<i class="fa fa-plus" aria-hidden="true"></i>';
  }
}

function hide_display(id){
  
  switch(id){
    case 3:
      getProds();
    break;
    case 4:
      getManagers();
    break;
    case 6: 
      getMembers_confirm();
    break;
    case 8:
      loadRules();
    break;
    case 9:
      get_orders();
    break; 
    case 10:
     
    break;  
    case 12:
      getMembers();
    break;   
    case 13:
      getMembers_not_confirm();
    break;
    case 14:
      load_the_current_banner();
      load_banner_rashi();
      get_categories_banners();
      
      
    break;   
    case 15:
      load_the_current_banner_prods();
     
    case 17:
      Get_logs();  
    break;  
    case 19:
      Get_Coupons();  
    break; 
    case 22:
      getIPWhitelist();
    break;
    case 23:
       getURLRedirects();
    break;  
    case 24:
       getAllContent();
      break;
    case 25:
      get_Update_Content();
      break;
    case 28:
      chartFunc();
    break;  
  }

  //viewing the according view 
  setTimeout(() => {
    close_panell2();

    let container = document.getElementById("your-div-id");
    let len = container.querySelectorAll('article').length + container.querySelectorAll('section').length;
    for(let i =1;i<=len;i++){
      document.getElementById(`${i}`).style.display="none";
    }

    document.getElementById(`${id}`).style.display="block";
  }, 100);

}

function addman(){
  var email = document.getElementById("emailman").value;
  var username_reg = document.getElementById("username_reg").value;
  var pass = document.getElementById("passman").value;
  if(!isValidEmail(email)){
    document.getElementById("manager_ltl").innerHTML = "הכנס כתובת מייל חוקית";
    return;
  }
  if(pass.length < 8 ){
    document.getElementById("manager_ltl").innerHTML = "סיסמא באורך 8 תווים לפחות ";
    return;
  }
  if(username_reg.trim() == ''){
    document.getElementById("manager_ltl").innerHTML = "שם משתמש לא יכול להיות ריק";
    return;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", pass);
  urlencoded.append("username", username_reg);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/managers/addmanager", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    if(data.msg.email == email){
      document.getElementById("manager_ltl").innerHTML = "מנהל חדש נוסף";
      return;
    }
    else {
      document.getElementById("manager_ltl").innerHTML = data.msg;
      return;
    }
  });
  make_alog('managers','add-manager',`הכנסת מנהל חדש ${username_reg}`);
}
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
 }

function delmember(Email){ 
  make_alog('membership','deleta-membership',`מחיקת מועדון אימייל: ${Email}`);
  fetch(`/member/del/${Email}`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{  
    let popresult = document.getElementById("all_content_pop_div");
    popresult.innerHTML  = `<h1 style="color:red;"> חבר מועדון נמחק</h1>`;
    openPopup();  
    setTimeout(() => {
      location.reload();
    }, 2000);
  });
}

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

function delmanager(mid){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("mid", mid);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  make_alog('managers','delete-manager',`מחיקת מנהל איידי: ${mid}`);
  fetch("/managers/delete", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    setTimeout(() => {
      let popresult = document.getElementById("all_content_pop_div");
      popresult.innerHTML  = data.msg;
      openPopup();
    }, 700);
    setTimeout(() => {
      location.reload();
    }, 2000);
  });
}
function getManagers() {
  document.getElementById('tbody3').innerHTML = '';
  fetch(`/managers/getall`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
    let arr = data.msg;
    let stringinner ='';
    for(let i=0;i< arr.length;i++){
      stringinner = '<tr><td data-th="אידי">'+arr[i].mid+'</td><td data-th="שם">'+arr[i].username+'</td><td data-th="מייל">'+arr[i].email+'</td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick="delmanager(`'+arr[i].mid+'`)" >מחק מנהל</button></td></tr>';
        document.getElementById('tbody3').innerHTML += stringinner;          
    }  
  });
}


function getMembers_confirm() {
  document.getElementById('tbody').innerHTML = '';
  fetch(`/member/all3`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
    let arr = data.msg;
    let stringinner ='';
    for(let i=0;i< arr.length;i++){
      stringinner = '<tr><td data-th="מייל">'+arr[i].Email+'</td><td data-th="שם">'+arr[i].Name+'</td><td data-th="שם משפחה">'+arr[i].Lastname+'</td><td data-th="נייד">'+arr[i].Phone+'</td><td data-th="כתובת">'+arr[i].Address+'</td><td data-th="ת. לידה">'+arr[i].Dob+'</td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick="delmember(`'+arr[i].Email+'`)" >מחק חבר מועדון</button></td></tr>';    
      document.getElementById('tbody').innerHTML += stringinner;          
    }  
  });
}

function getMembers() {
  document.getElementById("tbody_12").innerHTML='';
  fetch(`/member/all_`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
    let arr = data.msg;
    let stringinner ='';
    for(let i=0;i< arr.length;i++){
      stringinner = '<tr><td data-th="מייל">'+arr[i].Email+'</td><td data-th="שם">'+arr[i].Name+'</td><td data-th="שם משפחה">'+arr[i].Lastname+'</td><td data-th="נייד">'+arr[i].Phone+'</td><td data-th="כתובת">'+arr[i].Address+'</td><td data-th="ת. לידה">'+arr[i].Dob+'</td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick="delmember(`'+arr[i].Email+'`)" >מחק חבר מועדון</button></td></tr>';    
      document.getElementById('tbody_12').innerHTML += stringinner;          
    }  
  });
}

function getMembers_not_confirm() {
  document.getElementById("tbody_13").innerHTML='';
  fetch(`/member/all_notconf`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
    let arr = data.msg;
    if(arr == null) {
      document.getElementById("13").style.textAlign = "center";
      let h1 = document.createElement("h1");
      h1.style.color = "#F6A756";
      h1.innerText = "לא נמצאו";
      document.getElementById("13").appendChild(h1);
      return;
    }
    let stringinner ='';
    for(let i=0;i< arr.length;i++){
      stringinner = '<tr><td data-th="מייל">'+arr[i].Email+'</td><td data-th="שם">'+arr[i].Name+'</td><td data-th="שם משפחה">'+arr[i].Lastname+'</td><td data-th="נייד">'+arr[i].Phone+'</td><td data-th="כתובת">'+arr[i].Address+'</td><td data-th="ת. לידה">'+arr[i].Dob+'</td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick="delmember(`'+arr[i].Email+'`)" >מחק חבר מועדון</button></td></tr>';    
      document.getElementById('tbody_13').innerHTML += stringinner;          
    }  
  });
}

let currentPage_prods = 1;
let rowsPerPage_prods = 10;
let len_din_prods = 0;




function getProds() {
  document.getElementById('tbody2').innerHTML = '';
  let startIndex = (currentPage_prods - 1) * rowsPerPage_prods;
  fetch(`/product/all`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
     let arr = data.msg;
    len_din_prods = arr.length;
    let endIndex = startIndex + rowsPerPage_prods;
    let tableRows = '';
    for (let i = startIndex; i < endIndex && i < arr.length; i++) {
      let sale_str = arr[i].Sale;
      if(sale_str.length > 20)
        sale_str = sale_str.slice(0, 20);
      let row  = '<tr><td data-th="Number">'+i+'</td><td data-th="מקט">'+arr[i].Sku+'</td><td data-th="שם מוצר">'+arr[i].ProdName+'</td><td data-th="תמונה"><img style="height:50px; width:50px;" src="/public/pics/'+arr[i].Url+'" /></td><td data-th="מחיר">'+arr[i].Price+'</td><td data-th="מידע מוצר">'+arr[i].Description+'</td><td data-th="קטגוריה">'+arr[i].NetanelPid+'</td><td data-th="מבצע">'+sale_str+'</td><td data-th="כמות">'+arr[i].Qty+'</td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick=delProd(`'+arr[i].Sku+'`)> מחק מוצר</button></td></tr>'; 
      tableRows += row;              
    } 
    document.getElementById('tbody2').innerHTML += tableRows;  
    
    updatePaginationStatus_prods();
 
  });


  
}

document.getElementById('rows-per-page-prods').addEventListener('change', function(event) {
  rowsPerPage_prods = parseInt(event.target.value);
  currentPage_prods = 1;
  getProds();
  
});

document.getElementById('prev-page-btn-prods').addEventListener('click', function(event) {
  if (currentPage_prods > 1) {
    currentPage_prods--;
    getProds();
    
  }
});

document.getElementById('next-page-btn-prods').addEventListener('click', function(event) {
  if (currentPage_prods < Math.ceil(len_din_prods / rowsPerPage_prods)) {
    currentPage_prods++;
    getProds();
    
  }
});

function updatePaginationStatus_prods() {
  const totalPages = Math.ceil(len_din_prods / rowsPerPage_prods);
  const currentPageText = document.getElementById('current-page-text');
  currentPageText.textContent = `עמוד ${currentPage_prods}/${totalPages}`;
}


function get_orders() {
  document.getElementById("tbody_orders").innerHTML='';
  fetch(`/order/get_all`,{method:'GET'}).then((res)=>{return res.json()}).then((data)=>{   
    let arr = data.msg;
    if(arr == null) {
      document.getElementById("9").style.textAlign = "center";
      let h1 = document.createElement("h1");
      h1.style.color = "#F6A756";
      h1.innerText = "לא נמצאו הזמנות";
      document.getElementById("9").appendChild(h1);
      return;
    }
    let stringinner ='';
    for (let i = 0; i < arr.length; i++) {
      let statusOptions = `<select id="statusOption" name="${arr[i].orderId}" class="select_status">`;
      statusOptions += '<option value="1"' + (arr[i].status === 1 ? ' selected' : '') + '>ממתין לטיפול</option>';
      statusOptions += '<option value="2"' + (arr[i].status === 2 ? ' selected' : '') + '>בטיפול</option>';
      statusOptions += '<option value="3"' + (arr[i].status === 3 ? ' selected' : '') + '>הושלם</option>';
      statusOptions += '<option value="4"' + (arr[i].status === 4 ? ' selected' : '') + '>הזמנה מבוטלת</option>';
      statusOptions += '</select>';
      let paymentOptions = `<select id="paymentOption" name="${arr[i].orderId}" class="select_payment">`;
      paymentOptions += '<option value="true"' + (arr[i].hasPayment ? ' selected' : '') + '>הזמנה שולמה</option>';
      paymentOptions += '<option value="false"' + (!arr[i].hasPayment ? ' selected' : '') + '>הזמנה לא שולמה</option>';
      paymentOptions += '</select>';
      let deliveredOptions = `<select id="deliveredOption" name="${arr[i].orderId}" class="select_delivered">`;
      deliveredOptions += '<option value="true"' + (arr[i].hasDeliverd ? ' selected' : '') + '>הזמנה נמסרה</option>';
      deliveredOptions += '<option value="false"' + (!arr[i].hasDeliverd ? ' selected' : '') + '>הזמנה לא נמסרה</option>';
      deliveredOptions += '</select>';
      const stringinner = '<tr><td data-th="מזהה הזמנה">' + arr[i].orderId + '</td><td data-th="סטטוס">' + arr[i].status + '</td><td data-th="צפייה בהזמנה"><a class="btn btn-primary btn-xl" href="/public/invoices/invoice_' + arr[i].orderId + '.pdf" >לחץ לצפייה</a></td><td data-th="פעולה"><button class="btn btn-primary btn-xl" onClick=deleteOrder(`' + arr[i].orderId + '`)> מחק הזמנה</button></td><td data-th="מצב">' + statusOptions + '</td><td data-th="תשלום">' + paymentOptions + '</td><td data-th="מסירה">' + deliveredOptions + '</td></tr>';
      document.getElementById('tbody_orders').innerHTML += stringinner;
    }
    const selectElements = document.querySelectorAll('.select_status');
    selectElements.forEach((selectElement) => {
      selectElement.addEventListener('change', (event) => {
        const orderId = event.target.getAttribute('name');
        const status = event.target.value;
        changeOrderStatus(orderId, status);
      });
    });
    const paymentElements = document.querySelectorAll('.select_payment');
    paymentElements.forEach((paymentElement) => {
      paymentElement.addEventListener('change', (event) => {
        const orderId = event.target.getAttribute('name');
        const hasPayment = event.target.value === 'true';
        changeOrderPaymentStatus(orderId, hasPayment);
      });
    });

    const deliveredElements = document.querySelectorAll('.select_delivered');
    deliveredElements.forEach((deliveredElement) => {
      deliveredElement.addEventListener('change', (event) => {
        const orderId = event.target.getAttribute('name');
        const hasDeliverd = event.target.value === 'true';
        changeOrderDeliveredStatus(orderId, hasDeliverd);
      });
    });

  });
}

function changeOrderStatus(orderId,status){  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("orderId", orderId);
  urlencoded.append("status", status);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  make_alog('orders','change-order-status',`הזמנה מספר: ${orderId} לסטטוס- ${status}`);
  fetch("/order/update_status", requestOptions);
}
function changeOrderDeliveredStatus(orderId,hasDeliverd){  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("orderId", orderId);
  urlencoded.append("hasDeliverd", hasDeliverd);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  make_alog('orders','change-order-shipment',`הזמנה מספר: ${orderId} נשלחה- ${hasDeliverd}`);
  fetch("/order/update_delivred", requestOptions);

}
function changeOrderPaymentStatus(orderId,hasPayment){  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("orderId", orderId);
  urlencoded.append("hasPayment",hasPayment );
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  make_alog('orders','change-order-payment',`הזמנה מספר: ${orderId} שולמה- ${hasPayment}`);
  fetch("/order/update_paymnet", requestOptions);

}

function delProd(Sku){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch(`/product/delparam/${Sku}`, requestOptions).then((res)=>{return res.json()}).then((data)=>{
    alert(data.msg);
    let popresult = document.getElementById("all_content_pop_div");
    popresult.innerHTML  = data.msg;
    openPopup();
    setTimeout(() => {
      make_alog('products','delete-products',`נמחק מוצר מקט: ${Sku}`);
      location.reload();
    }, 2300);
  });

}
const category_btn_imp = document.getElementById("category_import_btn");
category_btn_imp.addEventListener("click", function(){
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML  = str_alert;
  document.getElementById("run_id").value= 4;
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
  openPopup();
});
async function category_import() {
  
  let popresult = document.getElementById("all_content_pop_div");

  const myHeaders = new Headers();
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  try {
    const res = await fetch("/category/catgsheet", requestOptions);
    const data = await res.json();
    if (data.msg) {
      setTimeout(() => {

        popresult.innerHTML  = `<h1 style="color:red;"> ${data.msg}</h1>`;
        openPopup();
        make_alog('categories','category_import',`import categories from drive into db`);
      }, 5000); 
    
    }
  } catch (error) {
    console.error('Error occurred during fetch request:', error);
  }
}



const importbtn = document.getElementById("import-button");

importbtn.addEventListener("click", function(){
  
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML = str_alert;
  openPopup();
  document.getElementById("run_id").value=1;
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
});


function run_according_to_id(){
  let run_id = document.getElementById("run_id").value;
  if(run_id == 1){
    importProduct();
  }
  if(run_id == 2){
    clearorders();
  }
  if(run_id == 3){
    clearcarts();
  }
  if(run_id == 4){
    category_import();
  }
  if(run_id == 5){
    delete_image_prod();
  }
  if(run_id == 6){
    backup_to_db_func();
    
  }
  if(run_id == 7){
    backup_to_folder_func();
    
  }
  if(run_id == 8){
    clear_db_collection_func();
    
  }
  closePopup();
  
}


  
function importProduct(){
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("Email", document.getElementById("emailImport").value);
  var requestOptions = {
    method: 'POST',
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/product/csvprods", requestOptions);
  setTimeout(() => {
    make_alog('import','import-products','הרצת ייבוא מוצרים');
      window.location.reload();
  },5000);
}

function deleteOrder(orderId){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("orderId", orderId);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/order/close", requestOptions);
  make_alog('orders','delete-one-order',`מחיקת הזמנה: ${orderId}`);
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML = '<h1 style="color:red;">ההזמנה נמחקה</h1>';
  openPopup();
  setTimeout(() => {
    location.reload();
  }, 3000);
}

const slear_cart_btn = document.getElementById("clear_carts");
slear_cart_btn.addEventListener("click", function(){
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value=3;
  openPopup();
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
});
function clearcarts(){
  var myHeaders = new Headers();
  var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
  };
  make_alog('cart','clear-carts','מחיקת כל הסלים');
  fetch("/cart/remove_all_carts", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let popresult = document.getElementById("all_content_pop_div");
    popresult.innerHTML  = `<h1 style="color:red;">סלים נמחקו</h1>`;
    openPopup();
    setTimeout(() => {
      location.reload();
    }, 2000);
    
  });
}

const delete_orders_btn = document.getElementById("delete_orders");
delete_orders_btn.addEventListener("click", function(){
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value=2;
  openPopup();
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
});
function clearorders(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  make_alog('orders','delete-all-orders','מחיקת כל ההזמנות');
  fetch("/order/delete_all", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    alert("הזמנות נמחקו");
    location.reload();
  });
}


function disp(){
  document.getElementById("disp").style.display="block";
}

const catfileInputs = document.querySelectorAll('input[name^="catfile"]');
const previewImage_banner_cats = document.querySelectorAll('img[id^="catpic"]');
for(let i = 0;i<catfileInputs.length;i++){
  catfileInputs[i].addEventListener('change',() => {
    const file = catfileInputs[i].files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        previewImage_banner_cats[i].src = reader.result;
      });
      reader.readAsDataURL(file);
    } else {
      previewImage_banner_cats[i].src = '';
    }
  });
}



const fileInput_banner_rashi = document.getElementById('banner_rashi_pic');
const previewImage_banner_rashi = document.getElementById('preview_image_banner_rahsi');


fileInput_banner_rashi.addEventListener('change', () => {
  const file = fileInput_banner_rashi.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      previewImage_banner_rashi.src = reader.result;
    });

    reader.readAsDataURL(file);
  } else {
    previewImage_banner_rashi.src = '';
  }
});


function load_banner_rashi(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_banner_rashi", requestOptions).then((res)=>{
    return res.json()}).then((configData)=>{
      configData =  JSON.parse(configData);
      title_of_banner_rashi = configData.title;
      let tech = configData.href;
      category_href_banner_rashi = tech;
      tech = tech.split('?')[1];
      category_id_banner_rashi = "";
      for(let i = 0;i<tech.length;i++){
        if(tech[i]!='&'){
          category_id_banner_rashi+=tech[i];
        }else break;
      }
      
      category_id_banner_rashi = category_id_banner_rashi.split('=')[1];
      document.getElementById("preview_image_banner_rahsi").src = configData.src;
    });

}

function load_the_current_banner(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_views_hp", requestOptions).then((res)=>{return res.json()}).then((configData)=>{
    configData =  JSON.parse(configData);
    title_of_banner = configData.title;
    category_id = configData.cid;

  });
}
function load_the_current_banner_prods(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_views_prods", requestOptions).then((res)=>{return res.json()}).then((configData)=>{
    configData =  JSON.parse(configData);
    title_of_banner_prods = configData.title;
    category_id_prods = configData.cid;
    Edit_View();
  });
}

function Edit_View(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("/category/all", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    var array =  data.msg;

    var select = document.getElementById('view_category_select');
    var select2 = document.getElementById('view_category_select2');
    var select3 = document.getElementById('view_category_select3');
   
    select.innerHTML = '';
    select2.innerHTML = '';
    select3.innerHTML = '';

    for (var i = 0; i < array.length; i++) {

      var option = document.createElement("option");
      var option2 = document.createElement("option");
      var option3 = document.createElement("option");
  
      option.value = array[i].cid;
      option2.value = array[i].cid;
      option3.value = array[i].cid;

      option.text = array[i].name;
      option2.text = array[i].name;
      option3.text = array[i].name;
    
      if (array[i].cid === category_id) {
        option.selected = true;
        quill.root.innerHTML = title_of_banner;
      }
      if (array[i].cid === category_id_prods) {
        option2.selected = true;
        quill2.root.innerHTML = title_of_banner_prods;
      }
      if (array[i].cid === category_id_banner_rashi) {
        option3.selected = true;
        quill3.root.innerHTML = title_of_banner_rashi;
      }

      select.appendChild(option);  
      select2.appendChild(option2); 
      select3.appendChild(option3); 
    }
    

    var select4 = document.getElementById('view_category_select4');
    var select5 = document.getElementById('view_category_select5');
    var select6 = document.getElementById('view_category_select6');
    var select7 = document.getElementById('view_category_select7');
    var select8 = document.getElementById('view_category_select8');
    var select9 = document.getElementById('view_category_select9');

    select4.innerHTML = '';
    select5.innerHTML = '';
    select6.innerHTML = '';
    select7.innerHTML = '';
    select8.innerHTML = '';
    select9.innerHTML = '';

    for( var i = 0; i < array.length;i++){
      var option_cat1 = document.createElement("option");
      option_cat1.value = array[i].cid;
      option_cat1.text = array[i].name;

      var option_cat2 = document.createElement("option");
      option_cat2.value = array[i].cid;
      option_cat2.text = array[i].name;

      var option_cat3 = document.createElement("option");
      option_cat3.value = array[i].cid;
      option_cat3.text = array[i].name;

      var option_cat4 = document.createElement("option");
      option_cat4.value = array[i].cid;
      option_cat4.text = array[i].name;

      var option_cat5 = document.createElement("option");
      option_cat5.value = array[i].cid;
      option_cat5.text = array[i].name;

      var option_cat6 = document.createElement("option");
      option_cat6.value = array[i].cid;
      option_cat6.text = array[i].name;
      
      for(let j = 0;j<all_catogroy_configuration.length;j++){
        let all_cat_current_cid =  all_catogroy_configuration[j].href;
        all_cat_current_cid = all_cat_current_cid.split('?')[1].split('&')[0].split('=')[1];
        if(array[i].cid == all_cat_current_cid ){
          switch(j){
            case 0:
              option_cat1.selected = true;
              document.getElementById("catpic_1").src = all_catogroy_configuration[j].src;
              document.getElementById("cot1").value = all_catogroy_configuration[j].title;
              break;
            case 1:
              option_cat2.selected = true;
              document.getElementById("catpic_2").src = all_catogroy_configuration[j].src;
              document.getElementById("cot2").value = all_catogroy_configuration[j].title;
              break;
            case 2:
              option_cat3.selected = true;
              document.getElementById("catpic_3").src = all_catogroy_configuration[j].src;
              document.getElementById("cot3").value = all_catogroy_configuration[j].title;
              break; 
            case 3:
              option_cat4.selected = true;
              document.getElementById("catpic_4").src = all_catogroy_configuration[j].src;
              document.getElementById("cot4").value = all_catogroy_configuration[j].title;
              break;
            case 4:
              option_cat5.selected = true;
              document.getElementById("catpic_5").src = all_catogroy_configuration[j].src;
              document.getElementById("cot5").value = all_catogroy_configuration[j].title;
              break;      
            case 5:
              option_cat6.selected = true;
              document.getElementById("catpic_6").src = all_catogroy_configuration[j].src;
              document.getElementById("cot6").value = all_catogroy_configuration[j].title;
              break;            
          }
        }
      }
      select4.appendChild(option_cat1); 
      select5.appendChild(option_cat2); 
      select6.appendChild(option_cat3); 
      select7.appendChild(option_cat4); 
      select8.appendChild(option_cat5); 
      select9.appendChild(option_cat6); 
    }
  
  });

  const saveButton = document.getElementById('save_button');
  const saveButtonProds = document.getElementById('save_button_prods');
  const select = document.getElementById('view_category_select');
  const select2 = document.getElementById('view_category_select2');
  


   saveButton.addEventListener('click', () => {
    
     let title_of_banner = quill.root.innerHTML;
     const selectedValue = select.value;
     const cidview = JSON.stringify({ cid: selectedValue,title: title_of_banner});
     var myHeaders = new Headers();
     myHeaders.append("Content-Type", "application/json");
     var requestOptions = {
       method: 'POST',
       headers: myHeaders,
       body: cidview,
       redirect: 'follow'
     };
     make_alog('view','save-view',`שמירת עיצוב דף הבית - ${cidview}`);
     fetch("/save-views_hp", requestOptions);
      setTimeout(() => {
        document.getElementById("banner_prods_crosela_literal").innerHTML = "שמירת באנר קרוסלת מוצרים הצליחה";
      }, 300);
   });
  saveButtonProds.addEventListener('click', () => {
    let title_of_banner_prods = quill2.root.innerHTML;
    const selectedValue = select2.value;
    const cidview = JSON.stringify({ cid: selectedValue,title: title_of_banner_prods});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: cidview,
      redirect: 'follow'
    };
    make_alog('view','save-view',`שמירת עיצוב דף עמוד מוצר - ${cidview}`);
    fetch("/save-views_prods", requestOptions);
    setTimeout(() => {
      document.getElementById("banner_prods_literal").innerHTML = "שמירת באנר דף עמוד מוצר הצליחה";
    }, 300);
  });
}

const fileInput = document.getElementById('ProdPic');
const form = document.getElementById('upload-form');
const submitBtn = document.getElementById('upload-btn');

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileType = file.type;
    if (fileType !== 'image/png') {
      let popresult = document.getElementById("all_content_pop_div");
      popresult.innerHTML = 'מותר להעלות סיומת png בלבד';
      openPopup();
      fileInput.value = '';
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
    }
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('ProdPic', fileInput.files[0]);
  try {
    const response = await fetch('/uploadpic', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const fileName = fileInput.files[0].name;
      const downloadLink = document.createElement('a');
      downloadLink.href = `/public/pics/${fileName}`;
      downloadLink.innerText = fileName;
      downloadLink.className = "btn btn-primary";
      const downloadSection = document.getElementById('download-section');
      downloadSection.appendChild(downloadLink);
      downloadSection.appendChild(document.createElement('br'));
    } else {
      console.log('Error uploading file');
    }
  } catch (error) {
    console.log(error);
  }
});


const form3 = document.getElementById('categories_banners');
form3.addEventListener('submit',async (e) =>{
  e.preventDefault();

  const formData3 = new FormData(form3);
  const fileNames = [];

  
  for (const [key, value] of formData3.entries()) {
    
    if (value instanceof File) {
      fileNames.push(value.name);
    }
  }

  
  let jsonDataArray = [];

let selectindex_v = 4;
for(let x = 0; x < 6 ; x++){
  var filepath = "";
  if (fileNames[x]) {
    filepath = '/public/pics/' + fileNames[x];
  } else {
    const previewImage = document.getElementById(`catpic_${x+1}`);
    const url = new URL(previewImage.src);
    filepath = url.pathname; 
  }

  var titleinput = document.getElementById(`cot${x+1}`).value;
  var selectedOption = document.getElementById(`view_category_select${selectindex_v}`).options[document.getElementById(`view_category_select${selectindex_v}`).selectedIndex];
  selectindex_v++;
  let tmpcid  = selectedOption.value;
  var selectedText =selectedOption.textContent;
  let hrefstr = `/prodbycat?cid=${tmpcid}&name=${selectedText.trim()}`;

  jsonObj = {
    src: filepath,
    title:titleinput,
    href:hrefstr
  };
  
  jsonDataArray.push(jsonObj);
}

formData3.append('jsonData', JSON.stringify(jsonDataArray));
try {
  const response3 = await fetch('/save_categories_banners', {
    method: 'POST',
    body: formData3,
  });
  let popresult = document.getElementById("all_content_pop_div");
  if (response3.ok) {
    popresult.innerHTML = ` <h1>Banner saved successfully! </h1>`;
    openPopup();
    setTimeout(() => {
        location.reload();
    }, 2000);
  } else {
    popresult.innerHTML = ` <h1>Save Banner Failed</h1>`;
    openPopup();
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
} catch (error) {
  console.error('An error occurred:', error);
}


});

const form2 = document.getElementById('banner_rashi_form');
const submitBtn2 = document.getElementById('save_banner_rashi_btn');

form2.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('banner_rashi_pic');
  const fileName = fileInput.files[0]?.name;
  const formData2 = new FormData(form2);
  const quillContent = quill3.root.innerHTML;
  
  let filepath;
  
  if (fileName) {
    filepath = '../public/pics/' + fileName;
  } else {
    const previewImage = document.getElementById('preview_image_banner_rahsi');
    const url = new URL(previewImage.src);
    filepath = url.pathname; 
  }


  var selectedOption = document.getElementById("view_category_select3").options[document.getElementById("view_category_select3").selectedIndex];
  let tmpcid  = selectedOption.value;
  var selectedText = selectedOption.textContent;

  let hrefstr = `/prodbycat?cid=${tmpcid}&name=${selectedText}`;

  const jsonData = {
    src: filepath,
    title: quillContent,
    href: hrefstr
  };

  formData2.append('jsonData', JSON.stringify(jsonData));
  //{"src":"../public/pics/background.png","title":"!בקרו אצלנו היום","href":"/prodbycat?cid=pk&name=פולי קפה"}
  try {
    const response2 = await fetch('/save_banner_rashi', {
      method: 'POST',
      body: formData2,
    });
    console.log(response2);
    let popresult = document.getElementById("all_content_pop_div");
    if (response2.status === 200) {
      popresult.innerHTML = ` <h1>Banner saved successfully! </h1>`;
      openPopup();
      setTimeout(() => {
        location.reload();
      }, 2000);
    } else {
      popresult.innerHTML = ` <h1>Failed to save banner </h1>`;
      openPopup();
      setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
});


const delete_image_btn = document.getElementById("delete_image_");
delete_image_btn.addEventListener("click", function(){
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value=5;
  openPopup();
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
}); 

function delete_image_prod(){
  
  let popresult = document.getElementById("all_content_pop_div");
  let ProdPic_delete = document.getElementById("ProdPic_delete").value;
  if (!ProdPic_delete || !ProdPic_delete.endsWith(".png")) {
    popresult.innerHTML = ` <h1>שם התמונה לא יכול להיות ריק וחייב להכיל סיומת .png </h1>`;
    openPopup();
    return;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("file_name", ProdPic_delete);
  var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
  };
 
    fetch("/product/delete_image_prod", requestOptions).then((res)=>{
      return res.json()}).then((data)=>{
      document.getElementById("ltl_delete").innerHTML = data.msg;
      setTimeout(() => {
        make_alog('delete','delte-image',`מחיקת תמונה ${ProdPic_delete.fileName}`);
        location.reload();
      }, 3000);
    })

}
function make_alog(log_type, action, message){
  var userAgent = navigator.userAgent;
  var managerDetials = sessionStorage.getItem("managerDetials");
  var myHeaders = new Headers();
  var urlencoded = new URLSearchParams();
  urlencoded.append("log_type", log_type);
  urlencoded.append("action", action);
  urlencoded.append("message", message);
  urlencoded.append("userAgent", userAgent);
  urlencoded.append("managerDetials", managerDetials);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  
  fetch("/logs/add", requestOptions);
}


let currentPage = 1;
let rowsPerPage = 10;
let len_din = 0;

function Get_logs(){
  close_panell();
  document.getElementById('tbody_logs').innerHTML = '';
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  let startIndex = (currentPage - 1) * rowsPerPage;
  fetch("/logs/get_all_logs", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let arr = data.msg;
    len_din = arr.length;
    let endIndex = startIndex + rowsPerPage;
    let tableRows = '';
    for (let i = startIndex; i < endIndex && i < arr.length; i++) {
      let user_agent =  arr[i].userAgent;
      if(user_agent.length > 50)
        user_agent = user_agent.substring(0,50);
      let row = '<tr><td data-th="Number">'+i+'</td><td data-th="מזהה לוג">'+arr[i].log_id+'</td><td data-th="סוג לוג">'+arr[i].log_type+'</td><td data-th="פעולה שבוצעה">'+arr[i].action+'</td><td data-th="תוכן">'+arr[i].message+'</td><td data-th="פרטי מכשיר">'+user_agent+'</td><td data-th="פרטי מנהל">'+arr[i].managerDetials+'</td><td data-th="נוצר ב">'+arr[i].created_at+'</td></tr>';
      tableRows += row;
    }
   
  
    document.getElementById('tbody_logs').innerHTML = tableRows;
    updatePaginationStatus_logs();
  });

}
function updatePaginationStatus_logs(){
  const totalPages = Math.ceil(len_din / rowsPerPage);
  const currentPageText = document.getElementById('current-page-logs');
  currentPageText.textContent = `עמוד ${currentPage}/${totalPages}`;
}


document.getElementById('rows-per-page').addEventListener('change', function(event) {
  rowsPerPage = parseInt(event.target.value);
  currentPage = 1;
  Get_logs();
});

document.getElementById('prev-page-btn').addEventListener('click', function(event) {
  if (currentPage > 1) {
    currentPage--;
    Get_logs();
  }
});

document.getElementById('next-page-btn').addEventListener('click', function(event) {
  if (currentPage < Math.ceil(len_din / rowsPerPage)) {
    currentPage++;
    Get_logs();
  }
});


var backup_to_db = document.getElementById("backup_to_db");
let popresult = document.getElementById("all_content_pop_div");

backup_to_db.addEventListener("click", function(){
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value= 6;
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
  openPopup();
});

var backup_to_folder = document.getElementById("backup_to_folder");
backup_to_folder.addEventListener("click", function(){
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value= 7;
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
  openPopup();
});

var clear_db_collection = document.getElementById("clear_db_collection");
clear_db_collection.addEventListener("click", function(){
  popresult.innerHTML = str_alert;
  document.getElementById("run_id").value= 8;
  const confirm_btn = document.getElementById("confirm-btn");
  confirm_btn.addEventListener("click",run_according_to_id);
  openPopup();
});
function backup_to_db_func(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("/pdf/saving_pdf", requestOptions).then((res)=>{
    return res.json()}).then((data)=>{
      if(data.msg != null){
         popresult.innerHTML  = "קבצי הPDF נשמרו בהצלחה במסד הנתונים";
         make_alog('pdf_binary','save-pdf-collection',`save all pdfs to db`);
         openPopup();
      }else{
         popresult.innerHTML  = "לא ניתן לגבות את הקבצים למסד הנתונים";
         openPopup();
      }
    })
}
function backup_to_folder_func(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("/pdf/saving_pdf_to_folder", requestOptions).then((res)=>{
    return res.json()}).then((data)=>{
      if(data.msg != null){
        popresult.innerHTML  = "קבצי הPDF ירדו בהצלחה לתייקיה";
        openPopup();
      } else{
        popresult.innerHTML  = " לא הצלחנו להוריד את הקבצים לתיקייה";
        openPopup();
      }
    });
}
function clear_db_collection_func(){
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("/pdf/clear_collection", requestOptions).then((res)=>{
  return res.json()}).then((data)=>{
    if(data.msg != null){
      popresult.innerHTML  = "ניקוי מסד הנתונים עבר בהצלחה";
      make_alog('pdf_binary','clear-pdf-collection',`delete all pdfs from db`);
      openPopup();
    }else{
      popresult.innerHTML  = "לא הצלחנו לנקות את מסד הנתונים";
      openPopup();
    }
  });
}


function get_categories_banners(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_categories_banners", requestOptions).then((res)=>{
    return res.json()}).then((configData)=>{
      all_catogroy_configuration = JSON.parse(configData);
      Edit_View();
    });
    
}


let currentPage_coupons = 1;
let rowsPerPage_coupons = 10;
let len_din_coupons = 0;

let arr_coupons = []; 
function Get_Coupons(){
  document.getElementById('tbody_coupons').innerHTML = '';
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  let startIndex = (currentPage_coupons - 1) * rowsPerPage_coupons;
  fetch("/coupon/get_all_coupons", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let arr = data.msg;
    arr_coupons = arr;
    if(arr == null) return;
    len_din_coupons = arr.length;
    let endIndex = startIndex + rowsPerPage_coupons;
    let tableRows = '';
    for (let i = startIndex; i < endIndex && i < arr.length; i++) {
      let row = `<tr>
        <td data-th="Number">${i}</td>
        <td data-th="קוד קופון"><input type="text" value="${arr[i].CouponCode}"></td>
        <td data-th="סוג הנחה">
          <select class="typesale-select">
            <option value="%" ${arr[i].TypeSale === '%' ? 'selected' : ''}>הנחה באחוזים</option>
            <option value="$" ${arr[i].TypeSale === '$' ? 'selected' : ''}>הנחה בכסף</option>
          </select>
        </td>
        <td data-th="שם קופון"><input type="text" value="${arr[i].name}"></td>
        <td data-th="תיאור קופון"><input type="text" value="${arr[i].shortDescription}"></td>
        <td data-th="כמות ההנחה"><input type="text" value="${arr[i].valueSale}"></td>
        <td data-th="תאריך יצירה">${arr[i].Created_At}</td>
        <td data-th="פעיל">
          <select class="active-select">
            <option value="false" ${!arr[i].Active ? 'selected' : ''}>כבוי</option>
            <option value="true" ${arr[i].Active ? 'selected' : ''}>פעיל</option>
          </select>
        </td>
      </tr>`;

      tableRows += row;
    }
   
  
    document.getElementById('tbody_coupons').innerHTML = tableRows;
    updatePaginationStatus_coupons();
  });

}

function updatePaginationStatus_coupons(){
  const totalPages = Math.ceil(len_din_coupons / rowsPerPage_coupons);
  const currentPageText_coupons = document.getElementById('current-page-coupons');
  currentPageText_coupons.textContent = `עמוד ${currentPage_coupons}/${totalPages}`;
}


document.getElementById('rows-per-page_coupons').addEventListener('change', function(event) {
  rowsPerPage_coupons = parseInt(event.target.value);
  currentPage_coupons = 1;
  Get_Coupons();
});

document.getElementById('prev-page-btn_coupons').addEventListener('click', function(event) {
  if (currentPage_coupons > 1) {
    currentPage_coupons--;
    Get_Coupons();
  }
});

document.getElementById('next-page-btn_coupons').addEventListener('click', function(event) {
  if (currentPage_coupons < Math.ceil(len_din_coupons / rowsPerPage_coupons)) {
    currentPage_coupons++;
    Get_Coupons();
  }
});



function Generate_coupon(){

  var myHeaders = new Headers();
  var urlencoded = new URLSearchParams();
  let TypeSale = document.getElementById('TypeSale_coupon').value;
  let name = document.getElementById('name_coupon').value;
  let shortDescription = document.getElementById('shortDescription_coupon').value;
  let valueSale = parseInt( document.getElementById('valueSale_coupon').value);
  let length_of_code = parseInt( document.getElementById('length_of_coupon_code').value);
  let numbers_of_coupons = parseInt( document.getElementById('numbers_of_coupons').value);
  urlencoded.append("TypeSale", TypeSale);
  urlencoded.append("name", name);
  urlencoded.append("shortDescription",shortDescription);
  urlencoded.append("valueSale", valueSale);
  urlencoded.append("length_of_code", length_of_code);
  urlencoded.append("numbers_of_coupons", numbers_of_coupons);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/coupon/generate_coupon", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let arr = data.msg;
    if(arr.length > 0){
      document.getElementById("ccc").style.backgroundColor="white";
      document.getElementById("ccc").style.textAlign="center";
    
      let popresult = document.getElementById("all_content_pop_div");
      popresult.innerHTML = `<h1 style="color:red;">הקופונים נוצרו בהצלחה</h1>`;
      openPopup();
      make_alog('coupons','generate_coupons',`numbers ofcoupons: ${numbers_of_coupons},name of coupons: ${name}`);
      setTimeout(() => {
        location.reload();
      }, 2100);
    }
  });
}





document.getElementById('tbody_coupons').addEventListener('input', function(event) {
  const target = event.target;
  const rowIndex = target.parentNode.parentNode.rowIndex - 1;
  const cellIndex = target.parentNode.cellIndex +1;

  if (arr_coupons[rowIndex]) {
    
    switch (cellIndex) {
      case 1: 
          arr_coupons[rowIndex].CouponCode = target.value;
        break;
      case 3: 
          arr_coupons[rowIndex].TypeSale = target.value;
        break;
      case 4: 
          arr_coupons[rowIndex].name = target.value;
        break;
      case 5: 
          arr_coupons[rowIndex].shortDescription = target.value;
        break;
      case 6: 
          arr_coupons[rowIndex].valueSale = parseInt(target.value);
        break;
        case 8: 
          arr_coupons[rowIndex].Active = target.value;
          
        break;
      default:
        break;
    }

    // Send the updated data to the server
    const data = {
      CouponCode: arr_coupons[rowIndex].CouponCode,
      TypeSale: arr_coupons[rowIndex].TypeSale,
      name: arr_coupons[rowIndex].name,
      shortDescription: arr_coupons[rowIndex].shortDescription,
      valueSale: arr_coupons[rowIndex].valueSale,
      active :arr_coupons[rowIndex].Active
    };

    fetch('/coupon/update_coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((data) => {
        
      }).catch((error) => {
        
        console.error(error);
      });
  }
});

function updateStatus_coupon(event, index) {
  const isActive = event.target.value === 'true';
  const couponCode = arr_coupons[index].CouponCode;
  const data = {
    CouponCode: couponCode,
    Active: isActive
  };
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  fetch('/coupon/update_coupon', requestOptions)
    .then(response => response.json()).then(updatedCoupon => {
      arr_coupons[index] = updatedCoupon;
      console.log('Coupon status updated successfully:', updatedCoupon);
    })
    .catch(error => {
      console.error('Error updating coupon status:', error);
    });
}

function Create_coupon(){

  var myHeaders = new Headers();
  var urlencoded = new URLSearchParams();
  let TypeSale = document.getElementById('TypeSale_coupon_personal').value;
  let name = document.getElementById('name_coupon_personal').value;
  let shortDescription = document.getElementById('shortDescription_coupon_personal').value;
  let valueSale = parseInt( document.getElementById('valueSale_coupon_personal').value);
  let coupon_code_personal = document.getElementById('coupon_code_personal').value;
  urlencoded.append("TypeSale", TypeSale);
  urlencoded.append("name", name);
  urlencoded.append("shortDescription",shortDescription);
  urlencoded.append("valueSale", valueSale);
  urlencoded.append("CouponCode", coupon_code_personal);
  

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/coupon/create_coupon", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    let coupon = data.msg;
    if(coupon != null){
      document.getElementById("ccc").style.backgroundColor="white";
      document.getElementById("ccc").style.textAlign="center";
      
      let popresult = document.getElementById("all_content_pop_div");
      popresult.innerHTML = `<h1 style="color:red;">הקופון נוצר בהצלחה - ${coupon.CouponCode}</h1>`;
      openPopup();
      make_alog('coupons','create_coupon',`coupon code: ${coupon.CouponCode}, coupon name: ${coupon.name}`);
      setTimeout(() => {
        location.reload();
      }, 2100);
    }
  });
}



// Function to send an AJAX request to the server to update the IP whitelist
function updateIPWhitelist(whitelist) {
  fetch('/whitelist/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ whitelist })
  })
    .then(response => {
      if (response.ok) {
        console.log('IP whitelist updated successfully');
      } else {
        console.error('Failed to update IP whitelist');
      }
    })
    .catch(error => {
      console.error('Error updating IP whitelist:', error);
    });
}

// Function to add new IP and name fields
function addFields() {
  const inputContainer = document.getElementById('inputContainer');

  const fieldWrapper = document.createElement('div');
  fieldWrapper.className = 'field-wrapper row'; // Add 'row' class for Bootstrap styling

  const ipInputWrapper = document.createElement('div');
  ipInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

  const nameInputWrapper = document.createElement('div');
  nameInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

  const deleteButtonWrapper = document.createElement('div');
  deleteButtonWrapper.className = 'col-md-2'; // Adjust the column size as per your preference

  const ipInput = document.createElement('input');
  ipInput.type = 'text';
  ipInput.className = 'form-control';
  ipInput.name = 'ipAddress';
  ipInput.required = true;

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'form-control';
  nameInput.name = 'name';
  nameInput.required = true;

  const ipLabel = document.createElement('label');
  ipLabel.htmlFor = 'ipInput';
  ipLabel.textContent = 'IP Address:';

  const nameLabel = document.createElement('label');
  nameLabel.htmlFor = 'nameInput';
  nameLabel.textContent = 'Name:';

  const ipFormGroup = document.createElement('div');
  ipFormGroup.className = 'form-group';
  ipFormGroup.appendChild(ipLabel);
  ipFormGroup.appendChild(ipInput);

  const nameFormGroup = document.createElement('div');
  nameFormGroup.className = 'form-group';
  nameFormGroup.appendChild(nameLabel);
  nameFormGroup.appendChild(nameInput);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button btn btn-primary'; 
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; 
  deleteButton.addEventListener('click', () => {
    const ipAddress = ipInput.value;
    const name = nameInput.value;

    delete_ip_from_whiteList({ ipAddress, name });
    fieldWrapper.remove();
    make_alog('white_list','delete-ip',`delete: ip Address: ${ipAddress} name: ${name}`);
  });

  ipInputWrapper.appendChild(ipFormGroup);
  nameInputWrapper.appendChild(nameFormGroup);
  deleteButtonWrapper.appendChild(deleteButton);

  fieldWrapper.appendChild(ipInputWrapper);
  fieldWrapper.appendChild(nameInputWrapper);
  fieldWrapper.appendChild(deleteButtonWrapper);

  inputContainer.appendChild(fieldWrapper);
}

const formips = document.getElementById('ipWhitelistForm');
formips.addEventListener('submit', event => {
  event.preventDefault();
  
  const whitelist = [];
  const ipAddressInputs = document.getElementsByName('ipAddress');
  const nameInputs = document.getElementsByName('name');
  

  for (let i = 0; i < ipAddressInputs.length; i++) {
    const ipAddress = ipAddressInputs[i].value;
    const name = nameInputs[i].value;
  
    whitelist.push({ ipAddress, name });
  }
  

  const ips = [];
    for (let i = 0; i < ipAddressInputs.length; i++) {
      const ipAddress = ipAddressInputs[i].value;
      const name = nameInputs[i].value;
      ips.push({ ipAddress, name });
    }
  updateIPWhitelist(ips);
  make_alog('white_list','update Whitelist',`update:  ${JSON.stringify(ips)} `);
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML  = `<h1 style="color:red;">כתובות אייפי עודכנו</h1>`;
  openPopup();
  setTimeout(() => {
    location.reload();
  }, 1700);
  
});
const addAfterButton = document.getElementById('addAfter');
addAfterButton.addEventListener('click', addFields);
function getIPWhitelist() {
  close_panell();
  fetch('/whitelist/get')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch IP whitelist');
      }
    })
    .then(whitelist => {
      populateFields(whitelist);
    })
    .catch(error => {
      console.error('Error fetching IP whitelist:', error);
    });
}
function populateFields(whitelist) {
  const inputContainer = document.getElementById('inputContainer');

  // Remove any existing field wrappers
  while (inputContainer.firstChild) {
    inputContainer.removeChild(inputContainer.firstChild);
  }

  // Iterate over the whitelist data and add field wrappers with corresponding values
  for (const item of whitelist) {
    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'field-wrapper row'; // Add 'row' class for Bootstrap styling

    const ipInputWrapper = document.createElement('div');
    ipInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

    const nameInputWrapper = document.createElement('div');
    nameInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

    const deleteButtonWrapper = document.createElement('div');
    deleteButtonWrapper.className = 'col-md-2'; // Adjust the column size as per your preference

    const ipInput = document.createElement('input');
    ipInput.type = 'text';
    ipInput.className = 'form-control';
    ipInput.name = 'ipAddress';
    ipInput.required = true;
    ipInput.value = item.ipAddress; // Set the IP address value

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control';
    nameInput.name = 'name';
    nameInput.required = true;
    nameInput.value = item.name; // Set the name value

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button btn btn-danger'; // Add Bootstrap classes for styling
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Replace with your desired trash icon markup
    deleteButton.addEventListener('click', () => {
      const ipAddress = ipInput.value;
      const name = nameInput.value;

      delete_ip_from_whiteList({ ipAddress, name });
      fieldWrapper.remove();
      make_alog('white_list','delete-ip',`delete: ip Address: ${ipAddress} name: ${name}`);
      
    });

    ipInputWrapper.appendChild(ipInput);
    nameInputWrapper.appendChild(nameInput);
    deleteButtonWrapper.appendChild(deleteButton);

    fieldWrapper.appendChild(ipInputWrapper);
    fieldWrapper.appendChild(nameInputWrapper);
    fieldWrapper.appendChild(deleteButtonWrapper);

    inputContainer.appendChild(fieldWrapper);
  }
}
function delete_ip_from_whiteList({ ipAddress, name }) {
  fetch('/whitelist/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ipAddress, name })
  })
    .then(response => {
      if (response.ok) {
        console.log(`IP address ${ipAddress} deleted from the whitelist`);
      } else {
        console.error('Failed to delete IP address from the whitelist');
      }
    })
    .catch(error => {
      console.error('Error deleting IP address:', error);
    });
}

//redirects
// Function to send an AJAX request to the server to update the URL redirect requests
async function updateURLRedirects(redirects) {
  fetch('/redirects/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ redirects })
  })
  .then((res)=>{return res.json()}).then((data)=>{
    console.log(data);
  })
  
}









// Function to add new URL input fields
function addURLFields() {
  const urlInputContainer = document.getElementById('urlInputContainer');

  const urlFieldWrapper = document.createElement('div');
  urlFieldWrapper.className = 'url-field-wrapper row'; // Add 'row' class for Bootstrap styling

  const urlInputWrapper = document.createElement('div');
  urlInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

  const redirectInputWrapper = document.createElement('div');
  redirectInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

  const deleteButtonWrapper = document.createElement('div');
  deleteButtonWrapper.className = 'col-md-2'; // Adjust the column size as per your preference

  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.className = 'form-control';
  urlInput.name = 'url';
  urlInput.required = true;

  const redirectInput = document.createElement('input');
  redirectInput.type = 'text';
  redirectInput.className = 'form-control';
  redirectInput.name = 'redirect';
  redirectInput.required = true;

  const urlLabel = document.createElement('label');
  urlLabel.htmlFor = 'urlInput';
  urlLabel.textContent = 'Request Path:';

  const redirectLabel = document.createElement('label');
  redirectLabel.htmlFor = 'redirectInput';
  redirectLabel.textContent = 'Target Path:';

  const urlFormGroup = document.createElement('div');
  urlFormGroup.className = 'form-group';
  urlFormGroup.appendChild(urlLabel);
  urlFormGroup.appendChild(urlInput);

  const redirectFormGroup = document.createElement('div');
  redirectFormGroup.className = 'form-group';
  redirectFormGroup.appendChild(redirectLabel);
  redirectFormGroup.appendChild(redirectInput);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button btn btn-primary';
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener('click', () => {
    const url = urlInput.value;
    const redirect = redirectInput.value;
    urlFieldWrapper.remove();
  });

  urlInputWrapper.appendChild(urlFormGroup);
  redirectInputWrapper.appendChild(redirectFormGroup);
  deleteButtonWrapper.appendChild(deleteButton);

  urlFieldWrapper.appendChild(urlInputWrapper);
  urlFieldWrapper.appendChild(redirectInputWrapper);
  urlFieldWrapper.appendChild(deleteButtonWrapper);

  urlInputContainer.appendChild(urlFieldWrapper);
}

const formUrls = document.getElementById('urlRedirectForm');
formUrls.addEventListener('submit', event => {
  event.preventDefault();

  const redirects = [];
  const urlInputs = document.getElementsByName('url');
  const redirectInputs = document.getElementsByName('redirect');

  for (let i = 0; i < urlInputs.length; i++) {
    const url = urlInputs[i].value;
    const redirect = redirectInputs[i].value;

    redirects.push({Request_path:url,Target_path:redirect });
  }

  setTimeout(() => {
    updateURLRedirects(redirects);
  }, 2000); 
  make_alog('redirects','update-redirect',`update: request path${redirects[redirects.length-1].Request_path} target path: ${redirects[redirects.length-1].Target_path}`);
  let popresult = document.getElementById("all_content_pop_div");
  popresult.innerHTML  = `<h1 style="color:red;">ריידרייקטים עודכנו</h1>`;
  openPopup();
});

const addUrlButton = document.getElementById('addUrl');
addUrlButton.addEventListener('click', addURLFields);

async function getURLRedirects() {
 
  await fetch('/redirects/get')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch URL redirects');
      }
    })
    .then(redirects => {


      populateURLFields(redirects);
    })
    .catch(error => {
      console.error('Error fetching URL redirects:', error);
    });
}

function populateURLFields(redirects) {
  const urlInputContainer = document.getElementById('urlInputContainer');

  while (urlInputContainer.firstChild) {
    urlInputContainer.removeChild(urlInputContainer.firstChild);
  }
  redirects = redirects.redirects_data;
  for (const item of redirects) {
    const urlFieldWrapper = document.createElement('div');
    urlFieldWrapper.className = 'url-field-wrapper row'; // Add 'row' class for Bootstrap styling

    const urlInputWrapper = document.createElement('div');
    urlInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

    const redirectInputWrapper = document.createElement('div');
    redirectInputWrapper.className = 'col-md-4'; // Adjust the column size as per your preference

    const deleteButtonWrapper = document.createElement('div');
    deleteButtonWrapper.className = 'col-md-2'; // Adjust the column size as per your preference

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'form-control';
    urlInput.name = 'url';
    urlInput.required = true;
    urlInput.value = item.Request_path;

    const redirectInput = document.createElement('input');
    redirectInput.type = 'text';
    redirectInput.className = 'form-control';
    redirectInput.name = 'redirect';
    redirectInput.required = true;
    redirectInput.value = item.Target_path;

    const urlLabel = document.createElement('label');
    urlLabel.htmlFor = 'urlInput';
    urlLabel.textContent = 'Request Path:';

    const redirectLabel = document.createElement('label');
    redirectLabel.htmlFor = 'redirectInput';
    redirectLabel.textContent = 'Target Path:';

    const urlFormGroup = document.createElement('div');
    urlFormGroup.className = 'form-group';
    urlFormGroup.appendChild(urlLabel);
    urlFormGroup.appendChild(urlInput);

    const redirectFormGroup = document.createElement('div');
    redirectFormGroup.className = 'form-group';
    redirectFormGroup.appendChild(redirectLabel);
    redirectFormGroup.appendChild(redirectInput);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button btn btn-danger';
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener('click', () => {
      const url = urlInput.value;
      const redirect = redirectInput.value;
      urlFieldWrapper.remove();
    });

    urlInputWrapper.appendChild(urlFormGroup);
    redirectInputWrapper.appendChild(redirectFormGroup);
    deleteButtonWrapper.appendChild(deleteButton);

    urlFieldWrapper.appendChild(urlInputWrapper);
    urlFieldWrapper.appendChild(redirectInputWrapper);
    urlFieldWrapper.appendChild(deleteButtonWrapper);

    urlInputContainer.appendChild(urlFieldWrapper);
  }
}

async function getAllContent(){
  var myHeaders = new Headers();


  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

fetch("/content/get", requestOptions).then((res)=>{return res.json()}).then((data)=>{
  console.log(data);
    // Get the table body element
    const tbody = document.getElementById("tbody_content");

    // Generate table rows and populate data
    data.data.forEach((item, index) => {
        // Create a new row
        const row = document.createElement("tr");

        // Create and append the table cells
        const indexCell = document.createElement("td");
        indexCell.textContent = index + 1;
        row.appendChild(indexCell);

        const idCell = document.createElement("td");
        idCell.textContent = item.usid;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const lnameCell = document.createElement("td");
        lnameCell.textContent = item.lname;
        row.appendChild(lnameCell);

        const mailCell = document.createElement("td");
        mailCell.textContent = item.mail;
        row.appendChild(mailCell);

        const phoneCell = document.createElement("td");
        phoneCell.textContent = item.phone;
        row.appendChild(phoneCell);

        const contentCell = document.createElement("td");
        contentCell.textContent = item.content;
        row.appendChild(contentCell);

        const editCell = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.classList.add();
        btnEdit.textContent = "מחק";
        btnEdit.onclick = function (){
          deleteContent(item.usid);
        }
        row.appendChild(editCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
})

}

async function deleteContent(id){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("usid", id);
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  
  fetch("content/delete/", requestOptions)

}



async function getAllContent(){
  var myHeaders = new Headers();


  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

fetch("/content/get", requestOptions).then((res)=>{return res.json()}).then((data)=>{
  console.log(data);
    // Get the table body element
    const tbody = document.getElementById("tbody_content");

    // Generate table rows and populate data
    data.data.forEach((item, index) => {
        // Create a new row
        const row = document.createElement("tr");

        // Create and append the table cells
        const indexCell = document.createElement("td");
        indexCell.textContent = index + 1;
        row.appendChild(indexCell);

        const idCell = document.createElement("td");
        idCell.textContent = item.usid;
        row.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const lnameCell = document.createElement("td");
        lnameCell.textContent = item.lname;
        row.appendChild(lnameCell);

        const mailCell = document.createElement("td");
        mailCell.textContent = item.mail;
        row.appendChild(mailCell);

        const phoneCell = document.createElement("td");
        phoneCell.textContent = item.phone;
        row.appendChild(phoneCell);

        const contentCell = document.createElement("td");
        contentCell.textContent = item.content;
        row.appendChild(contentCell);

        const editCell = document.createElement("td");
        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-primary";
        btnEdit.textContent = "מחק";
        btnEdit.onclick = function (){
          deleteContent(item.usid);
        }
        editCell.appendChild(btnEdit);
        row.appendChild(editCell);

        // Append the row to the table body
        tbody.appendChild(row);
    });
})

}

async function deleteContent(id){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("usid", id);
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("content/delete/", requestOptions);
  setTimeout(() => {
    location.reload();
  }, 2000);

}

async function get_Update_Content() {
  var myHeaders = new Headers();

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("/content/get", requestOptions)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // Get the select element
      sessionStorage.setItem("contents",JSON.stringify(data));
      var selectElement = document.getElementById('select_content');

      // Loop through the data and create options
      data.data.forEach((item) => {
        // Create the option element
        var option = document.createElement('option');
        option.style.color = "red";
        option.value = item.usid; // Use the _id as the value
        option.text = ` ${item.name} - ${item.content.substring(0,15)} ... `; // Use name and lname as the text

        // Append the option to the select element
        selectElement.appendChild(option);
      });
    });
}



document.getElementById('select_content').addEventListener('change', function() {
  let contents = JSON.parse(sessionStorage.getItem("contents")); 

  var selectedOption = this.options[this.selectedIndex];
  var selectedUsid = selectedOption.value;
  // Find the selected data object in the "data" array based on the "usid"
  var selectedData = contents.data.find(item => item.usid === selectedUsid);
  document.getElementById('usid_header').textContent = `פנייה מספר - ${selectedUsid}`;

  var btn_response = document.createElement("button");
  btn_response.onclick = function(){
    UpdateContent(selectedUsid);
  };
  btn_response.className = "btn btn-primary btn-block";
  btn_response.textContent = "הגב לפנייה";
  
  var contentForm = document.getElementById('content_form');
  var formgroupbtn = document.getElementById('form-groupbtn');

  var lastChild = formgroupbtn.lastElementChild;
  if (lastChild && lastChild.tagName === 'BUTTON') {
    formgroupbtn.removeChild(lastChild);
  }
  formgroupbtn.appendChild(btn_response);
  
  // Update the HTML elements with the selected data
  document.getElementById('FirstName').value = selectedData.name;
  document.getElementById('LastName').value = selectedData.lname;
  document.getElementById('Email').value = selectedData.mail;
  document.getElementById('Phone').value = selectedData.phone;
  document.getElementById('Content').value = selectedData.content;
  
  // Show the hidden form section
  contentForm.style.display = "block";

});



async function  UpdateContent(usid){
    let Manager_response = document.getElementById('Manager_response').value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


    var urlencoded = new URLSearchParams();
    urlencoded.append("usid", usid);
    urlencoded.append("managerResponse",Manager_response);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

   await fetch("/content/update", requestOptions).then((res) => {
      return res.json();
    })
    .then((data) => {
      if(data != null){
        let popresult = document.getElementById("all_content_pop_div");
        popresult.innerHTML  = `<h1 style="color:red;"> תשובתך נשלחה ללקוח במייל</h1>`;
        openPopup();  
      }
    });
}
async function set_redirects(){

  var myHeaders = new Headers();


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("/redirects/set_redirects", requestOptions)
  .then(response => response.text())
  .then(result => {
    let popresult = document.getElementById("all_content_pop_div");
    popresult.innerHTML  = `<h4 style="color:red;">${result}</h4>`;
    openPopup();  
    setTimeout(() => {
      location.reload();
    }, 2500);
  })
  .catch(error => console.log('error', error));
}

function chartFunc() {
  // Get the canvas element
  var canvas = document.getElementById("myChart");
  var ctx = canvas.getContext("2d");
  var labels = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  // Fetch the data
  fetch("/reports/get")
    .then(response => response.json())
    .then(data => {
      console.log(data[0]);
      // Set the chart data
      var chartData = {
        labels: labels,
        datasets:data
        
      };

      // Create the chart
      var myChart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}











