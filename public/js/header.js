"use strict";

window.onload = function() {
  // Retrieve the client's IP address
  fetch('https://api.ipify.org/?format=json')
    .then(response => response.json())
    .then(data => {
      // Save the IP address in sessionStorage
      console.log(data.ip);
      sessionStorage.setItem('ipAddress', data.ip);
      save_client_ip();
    })
    .catch(error => {
      console.error('Error:', error);
    });
};
const slider = document.querySelector(".slider");
const sliderCon = document.querySelector(".slider__slides-cont");
const slides = document.getElementsByClassName("slider__slide");
const btnLeft = document.querySelector(`.slider__nav--left`);
const btnRight = document.querySelector(`.slider__nav--right`);
let currentSlideIndex = 0;
let lastSlideIndex = slides.length - 1;

function goToSlide(slideIndex) {
  [...slides].forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
  });
  currentSlideIndex = slideIndex;
}
goToSlide(currentSlideIndex);

function readyNextSlide() {
  if (currentSlideIndex === 0) {
    [...slides].forEach((s, _) => {
      s.style.display = `block`;
    });
    slides[0].insertAdjacentElement("beforebegin", slides[lastSlideIndex]);
    slides[0].style.transform = `translateX(-${100}%)`;
    currentSlideIndex++;
  }

  if (currentSlideIndex === lastSlideIndex) {
    slides[lastSlideIndex].insertAdjacentElement("afterend", slides[0]);
    slides[lastSlideIndex].style.transform = `translateX(${100}%)`;
    currentSlideIndex--;
  }
}

readyNextSlide();

function shiftSlides(direction) {
  direction ? currentSlideIndex++ : currentSlideIndex--;

  if (currentSlideIndex === lastSlideIndex || currentSlideIndex === 0)
    readyNextSlide();
  goToSlide(currentSlideIndex);
}

let automate = true;

const Automation = {
  id: null,
  timeInterval: 5000,

  start: function () {
    this.id = setInterval(function () {
      shiftSlides(1);
    }, this.timeInterval);
  },
  reset: function () {
    clearInterval(this.id);
    this.start();
  },
};

if (automate) {
  Automation.start();
}


var startTime = 0;
var endTime = 0;
var benchmarkTime = 200;
var startPos = 0;
var endPos = 0;
var deltaPos = 0;
var halfSlideWidth = sliderCon.getBoundingClientRect().width / 2;

var resizeTimeout;

sliderCon.addEventListener("touchstart", function (e) {
  e.preventDefault();
  startTime = new Date();
  startPos = e.changedTouches[0].clientX;
});
sliderCon.addEventListener("touchend", function (e) {
  e.preventDefault();
  endTime = new Date();
  endPos = e.changedTouches[0].clientX;
  deltaPos = endPos - startPos;

  if (endTime - startTime < benchmarkTime || deltaPos >= halfSlideWidth) {
    if (deltaPos === 0) return;
    else if (deltaPos > halfSlideWidth * 0.1) {
      shiftSlides(0);
    }
  }
  if (endTime - startTime < benchmarkTime || deltaPos <= -halfSlideWidth) {
    if (deltaPos === 0) return;
    else if (deltaPos < -halfSlideWidth * 0.1) {
      shiftSlides(1);
    }
  }
  this.style.transform = "translateX(" + 0 + "px)";
  this.style.transition = "all 0.2s ";

  Automation.reset();
});

sliderCon.addEventListener("touchmove", function (e) {
  e.preventDefault();
  deltaPos = e.changedTouches[0].clientX - startPos;

  this.style.transition = "none";
  clearInterval(Automation.id);
  this.style.transform = "translateX(" + deltaPos + "px)";
});

window.onresize = function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    halfSlideWidth =
      slides[currentSlideIndex].getBoundingClientRect().width / 2;
  }, 500);
};

sliderCon.addEventListener("mouseenter", function (e) {
  clearInterval(Automation.id);
});
sliderCon.addEventListener("mouseleave", function (e) {
  clearInterval(Automation.id);
  Automation.reset();
});

btnRight.addEventListener("click", function (e) {
  shiftSlides(0);
  Automation.reset();
});
btnLeft.addEventListener("click", function (e) {
  shiftSlides(1);
  Automation.reset();
});




