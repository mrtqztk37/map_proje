import { detecType,setStorage,detecIcon} from "./helpers.js";

//! HTML DEN ÇEKTİKLERİMİZ
const form=document.querySelector("form");
const list=document.querySelector("ul");
console.log(list);
//!!! OLAY İZLEYİCİLERİ

form.addEventListener("submit",handleSubmit);
list.addEventListener("click",handleClick)


//! ortak kullanım alanı  //!


var map;
var notes= JSON.parse(localStorage.getItem("notes")) || [];
var coords= [];
var layerGroup= [];


navigator.geolocation.getCurrentPosition(loadMap,console.log("kullanıcı kabul etmedi"));


//!  HARİTAYA TIKLANINCA ÇALIŞIR


function onMapClick(e) {
  form.style.display= "flex";
  coords = [e.latlng.lat,e.latlng.lng];
  //console.log(coords);
  
}

//! KULLANICININ KONUMUNA GÖRE HARİTAYI GETİRME


function loadMap(e) {
    //console.log(e);
 
    //!haritanın kurulumu   //!
 
    map = new L.map("map").setView([e.coords.latitude,e.coords.longitude], 10);
    L.control;

    
    //! HARİTANIN NASIL GÖZÜKECEĞİNİ BELİRLER
   
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
   
   //! HARİTADA BASILACAK İMLEÇLERİ TUTACAĞİMİZ KATMAN
    layerGroup = L.layerGroup().addTo(map);
    
   renderNoteList(notes);
   form.style.display = "none"
   
    // haritada tıklama olduğunda çalışacak fonksiyon
   
    map.on("click",onMapClick);


  }

  function renderMarker(item) {
  // todo markerı oluşturur
    L.marker(item.coords, {icon:detecIcon(item.status)})
    .addTo(layerGroup)
    // todo üzerine tıklanınca açılacak popup yazısı
    .bindPopup(`${item.desc}`);
  }

// todo FORMUN GÖNDERİLME OLAYINDA ÇALIŞIR

  function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
    const desc = e.target[0].value;
    if(!desc) return;
    const date = e.target[1].value;
    const status = e.target[2].value;
   
    // TODO NOTES DİZİSİNE ELEMAN EKLEME
   
    notes.push({ id: new Date().getTime(), desc, date, status, coords });
    console.log(notes)
   //TODO lOCAL STORAGE GÜNCELLEME
    setStorage(notes);
    renderNoteList(notes);
    
    form.style.display="none";
  }
 // todo ekrana notları basma

  function renderNoteList(item) {
    //todo notlar alanını temizler
    list.innerHTML = "";
    //todo markerları temizle
    layerGroup.clearLayers();
    // todo her bir not için diziyi döner
    item.forEach((item)=>{
      const listElement = document.createElement("li")
       listElement.dataset.id= item.id;
       listElement;
       listElement.innerHTML = `
               <div>
                    <p>${item.desc}</p>
                    <p><span>Tarih:</span>${item.date}</p>
                    <p><span>Durum:</span>${detecType(item.status)}</p>
                   
                   
                     <i class="fa-solid fa-xmark" id="delete"></i>
                     <i class="fa-solid fa-plane-up" id="fly"></i>
                </div>`;
                list.insertAdjacentElement("afterbegin",listElement)
                renderMarker(item);
    });
  }
  function handleClick(e) {
    const id=e.target.parentElement.parentElement.dataset.id;
    
    if (e.target.id=== "delete") {
      console.log(notes);
     // todo id sini bildiğimiz elemanı diziden kaldırma
      notes =notes.filter((note)=>note.id!=id);
      setStorage(notes);
      renderNoteList(notes)
    }
     if (e.target.id === "fly") {
       const note = notes.find((note)=> note.id==id);

       map.flyTo(note.coords);
  }
}