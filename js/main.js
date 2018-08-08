// Initialize Firebase
var config = {
  apiKey: "AIzaSyDRS9Hm4fQw44is4hl58Zez3QnbUIkYf90",
  authDomain: "buy-all-the-tickets.firebaseapp.com",
  databaseURL: "https://buy-all-the-tickets.firebaseio.com",
  projectId: "buy-all-the-tickets",
  storageBucket: "buy-all-the-tickets.appspot.com",
  messagingSenderId: "905184385134"
};
firebase.initializeApp(config);
const database = firebase.database()
const userDB = database.ref('user-database')

//DOM getters
const mainUrl = `https://app.ticketmaster.com/discovery/v2/events.json?`
const api = 'apikey=G12DiVexBiiQI7qmXn2CcNyKl5ATzHtd'
const keywordUrl = '&keyword='
const regex = /\s+/g
const logo = document.querySelector('#logo')
const login = document.querySelector('.login')
const register = document.querySelector('.register')

//Mouse events for  links on the webpage
logo.addEventListener('click', backHome)
login.addEventListener('click', loginFunc)
register.addEventListener('click', registerFunc)

//When clicking on the logo, it returns to the main page
function backHome(){
  sliderFunc()
}

//main events page
function sliderFunc(){
  let newUrl = `${mainUrl}${api}`

  fetch(newUrl)
  .then(res => res.json())
  .then(json => {
    let arr = []
    let events = json._embedded.events
    for(let i in events){
      arr.push(events[i])
    }
    let newArr = []
  
    
    newArr.push(arr[0])
  
    for(let x = 1; x < arr.length; x++){
      if(arr[x].name != arr[x-1].name){
        newArr.push(arr[x])
      }
    }

    let mainSection = document.querySelector('#mainSection')
    mainSection.innerHTML = `<h3 class="sliderHeading is-size-3 ">Top Events of the Week</h3><br><br>
    <div class="slider" style="width:70%; margin:auto"></div>`

    let slider = document.querySelector('.slider')

    slider.innerHTML = ''

    slider.insertAdjacentHTML('beforeend', '<div class="sliderTwo">')
       
    for(let x of newArr){
      document.querySelector('.sliderTwo').insertAdjacentHTML('beforeend', sliderHTML(x))
    }
  
    
    slider.insertAdjacentHTML('beforeend', '</div>')
    $('.sliderTwo').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      appendArrows: "Selector"
    });
  })
}

sliderFunc()

document.addEventListener('keyup', (e) =>{
  if(e.keyCode == 13){
    searchTicket()
  }
})

function sliderHTML(item){
  return `<div class="box">
  <article class="media">
    <div class="media-left">
      <figure class="image is-128x128">
        <img src="${item.images[0].url}" alt="Image">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>${item.name}</strong> <small>@${item.name}</small>
          <br>
          <strong>Venue:</strong> ${item._embedded.venues[0].name}
          <br>
          ${item.pleaseNote ? item.pleaseNote : ''}
          </p>
      </div>
    </div>
  </article>
</div>`
}
  
function cardHTML(json, index){
  console.log(json, index)
  console.log('test')
  console.log(json.name)
  let name = json.name
  let img = json.images[3].url
  let localDate = json.dates.start.localDate
  let segment =  json.classifications[0].segment.name
  let genre = json.classifications[0].genre.name
  let price = json.priceRanges ? json.priceRanges[0].min  : ''
  let venueName = json._embedded.venues[0].name
  let venueCity = json._embedded.venues[0].city.name
  let venueState = json._embedded.venues[0].state.name
  let url = json.url
  let html = `<tr class="tableContent"><td>${name}</td><td>${venueName}</td><td>${venueCity}</td><td>${localDate}</td><td>${price}</td><td>Link to Buy:<a href='${url}'>TicketMaster</a></td></tr>`
  
  return html
}
//the main use of the webpage
function searchTicket(){
  const keyword = document.querySelector('#keywordSearch')

  if(keyword.value){
    let newKeyword = keyword.value.replace(regex, '%20')
    console.log(keyword.value)
    let url = `${mainUrl}${api}${keywordUrl}${newKeyword}`
    fetch(url)
    .then(res => res.json())
    .then(json => {
      console.log(json)
      
      let slider = document.querySelector(".slider") 
      
      if(slider){
        slider.classList.add('hidden')
      }

      let sliderHeading = document.querySelector(".sliderHeading")
      if(sliderHeading){
        sliderHeading.classList.add('hidden')
      }

      let mainSection = document.querySelector('#mainSection')
      mainSection.innerHTML = `<br><h3 class='is-size-3'>${json._embedded.events[0].name}</h3><div id='main'></div>`
      let mainDIV = document.querySelector('#main')

      mainDIV.innerHTML = `<table class="table is-hoverable"><thead><tr><td>Attraction Name</td><td>Venue Name</td><td>City</td><td>Date</td><td>Price</td><td>Where to buy</td></tr></thead><tbody id="tableContent">`
      
      let test = json._embedded.events
      let count = 0
      for(let x in test){
        let result = cardHTML(test[x], x)
        document.querySelector('#tableContent').insertAdjacentHTML('beforeend', result)
      }
      mainDIV.insertAdjacentHTML('beforeend','</tbody></table>')
      
      let nodes = document.querySelectorAll('.tableContent')
      let nodeArray = Array.from(nodes)
      console.log(nodeArray)
      nodeArray.forEach(x => x.addEventListener('click', hello))
    })
    keyword.value = ''
  }
  else{
    sliderFunc()
  }
}

