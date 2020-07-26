const form = document.querySelector('form');

const loadingElement = document.querySelector('.loading');
const donkeysElement = document.querySelector('.donkey');

const API_URL = 'http://localhost:5000/donkeys';

loadingElement.style.display='';

listAllDonkey()

form.addEventListener('submit',event=>{
  event.preventDefault();
  let formData = new FormData(form);
  let name = formData.get('name');
  let content = formData.get('content');
  let dict = {name,content};
  loadingElement.style.display='';
  form.style.display='none';
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify(dict),
    headers:{
      "content-type":"application/json"
    }
  }).then(response=>response.json()).then(createdMew=>{
    form.reset();
    setTimeout(()=>{
      form.style.display='';
    },5000)
    listAllDonkey()
  })
})


function listAllDonkey() {
  donkeysElement.innerHTML='';
  fetch(API_URL).then(response=>response.json()).then(mews=>{
    mews.reverse();
    mews.forEach(mew=>{
      let div = document.createElement('div');
      let donkeyName = document.createElement('h1');
      donkeyName.textContent=mew.name;
      let donkeyContent = document.createElement('p');
      donkeyContent.textContent=mew.content;
      let date = document.createElement('p');
      date.textContent=new Date(mew.create);
      div.appendChild(donkeyName);
      div.appendChild(donkeyContent);
      div.appendChild(date);
      donkeysElement.appendChild(div);
    })
    loadingElement.style.display='none';
  })
}
