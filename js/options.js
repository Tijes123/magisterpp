
var selectedColorName = ""

const cAppearance = document.getElementById("c-appearance")
const cLayout = document.getElementById("c-layout")
const cLogin = document.getElementById("c-login")
const cExperimental = document.getElementById("c-experimental")
const cUpdate = document.getElementById("c-update")

const sbAppearance = document.getElementById("sb-appearance")
const sbLayout = document.getElementById("sb-layout")
const sbLogin = document.getElementById("sb-login")
const sbExperimental = document.getElementById("sb-experimental")
const sbUpdate = document.getElementById("sb-update")



sbAppearance.onclick = () => {
  cAppearance.style.display = "block"
  cLayout.style.display = "none"
  cLogin.style.display = "none"
  cExperimental.style.display = "none"
  cUpdate.style.display = "none"
  
  sbAppearance.classList.add("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.remove("selected")
  sbUpdate.classList.remove("selected")
}

sbLayout.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "block"
  cLogin.style.display = "none"
  cExperimental.style.display = "none"
  cUpdate.style.display = "none"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.add("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.remove("selected")
  sbUpdate.classList.remove("selected")
}

sbLogin.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "none"
  cLogin.style.display = "block"
  cExperimental.style.display = "none"
  cUpdate.style.display = "none"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.add("selected")
  sbExperimental.classList.remove("selected")
  sbUpdate.classList.remove("selected")
}

sbExperimental.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "none"
  cLogin.style.display = "none"
  cExperimental.style.display = "block"
  cUpdate.style.display = "none"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.add("selected")
  sbUpdate.classList.remove("selected")
}

sbUpdate.onclick = () => {
  cAppearance.style.display = "none"
  cLayout.style.display = "none"
  cLogin.style.display = "none"
  cExperimental.style.display = "none"
  cUpdate.style.display = "block"
  
  sbAppearance.classList.remove("selected")
  sbLayout.classList.remove("selected")
  sbLogin.classList.remove("selected")
  sbExperimental.classList.remove("selected")
  sbUpdate.classList.add("selected")

  checkUpdate()
}

function checkUpdate() {
  const localVersion = chrome.runtime.getManifest().version;
  document.getElementById("currentVersion").textContent = `Versie: ${localVersion}`;

  fetch('https://raw.githubusercontent.com/TTekar/magisterpp/main/manifest.json')
    .then(res => res.json())
    .then(remoteManifest => {
      const remoteVersion = remoteManifest.version;
      if (remoteVersion !== localVersion) {
        document.getElementById("checkUpdate").textContent = `Er is een nieuwe versie beschikbaar! (${remoteVersion})`;
        document.getElementById("updateHelp").style.display = "block";
      } else {
        document.getElementById("checkUpdate").textContent = "Magister++ is up to date.";
        document.getElementById("updateHelp").style.display = "none";
      }
  });
}