const headerCon = document.querySelector(".header-container__content");
const header = document.querySelector(".header");

const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    headerCon.classList.add("header-container__content--color");
    headerLogo.classList.add("header-container__logo--active");
  } else {
    headerCon.classList.remove("header-container__content--color");
    headerLogo.classList.remove("header-container__logo--active");
  }
};

const obsOptions = {
  root: null,
  threshold: 0,
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);



const menuNav = document.querySelector(".menu__nav");
const menuBack = document.querySelector(".menu__nav-back");
const menuBtn = document.querySelector(".menu__btn");
const menuBtnText = document.querySelector(".menu__btn-text");
const menuBtnIcon = document.querySelector(".menu__btn-icon");
const menuNavLinks = document.querySelectorAll(".menu__nav-list__link");
const menuHomeLink = document.querySelectorAll(
  ".menu__container--home__item-link"
);
const menuCon = document.querySelectorAll(".menu__container");
const menuHomeCon = document.querySelectorAll(
  ".menu__container--home__item-content"
);
const headerLogo = document.querySelector(".header-container__logo");
const showMenuNav = function () {
  menuNav.classList.add("menu__nav--active");
  menuBtn.classList.add("menu__btn--close");
  menuBtn.classList.add("menu__btn--active");
  menuBtnIcon.classList.add("menu__btn-icon--open");
  menuBtnText.classList.add("menu__btn-text--hide");
  headerLogo.classList.add("header-container__logo--hidden");
  document.getElementsByTagName("body")[0].classList.add("hide-scroll");
  
};
const hideMenuNav = function () {
  menuNav.classList.remove("menu__nav--active");
  menuBtn.classList.remove("menu__btn--close");
  menuBtn.classList.remove("menu__btn--active");
  menuBtnIcon.classList.remove("menu__btn-icon--open");
  menuBtnIcon.classList.add("menu__btn-icon--close");
  menuBtnText.classList.remove("menu__btn-text--hide");
  headerLogo.classList.remove("header-container__logo--hidden");
  document.getElementsByTagName("body")[0].classList.remove("hide-scroll");
  menuCon.forEach((el) => {
    el.classList.remove("menu__container--active");
  });

};

menuBtn.addEventListener("click", function () {
  if (!menuBtnIcon.classList.contains("menu__btn-icon--open")) showMenuNav();
  else hideMenuNav();
});
menuBack.addEventListener("click", hideMenuNav);
menuBtnIcon.addEventListener("animationend", () => {
  menuBtnIcon.classList.remove("menu__btn-icon--close");
});

let viewportWidth;

const setViewportWidth = function () {
  viewportWidth = window.innerWidth || document.documentElement.clientWidth;
};
setViewportWidth();
window.addEventListener(
  "resize",
  function () {
    setViewportWidth();
  },
  false
);

menuNav.addEventListener("mouseover", function (e) {
  const item = e.target.closest(".menu__nav-list__item");
  if (!item) return;

  const link = item.children[1];
  const con = item.children[2];

  if (viewportWidth > 2000) {
    menuNavLinks.forEach((el) => {
      if (el !== link) el.classList.remove("menu__nav-list__link--active");
    });
    link.classList.add("menu__nav-list__link--active");
    menuCon.forEach((el) => {
      if (el !== con) el.classList.remove("menu__container--active");
    });

    con.classList.add("menu__container--active");
  }
});

menuNav.addEventListener("mouseout", function (e) {
  const item = e.target.closest(".menu__nav-list__item");
  if (!item) return;

  const link = item.children[1];
  const con = item.children[2];

  if (viewportWidth > 2000) {
    menuNavLinks.forEach((el) => {
      if (el !== link) el.classList.remove("menu__nav-list__link--active");
    });
    link.classList.remove("menu__nav-list__link--active");
    menuCon.forEach((el) => {
      if (el !== con) el.classList.remove("menu__container--active");
    });
    con.classList.remove("menu__container--active");
  }
});

menuNav.addEventListener("click", function (e) {
  const item = e.target.closest(".menu__nav-list__item");
  if (!item) return;
  const con = item.children[2];
  con.classList.add("menu__container--active");
});
menuNav.addEventListener("click", function (e) {
  const item = e.target.closest(".menu__nav-list__item");
  if (!item) return;
  const con = item.children[2];
  const btnConBack = e.target.closest(".menu__container-back");
  if (btnConBack) {
    con.classList.remove("menu__container--active");
  }
});

