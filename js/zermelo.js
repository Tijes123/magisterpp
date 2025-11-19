
var lln = {} 

var medewerkers = {}


fetch('https://jmlu.tekar.dev/medewerkers.js')
  .then(response => {
    if (!response.ok) {
      throw new Error('Zermelo medewerkers fetch response was not ok');
    }
    return response.text();
  })
  .then(data => {
    medewerkers = JSON.parse(data.replace(/export\s+default\s+medewerkers\s*;?/g, "").replace(/const\s+medewerkers\s*=\s*/, "").trim().replace(/;$/, "").replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/,\s*(?=[}\]])/g, ""));
    console.log(medewerkers)
  })
  .catch(error => {
    console.error('There was a problem with the zermelo medewerkers fetch operation:', error);
});

fetch('https://jmlu.tekar.dev/lln.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Zermelo lln fetch response was not ok');
    }
    return response.json();
  })
  .then(data => {
    lln = data;
  })
  .catch(error => {
    console.error('There was a problem with the zermelo lln fetch operation:', error);
});


var zermeloLoop = window.setInterval(function(){

    const allSchedulesPage = document.querySelector("#app > div > div.lowerContent > div > div.masterHolder > div.master > div.allSchedulesPage")

    if (allSchedulesPage) {
        
        const persoonListItems = allSchedulesPage.querySelectorAll("div.allSchedulesList > .personListItem")

        persoonListItems.forEach(child => {
            if (child.classList.contains("studentItem")) {
                const title = child.querySelector(".personInformation > .title")
                
                const name = title.textContent.split(" ")[0]
  
                const newName = `${name} - ${lln[name]}`
  
                if (lln[name] && title.textContent != newName) {
                    title.textContent = newName
                }
            }else if (child.classList.contains("teacherItem")) {
                const title = child.querySelector(".personInformation > .title")
                title.style.textTransform = "none"
                
                const name = title.textContent[0].toUpperCase() + title.textContent[1]

                const newName = `${name} - ${medewerkers[name]}`

                if (medewerkers[name] && title.textContent != newName.slice(0, -5)) {
                    title.textContent = newName.slice(0, -5)
                }

            }

        })

    }

}, 500)