const saveOptions = () => {

  const darkSelected = document.getElementById('dark').checked;
  const lightSelected = document.getElementById('light').checked;
  const theme = darkSelected ? "dark" :
				lightSelected ? "light" : "auto";

  const keuzeBtn = document.getElementById('keuzeBtn').checked
  var keuzeMode
  if (document.getElementById('k-options').checked) keuzeMode = "options"
  else if (document.getElementById('k-table').checked) keuzeMode = "table"
  else if (document.getElementById('k-both').checked) keuzeMode = "both"

  const cijfers = document.getElementById('cijfers').checked
  const inlogText = document.getElementById('inlogText').value
  const widgetCustomHigh = document.getElementById('widgetCustomHigh').value
  const widgetCustomLow = document.getElementById('widgetCustomLow').value
  const autoLogin = document.getElementById('autoLogin').checked
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  
  
  const pfpDefault = document.getElementById('pfp-default').checked
  const pfpCustom = document.getElementById('pfp-custom').checked
  const pfpHidden = document.getElementById('pfp-hidden').checked
  
  const studiewijzersGrid = document.getElementById('sw-grid').checked
  
  const hideBestellenBtn = !document.getElementById('bestellenBtn').checked
  const hideHelpBtn = !document.getElementById('helpBtn').checked
  const hideZoekenBtn = !document.getElementById('zoekenBtn').checked

  const widgetDrag = document.getElementById('widgetDrag').checked

  const customVandaag = document.getElementById('v-custom').checked
  
  const maxLaatsteCijfers = document.getElementById('maxLaatsteCijfers').value

  const customHtml = document.getElementById('h-on').checked

  const showTime = document.getElementById("timeBtn").checked

  const zermelo = document.getElementById("zermeloBtn").checked

  const oppBtn = document.getElementById("oppBtn").checked

  const koppelingenBtn = document.getElementById("koppelingenBtn").checked

  const clockSecondBtn = document.getElementById("clockSecondBtn").checked

  const sidebarSmallBtn = document.getElementById("sidebarSmallBtn").checked

  const spaceSidebar = document.getElementById("spaceSidebar").checked


  var hidePfp
  var customPfp

  if (pfpDefault) {
    hidePfp = false
    customPfp = false
  }else if(pfpCustom) {
    hidePfp = false
    customPfp = true
  }else if(pfpHidden) {
    hidePfp = true
    customPfp = false
  }

  chrome.storage.sync.set(
    { theme: theme , keuzeBtn: keuzeBtn , cijfers: cijfers , studiewijzersGrid: studiewijzersGrid , hideHelpBtn: hideHelpBtn , hideZoekenBtn: hideZoekenBtn , inlogText: inlogText , hidePfp: hidePfp , customPfp: customPfp , widgetCustomHigh: widgetCustomHigh , widgetCustomLow: widgetCustomLow , hideBestellenBtn: hideBestellenBtn , autoLogin: autoLogin , username: username , password: password , widgetDrag: widgetDrag, customVandaag: customVandaag , maxLaatsteCijfers: maxLaatsteCijfers , keuzeMode: keuzeMode , customHtml: customHtml , showTime: showTime , customColor: selectedColorName , zermelo: zermelo , oppBtn: oppBtn , koppelingenBtn: koppelingenBtn , clockSecondBtn: clockSecondBtn , sidebarSmallBtn: sidebarSmallBtn , spaceSidebar: spaceSidebar },
    () => {
      // do after saved
      // console.log(`darkMode: ${darkMode}\nkeuzeBtn: ${keuzeBtn}\ncijfers: ${cijfers}\nstudiewijzersGrid: ${studiewijzersGrid}\nhideHelpBtn: ${hideHelpBtn}\ninlogText: ${inlogText}\nhidePfp: ${hidePfp}\ncustomPfp:${customPfp}\nwidgetCustomHigh:${widgetCustomHigh}\nwidgetCustomLow:${widgetCustomLow}`)
      updateAutoLogin()
      updateFileUpload()
      updateKeuzeMode()
      updateCustomSelectedColor()
      updateClockSecond()
    }
  )
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    { theme: "auto" , keuzeBtn: true , cijfers: false , studiewijzersGrid: false , hideHelpBtn: true , inlogText: "Bonjour" , hidePfp: false , customPfp: false , widgetCustomHigh: 385 , widgetCustomLow: 0 , hideBestellenBtn: false , autoLogin: false , username: "" , password: "" , widgetDrag: true , hideZoekenBtn: true , customVandaag: false , maxLaatsteCijfers: 10 , keuzeMode: "table" , customHtml: false , showTime: false , customColor: "default" , zermelo: false , oppBtn: true , koppelingenBtn: true , clockSecondBtn: true , sidebarSmallBtn: false , spaceSidebar: false },
    (items) => {
      document.getElementById('dark').checked = items.theme == "dark";
      document.getElementById('light').checked = items.theme == "light";
      document.getElementById('auto').checked = items.theme == "auto";

      
      document.getElementById('keuzeBtn').checked = items.keuzeBtn;
      document.getElementById('cijfers').checked = items.cijfers;
      document.getElementById('inlogText').value = items.inlogText;
      document.getElementById('widgetCustomHigh').value = items.widgetCustomHigh;
      document.getElementById('widgetCustomLow').value = items.widgetCustomLow;
      document.getElementById('autoLogin').checked = items.autoLogin;
      document.getElementById('username').value = items.username;
      document.getElementById('password').value = items.password;
      
      document.getElementById('sw-list').checked = !items.studiewijzersGrid;
      document.getElementById('sw-grid').checked = items.studiewijzersGrid;
      
      document.getElementById('bestellenBtn').checked = !items.hideBestellenBtn;

      document.getElementById('helpBtn').checked = !items.hideHelpBtn;

      document.getElementById('zoekenBtn').checked = !items.hideZoekenBtn;

      document.getElementById('widgetDrag').checked = items.widgetDrag;

      document.getElementById('v-custom').checked = items.customVandaag;
      document.getElementById('v-normal').checked = !items.customVandaag;

      document.getElementById('maxLaatsteCijfers').value = items.maxLaatsteCijfers;

      document.getElementById(`k-${items.keuzeMode}`).checked = true

      document.getElementById("h-on").checked = items.customHtml
      document.getElementById("h-off").checked = !items.customHtml

      document.getElementById("timeBtn").checked = items.showTime

      document.getElementById("zermeloBtn").checked = items.zermelo

      document.getElementById("oppBtn").checked = items.oppBtn

      document.getElementById("koppelingenBtn").checked = items.koppelingenBtn

      document.getElementById("clockSecondBtn").checked = items.clockSecondBtn

      document.getElementById("sidebarSmallBtn").checked = items.sidebarSmallBtn

      document.getElementById("spaceSidebar").checked = items.spaceSidebar

      

      if (!items.hidePfp && !items.customPfp) {
        document.getElementById('pfp-default').checked = true
      }else if (!items.hidePfp && items.customPfp) {
        document.getElementById('pfp-custom').checked = true
      }else if (items.hidePfp && !items.customPfp){
        document.getElementById('pfp-hidden').checked = true
      }

      selectedColorName = items.customColor
      updateCustomSelectedColor()

      updateAutoLogin()
      updateFileUpload()
      updateKeuzeMode()
      updateClockSecond()
    }
  )
};


