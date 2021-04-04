document.addEventListener('DOMContentLoaded', ()=>{


const getData = (url, callback) => {
    const request = new XMLHttpRequest();
    
    request.open('GET', url);
    
    request.addEventListener('readystatechange', ()=>{
      if (request.readyState!==4) return;
      if(request.status===200){
        callback(JSON.parse(request.responseText));
      }
      else{
        console.error(new Error('Error: '+ request.statusText));
      }
    });
    request.send();

};

////////////////////////////////////////////////////////////////

const renderReviews = () => {
  let count = 0;
  const ReviewList = document.querySelector('.slides-line');

  const createReviewListItem = (review) => {

      const {photo_1, photo_2, comment, author}=review;
      const reviewItem = document.createElement('div');
          reviewItem.innerHTML = `
            
            <article >
              <div class="review-text">
                
                <p>${comment}</p>
                <span class="named">${author}</span>
                
              </div>
              <button class="read-more">Читать подробнее</button>
            </article>
            <aside class="pictures">
              <figure class="img-1 review-image review-${count} "></figure>
              <figure class="img-2 review-image review-${count}"></figure>
            </aside>
            `;
          reviewItem.classList.add('slide');
              // console.log(reviewItem);
                return reviewItem;
    };

const renderPhoto = (review) => {
  const {photo_1, photo_2, comment, author}=review;
  document.querySelector(`.img-2.review-${count}`).style.backgroundImage = `url(${photo_2})`;
  document.querySelector(`.img-1.review-${count}`).style.backgroundImage = `url(${photo_1})`;
};

  const createReviewLine = (reviews) => {
      reviews.forEach((item)=>{
        count++;
        ReviewList.append(createReviewListItem(item));
        renderPhoto(item);
      });
      mySlider();
    };
  getData('dbase.json',createReviewLine);

};

////////////////////////////////////////////////////////////////

const renderWorkList = () => {
  let count = 0;
  const WorkList = document.querySelector('.img-wrap');
  const moreBtn = document.querySelector('.more');
  let fullLoaded = false;
  let photosToOpen = null;
  let photoAll = null;
  const createWorkListItem = (element) => {
    const {work} = element;
    console.log(element);
      const workItem = document.createElement('figure');
      workItem.classList.add('work-image');
          workItem.innerHTML = `
            <figcaption class="title">Квартира-студия 30 кв.м.</figcaption>
            <figcaption class="info">В квартире были светлые стены и тёплые цвета. Мы сконцентрировались на отсылках к природе и сделали ребятам уютный интерьер, отсылающий к виллам островов Бали.
            `;
          workItem.style.backgroundImage = `url(${work})`
            workItem.addEventListener('mouseover', () => {
              workItem.classList.add('active');
            });
            workItem.addEventListener('mouseleave', () => {
              workItem.classList.remove('active');
            });
            return workItem;
    };
  moreBtn.addEventListener('click',()=>{
    if (allPhotos.length<=0 && !fullLoaded){
      fullLoaded = true; 
      
    }
    if(!fullLoaded){
      console.log(allPhotos);
      const fourPhotos = allPhotos.splice(0,4);
      
      fourPhotos.forEach((item)=>{
      const picture = createWorkListItem(item);
      WorkList.append(picture);
      photoAll = document.querySelectorAll('.work-image');
      photosToOpen = Array.from(document.querySelectorAll('.work-image:not(.first)'));
      setTimeout(transition, 50, picture);
        if (!allPhotos.length){
          moreBtn.textContent = 'Скрыть';
          moreBtn.classList.remove('to-open');
        }
      });
    }
    else{
    
      const photosToClose = document.querySelectorAll('.work-image.added');
      if(photosToClose.length === photoAll.length - 4){
        const scrolToworkHead = document.getElementById('works');
        photosToOpen = Array.from(document.querySelectorAll('.work-image:not(.first)'));
        photosToClose.forEach((item)=>{
         item.classList.add('slow');
        item.classList.remove('added');
       setTimeout(()=>{
        item.style.display = 'none';
        item.classList.remove('slow');
       }, 1000); 
        
        });
        moreBtn.textContent = 'Смотреть еще';
        moreBtn.classList.add('to-open');
        scrollCustomImplementation(scrolToworkHead,1000)
      }
      else{
        
    
        fourPhotos = photosToOpen.splice(0,4);
        fourPhotos.forEach((item)=>{
          item.style.display = 'block';
          setTimeout(transition, 50, item);
          if (!photosToOpen.length){
          moreBtn.textContent = 'Скрыть';
          moreBtn.classList.remove('to-open');
          }
        })
      }
    }
    
  });
  const transition =(elem)=>{
    elem.classList.add('added');
  }

  const allPhotos =[];
  const createWorkImgs = (works=[]) => {
    allPhotos.push(...works);
    const fourPhotos = allPhotos.splice(0,4);
    console.log(fourPhotos);
      fourPhotos.forEach((item)=>{
        const picture = createWorkListItem(item);
        WorkList.append(picture);
        picture.classList.add('first');
      });
    }
  getData('worklist.json',createWorkImgs);
};

////////////////////////////////////////////////////////////////

const mySlider = () => {
let slider = document.querySelector('.container'),
  sliderList = slider.querySelector('.slider-wrap'),
  sliderTrack = slider.querySelector('.slides-line'),
  slides = slider.querySelectorAll('.slide'),
  arrows = slider.querySelectorAll('.button'),
  prev = arrows[0],
  next = arrows[1],
  slideWidth = document.querySelector('.slider-wrap').offsetWidth,
  slideIndex = 0,
  counter = document.querySelector('.counter'),
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --slides.length * slideWidth,
  posThreshold = slides[0].offsetWidth * 0.15,
  trfRegExp = /([-0-9.]+(?=px))/,
  evt,
  head = document.getElementById('reviews'),
  changeSlide = false,

  slide = function () {
    slideWidth = document.querySelector('.slider-wrap').offsetWidth;
    if (transition) {
      sliderTrack.style.transition = 'transform .5s';
    }
    sliderTrack.style.transform = `translate3d(-${slideIndex * slideWidth}px, 0px, 0px)`;
    counter.textContent = `${1 + slideIndex} / ${slides.length}`;
    prev.classList.toggle('disabled', slideIndex === 0);
    next.classList.toggle('disabled', slideIndex === --slides.length);
   
    
      if(!isResize && changeSlide){
      close();
      const position = document.getElementById('reviews');
      console.log(position.getBoundingClientRect().top);
      if (position.getBoundingClientRect().top<-200){
        scrollCustomImplementation(head);
      }
      
    }
  },

  close = function () {

    const reviewText = document.querySelectorAll('.review-text');
    const readMore = document.querySelectorAll('.read-more');
    const main = document.querySelector('body')
    readMore.forEach((item,i)=>{
    reviewText[i].classList.add('closed');
    item.classList.remove('active');
    });
    },

  swipeStart = function () {
 
  
    if (allowSwipe) {

      transition = true;

      nextTrf = (slideIndex + 1) * -slideWidth;
      prevTrf = (slideIndex - 1) * -slideWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      sliderTrack.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mouseup', swipeEnd);


    }
  },
  swipeAction = function () {


    style = sliderTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    // определение действия свайп или скролл
    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      // запрет ухода влево на первом слайде
      if (slideIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (slideIndex === --slides.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет протаскивания дальше одного слайда
      if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
        reachEdge();
        return;
      }

      // двигаем слайд
      sliderTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }

  },
  swipeEnd = function () {
  
    // console.log(lastTrf);
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);



    if (allowSwipe) {
      if (Math.abs(posFinal) > posThreshold) {
        if (posInit < posX1 && slideIndex > 0) {
          slideIndex--;
          changeSlide = true;
        } else if (posInit > posX1 && slideIndex < --slides.length) {
          slideIndex++;
          changeSlide = true;
        }
      }

      if (posInit !== posX1) {
        slide();
        changeSlide = false;
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }

  },
  setTransform = function (transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        sliderTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function () {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };
// const temp = window.innerWidth;
let isResize = false;
counter.textContent = `${slideIndex + 1} / ${slides.length}`;
sliderTrack.style.transform = 'translate3d(0px, 0px, 0px)';
window.addEventListener('resize', () => {

    isResize = true;
    
    slide();
    isResize = false;
  
});

sliderTrack.addEventListener('transitionend', () => allowSwipe = true);
// slider.addEventListener('touchstart', swipeStart);
// slider.addEventListener('mousedown', swipeStart);




arrows[0].addEventListener('click', function () {

  if (slideIndex > 0) {
    slideIndex--;
    slide();
  }
});

arrows[1].addEventListener('click', function () {
  if (slideIndex < --slides.length) {
    slideIndex++;
    slide();
  }
});

slider.addEventListener('mousedown', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
  swipeStart();
});
slider.addEventListener('mousemove', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
});

slider.addEventListener('mouseup', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
});
slider.addEventListener('touchmove', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
});