menuNav.addEventListener("mouseover", function (e) {
  const item = e.target.closest(".menu__container--home__item");
  if (!item) return;

  const link = item.children[0];
  const con = item.children[1];
  // const con = document.querySelector(
  //   `.menu__container-lists--home__container--${item.dataset.tab}`
  // );
  if (viewportWidth > 2000) {
    menuHomeLink.forEach((el) => {
      el.classList.remove("menu__container--home__item-link--active");
    });
    link.classList.add("menu__container--home__item-link--active");
    menuHomeCon.forEach((c) =>
      c.classList.remove("menu__container--home__item-content--active")
    );
    con.classList.add("menu__container--home__item-content--active");
  }
});
menuNav.addEventListener("mouseout", function (e) {
  const item = e.target.closest(".menu__container--home__item");
  if (!item) return;

  const link = document.querySelector(".menu__container--home__item-link");
  const con = document.querySelector(".menu__container--home__item-content");

  // const con = document.querySelector(
  //   `.menu__container-lists--home__container--${item.dataset.tab}`
  // );
  if (viewportWidth > 2000) {
    menuHomeLink.forEach((el) => {
      el.classList.remove("menu__container--home__item-link--active");
    });
    link.classList.add("menu__container--home__item-link--active");
    menuHomeCon.forEach((c) =>
      c.classList.remove("menu__container--home__item-content--active")
    );
    con.classList.add("menu__container--home__item-content--active");
  }
});
menuNav.addEventListener("mouseover", function (e) {
  const item = e.target.closest(".menu__container--home__item");
  if (!item) return;

  const link = item.children[1];
  const con = item.children[2];

  if (viewportWidth > 2000) {
    menuHomeLink.forEach((el) => {
      if (el !== link) el.classList.remove("menu__nav-list__link--home--hover");
    });
    link.classList.add("menu__nav-list__link--home--hover");


    con.classList.remove("menu__container--hidden");
  }
});
menuNav.addEventListener("mouseout", function (e) {
  const item = e.target.closest(".menu__container--home__item");
  if (!item) return;

  const link = document.querySelector(".menu__nav-list__link--home");
  const con = item.children[2];

  if (viewportWidth > 2000) {
    menuHomeLink.forEach((el) => {
      if (el !== link) el.classList.remove("menu__nav-list__link--home--hover");
    });
    link.classList.add("menu__nav-list__link--home--hover");
 

    con.classList.add("menu__container--hidden");
  }
});


const userBtn = document.querySelector(".user__btn");
const userBtnText = document.querySelector(".user__btn-text");
const userClose = document.querySelector(".user__close");
// const userForm = document.querySelector(".user__form");
// const userInput = document.querySelector(".user__input");
const userBack = document.querySelector(".user__back");
const userCon = document.querySelector(".user__container");

userBtn.addEventListener("mouseover", function (e) {
  userBtn.classList.add("user__btn--active");
  userBtnText.classList.add("user__btn-text--active");
});
userBtn.addEventListener("mouseout", function (e) {
  userBtn.classList.remove("user__btn--active");
  userBtnText.classList.remove("user__btn-text--active");
});

const showUser = function () {
  if (menuNav.classList.contains("menu__nav--active")) hideMenuNav();
  userCon.classList.add("user__container--active");
  userBack.classList.add("user__back--active");
  document.getElementsByTagName("body")[0].classList.add("hide-scroll");
};
const hideUser = function () {
  userCon.classList.remove("user__container--active");
  userBack.classList.remove("user__back--active");
  document.getElementsByTagName("body")[0].classList.remove("hide-scroll");
};

userBtn.addEventListener("click", function (e) {
  showUser();
});
userClose.addEventListener("click", function (e) {
  const close = e.target.closest(".user__close");
  if (!close) return;
  else {
    hideUser();
  }
});
userBack.addEventListener("click", hideUser);

