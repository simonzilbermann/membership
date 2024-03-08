window.addEventListener("load", function () {
  get_cid();


});

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
var urlencoded = new URLSearchParams();
const urlParams = new URLSearchParams(window.location.search);
const cid = urlParams.get('cid');
const namecat = urlParams.get('name');


urlencoded.append("cid",cid );
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};
fetch('/category/getprodbycid', requestOptions).then((res)=>{return res.json()}).then((data)=>{          
  if(data.msg != 0){
    let array = data.msg;
    let stringinner = ''; 
    if(array.length ==1){
      document.getElementById("sortcat").style.display = "none";
    }
    document.getElementById("cat_name_head").innerHTML += namecat;   

    for(let i = 0;i < array.length; i++){
      if(array[i].Qty > 0 ){
        stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+array[i].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <div class="d-flex flex-column mb-4"> <span> מבצע מועדון:'+array[i].Sale+'</span></div> <div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">'+array[i].Description+'</h5></div><a class="btn btn-outline-dark mt-auto" href="/'+array[i].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
        document.getElementById("rrr").innerHTML += stringinner;
      }
      else{
        stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4></div><div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">מוצר זה אזל במלאי</h5></div></div></div></div>';
        document.getElementById("rrr").innerHTML += stringinner;
      }
    }
  }
  else{
    document.getElementById("sortcat").style.display = "none";
    document.getElementById("rrr").innerHTML = "";
    document.getElementById("cat_name_head").innerHTML = ' אין מוצרים בקטגוריה ';
  }
});




const select2 = document.querySelector("#price-select");
select2.addEventListener("change", function() {
  const selectedValue2 = this.value;
  if(selectedValue2 == "maxtomin"){
    document.getElementById("rrr").innerHTML = "";
    MaxToMin();
  }
  else if(selectedValue2 == "mintomax" ) {
    document.getElementById("rrr").innerHTML = "";
    MinToMax();
  }
  else func(); return;
});

function MaxToMin() {
  const urlParams = new URLSearchParams(window.location.search);
  const cid = urlParams.get('cid');
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("CatId", cid);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/category/maxtomin", requestOptions).then((res)=>{return res.json()}).then((data)=>{        
    if(data.msg != 0){
      let array = data.msg;
      let stringinner = '';       
      for(let i = 0;i < array.length; i++){
        if(array[i].Qty > 0 ){
          stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+array[i].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <div class="d-flex flex-column mb-4"> <span> מבצע מועדון:'+array[i].Sale+'</span></div> <div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">'+array[i].Description+'</h5></div><a class="btn btn-outline-dark mt-auto" href="/'+array[i].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
          document.getElementById("rrr").innerHTML += stringinner;
        }
        else{
          stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4></div><div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">מוצר זה אזל במלאי</h5></div></div></div></div>';
          document.getElementById("rrr").innerHTML += stringinner;
        }
      }
    }  
  });
   
}
function MinToMax(){
  const urlParams = new URLSearchParams(window.location.search);
  const cid = urlParams.get('cid');
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("CatId", cid);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };
  fetch("/category/mintomax", requestOptions).then((res)=>{return res.json()}).then((data)=>{        
    if(data.msg != 0){
      let array = data.msg;
      let stringinner = '';        
      for(let i = 0;i < array.length; i++){
        if(array[i].Qty > 0 ){
          stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+array[i].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <div class="d-flex flex-column mb-4"> <span> מבצע מועדון:'+array[i].Sale+'</span></div> <div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">'+array[i].Description+'</h5></div><a class="btn btn-outline-dark mt-auto" href="/'+array[i].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
          document.getElementById("rrr").innerHTML += stringinner;
        }
        else{
          stringinner = '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+array[i].Sku+'" style="text-decoration: none;"> <img style="max-height:300px ; max-width:400px;" src="/public/pics/'+array[i].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center mt-1"><h4 class="card-title">'+array[i].ProdName+'</h4></div><div class="p-3 mx-n3 mb-4" > <h5 class="mb-0">מוצר זה אזל במלאי</h5></div></div></div></div>';
          document.getElementById("rrr").innerHTML += stringinner;
        }
      }
    }
  });
}




function groupProducts(products, itemsPerSlide) {
  const groups = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    groups.push(products.slice(i, i + itemsPerSlide));
  }
  return groups;
}

function  get_cid(){
  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_views_prods", requestOptions).then((res)=>{
    return res.json()}).then((configData)=>{
      configData =  JSON.parse(configData);
      var myHeaders = new Headers();
      document.getElementById("title_of_banner").innerHTML = configData.title;
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var urlencoded = new URLSearchParams();
      urlencoded.append("cid", configData.cid);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };
      fetch("/category/getprodbycid", requestOptions).then((res) => {return res.json();}).then((data) => {
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
            carouselInner =    '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+chunk[j].Sku+'" style="text-decoration: none;"><img style="max-height:300px ; max-width:400px;" src="/public/pics/'+chunk[j].Url+'" class="card-img-top" /> </a><div class="card-body"><div class="text-center"><h4 class="card-title">'+chunk[j].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+chunk[j].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <a class="btn btn-outline-dark mt-auto" href="/'+chunk[j].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
            inside_div.innerHTML += carouselInner;
          }
          div.appendChild(inside_div);
          document.getElementById("carousel-inner").appendChild(div);
        }
      });

  });
}
setTimeout(() => {
  get_cat_for_icons();
}, 1000);
function get_cat_for_icons(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("/category/all", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    var array =  data.msg;
    for(let i=0;i<array.length;i++){
      if(array[i].cid == cid ){
        var icon = document.getElementById("icon_category").setAttribute("src",`/public/pics/${array[i].icon}`);
        break;
      }
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