const updateAutoLogin = () => {
  if (document.getElementById("autoLogin").checked) {
    document.getElementById("l-username").style.opacity = "1"
    document.getElementById("l-password").style.opacity = "1"
  }else {
    document.getElementById("l-username").style.opacity = ".35"
    document.getElementById("l-password").style.opacity = ".35"
  }
}

const updateFileUpload = () => {
  if (document.getElementById("pfp-custom").checked) {
    document.getElementById("l-imageUpload").style.display = "block"
  }else {
    document.getElementById("l-imageUpload").style.display = "none"
  }
}

const updateKeuzeMode = () => {
  if (document.getElementById("keuzeBtn").checked) {
    document.getElementById("k-keuzeMode").style.display = "block"
  }else {
    document.getElementById("k-keuzeMode").style.display = "none"
  }
}

const updateClockSecond = () => {
  if (document.getElementById("timeBtn").checked) {
    document.getElementById("clockSecondSetting").style.display = "block"
  }else {
    document.getElementById("clockSecondSetting").style.display = "none"
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions)

document.querySelectorAll("#main label input").forEach((input) => {
  input.addEventListener('change', saveOptions)
})

//~ Reset numeber inputs
document.getElementById("resetWidgetCustomHigh").addEventListener("click", () => {
  document.getElementById('widgetCustomHigh').value = 385
  saveOptions()
})

document.getElementById("resetWidgetCustomLow").addEventListener("click", () => {
  document.getElementById('widgetCustomLow').value = 0  // was 145, but 0 for auto
  saveOptions()
})


//~ IMAGE STORAGE

document.getElementById("upload").addEventListener("change", async function (event) {
  const file = event.target.files[0];
  if (file) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const maxSize = 128;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const resizedImageURL = canvas.toDataURL("image/png");

        chrome.storage.local.set(
          { userImage: resizedImageURL },
          () => {
            console.log("Image had been saved")
            console.log(resizedImageURL)
          }
        )
      };
    };

    reader.readAsDataURL(file);
  }

});

//~ add color buttons


document.querySelector("#colorsContainer > div.item.default").addEventListener("click", () => {

  console.log(`clicked on the default button`)
  selectedColorName = "default"
  saveOptions()
  updateCustomSelectedColor()

})

fetch('https://jmlu.tekar.dev/data/colors.json')
  .then(res => res.json())
  .then(colors => {
    const colorsContainer = document.getElementById("colorsContainer")

    for (const colorName in colors) {
      const values = colors[colorName];

      const newButton = document.createElement("div")
      newButton.classList.add("item")
      newButton.style.backgroundColor = values["primaryBackground"]
      newButton.setAttribute("data-name", colorName)

      newButton.addEventListener("click", () => {
        console.log(`clicked on the ${colorName} button`)
        selectedColorName = colorName
        saveOptions()
        updateCustomSelectedColor()
      })

      colorsContainer.appendChild(newButton)

    } 
    updateCustomSelectedColor()
    updateFileUpload()
});


function updateCustomSelectedColor() {
  console.log(selectedColorName)
  const selectedDiv = document.querySelector(`[data-name="${selectedColorName}"]`)
  document.querySelectorAll(`[data-name]`).forEach((div) => {
    div.style.borderRadius = "6px"
    div.style.boxShadow = "none"
  })
  selectedDiv.style.borderRadius = "10px"
  selectedDiv.style.boxShadow = "0 0 4px #fff"
}