const cartBtn = document.querySelector(".cart__btn");
const cartClose = document.querySelector(".cart__close");
const cartBack = document.querySelector(".cart__back");
const cartCon = document.querySelector(".cart__container");
const cartQty = document.querySelector(".cart__product-total-qty");
const cartCoupon = document.querySelector(".cart__coupon");
const cartCouponIcon = document.querySelector(".cart__coupon-icon");
const cartCouponContent = document.querySelector(".cart__coupon__content");

userBtn.addEventListener("mouseover", function (e) {
  userBtn.classList.add("user__btn--active");
  userBtnText.classList.add("user__btn-text--active");
});
userBtn.addEventListener("mouseout", function (e) {
  userBtn.classList.remove("user__btn--active");
  userBtnText.classList.remove("user__btn-text--active");
});

const showCart = function () {
  if (menuNav.classList.contains("menu__nav--active")) hideMenuNav();
  cartCon.classList.add("cart__container--active");
  cartBack.classList.add("cart__back--active");
  document.getElementsByTagName("body")[0].classList.add("hide-scroll");
};
const hideCart = function () {
  cartCon.classList.remove("cart__container--active");
  cartBack.classList.remove("cart__back--active");
  document.getElementsByTagName("body")[0].classList.remove("hide-scroll");
};

cartBtn.addEventListener("click", function (e) {
  showCart();
});
cartClose.addEventListener("click", function (e) {
  const close = e.target.closest(".cart__close");
  if (!close) return;
  else {
    hideCart();
  }
});


cartBack.addEventListener("click", hideCart);

const freeShip = 300;

const galerySlides = document.getElementsByClassName("galery__slides-item");
const galeryBtnLeft = document.querySelector(`.galery__arrow--left`);
const galeryBtnRight = document.querySelector(`.galery__arrow--right`);
let currentGaleryIndex = 0;
let lastGaleryIndex = galerySlides.length - 1;