slider.addEventListener('touchstart', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
  swipeStart();
});

slider.addEventListener('touchend', (event) => {
  evt = ((event.type.search('touch') !== -1) ? event.touches[0] : event);
});
}

////////////////////////////////////////////////////////////////

(() => {
  const HeaderElem = document.querySelector('.header-wrap');


  const chekScrcollMoment = () => {
    let HeightByCheck = parseFloat(getComputedStyle(HeaderElem).marginTop);
    let YPos = window.pageYOffset;
    let bodyPos = parseFloat(document.querySelector('body').style.top);
    if (YPos > HeightByCheck * -1 - 100 || bodyPos) {
      HeaderElem.classList.add('show-item');
    }
    else {
      HeaderElem.classList.remove('show-item');
    }
  }
  window.addEventListener('scroll', chekScrcollMoment);
  document.addEventListener("DOMContentLoaded", chekScrcollMoment);
})();

////////////////////////////////////////////////////////////////

const workImages = () =>{
const arrow = document.querySelector('.more');
const worksImageElems = document.querySelectorAll('.work-image');

arrow.addEventListener('mouseover', () => {
  arrow.classList.add('onhover');
});

arrow.addEventListener('mouseleave', () => {
  arrow.classList.remove('onhover');
});

worksImageElems.forEach(img => {

  img.addEventListener('mouseover', () => {
    img.classList.add('active');
  });
  img.addEventListener('mouseleave', () => {
    img.classList.remove('active');
  });
});

}

