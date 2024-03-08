

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    var div = document.createElement('div');
    div.classList.add('menu__container-categories');
    div.innerHTML += '<div class="link"></div> <div class="link"></div>';
    div.style.height = '700px';
    div.style.overflow = 'auto';
  
    var ulElement = document.getElementById('header_cats');
    var parentElement = ulElement.parentNode;
  
    // Replace ulElement with the new div
    parentElement.replaceChild(div, ulElement);
    div.appendChild(ulElement);
  
    // Add class to the new ul element
    ulElement.classList.add('menu__container-category');
  
    // Replace class for li items
    var liItems = ulElement.querySelectorAll('.menu__nav-list__item');
    liItems.forEach(function(li) {
      li.className = 'menu__container-category__item';
    });
  }
  
 
  document.getElementById("close_panel").addEventListener('click',close_panell);

  function close_panell(){
    
    var content = document.getElementById("contentt");
    var sidebarElement = document.getElementById("sidebar");
    if (content.style.display !== 'none') {
      content.style.display = 'none';
      sidebarElement.style.pointerEvents = 'none';
      if(isMobile()){
        sidebarElement.classList.remove("sidebar");
      }
    } else {
      sidebarElement.style.pointerEvents = 'auto';
      content.style.display = 'block';
      if(isMobile()){
        sidebarElement.classList.add("sidebar");
      }
    }


   
  }
  function close_panell2(){
    
    var content = document.getElementById("contentt");
    var sidebarElement = document.getElementById("sidebar");
   
      content.style.display = 'none';
      sidebarElement.style.pointerEvents = 'none';
      if(isMobile()){
        sidebarElement.classList.remove("sidebar");
      }
   


   
  }
  