function goToSlides(slideIndex) {
  [...galerySlides].forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideIndex)}%)`;
  });
  currentGaleryIndex = slideIndex;
}
goToSlides(currentGaleryIndex);



function readyNextSlides() {
  if (currentGaleryIndex === 0) {

    [...galerySlides].forEach((s, _) => {
      s.style.display = `flex`;
    
    });
    galerySlides[0].insertAdjacentElement(
      "beforebegin",
      galerySlides[lastGaleryIndex]
    );
    galerySlides[0].style.transform = `translateX(-${100}%)`;
    currentGaleryIndex++;
  }

  if (currentGaleryIndex === lastGaleryIndex) {
    galerySlides[lastGaleryIndex].insertAdjacentElement(
      "afterend",
      galerySlides[0]
    );
    galerySlides[lastGaleryIndex].style.transform = `translateX(${100}%)`;
    currentGaleryIndex--;
  }
}



function shiftSlid(direction) {
  direction ? currentGaleryIndex++ : currentGaleryIndex--;

  if (currentGaleryIndex === lastGaleryIndex || currentGaleryIndex === 0)
    readyNextSlides();
  goToSlides(currentGaleryIndex);
}

let totalprice_header = 0;

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("/category/all", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    var array =  data.msg;
    let str = "";
    if(isMobile()){
      var div = document.createElement('div');
      div.classList.add("menu__container-categories");
      div.innerHTML+='<div class="link"></div> <div class="link"></div>';
      div.style.height='700px';
      div.style.overflow ='auto';
      var ul = document.createElement('ul');
      ul.classList.add("menu__container-category");
      for (let i = 0; i < array.length; i++) {
        str = `<li class="menu__container-category__item">
                <a style="font-weight:600;font-size:1.4rem;" href="/prodbycat?cid=${array[i].cid}&name=${array[i].name}">
                  <img  src="../public/pics/${array[i].icon}" alt="">
                  <span>${array[i].name}</span>
                </a>
              </li>`;
              ul.innerHTML += str;
      }
      div.appendChild(ul);
      var oldul = document.getElementById("header_cats");
      oldul.parentNode.replaceChild(div, oldul);
    }else {
      let str = "";
      let ul = document.getElementById("header_cats");
      for (let i = 0; i < 3; i++) {
          str =   ` 
                <li class="menu__nav-list__item">
                <span class="menu__nav-list__image">
                  <img src="../public/pics/${array[i].icon}" alt="">
                </span>
                <span class=""><a style="font-weight:600;font-size:1.4rem;" href="/prodbycat?cid=${array[i].cid}&name=${array[i].name}" class="menu__nav-list__link menu__nav-list__link--color ">${array[i].name}</a> </span>
                </li>`;
          ul.innerHTML += str;
      }

      var dropdownMenu = document.getElementById("more_cats");    

      for(let i = 3;i <array.length;i++){
        str = `<li class="menu__container-category__item">
                  <a href="/prodbycat?cid=${array[i].cid}&name=${array[i].name}">
                      <img  src="../public/pics/${array[i].icon}" alt="">
                      <span>${array[i].name}</span>
                  </a>
              </li>`;
          dropdownMenu.innerHTML+=str;
      }
    }
});

        
if( JSON.parse(sessionStorage.getItem("logged")) == true){
  var login_html = document.getElementById("login_html");
  var membership = JSON.parse(sessionStorage.getItem("member_acount"));
    login_html.innerHTML = `שלום&nbsp; ${membership.Name} &nbsp; ${membership.Lastname}`;
    document.getElementById("user_body").innerHTML = "";
    var login_header_btn = document.getElementById("login_header_btn");
    login_header_btn.addEventListener("click",function(){
      location.replace('/personal_area');
    });
}


function loginmember(){
  const Email = document.getElementById("Email_header").value;
  const Pass = document.getElementById("Pass_header").value; 
  let ccc_element = document.getElementById("ccc");
  ccc_element.style.height = "200px";
  ccc_element.style.width = "200px";
  ccc_element.style.backgroundColor="white";
  ccc_element.style.textAlign="center";


  let popresult = document.getElementById("all_content_pop_div");
  if(Email.length == 0 || !Email.includes("@")){
      popresult.innerHTML =`<h1 style="color:red">*כתובת המייל ריקה או אינה תקינה</h1>`;
      openPopup();
      setTimeout(() => {
        closePopup();
      }, 1000);
      return;
  }
  if(Pass.length == 0){
      popresult.innerHTML  =`<h1 style="color:red"> *סיסמא לא יכולה להיות ריקה</h1>`;
      openPopup();
      setTimeout(() => {
        closePopup();
      }, 1000);
      return;
  }
  fetch('/member/login',{
      method:'POST',
      body:new URLSearchParams({
          Email,
          Pass
      })
  }).then((res)=>{return res.json()}).then((data)=>{
      if(data.msg == 1){
          let membership = data.member;
          sessionStorage.setItem("member_acount",JSON.stringify(membership[0]));
          popresult.innerHTML  =`<h1 style="color:red">התחברת בהצלחה</h1>`;
          openPopup();
          sessionStorage.setItem("logged",true);
          var login_html = document.getElementById("login_html");
          login_html.innerHTML = `שלום&nbsp; ${membership[0].Name} &nbsp; ${membership[0].Lastname}`;
          document.getElementById("user_body").innerHTML = "";
          setTimeout(() => {
            location.reload();
          }, 2000);
      } 
      else if(data.msg == 2){
        popresult.innerHTML =`<h1 style="color:red">חשבונך טרם אומת</h1>`;
        openPopup();
        setTimeout(() => {
          closePopup();
        }, 1000);
        return;
      } else {
          sessionStorage.setItem("logged",false);
          popresult.innerHTML =`<h1 style="color:red">התחברות נכשלה</h1>`;
          openPopup();
          setTimeout(() => {
            closePopup();
          }, 1000);
          return;
      }
  });    
}

get_cart_header();
get_popular_prods();

function get_cart_header(){

if (sessionStorage.getItem("logged") === null) {
sessionStorage.setItem("logged", false);
}     

var myHeaders = new Headers();
var requestOptions = {
method: 'GET',
headers: myHeaders,
redirect: 'follow'
};

fetch("/cart/getcart", requestOptions).then((res)=>{return res.json()}).then((data)=>{

sessionStorage.setItem("cart",JSON.stringify(data.msg));
let cart = JSON.stringify( data.msg);
cart = JSON.parse(cart);
if(cart.length == 0){
document.getElementById('sum_items').innerHTML = 0;
document.getElementById('product-title').innerHTML = 0;
document.getElementById("cart__body").innerHTML = "";
document.getElementById("cart__body").innerHTML = '<h1 >הסל שלך ריק</h1>';
return;
}

document.getElementById("product-title").innerHTML = cart.length;
document.getElementById('sum_items').innerHTML = cart.length;

  get_favorite_on_cart(cart);

});



}



function updateQuantityDec_header(quantity, sku) {
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

function deleteprod_fromcart_header(sku) {
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

function decrementQuantity_header(button,sku) {
  const quantityInput =  document.getElementById("form1");
  quantityInput.stepDown();
  updateQuantityDec_header(quantityInput.value, sku);
}
function incrementQuantity_header(button,sku) {
  const quantityInput = document.getElementById("form1");
  quantityInput.stepUp();
  updateQuantityInc_header(quantityInput.value, sku);
}

function updateQuantityInc_header(quantity, sku) {
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
function updateQuantityDec_header(quantity, sku) {
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


function shitritfunc() {
  const searchContainer = document.querySelector('.search__container');
  if (searchContainer.classList.contains('search__container--active')) {
    searchContainer.classList.remove('search__container--active');
  } else {
    searchContainer.classList.add('search__container--active');
  }
}
function get_popular_prods(){

  var div = document.getElementById('search_cards_popular');
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch('/category/popular_prods',requestOptions).then((res)=>{return res.json()}).then((data)=>{
    var prods = data.msg;
    for(let i = 0;i<prods.length;i++){
        let str =  `<a href="/product/prodpage?sku=${prods[i].Sku}" style="text-decoration: none;color:black;">
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

}

