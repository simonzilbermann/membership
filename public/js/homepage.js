
let category_id;
let title_of_banner = "";
window.addEventListener("load", function () {
  get_cid();
  get_view_banners();
  get_categories_banners();
});




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
  fetch("/get_views_hp", requestOptions).then((res)=>{
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
            carouselInner =    '<div class="col-md-6 col-lg-4 mb-4 mb-md-0"><div class="card text-black" ><a  href="/'+chunk[j].Sku+'" style="text-decoration: none;"><img style="max-height:300px ; max-width:400px;" src="/public/pics/'+chunk[j].Url+'" class="card-img-top" /></a><div class="card-body"><div class="text-center"><h4 class="card-title">'+chunk[j].ProdName+'</h4><h6 class="display-5 fw-bolder" style="font-size:25px;" >'+chunk[j].Price+'₪ </h6></div><div class="text-center"><div class="d-flex flex-column mb-4"></div> <a class="btn btn-outline-dark mt-auto" href="/'+chunk[j].Sku+'" style="text-decoration: none;">בקרו אותי</a></div><div class="d-flex flex-row"></div></div></div></div>';
            inside_div.innerHTML += carouselInner;
          }
          div.appendChild(inside_div);
          document.getElementById("carousel-inner").appendChild(div);
        }
      });
  });
}

function get_view_banners(){

  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_banner_rashi", requestOptions).then((res)=>{
    return res.json()}).then((configData)=>{
      configData =  JSON.parse(configData);
      
      document.getElementById("rashi_href").href= configData.href;

      document.getElementById("tmona_rashit").src = configData.src;
      document.getElementById("tmona_rashit").alt = configData.title;

      document.getElementById("coteret_rashit").innerHTML = configData.title;

    });
    
}

function get_categories_banners(){
  const imgElements = document.querySelectorAll('img[id^="catpic"]');
  const imgArray = Array.from(imgElements);

  const spanElements = document.querySelectorAll('span[id^="cattext"]');
  const spanArray = Array.from(spanElements);

  const aElements = document.querySelectorAll('a[id^="ref"]');
  const aArray = Array.from(aElements);
  

  var myHeaders = new Headers();
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch("/get_categories_banners", requestOptions).then((res)=>{
    return res.json()}).then((configData)=>{
      configData =  JSON.parse(configData);
      aArray.forEach((aElement,index)=>{
        aElement.href = configData[index].href;
      });

      imgArray.forEach((imgElement, index) => {
        imgElement.src = configData[index].src;
        imgElement.alt = configData[index].title;
      });
      spanArray.forEach((spanElement,index)=>{
          spanElement.textContent = configData[index].title;
      });
    

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