////////////////////////////////////////////////////////////////

(() => {
  let lastWidthItems = 0;
  let burgerSize = 0;

  const navRefs = document.querySelectorAll('a.scroll-to')
  const mainBlock = document.querySelector('body');
  let scrollPosition = 0;
  const init = (menu, menuList, itemsMenu, burgerMenu) => {
    itemsMenu.forEach(elem => {
      elem.classList.add('amenu__item');
    });

    burgerMenu.classList.add('amenu__burger');

    const [burgerBtn, burgerList] = createBurgerBlock(burgerMenu);
    burgerBtn.classList.add('amenu__burger-btn_active');
    updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);

    window.addEventListener('resize', () => {
      updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);
    });
    setTimeout(updateMenu, 20, menu, menuList, burgerMenu, burgerBtn, burgerList);
    setTimeout(updateMenu, 40, menu, menuList, burgerMenu, burgerBtn, burgerList);
    setTimeout(updateMenu, 100, menu, menuList, burgerMenu, burgerBtn, burgerList);
  };


  const createBurgerBlock = (burgerMenu) => {

    const burgerBtn = document.createElement('button');
    burgerMenu.append(burgerBtn);
    burgerBtn.classList.add('amenu__burger-btn');

    burgerBtn.addEventListener('click', (evt) => {

      scrollPosition = window.pageYOffset;
      burgerMenu.classList.add('amenu__burger-open');
      evt.preventDefault();
      burgerClose.classList.add('burger-to-close');

      burgerBtn.classList.add('to-close');
      
      mainBlock.classList.add('not-to-scroll');
      mainBlock.style.top = -scrollPosition + 'px';
    })


    mainBlock.addEventListener('click', (event) => {
      const target = event.target;
      if (!target.closest('.header-menu__burger')&& burgerMenu.classList.contains('amenu__burger-open')) {
        burgerMenu.classList.remove('amenu__burger-open');
        burgerBtn.classList.remove('to-close');
        mainBlock.classList.remove('not-to-scroll');
        window.scrollTo(0, scrollPosition);
        mainBlock.style.top = 0;
      }
    });


    const burgerWrap = document.createElement('div');
    const burgerClose = document.createElement('button');
    burgerMenu.append(burgerWrap);
    burgerWrap.classList.add('burger-wrap');

    burgerWrap.append(burgerClose);

    const burgerList = document.createElement('ul');
    burgerWrap.append(burgerList);
    burgerList.classList.add('amenu__burger-list');


    burgerClose.addEventListener('click', () => {

      burgerMenu.classList.toggle('amenu__burger-open');
      burgerBtn.classList.remove('to-close');
      mainBlock.classList.remove('not-to-scroll');
      window.scrollTo(0, scrollPosition);
      mainBlock.style.top = 0;

    })

    navRefs.forEach((item) => {
      
      item.addEventListener('click', () => {
        if(burgerMenu.classList.contains('amenu__burger-open')){
          burgerMenu.classList.remove('amenu__burger-open');
          burgerBtn.classList.remove('to-close');
          mainBlock.classList.remove('not-to-scroll');
          window.scrollTo(0, scrollPosition);
          mainBlock.style.top = 0;
        }
        
      });

    });


    return [burgerBtn, burgerList];
  };



  const updateMenu = (menu, menuList, burgerMenu, burgerBtn, burgerList) => {

    const menuItems = menuList.querySelectorAll('.amenu__item');
    const burgerItems = burgerList.querySelectorAll('.amenu__item');
    const widthMenu = menu.offsetWidth;
    burgerSize = burgerMenu.offsetWidth || burgerSize
    const widthAllItems = [...menuItems].reduce((width, elem) => {
      
      return elem.offsetWidth + width + parseFloat(getComputedStyle(elem).marginRight)
    }, 0) + burgerSize + 10;



    if (widthMenu <= widthAllItems) {
      const lastItems = menuItems[menuItems.length - 1];
      if (lastItems) {
        lastWidthItems = lastItems.offsetWidth;
        
        burgerList.prepend(lastItems)
        return updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList)
      }


    }

    if (widthMenu > widthAllItems + lastWidthItems * 2 && burgerItems.length) {
      const firstElem = burgerItems[0];
      
      menuList.append(firstElem);
      return updateMenu(menu, menuList, burgerMenu, burgerBtn, burgerList);
    }

    //add
    if (burgerItems.length) {
      burgerMenu.style.display = '';
    } else {
      burgerMenu.style.display = 'none';
    }
    // end add

    checkBurgerItems(burgerItems, burgerBtn);


  };

  const checkBurgerItems = (burgerItems, burgerBtn) => {
    if (burgerItems.length) {
      burgerBtn.classList.add('amenu__burger-btn_active')
    } else {
      burgerBtn.classList.remove('amenu__burger-btn_active')
    }
  }

  window.amenu = (selectorMenu, selectorMenuList, selectorItemsMenu, selectorBurgerMenu) => {

    const menu = document.querySelector(selectorMenu),
      menuList = document.querySelector(selectorMenuList),
      itemsMenu = document.querySelectorAll(selectorItemsMenu),
      burgerMenu = document.querySelector(selectorBurgerMenu);


    init(menu, menuList, itemsMenu, burgerMenu)
  };



})()