var flag_fav_header = false;
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function test(sku){

  var is_logged_header = JSON.parse(sessionStorage.getItem("logged"));
  var membership_header = JSON.parse(sessionStorage.getItem("member_acount"));
    if(is_logged_header){
        membership_header = JSON.parse(sessionStorage.getItem("member_acount"));
        var favorites_header = membership_header.Favorite;
        if(favorites_header.includes(sku)){
          flag_fav_header = true;
          document.getElementById(`${sku}_`).classList.add("fa-solid");
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

function remove_prod_from_favorite_header(sku){
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
      document.getElementById(`${sku}_`).classList.add("fa-regular"); 
      let cart_sku = document.getElementById(`${sku}_cart`);
      if(cart_sku){
        cart_sku.classList.add("fa-regular"); 
      }
      flag_fav_header = false;
      document.getElementById("ccc").style.backgroundColor="white";
      document.getElementById("ccc").style.textAlign="center";
      document.getElementById("all_content_pop_div").innerHTML = "המוצר הוסר מהמועדפים";
      openPopup();
    }
  });
}
function add_prod_to_favorite_header(sku){
  var membership = JSON.parse(sessionStorage.getItem("member_acount"));
  let email = membership.Email;
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
      document.getElementById(`${sku}_`).classList.add("fa-solid");
      let cart_sku = document.getElementById(`${sku}_cart`);
      if(cart_sku){
        cart_sku.classList.add("fa-solid"); 
      }
      flag_fav_header = true;
      document.getElementById("ccc").style.backgroundColor="white";
      document.getElementById("ccc").style.textAlign="center";
      document.getElementById("all_content_pop_div").innerHTML = "המוצר נוסף למועדפים";
      openPopup();
    }
  });
}


