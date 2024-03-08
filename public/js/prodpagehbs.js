const urlParams = new URLSearchParams(window.location.search);
const sku = urlParams.get('sku');
sessionStorage.setItem("sku",sku);
document.getElementById("skuprod").innerHTML="SKU: "+sku;
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
var urlencoded = new URLSearchParams();
urlencoded.append("Sku",sku);
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch("/product/getbyid", requestOptions).then((res)=>{return res.json()}).then((data)=>{
  document.getElementById("imgprod").src = "/public/pics/"+data.msg[0].Url;
  sessionStorage.setItem("cid",data.msg[0].NetanelPid);
  sessionStorage.setItem("price",data.msg[0].Price);
  sessionStorage.setItem("name",data.msg[0].ProdName);

  document.getElementById("nameprod").innerHTML=data.msg[0].ProdName ;
  if(data.msg[0].Qty > 0){
    document.getElementById("prodprice").innerHTML = data.msg[0].Price+" ₪";
    document.getElementById("proddesc").innerHTML=data.msg[0].Description;
    document.getElementById("prodsale").innerHTML=data.msg[0].Sale;
  }
  else{
    document.getElementById("addcart").style.display="none";
    document.getElementById("qtyExist").style.display = "none";
    document.getElementById("NotExistQty").style.display = "block";
    document.getElementById("msg").innerHTML = "המוצר אזל במלאי";
  }
});

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
setTimeout(() => {
  const sku = urlParams.get('sku');
  let heartClass = 'fa-regular';
  var is_logged = JSON.parse( sessionStorage.getItem("logged"));
  if(is_logged){
    var membership = JSON.parse(sessionStorage.getItem("member_acount"));
    membership = JSON.parse(sessionStorage.getItem("member_acount"));
    var favorites = membership.Favorite;
    if ( favorites.includes(sku)) {
      heartClass = 'fa-solid';
    }
    document.getElementById("heart").classList.add(heartClass);
  }
  
  let cid = sku.split('-')[0];
  var urlencoded = new URLSearchParams();
  urlencoded.append("cid", cid);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/category/getprodbycid", requestOptions).then((res)=>{return res.json()}).then((data)=>{
        const products = data.msg;
        const itemsPerSlide = getItemsPerSlide();
        const productGroups = groupProducts(products, itemsPerSlide);
        var carouselInner = "";
        for(let i=0;i<productGroups.length;i++){
          var div = document.createElement("div");
          if(i == 0){
            div.className = "carousel-item active";
          } else {
            div.className = "carousel-item";
          }
          var chunk =  productGroups[i];
          var inside_div = document.createElement("div");
          inside_div.style.display = "flex";
          for(let j=0;j<chunk.length;j++){ 
            carouselInner ='<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+chunk[j].Sku+'" style="text-decoration: none;"><img style="max-height:300px ; max-width:400px;" src="/public/pics/'+chunk[j].Url+'" class="card-img-top" /></a><div class="card-body"><div class="text-center"><h4 class="card-title">'+chunk[j].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+chunk[j].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <a class="btn btn-outline-dark mt-auto" href="/'+chunk[j].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
            inside_div.innerHTML += carouselInner;
          }
          div.appendChild(inside_div);
          document.getElementById("carousel-inner").appendChild(div);
        }
  });
}, 1000);