////////////////////////////////////////////////////////////////

const animationScroll = () => {

window.addEventListener("scroll", throttleScroll);
function throttleScroll() {

  window.requestAnimationFrame(function () {
    scrolling();

  });
}


const scrollItemElems = document.querySelectorAll('.scroll-item');
let checkEdUp = Array().fill(false);

function scrolling(e) {
  scrollItemElems.forEach((item, i) => {
    if (isFullyVisible(item)) {
      item.classList.add("scroll-point");
      checkEdUp[i] = false;
    } else if (checkUp(item) && !checkEdUp[i]) {
      checkEdUp[i] = true;
      item.classList.remove("scroll-point");
    }
  });


}

const checkUp = (el) => {
  let YPos = window.pageYOffset;

  return YPos <= 200;
};

function isFullyVisible(el) {

  let elementBoundary = el.getBoundingClientRect();
  // console.log(elementBoundary);
  let top = elementBoundary.top;
  let bottom = elementBoundary.bottom;
  let height = elementBoundary.height;
  // console.log(window.innerHeight);
  return (((top >= 0) && (bottom <= window.innerHeight + 0.8 * height))||(top<0&&top>-800));
}
scrolling();
}

////////////////////////////////////////////////////////////////

const navigation = () => {
  const anchors = document.querySelectorAll('a.scroll-to')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const blockID = anchor.getAttribute('href');
    let element = document.querySelector(blockID);
    


    scrollCustomImplementation(element);
  });
}
}