function get_favorite_on_cart(cart){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
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
      var str_reapet ='';
      var favorites_on_cart = data.msg;
      for(let i=0;i<cart.length;i++){
        totalprice_header += cart[i].productPrice * cart[i].quantity;
        const productSku = cart[i].productSku;
        const isFavorite = favorites_on_cart.some((favorite) => favorite.Sku === productSku);
        let heartClass = 'fa-regular fa-heart';
        if (isFavorite) {
          heartClass = 'fa-solid fa-heart';
        }
        str_reapet+=`
          <div class="cart__product" ><div class="cart__product-image">
            <a href="/product/prodpage?sku=${cart[i].productSku}" ><img src="${cart[i].prodPic}" alt=""></a>
            <div class="cart__product-action">
              <button onclick="deleteprod_fromcart_header('${cart[i].productSku}')" class="cart__product-del"><span>&nbsp;</span></button>
              <button onclick="test('${cart[i].productSku}')" class="cart__product-wish"><i id="${cart[i].productSku}_" class="${heartClass}" ></i> </button>
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
            </div>
            <div class="cart__product-total">
              <div class="cart_qty">
                <button class="cart_qty_btn" onclick="decrementQuantity_header(this,'${cart[i].productSku}')">
                  <i class="fas fa-minus"></i>
                </button>
                <input class="cart_qty_input" disabled="true" readonly="true"  id="form1" name="quantity" value="${cart[i].quantity}" type="number" min="1"  onchange="updateQuantity(this.value, ${i})"  />
                <button class="cart_qty_btn" onclick="incrementQuantity_header(this,'${cart[i].productSku}')" >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <span id="product-sumprice">${cart[i].sum} ₪</span>
            </div>
          </div>
          </div>`;
      }
      document.getElementById("cart__body").innerHTML = str_reapet;
      document.getElementById("product-total").innerHTML = `${totalprice_header}₪`;
    });
  }else{
    var str_reapet ='';
    for(let i=0;i<cart.length;i++){
      totalprice_header += cart[i].productPrice * cart[i].quantity;
      let heartClass = 'fa-regular fa-heart';
      str_reapet+=`
        <div class="cart__product" ><div class="cart__product-image">
          <img src="${cart[i].prodPic}" alt="">
          <div class="cart__product-action">
            <button onclick="deleteprod_fromcart_header('${cart[i].productSku}')" class="cart__product-del"><span>&nbsp;</span></button>
            <button onclick="test('${cart[i].productSku}')" class="cart__product-wish"><i id="${cart[i].productSku}_" class="${heartClass}" ></i> </button>
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
          </div>
          <div class="cart__product-total">
            <div class="cart_qty">
              <button class="cart_qty_btn" onclick="decrementQuantity_header(this,'${cart[i].productSku}')">
                <i class="fas fa-minus"></i>
              </button>
              <input class="cart_qty_input" disabled="true" readonly="true"  id="form1" name="quantity" value="${cart[i].quantity}" type="number" min="1"  onchange="updateQuantity(this.value, ${i})"  />
              <button class="cart_qty_btn" onclick="incrementQuantity_header(this,'${cart[i].productSku}')" >
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <span id="product-sumprice">${cart[i].sum} ₪</span>
          </div>
        </div>
        </div>`;
    }
    document.getElementById("cart__body").innerHTML = str_reapet;
    document.getElementById("product-total").innerHTML = `${totalprice_header}₪`;
  }

  
}


const checkbox = document.getElementById('forget');

checkbox.addEventListener('change', function() {
  if (this.checked) {
    document.getElementById("login_html").innerHTML = "איפוס סיסמא";
    document.getElementById('user_body').style.display = "none";
    document.getElementById('user_body_forget').style.display = "block";
  } else {
    document.getElementById("login_html").innerHTML = "התחברות";
    document.getElementById('user_body').style.display = "block";
    document.getElementById('user_body_forget').style.display = "none";
  }
});

function forgetpass(){
   let ccc_element = document.getElementById("ccc");
  ccc_element.style.height = "200px";
  ccc_element.style.width = "200px";
  ccc_element.style.backgroundColor="white";
  ccc_element.style.textAlign="center";


  let popresult = document.getElementById("all_content_pop_div");

  var emailforget = document.getElementById("Email_header_forget").value;
  if (!emailforget.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      popresult.innerHTML = "אנא הכניסו כתובת מייל תקינה";
      openPopup();
      setTimeout(() => {
        closePopup();
      }, 1000);
      return;
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  var urlencoded = new URLSearchParams();
  urlencoded.append("Email", emailforget.toLowerCase());
  var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
  };
  fetch("/member/forget", requestOptions).then((res)=>{return res.json()}).then((data)=>{
    popresult.innerHTML = `<h1>${data.msg}</h1>`;
    openPopup(); 
    setTimeout(() => {
      closePopup();
    }, 1000);
  });
}
// setTimeout(() => {
//   asve_client_ip();
// }, 3000);

function save_client_ip(){
  const ipAddress = sessionStorage.getItem('ipAddress');
  console.log("-----------");
  console.log(ipAddress);
  fetch('/save_client_ip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ipaddress: ipAddress })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Error saving client IP address.');
    })
    .then(data => {
      sessionStorage.setItem('ipAddress', data.ip);
      console.log(data.message);
    })
    .catch(error => {
      console.error(error);
    });
  
}