function hello(){
  event.target.classList.add('is-info')
}
//login for test
function loginFunc(){
  loginHTML()
  let submit = document.querySelector('.submitLogin')
  submit.addEventListener('click', loginAlgo)
}

function loginAlgo(){
  let user = document.querySelector('.user')
  let password = document.querySelector('.senha')
  retrieveUserFirebase(user, password)
}

function loginHTML(){
  let mainSection = document.querySelector('#mainSection')
  mainSection.innerHTML = '<h3 class="is-size-3">Enter Your Login</h3>'
  mainSection.insertAdjacentHTML('beforeend', `<div class="field" style="max-width:400px;margin:auto">
                                                 <div class="control" >
                                                 <label for="login">Login</label>
                                                 <input class="input is-info is-rounded user" type="email" placeholder="Login">
                                                 <label for="senha">password</label>
                                                 <input class="input is-info is-rounded senha" type="password" placeholder="password">
                                               </div><br><br><a class="button is-light submitLogin" style="display: block;border-radius=50px">Submit</a></div>`)
}

function registerFunc(){
  registerHTML()
  let submit = document.querySelector('.submitReg')
  submit.addEventListener("click", registerAlgo)
}

function registerAlgo(){
  let name = document.querySelector('.userName')
  let userLogin = document.querySelector('.userLogin')
  let userPassword = document.querySelector('.userPassword')
  let data = { name: name.value, login: userLogin.value, password: userPassword.value}
  
  let token = createUserFirebase(data)

   if(token){
    alert('sucess')
  }
}

function registerHTML(){
  let mainSection = document.querySelector('#mainSection')
  mainSection.innerHTML = '<h3 class="is-size-3">Register</h3>'
  mainSection.insertAdjacentHTML('beforeend', `<div class="field" style="max-width:400px;margin:auto">
                                                 <div class="control" >
                                                 <label for="login">Enter your Name</label>
                                                 <input class="input is-info is-rounded userName" type="text" placeholder="Name">
                                                 <label for="login">Enter your Email</label>
                                                 <input class="input is-info is-rounded userLogin" type="email" placeholder="Email">
                                                 <label for="senha">Enter a password</label>
                                                 <input class="input is-info is-rounded userPassword" type="password" placeholder="passwordUser">
                                               </div><br><br><a class="button is-light submitReg" style="display: block;border-radius=50px">Submit</a></div>`)
}

function createUserFirebase(data){
  let result = userDB.push(data)
  if(result){
    return result.key
  }
}

function retrieveUserFirebase(user, password){
  let userNow = user
  let passwordNow = password

  userDB.on('value', result, function err(y){
    console.log(`Error is ${y.code}`)
  })


  function result(x){
    let result = x.val()

    for(let one in result){
      if(userNow.value == result[one].login && passwordNow.value == result[one].password){
        alert('Login successful')
        document.querySelector('.item-c').innerHTML = `<a class='is-outlined is-small padding-items logout'>Logout</a>
        <a class='is-outlined is-small padding-items page'>${result[one].name}</a>`
        userPage(result[one])
        
        
      }
      else{
        console.log('The email or password is incorrect!')
      }
    }
  }
}


function userPage(user){
  let mainSection = document.querySelector('#mainSection')
  mainSection.innerHTML = `<h3 class="is-size-3">${user.name}'s page</h3>`
  
}