////////////////////////////////////////////////////////////////

    const scrollCustomImplementation = (element, time=600) => {
      let start = null;
      let target = element && element ? element.getBoundingClientRect().top - 110 : 0;
      let firstPos = window.pageYOffset || document.documentElement.scrollTop;
      let pos = 0;

      (function () {
        var browser = ['ms', 'moz', 'webkit', 'o'];

        for (var x = 0, length = browser.length; x < length && !window.requestAnimationFrame; x++) {
          window.requestAnimationFrame = window[browser[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[browser[x] + 'CancelAnimationFrame'] || window[browser[x] + 'CancelRequestAnimationFrame'];
        }
      })();

      function showAnimation(timestamp) {

        if (!start) {
          start = timestamp || new Date().getTime();
        }


        var elapsed = timestamp - start;
        var progress = elapsed / time; // animation duration 600ms
        //ease in function from https://github.com/component/ease/blob/master/index.js

        var outQuad = function outQuad(n) {
          return n * (2 - n);
        };

        var easeInPercentage = +outQuad(progress).toFixed(2); // if target is 0 (back to top), the position is: current pos + (current pos * percentage of duration)
        // if target > 0 (not back to top), the positon is current pos + (target pos * percentage of duration)

        pos = target === 0 ? firstPos - firstPos * easeInPercentage : firstPos + target * easeInPercentage;
        window.scrollTo(0, pos);
     


        if (target > 0 && pos >= firstPos + target || target < 0 && firstPos - pos >= -1 * target || target === 0) {
          cancelAnimationFrame(start);

          if (element) {
            element.setAttribute("tabindex", -1);
            element.focus();
          }

          pos = 0;
        } else {
          window.requestAnimationFrame(showAnimation);
        }
      }

      window.requestAnimationFrame(showAnimation);
    }

////////////////////////////////////////////////////////////////

const viewMore = () =>{
const reviewText = document.querySelectorAll('.review-text');
const readMore = document.querySelectorAll('.read-more');
const pReview = document.querySelectorAll('.review-text p');
const main = document.querySelector('body');

(()=>{
  pReview.forEach((item,i)=>{
    if (item.offsetHeight>120){
      readMore[i].classList.add('active1');
    }
    if (item.offsetHeight>240){
      readMore[i].classList.add('active2');
    }
    reviewText[i].classList.add('closed');
  });
})()

  readMore.forEach((item,i)=>{

    item.addEventListener('click', () => {
    //  console.log(pReview[i].offsetHeight);
  reviewText[i].classList.remove('closed');
  item.classList.add('active');
  });

  main.addEventListener('click', (event) => {
      const target = event.target;
      // console.log(target);
    if(!target.closest('.read-more')){
      reviewText[i].classList.add('closed');
      item.classList.remove('active');
    }
    });
  });

}

////////////////////////////////////////////////////////////////

const sending = () => {

  const submit = document.querySelectorAll('.order-wrap button[type ="submit"]');
  modal1 = document.querySelector('.modal1');
  modal2 = document.querySelector('.modal2');
  

  submit.forEach((item)=>{
    const modalWindow = item.closest('.order-wrap');
    
    item.addEventListener('click', (event) => {
      
    const nameInputElement = modalWindow.querySelector('.input-name');
    const telInputElement = modalWindow.querySelector('.input-tel');
    
    const h2Modal1 = document.querySelector('.modal1 h2');
    const spanModal1 = document.querySelector('.modal1 span');
    if (telInputElement.validity.valid && nameInputElement.validity.valid){
    h2Modal1.textContent = nameInputElement.value+", спасибо, что оставили заявку!";
    spanModal1.textContent = "В ближащее время мы свяжемся с вами по номеру: "+ telInputElement.value;
    modal1.classList.add('active');
    modal2.classList.remove('active');
    nameInputElement.value="";
    telInputElement.value="";
    event.preventDefault();
    }

  });
  });
  

}

////////////////////////////////////////////////////////////////

const modalElem1 = () => {
  const leaveButton = document.querySelector('.modal1 button');
  leaveButton.addEventListener('click', ()=>{
    modal1.classList.remove('active');
  });

  const modal1  = document.querySelector('.modal1');
  modal1.addEventListener('click', (event)=>{
    const target = event.target;
    if(!target.closest('.modal_wrap')){
      modal1.classList.remove('active');
    }
  });

}

////////////////////////////////////////////////////////////////


const modalElem2 = () => {
const heroWrapBtn = document.querySelector('.hero-wrap button');
heroWrapBtn.addEventListener('click',()=>{
  modal2 = document.querySelector('.modal2');
  modal2.classList.add('active');
});

  modal2.addEventListener('click', (event)=>{
    const target = event.target;
    if(!target.closest('.modal_wrap')){
      modal2.classList.remove('active');
    }
  });

}

////////////////////////////////////////////////////////////////

renderReviews();
renderWorkList();
workImages();
amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');
animationScroll();
navigation();
setTimeout(viewMore,100);
sending();
modalElem1();
modalElem2();
});






////////////////////////////////////////////////////////////////////






////////////////////////////////////////////////////////////////


let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
  let marker = new google.maps.Marker({
    position: { lat: -34.397, lng: 150.644 },
    map: map
  })
}