function addtocart(){
  let pic = document.getElementById("imgprod").src;
  let sku = sessionStorage.getItem("sku");
  let name = sessionStorage.getItem("name");
  let price = sessionStorage.getItem("price");
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("productSku", sku);
  urlencoded.append("productName", name);
  urlencoded.append("productPrice",price );
  urlencoded.append("quantity", 1);
  urlencoded.append("prodPic", pic);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/cart/addtocart", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    document.getElementById("all_content_pop_div").innerHTML = "";
    document.getElementById("all_content_pop_div").innerHTML = "<h4>המוצר נוסף לסל בהצלחה!</h4><br><h4>אולי תתעניינו גם במוצרים המובילים שלנו</h4>";
    var div = document.getElementById('all_content_pop_div');
    div.classList.add('search__container--active');
    div.style.height='600px';
    div.style.overflow='auto';
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
  
    fetch('/category/popular_prods',requestOptions).then((res)=>{return res.json()}).then((data)=>{
      var prods = data.msg;
      for(let i = 0;i<prods.length;i++){
          let str =  `<a href="/${prods[i].Sku}" style="text-decoration: none;color:black;">
                        <div class="search__container-card">
                          <div class="search__container-image">
                              <img style="max-height: 100px; max-width: 100px;" src="/public/pics/${prods[i].Sku}.png" alt="">
                          </div>
                          <span class="search__container-des">${prods[i].ProdName}</span>
                          <span class="search__container-price">₪ ${prods[i].Price}</span>
                        </div>
                      </a>`;
          div.innerHTML += str;         
        }
  
    });
  
    openPopup();
    get_cart_header();
  return;
  });
}


document.getElementById("add_to_Favorite").addEventListener("click", function() {
var flag_fav = false;
var is_logged = JSON.parse( sessionStorage.getItem("logged"));
var membership = JSON.parse(sessionStorage.getItem("member_acount"));
if(is_logged){
  membership = JSON.parse(sessionStorage.getItem("member_acount"));
  var favorites = membership.Favorite;
  console.log(favorites);
  const sku = urlParams.get('sku');
  if(favorites.includes(sku)){
    flag_fav = true;
    document.getElementById("heart").classList.add("fa-solid");
  }
}
  if(!is_logged) {
      document.getElementById("all_content_pop_div").innerHTML = "";
      document.getElementById("all_content_pop_div").innerHTML = "<h4>צריך להתחבר למועדון כדי להוסיף למועדפים</h4>";
      openPopup();
      setTimeout(() => {
        closePopup();
      }, 4500);
    return;
  }
  if (flag_fav) {
    remove_prod_from_favorite();
  } else {
    
    add_prod_to_favorite();
  }
 
});



function remove_prod_from_favorite(){
  var membership = JSON.parse(sessionStorage.getItem("member_acount"));
  let email = membership.Email;
  const sku = urlParams.get('sku');
  var allsku = membership.Favorite;
  console.log(typeof allsku);
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
      document.getElementById("all_content_pop_div").innerHTML = "";
      document.getElementById("all_content_pop_div").innerHTML = "<h4>המוצר הוסר בהצלחה</h4>";
      all_content_pop_div;
      setTimeout(() => {
        closePopup();
      }, 2500);
    }
  });
}
function add_prod_to_favorite(){
  var membership = JSON.parse(sessionStorage.getItem("member_acount"));
  let email = membership.Email;
  const sku = urlParams.get('sku');
  var allsku = membership.Favorite;
  allsku+= ","+sku;
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
  fetch("/member/add_favorite_member", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    
    if(data.msg  > 0 ){
      flag_fav = true;
      document.getElementById("heart").classList.add("fa-solid");
      document.getElementById("all_content_pop_div").innerHTML = "";
      document.getElementById("all_content_pop_div").innerHTML = "<h4>המוצר נוסף בהצלחה</h4>";
      openPopup();
      setTimeout(() => {
        closePopup();
      }, 2500);
    }
  });
}

function get_membership(email){
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
  fetch("/get_by_email", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    if(data.msg!= null){
      sessionStorage.setItem("member_acount",JSON.stringify(data.msg));
    }
  });
}

function getItemsPerSlide() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  if (vw >= 1200) {
    return 3;
  } else if (vw >= 992) {
    return 2;
  } else if (vw >= 768) {
    return 2;
  } else {
    return 1;
  }
}
function groupProducts(products, itemsPerSlide) {
  const groups = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    groups.push(products.slice(i, i + itemsPerSlide));
  }
  return groups;
}


