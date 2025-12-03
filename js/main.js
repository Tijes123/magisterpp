
var keuzeUI = false;
var madeKeuzeIframe = false;

var zermeloUI = false;
var madeZermeloIframe = false;


var weekToPensum = {};

fetch('https://jmlu.tekar.dev/data/weekToPensum.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // console.log('Fetched weekToPensum JSON data:', data);
    weekToPensum = data;
  })
  .catch(error => {
    console.error('There was a problem with the weekToPensum fetch operation:', error);
  });


var motd = "";

fetch('https://jmlu.tekar.dev/data/motd.txt')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(data => {
    // console.log('Fetched motd:', data);
    motd = data;
  })
  .catch(error => {
    console.error('There was a problem with the motd fetch operation:', error);
});
 
// check version
const localVersion = browser.runtime.getManifest().version;
var newestVersion = "";

fetch('https://raw.githubusercontent.com/TTekar/magisterpp/main/manifest.json')
  .then(res => res.json())
  .then(remoteManifest => {
    const remoteVersion = remoteManifest.version;
    newestVersion = remoteVersion;
    if (remoteVersion !== localVersion) {
      console.warn(`Magister++ update available! Installed: ${localVersion}, Latest: ${remoteVersion}`);
    } else {
      // console.log('Extension is up to date.');
    }
});

const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length > 0) {
              if (document.querySelector('[id^="drag-"].vandaag-drag-hint')) document.querySelector('[id^="drag-"].vandaag-drag-hint').remove()
            }
        }
    }
}

const observer = new MutationObserver(callback)
var observing = false

const keysPressed = new Set()

var selectedSearchIndex = 0

var setBerichtenIframeUp = true
var setBerichtenIframeDown = true

var zoekenActive = false

var spaceToggleSidebar = false

var currentCijferId = 0

var currentDag = 0

const weeks = [
  ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6", "Jan 7"],
  ["Jan 8", "Jan 9", "Jan 10", "Jan 11", "Jan 12", "Jan 13", "Jan 14"],
  ["Jan 15", "Jan 16", "Jan 17", "Jan 18", "Jan 19", "Jan 20", "Jan 21"],
  ["Jan 22", "Jan 23", "Jan 24", "Jan 25", "Jan 26", "Jan 27", "Jan 28"],
  ["Jan 29", "Jan 30", "Jan 31", "Feb 1", "Feb 2", "Feb 3", "Feb 4"],
  ["Feb 5", "Feb 6", "Feb 7", "Feb 8", "Feb 9", "Feb 10", "Feb 11"],
  ["Feb 12", "Feb 13", "Feb 14", "Feb 15", "Feb 16", "Feb 17", "Feb 18"],
  ["Feb 19", "Feb 20", "Feb 21", "Feb 22", "Feb 23", "Feb 24", "Feb 25"],
  ["Feb 26", "Feb 27", "Feb 28", "Feb 29", "Mar 1", "Mar 2", "Mar 3"],
  ["Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10"],
  ["Mar 11", "Mar 12", "Mar 13", "Mar 14", "Mar 15", "Mar 16", "Mar 17"],
  ["Mar 18", "Mar 19", "Mar 20", "Mar 21", "Mar 22", "Mar 23", "Mar 24"],
  ["Mar 25", "Mar 26", "Mar 27", "Mar 28", "Mar 29", "Mar 30", "Mar 31"],
  ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7"],
  ["Apr 8", "Apr 9", "Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14"],
  ["Apr 15", "Apr 16", "Apr 17", "Apr 18", "Apr 19", "Apr 20", "Apr 21"],
  ["Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27", "Apr 28"],
  ["Apr 29", "Apr 30", "May 1", "May 2", "May 3", "May 4", "May 5"],
  ["May 6", "May 7", "May 8", "May 9", "May 10", "May 11", "May 12"],
  ["May 13", "May 14", "May 15", "May 16", "May 17", "May 18", "May 19"],
  ["May 20", "May 21", "May 22", "May 23", "May 24", "May 25", "May 26"],
  ["May 27", "May 28", "May 29", "May 30", "May 31", "Jun 1", "Jun 2"],
  ["Jun 3", "Jun 4", "Jun 5", "Jun 6", "Jun 7", "Jun 8", "Jun 9"],
  ["Jun 10", "Jun 11", "Jun 12", "Jun 13", "Jun 14", "Jun 15", "Jun 16"],
  ["Jun 17", "Jun 18", "Jun 19", "Jun 20", "Jun 21", "Jun 22", "Jun 23"],
  ["Jun 24", "Jun 25", "Jun 26", "Jun 27", "Jun 28", "Jun 29", "Jun 30"],
  ["Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7"],
  ["Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14"],
  ["Jul 15", "Jul 16", "Jul 17", "Jul 18", "Jul 19", "Jul 20", "Jul 21"],
  ["Jul 22", "Jul 23", "Jul 24", "Jul 25", "Jul 26", "Jul 27", "Jul 28"],
  ["Jul 29", "Jul 30", "Jul 31", "Aug 1", "Aug 2", "Aug 3", "Aug 4"],
  ["Aug 5", "Aug 6", "Aug 7", "Aug 8", "Aug 9", "Aug 10", "Aug 11"],
  ["Aug 12", "Aug 13", "Aug 14", "Aug 15", "Aug 16", "Aug 17", "Aug 18"],
  ["Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25"],
  ["Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1"],
  ["Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7", "Sep 8"],
  ["Sep 9", "Sep 10", "Sep 11", "Sep 12", "Sep 13", "Sep 14", "Sep 15"],
  ["Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 20", "Sep 21", "Sep 22"],
  ["Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"],
  ["Sep 30", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6"],
  ["Oct 7", "Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13"],
  ["Oct 14", "Oct 15", "Oct 16", "Oct 17", "Oct 18", "Oct 19", "Oct 20"],
  ["Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27"],
  ["Oct 28", "Oct 29", "Oct 30", "Oct 31", "Nov 1", "Nov 2", "Nov 3"],
  ["Nov 4", "Nov 5", "Nov 6", "Nov 7", "Nov 8", "Nov 9", "Nov 10"],
  ["Nov 11", "Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17"],
  ["Nov 18", "Nov 19", "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24"],
  ["Nov 25", "Nov 26", "Nov 27", "Nov 28", "Nov 29", "Nov 30", "Dec 1"],
  ["Dec 2", "Dec 3", "Dec 4", "Dec 5", "Dec 6", "Dec 7", "Dec 8"],
  ["Dec 9", "Dec 10", "Dec 11", "Dec 12", "Dec 13", "Dec 14", "Dec 15"],
  ["Dec 16", "Dec 17", "Dec 18", "Dec 19", "Dec 20", "Dec 21", "Dec 22"],
  ["Dec 23", "Dec 24", "Dec 25", "Dec 26", "Dec 27", "Dec 28", "Dec 29"],
  ["Dec 30", "Dec 31"]
]

function getWeekNumber(date = new Date()) {
  const today = new Date()
  const formattedToday = today.toLocaleString('en-US', { month: 'short', day: 'numeric' })

  console.log(formattedToday)

  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i].includes(formattedToday)) {
      return i + 1
    }
  }
}

function getISOWeekNumber(date = new Date()) {
  const inputDate = new Date(date)
  if (isNaN(inputDate)) {
    return "Invalid date"
  }

  const day = inputDate.getDay() || 7

  const nearestThursday = new Date(inputDate);
  nearestThursday.setDate(inputDate.getDate() + 4 - day);

  const yearStart = new Date(nearestThursday.getFullYear(), 0, 1);

  const weekNumber = Math.ceil(((nearestThursday - yearStart) / (24 * 60 * 60 * 1000) + 1) / 7);

  return weekNumber;
}

function formatYMDtoDmY(dateStr) {
  const [year, month, day] = dateStr.split("-");
  const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

var update100ms = window.setInterval(function(){

  if(document.querySelector("#user-menu > figure > img").getAttribute("alt") == "Aidan Schoester") {
    let name = `Aldani Julius III Raidie "Adriaan" "Erik" "Michael" Schoester Knoester Oester Assepoester`
    let popup = document.querySelector("#user-menu ~ .popup-menu > div > div > div.ng-binding")
    let h3 = document.querySelector("#instellingen-container .card .person-info > div:nth-child(1) > h3")
    let strong = document.querySelector("#instellingen-container .card .person-info > div:nth-child(1) > strong")
    
    if (popup) popup.textContent = name
    if (h3) {
      if (h3.textContent != name) h3.textContent = name
      if (h3.style.overflow != "visible") h3.style.overflow = "visible"
      if (strong) strong.remove()
    }
  }

  const currentLocationSplit = (window.location.href.split("?")[0]).substring((window.location.href.split("?")[0]).indexOf(".") + 1) // eg. magister.net/magister/#/vandaag

  if (window.location.href.includes("?keuzes")) keuzeUI = true
  else if (window.location.href.includes("?zermelo")) zermeloUI = true

  //~ Keuze plattegrond

  // if (!document.getElementById("coverDivKeuze")) {
  if (true) {  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    browser.storage.sync.get({ keuzeBtn: true, keuzeMode: "table" , zermelo: false })
	  .then((items) => {
        /// Keuze page
        if (!document.getElementById("coverDivKeuze")) {
          const mainView = document.querySelector("div.view.ng-scope")
          const coverDivKeuze = document.createElement("div")

          coverDivKeuze.id = "coverDivKeuze"
          coverDivKeuze.style.position = "relative"
          coverDivKeuze.style.width = "100%"
          coverDivKeuze.style.height = "100%"
          coverDivKeuze.style.display = "none"
          coverDivKeuze.style.justifyContent = "center"
          coverDivKeuze.style.alignItems = "center"

          if (mainView) mainView.parentElement.appendChild(coverDivKeuze)
          else return
        }

        //~ Keuze Plattegrond 
        if (items.keuzeBtn && !madeKeuzeIframe) {
          
          /// Define button
          const buttonsSideList = document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-container > ul.main-menu");
          const newButtonList = document.createElement("li")
          buttonsSideList.appendChild(newButtonList)

          const newButton = document.createElement("a")
          newButton.innerHTML = `<i class="far ng-scope fa-regular fa-compass" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Keuzes</span>`

          newButton.id = "customButtonKeuze"
          newButton.classList.add("customButton")
          newButton.style.borderRadius = "6px"

          /// Keuze plattegrond button onclick
          newButton.onclick = function(event) {

            /// Make the iframe if its not there yet
            if (!document.getElementById("iframeKeuze")) {
              const iframeKeuze = document.createElement("iframe")
              const coverDivKeuzeGet = document.getElementById("coverDivKeuze")

              let options = []

              if (items.keuzeMode === "options" || items.keuzeMode === "both") options.push("sidebar=1")
              if (items.keuzeMode === "table" || items.keuzeMode === "both") options.push("table=1")

              iframeKeuze.src = `https://jmlu.tekar.dev/keuze?${options.join("&")}`

              iframeKeuze.id = "iframeKeuze"
              iframeKeuze.style.width = "100%"
              iframeKeuze.style.height = "100%"
              coverDivKeuzeGet.appendChild(iframeKeuze)
            }

            /// Show UI
            event.preventDefault();
            keuzeUI = true;

            document.getElementById("iframeKeuze").style.display = "block"

            zermeloUI = false;
			iframeZermelo = document.getElementById("iframeZermelo");
			if (iframeZermelo) {
				iframeZermelo.style.display = "none"
			}

            window.location.href = `${window.location.href.split("?")[0]}?keuzes`


            document.querySelector("body > div.container").style.paddingRight = "0"


            /// All other buttons lighter
            const sideButtons = document.querySelectorAll(".main-menu>li>a")

            sideButtons.forEach(button => {
              if (!button.classList.contains("customButton")) {
                button.classList.add("nonCustomButtonNotClicked")
              }else {
                button.classList.remove("customButtonClicked")
              }
            })

            /// Button darker
            this.classList.add("customButtonClicked")

            setKeuzeIframeDown = true
            setKeuzeIframeUp = true

          };

          /// Append button
          newButtonList.appendChild(newButton);

          madeKeuzeIframe = true

          if (keuzeUI) document.getElementById("customButtonKeuze").click()
        }

        //~ Zermelo
        if (items.zermelo && !madeZermeloIframe) {

          /// Define button
          const buttonsSideList = document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-container > ul.main-menu");
          const newButtonList = document.createElement("li")
          buttonsSideList.appendChild(newButtonList)

          const newButton = document.createElement("a")
          newButton.innerHTML = `<i class="far ng-scope fa-regular fa-circle-z" ng-if="item.icon" ng-class="item.icon"></i> <span ng-bind="item.title" class="caption ng-binding ng-scope" title="" ng-if="item.title !== 'OPP' &amp;&amp; item.title !== 'ELO'">Zermelo</span>`
              
          newButton.id = "customButtonZermelo"
          newButton.classList.add("customButton")
          newButton.style.borderRadius = "6px"

          /// Zermelo button onclick
          newButton.onclick = function(event) {

            if (!document.getElementById("iframeZermelo")) {
              const iframeZermelo = document.createElement("iframe")
              const coverDivKeuzeGet = document.getElementById("coverDivKeuze")

              iframeZermelo.src = `https://jordanmlu.zportal.nl`

              iframeZermelo.id = "iframeZermelo"
              iframeZermelo.style.width = "100%"
              iframeZermelo.style.height = "100%"
              coverDivKeuzeGet.appendChild(iframeZermelo)
            }

            /// Show UI
            event.preventDefault();
            zermeloUI = true;
            document.getElementById("iframeZermelo").style.display = "block"

            keuzeUI = false;
			iframeKeuze = document.getElementById("iframeKeuze");
			if (iframeKeuze) {
				iframeKeuze.style.display = "none"
			}

            window.location.href = `${window.location.href.split("?")[0]}?zermelo`
            

            document.querySelector("body > div.container").style.paddingRight = "0"
            

            /// All other buttons lighter
            const sideButtons = document.querySelectorAll(".main-menu>li>a")

            sideButtons.forEach(button => {
              if (!button.classList.contains("customButton")) {
                button.classList.add("nonCustomButtonNotClicked")
              }else {
                button.classList.remove("customButtonClicked")
              }
            })
            
            /// Button darker
            this.classList.add("customButtonClicked")
            
            setKeuzeIframeDown = true
            setKeuzeIframeUp = true
            
          };
          
          /// Append button
          newButtonList.appendChild(newButton);

          madeZermeloIframe = true

          if (zermeloUI) document.getElementById("customButtonZermelo").click()

        }


        /// Do things when pressing other buttons (ie revert some shit and change dark button)
        const buttonsSideList = document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-container > ul.main-menu");
        const buttonsInListA = buttonsSideList.querySelectorAll("li a")

        for (const link of buttonsInListA) {
          if (!link.classList.contains("customButton")) {
            link.onclick = function(event) {
              event.preventDefault();
              keuzeUI = false;
              zermeloUI = false;
              window.location.href = `${window.location.href.split("?")[0]}`
              link.classList.remove("nonCustomButtonNotClicked")
              document.querySelector("body > div.container").style.paddingRight = "8px"
              document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
              document.getElementById("customButtonZermelo").classList.remove("customButtonClicked")
            }
          } 
        }

        document.getElementById("menu-berichten-new").onclick = function(event) {
          keuzeUI = false;
          zermeloUI = false;
          window.location.href = `${window.location.href.split("?")[0]}`
          document.querySelector("body > div.container").style.paddingRight = "8px"
          document.getElementById("customButtonKeuze").classList.remove("customButtonClicked")
          document.getElementById("customButtonZermelo").classList.remove("customButtonClicked")
        }

      }
    );
  }


  /// Chrome storage
  browser.storage.sync.get({ 
	  cijfers: false ,
	  hideHelpBtn: true ,
	  hidePfp: false ,
	  widgetCustomHigh: 385 ,
	  widgetCustomLow: 0,
	  hideBestellenBtn: false ,
	  customPfp: false ,
	  widgetDrag: true ,
	  hideZoekenBtn: true ,
	  customVandaag: false ,
	  maxLaatsteCijfers: 10 ,
	  showTime: false ,
	  oppBtn: true ,
	  koppelingenBtn: true ,
	  clockSecondBtn: true ,
	  sidebarSmallBtn: false ,
	  spaceSidebar: false
  })
	.then((items) => {

        spaceToggleSidebar = items.spaceSidebar

        zoekenActive = !items.hideZoekenBtn

        //~ Set custom pfp
        if (items.customPfp) {

          browser.storage.local.get({  userImage: "" })
			.then((items) => {
              document.querySelectorAll('img[mg-http-src$="/foto"]').forEach((img) => {

                if(document.querySelector("#user-menu > figure > img").getAttribute("alt") == "Aidan Schoester") {

                  img.setAttribute("src", `https://thijmpie.netlify.app/img/adanPfp/${getWeekNumber()}.jpg`)

                }else {

                  img.setAttribute("src", items.userImage)

                }
              })
            }
          );
        }


        //~ Custom widget height

        if (currentLocationSplit === "magister.net/magister/#/vandaag") {

          const vandaagWidgets = document.querySelectorAll("#vandaag-container > .main > .content-container > div > .ng-scope > div > div > .widget")

          vandaagWidgets.forEach((widget) => {
            const contentDiv = widget.querySelector(".content")
          
            if (widget.classList.contains("widget-high")) {
              contentDiv.style.height = `${items.widgetCustomHigh}px`
            }else {
              if (items.widgetCustomLow == 0) {
                const calcLow = (items.widgetCustomHigh - 92) / 2
                contentDiv.style.height = `${calcLow}px`
              }else {
                contentDiv.style.height = `${items.widgetCustomLow}px`
              }
            }
          
          })

        }

        
        


        //~ Bad cijfer hide
        if (items.cijfers && currentLocationSplit === "magister.net/magister/#/vandaag") {
          
          var cijfer = document.querySelector("span.cijfer.ng-binding")

          if (cijfer.innerHTML.length > 4) {
              return
          }

          if (parseFloat(cijfer.innerHTML.replace(",", ".")) < 5.5) {
              cijfer.innerHTML = "<5,5"
          }
          if (cijfer.innerHTML.toUpperCase().includes("Z") || cijfer.innerHTML.toUpperCase().includes("O")) {
             cijfer.innerHTML = "< v"
          }
          
        }



        //~ Hide help button
        if (items.hideHelpBtn) {
          document.getElementById("help-menu").parentElement.style.display = "none"
        }else {
          document.getElementById("help-menu").parentElement.style.display = "block"
        }

        //~ Hide bestellen button
        if (items.hideBestellenBtn) {
          document.getElementById("menu-bestellen").parentElement.style.display = "none"
        }else {
          document.getElementById("menu-bestellen").parentElement.style.display = "block"
        }
        
        //~ Hide opp button
        if (items.oppBtn) {
          document.getElementById("menu-opp").parentElement.style.display = "block"
        }else {
          document.getElementById("menu-opp").parentElement.style.display = "none"
        }

        //~ Zoeken btn hidden/shown
        if (document.getElementById("searchButton")) {
          if (items.hideZoekenBtn) {
            document.getElementById("searchButton").style.display = "none"
          }else {
            document.getElementById("searchButton").style.display = "block"
          }
        }
        

        //~ Hide externe koppelingen button
        if (items.koppelingenBtn) {
          document.querySelector("body > div.container > div.appbar-host > mg-appbar > div.appbar > div.gripper.ng-scope").style.display = "block"
        }else {
          document.querySelector("body > div.container > div.appbar-host > mg-appbar > div.appbar > div.gripper.ng-scope").style.display = "none"
        }


        
        //~ Hide pfp
        if (items.hidePfp){
          document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {
            img.style.display = "none"
          })
        }else {
          document.querySelectorAll('img[mg-http-src^="/api/leerlingen/"]').forEach((img) => {
            img.style.display = "block"
          })
        }


        //~ Hide widget drag  

        if (!items.widgetDrag && !observing) {
          observer.observe(document.body, { childList: true, subtree: true })
          observing = true
        }else if(items.widgetDrag) {
          observer.disconnect()
          observing = false
        }


        //~ Collapse sidebar
        if (items.sidebarSmallBtn) {
          let sidebarDiv = document.querySelector("body > div.container > div.menu-host")
          let toggleSidebarButton = document.querySelector("body > div.container > div.menu-host > nav.menu > div.menu-footer > a")
          if (!sidebarDiv.classList.contains("started-collapsed") && toggleSidebarButton) {
            toggleSidebarButton.click()
            sidebarDiv.classList.add("started-collapsed")
          }
        }
        


        //~ Aantekeningen text color

        if (currentLocationSplit.includes("magister.net/magister/#/agenda")) {
          const iframe = document.querySelector("#idAantekeningen > div > .widget > .block > .content.aantekeningen > .widget table > tbody > tr > td.k-editable-area > iframe")

		  const darkMode = document.documentElement.dataset["theme"] == "dark";
          if (iframe) {
            const iframeDocument = iframe.contentWindow.document
            if (darkMode) {
              iframeDocument.body.style.color = "#fff"
            } else {
              iframeDocument.body.style.color = "#000"
            }
          }

          const iframeAgenda = document.querySelector("#agenda-afspraak-bewerken-container > section > div > div.widget.wide.wysiwyg.k-content > table > tbody > tr > td > iframe")


          if (iframeAgenda) {
            const iframeDocument = iframeAgenda.contentWindow.document
            if (darkMode) {
              iframeDocument.body.style.color = "#fff"
            }else {
              iframeDocument.body.style.color = "#000"
            }
          }
        }

        // ~~ CUSTOM VANDAAG

        if (items.customVandaag) {
          const vandaagContainer = document.getElementById("vandaag-container")

          if (vandaagContainer) {
            const main = vandaagContainer.querySelector("section.main")

            if (main) vandaagContainer.innerHTML = ""

            //~ Date and Time

            const date = new Date()

            const [day, month, year] = getCurrentDateFormatted(currentDag).split("-").map(Number);

            const modDate = new Date(year, month - 1, day);

            const timeString = date.toLocaleTimeString("nl-NL", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })

            // console.log(timeString)

            const dateString = modDate.toLocaleDateString("nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })

            const capitalDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)
            const index = capitalDate.indexOf(" ");
  
            const finalDate = capitalDate.slice(0, index) + "," + capitalDate.slice(index);
            
            const pensumSuffix = weekToPensum[getISOWeekNumber(modDate)]

            // console.log(finalDate, pensumSuffix)

            vandaagContainer.style.paddingRight = "0px"
            document.querySelector("body > .container").style.paddingRight = "0px"
            vandaagContainer.parentElement.style.paddingBottom = "0px"

            //~ Main Sections

            const infoWidth = 450        // TODO make this a setting   outside of create loop so it always updates and not only on refresh?

            if (!vandaagContainer.querySelector("#roosterDiv")) {
              const roosterDiv = document.createElement("div")
              roosterDiv.id = "roosterDiv"
              roosterDiv.style.width = `calc(100% - ${infoWidth}px)`
              vandaagContainer.appendChild(roosterDiv)
            }
            if (!vandaagContainer.querySelector("#infoDiv")) {
              const infoDiv = document.createElement("div")
              infoDiv.id = "infoDiv"
              infoDiv.style.width = `${infoWidth}px`
              vandaagContainer.appendChild(infoDiv)
            }

            //~ Rooster

            if (!document.getElementById("dayText")) {
              const dayText = document.createElement("div")
              dayText.id = "dayText"

              const dateText = document.createElement("span")
              dateText.id = "dateText"
              dateText.textContent = finalDate

              const pensumText = document.createElement("span")
              pensumText.id = "pensumText"
              pensumText.textContent = pensumSuffix

              document.getElementById("roosterDiv").appendChild(dayText)
              dayText.appendChild(dateText)
              dayText.appendChild(pensumText)
            }

            if (!document.getElementById("dagRooster")) {
              const dagRooster = document.createElement("ul")
              dagRooster.id = "dagRooster"
              document.getElementById("roosterDiv").appendChild(dagRooster)

              loadDayEvents()
            }

            
            


            //~ Info
            
            if (!document.getElementById("currentTime")) {
              const currentTime = document.createElement("span")
              currentTime.id = "currentTime"
              document.getElementById("infoDiv").appendChild(currentTime)
            }
            // update time
            document.getElementById("currentTime").textContent = timeString.replace(/:/g, " : ")
            
            //~ Cijfers
            if (!document.getElementById("cijfersCard")) {
              const cijfersCard = document.createElement("div")
              cijfersCard.id = "cijfersCard"
              cijfersCard.classList.add("infoCard")

              document.getElementById("infoDiv").appendChild(cijfersCard)

              const cijfersLeft = document.createElement("div")
              cijfersLeft.id = "cijfersLeft"
              cijfersLeft.innerHTML = `<i class="fa-regular fa-chevron-left"></i>`
              cijfersLeft.addEventListener("click", () => {
                if (currentCijferId > 0) currentCijferId -= 1
              })
              cijfersCard.appendChild(cijfersLeft)

              const cijfersMid = document.createElement("div")
              cijfersMid.id = "cijfersMid"
              cijfersCard.appendChild(cijfersMid)

              const cifjersRight = document.createElement("div")
              cifjersRight.id = "cijfersRight"
              cifjersRight.innerHTML = `<i class="fa-regular fa-chevron-right"></i>`
              cifjersRight.addEventListener("click", () => {
                if (currentCijferId < items.maxLaatsteCijfers - 1) currentCijferId += 1
              })
              cijfersCard.appendChild(cifjersRight)

              const laatsteCijfersText = document.createElement("span")
              laatsteCijfersText.id = "laatsteCijfersText"
              laatsteCijfersText.textContent = "Laatste Cijfers"
              laatsteCijfersText.addEventListener("click", () => { currentCijferId = 0 })
              cijfersMid.appendChild(laatsteCijfersText)

              const cijferWaarde = document.createElement("span")
              cijferWaarde.id = "cijferWaarde"
              cijferWaarde.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferWaarde)

              const cijferOmschrijving = document.createElement("span")
              cijferOmschrijving.id = "cijferOmschrijving"
              cijferOmschrijving.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferOmschrijving)

              const cijferVak = document.createElement("span")
              cijferVak.id = "cijferVak"
              cijferVak.addEventListener("click", () => {document.getElementById("menu-cijfers").click()})
              cijfersMid.appendChild(cijferVak)

              const cijferTijd = document.createElement("span")
              cijferTijd.id = "cijferTijd"
              cijfersMid.appendChild(cijferTijd)

              

              const cijferIdCurrent = document.createElement("span")
              cijferIdCurrent.id = "cijferIdCurrent"
              cijfersCard.appendChild(cijferIdCurrent)
            }
            
            /// Update Cijfers
            MagisterApi.grades.recent(items.maxLaatsteCijfers).then(result => {
              // console.log(result)
              const nth = currentCijferId
              cijferWaarde.textContent = result[nth].waarde
              cijferOmschrijving.textContent = `${result[nth].omschrijving} (x${result[nth].weegfactor})`
              cijferVak.textContent = result[nth].vak.omschrijving
              cijferTijd.textContent = formatDate(result[nth].ingevoerdOp)
              cijferIdCurrent.textContent = `${currentCijferId + 1} / ${result.length}`
              
              
              // cijfers color
              const float = parseFloat(result[nth].waarde.replace(",", "."))
              let value
              if (!isNaN(float) && float >= 0 && float <= 10) {
                value = float
              }else if (result[nth].waarde.length <= 3) {
                var tmpValue = 0
                for (const char of result[nth].waarde) {
                  if (char.toLowerCase() == "o") tmpValue += 1
                  else if (char.toLowerCase() == "z") tmpValue += 3
                  else if (char.toLowerCase() == "v") tmpValue += 5
                  else if (char.toLowerCase() == "r") tmpValue += 7
                  else if (char.toLowerCase() == "g") tmpValue += 9
                }
                value = tmpValue / result[nth].waarde.length
                if (tmpValue == 0) value = 6
              }else {
                value = 6
              }

              const t = value / 10;

              const startColor = { r: 206, g: 18, b: 8 }
              const midColor = { r: 255, g: 147, b: 246 }
              const endColor = { r: 186, g: 201, b: 239 }

              let r, g, b;
              if (value <= 7) {
                const t = value / 7;
                r = Math.round(startColor.r + (midColor.r - startColor.r) * t);
                g = Math.round(startColor.g + (midColor.g - startColor.g) * t);
                b = Math.round(startColor.b + (midColor.b - startColor.b) * t);
              } else {
                const t = (value - 7) / 3;
                r = Math.round(midColor.r + (endColor.r - midColor.r) * t);
                g = Math.round(midColor.g + (endColor.g - midColor.g) * t);
                b = Math.round(midColor.b + (endColor.b - midColor.b) * t);
              }

              cijferWaarde.style.color = `rgb(${r}, ${g}, ${b})`
            })

            //~ Mededelingen
            if (!document.getElementById("mededelingenCard")) {
              const mededelingenCard = document.createElement("div")
              mededelingenCard.id = "mededelingenCard"
              mededelingenCard.classList.add("infoCard")

              document.getElementById("infoDiv").appendChild(mededelingenCard)

              createMededelingen(mededelingenCard)

            }
          }
        }


        //~ Time
        if (items.showTime) {
          let timeNow = new Date().toLocaleTimeString([], { hour12: false }).replace(/:/g, ' : ')
          
          if (!document.getElementById("timeNow") || !document.getElementById("clock")) {
            let span = document.createElement("span")
            span.id = "timeNow"
            let outer = document.querySelector("body > div.container > div.menu-host.loading > div.logo")
            outer.innerHTML = ""
            outer.appendChild(span)

            let clockDiv = document.createElement("div")
            clockDiv.id = "clock"

            outer.appendChild(clockDiv)

            if (items.clockSecondBtn) {
              let secondHand = document.createElement("span")
              secondHand.classList.add("second")

              clockDiv.appendChild(secondHand)
            }

            let minuteHand = document.createElement("span")
            minuteHand.classList.add("minute")

            clockDiv.appendChild(minuteHand)

            let hourHand = document.createElement("span")
            hourHand.classList.add("hour")

            clockDiv.appendChild(hourHand)
          }

          let timeSpan = document.getElementById("timeNow")

          if (timeSpan.textContent !== timeNow) [
            timeSpan.textContent = timeNow
          ]

		  const time = new Date()
		  const hours = time.getHours() % 12
		  const minutes = time.getMinutes()
		  const seconds = time.getSeconds()

		  const hourDegrees = (hours * 30) + (minutes * 0.5)
		  const minuteDegrees = (minutes * 6) + (seconds * 0.1)
		  const secondDegrees = seconds * 6

		  document.querySelector("#clock > .hour").style.transform = `rotate(${hourDegrees}deg)`;
		  document.querySelector("#clock > .minute").style.transform = `rotate(${minuteDegrees}deg)`;
			
		  if (items.clockSecondBtn) {
		    document.querySelector("#clock > .second").style.transform = `rotate(${secondDegrees}deg)`;
		  }
        } 
        
        // document.getElementById("clock").title = new Date().toLocaleTimeString([], { hour12: false }).replace(/:/g, ' : ')

        

      }
  );
  

  /// Edit layout button 
  if(currentLocationSplit === "magister.net/magister/#/vandaag"){
    if (document.getElementById("edit-toggle-btn") && document.getElementById("edit-toggle-btn").offsetWidth > 32 ) {
      document.getElementById("edit-toggle-btn").innerHTML = '<dna-icon name="far-pencil"></dna-icon><button aria-hidden="true" style="display: none" tabindex="-1" type="button"></button>'
    }
  }


  /// Cijfers lijst wel knop donker
  if((currentLocationSplit == "magister.net/magister/#/cijfers/cijferoverzicht" || currentLocationSplit == "magister.net/magister/#/cijfers") && document.getElementById("menu-cijfers")) {
    document.getElementById("menu-cijfers").parentElement.classList.add("active")
  }else if (document.getElementById("menu-cijfers")) {
    document.getElementById("menu-cijfers").parentElement.classList.remove("active")
  }
  
  

  /// Check for hidden ui shit
  const divToHide = document.querySelector("div.view.ng-scope")
  const coverDivKeuze = document.getElementById("coverDivKeuze")

  if (divToHide && coverDivKeuze) {
    if (keuzeUI || zermeloUI) {
      divToHide.style.display = "none"
      coverDivKeuze.style.display = "flex"
    } else {
      divToHide.style.display = "block"
      coverDivKeuze.style.display = "none"
    }
  }
  

  /// Studiewijzers grid multi color bs
  // const studiewijzersListItems = document.querySelectorAll('div.studiewijzer-list.normaal > ul > li');
  
  // ////const colors = ['#FFA3A3', '#F2DC9B', '#D1FFA3', '#A3FFBA', '#A3FFFF', '#A3BAFF', '#CC9BF2'];
  // ////const colors = ['#0e4772', '#023660'];
  // const colors = ['#020203'];
  // const opacity = 0.18;

  // function hexToRgba(hex, alpha) {
  //   const bigint = parseInt(hex.slice(1), 16);
  //   const r = (bigint >> 16) & 255;
  //   const g = (bigint >> 8) & 255;
  //   const b = bigint & 255;
  //   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  // }

  // studiewijzersListItems.forEach((li, index) => {
  //     const spans = li.querySelectorAll('a span');
  //     if (spans.length > 1) {
  //         spans[1].remove();
  //     }

  //     const colorIndex = index % colors.length;
  //     const rgbaColor = hexToRgba(colors[colorIndex], opacity);
  //     li.style.backgroundColor = rgbaColor;
  // });


  /// Remove aside tabs if == 1

  try {
    const asideHeadBar = document.querySelector('aside.ng-isolate-scope > div.head-bar');
    const asideTabs = asideHeadBar.querySelector('ul.tabs');
    const asideSheets = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets');
    const asideSpan = document.querySelector('aside.ng-isolate-scope > div.content-container > div.sheets .block h3 span');

    if (asideTabs.childElementCount == 1) {
      asideHeadBar.style.display = "none";
      asideSheets.style.padding = "0px"
    }
    
    asideSpan.remove();
  }catch {
    
  }


  /// Absentie color

  if (currentLocationSplit === "magister.net/magister/#/att-absence") {
    const attAbsenceRoot = document.querySelector('html div.container > div.view.ng-scope > mg-att-absence > att-absence-root')

    if (attAbsenceRoot && attAbsenceRoot.shadowRoot) {

      const shadowRoot = attAbsenceRoot.shadowRoot

      const dashboard = shadowRoot.querySelector("#outlet > att-absence-dashboard")

      if (dashboard && dashboard.shadowRoot) {

        const shadowRoot = dashboard.shadowRoot

        const wrapperLink = shadowRoot.querySelector("div.wrapper > dna-link-card")

        wrapperLink.style.color = "var(--mooie-text-color)"

      }
    }
  }
  


  /// Activiteiten warning

  const attentionAlert = document.querySelector("#activiteit-detail-container > dna-alert")

  if (attentionAlert && attentionAlert.shadowRoot) {

    attentionAlert.shadowRoot.querySelectorAll(".text").forEach((text) => {
      text.style.color = "var(--mooie-text-color)"
    })

  }

  /// Dialog

  const dialog = document.querySelector("html dna-overlay-container > dna-overlay > dna-message-dialog")

  if (dialog && dialog.shadowRoot) {

    dialog.shadowRoot.querySelector("dna-dialog-title").style.color = "var(--mooie-text-color)"

    dialog.shadowRoot.querySelector("dna-button-bar > dna-button:nth-child(1):hover").style.backgroundColor = "var(--mooie-bg-color-hover)"

  }


  /// Datum week

  if (currentLocationSplit === "magister.net/magister/#/vandaag") {
    const pageHeader = document.querySelector("#vandaag-container > dna-page-header")

    if (pageHeader && pageHeader.shadowRoot) {

      if (!pageHeader.shadowRoot.getElementById("pensumA")) {
        // const style = document.createElement('style');
        // style.id = "mpp-week-style"
        c = ""
        if (weekToPensum[getISOWeekNumber()] != undefined) {
          c = weekToPensum[getISOWeekNumber()]
        }
        // style.textContent = `
        //   div.container > div > div.title::after {
        //     content: "${c}";
        //     color: var(--mid-gray);
        //   }
        // `;
        const pensumA = document.createElement("a")
        pensumA.id = "pensumA"
        pensumA.innerHTML = c

        if (document.querySelector("#user-menu > figure > img").getAttribute("alt") == "Aidan Schoester") {
          if (localVersion != newestVersion) {
            pensumA.innerHTML = `${c} pull ff slet`
          }
        }

        if (weekToPensum["src"] != undefined) pensumA.href = weekToPensum["src"]
        pensumA.style.color = "var(--mid-gray)"
        pensumA.style.textDecoration = "none"
        pensumA.target = "_blank"


        pageHeader.shadowRoot.querySelector("div.container > div > div.title").style.userSelect = "none"

        pageHeader.shadowRoot.querySelector("div.container > div > div.title").appendChild(pensumA);
      
      }
    }
  }  

  //~ MotD

  if (currentLocationSplit === "magister.net/magister/#/vandaag") {
    if (!document.getElementById("motdSpan")) {
      const cont = document.getElementById("vandaag-container");
      const motdSpan = document.createElement("span")
      motdSpan.innerHTML = motd
      motdSpan.id = "motdSpan"
      cont.appendChild(motdSpan)
    }
    
  }

  ///! Keuze button small hover text 

  const span = document.querySelector("#customButtonKeuze > span")

  if (span) {
    if (window.getComputedStyle(span, '::after').content !== "none" && window.getComputedStyle(span, '::after').content !== "" ) {
      const fauxLabel = document.getElementById("faux-label")
      fauxLabel.style.display = "block"
      fauxLabel.innerHTML = "Keuzes"
  
      const menuContainerTop = document.querySelector("body > div.container > div.menu-host.loading.collapsed-menu > nav > div.menu-container").getBoundingClientRect().top
  
      const spanRect = span.getBoundingClientRect()
      const spanCenterY = spanRect.top + (spanRect.height / 2) - menuContainerTop - 12
  
      fauxLabel.style.top = `${spanCenterY}px`
    }
  }

  const spanZer = document.querySelector("#customButtonZermelo > span")

  if (spanZer) {
    if (window.getComputedStyle(spanZer, '::after').content !== "none" && window.getComputedStyle(spanZer, '::after').content !== "" ) {
      const fauxLabel = document.getElementById("faux-label")
      fauxLabel.style.display = "block"
      fauxLabel.innerHTML = "Zermelo"
  
      const menuContainerTop = document.querySelector("body > div.container > div.menu-host.loading.collapsed-menu > nav > div.menu-container").getBoundingClientRect().top
  
      const spanRect = spanZer.getBoundingClientRect()
      const spanCenterY = spanRect.top + (spanRect.height / 2) - menuContainerTop - 12
  
      fauxLabel.style.top = `${spanCenterY}px`
    }
  }
  if (document.getElementById("customButtonKeuze")) {
    document.getElementById("customButtonKeuze").addEventListener("mouseleave", () => {
      document.getElementById("faux-label").style.display = "none"
    })
  }

  if (document.getElementById("customButtonZermelo")) {
    document.getElementById("customButtonZermelo").addEventListener("mouseleave", () => {
      document.getElementById("faux-label").style.display = "none"
    })
  }

  //~ Absentie

  if (currentLocationSplit === "magister.net/magister/#/att-absence") {

    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsDashDOM = attAbs.shadowRoot.querySelector("#outlet > att-absence-dashboard").shadowRoot

    const pageHeader = attAbsDashDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"


    attAbsDashDOM.querySelector(".wrapper > dna-link-card").shadowRoot.querySelectorAll(".arrow").forEach((item) => {
      item.style.color = "var(--mooie-bg-color)"
    })

  }

  if (currentLocationSplit === "magister.net/magister/#/att-absence/absence-overview-student") {
    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsOverDOM = attAbs.shadowRoot.querySelector("#outlet > att-absence-overview-student").shadowRoot

    attAbs.shadowRoot.querySelector("#outlet > att-absence-overview-student").style.backgroundColor = "var(--mooie-bg-color)"

    const scrollbarStyle = document.createElement("style")
    scrollbarStyle.id = "scrollbarStyle"

    scrollbarStyle.textContent = `
    *::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
    }

    *::-webkit-scrollbar-track {
      border-radius: 10px !important;
      background-color: var(--mooie-bg-color) !important;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--primary-background) !important; 
      border-radius: 5px !important;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: var(--primary-background) !important; 
    }`

    if (!attAbs.shadowRoot.getElementById("scrollbarStyle")) attAbs.shadowRoot.appendChild(scrollbarStyle)

    const pageHeader = attAbsOverDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"


    const dnaTabs = attAbsOverDOM.querySelector("dna-tabs")
    dnaTabs.style.backgroundColor = "var(--mooie-bg-color)"
    
    dnaTabs.querySelector("dna-tab > .page-content > att-lesson-registrations").style.backgroundColor = "var(--mooie-bg-color)"
    dnaTabs.querySelector("dna-tab > .page-content > att-lesson-registrations").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").style.backgroundColor = "var(--mooie-bg-color)"
    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab-bar").style.backgroundColor = "var(--mooie-bg-color)"

    dnaTabs.querySelectorAll("dna-tab-bar > dna-tab-button").forEach((btn) => { btn.style.color = "var(--mooie-text-color)" })

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.querySelector("ul").style.color = "var(--mooie-text-color)"

    dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.querySelector("ul > li").setAttribute("style", "")

    const hoverStyle = document.createElement("style")
    hoverStyle.id = "hoverStyle"

    hoverStyle.textContent = `
    ul > li:hover {
      background-color: var(--mooie-bg-color-hover);
    }`

    if (!dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.getElementById("hoverStyle")) dnaTabs.querySelector("dna-tab > .page-content > att-report-list").shadowRoot.appendChild(hoverStyle)

  }

  if (currentLocationSplit.replace(/\/[^\/]+$/,"") == "magister.net/magister/#/att-absence/details") {
    document.querySelector("body > .container").style.paddingRight = "0"

    const attAbs = document.querySelector("body > div.container > div.view.ng-scope > mg-att-absence > att-absence-root")
    const attAbsOverDOM = attAbs.shadowRoot.querySelector("#outlet > att-parent-student-absence-details").shadowRoot

    attAbs.shadowRoot.querySelector("#outlet > att-parent-student-absence-details").style.backgroundColor = "var(--mooie-bg-color)"

    const scrollbarStyle = document.createElement("style")
    scrollbarStyle.id = "scrollbarStyle"

    scrollbarStyle.textContent = `
    *::-webkit-scrollbar {
      width: 5px !important;
      height: 5px !important;
    }

    *::-webkit-scrollbar-track {
      border-radius: 10px !important;
      background-color: var(--mooie-bg-color) !important;
    }

    *::-webkit-scrollbar-thumb {
      background: var(--primary-background) !important; 
      border-radius: 5px !important;
    }

    *::-webkit-scrollbar-thumb:hover {
      background: var(--primary-background) !important; 
    }`

    if (!attAbs.shadowRoot.getElementById("scrollbarStyle")) attAbs.shadowRoot.appendChild(scrollbarStyle)

    const pageHeader = attAbsOverDOM.querySelector("dna-page-header")

    pageHeader.style.backgroundColor = "var(--primary-background)"



    const cardStyle = document.createElement("style")
    cardStyle.id = "cardStyle"

    cardStyle.textContent = `
    .page-content > dna-card {
      background: var(--mooie-bg-color-mid);
      border-color: transparent;
      color: var(--mooie-text-color);
      --dna-control-border: var(--mid-gray);
    }`

    if (!attAbsOverDOM.getElementById("cardStyle")) attAbsOverDOM.appendChild(cardStyle)

    
  }
  

  //~ Cijfers list new
  if (currentLocationSplit === "magister.net/magister/#/cijfers") {
    
    const cijferTrs = document.querySelectorAll("#cijfers-laatst-behaalde-resultaten-container > section.main > div.content-container > div.wide-widget > div.table-block > div.content > table.data-overview > tbody > tr")

    cijferTrs.forEach((tr) => {
      if (!tr.classList.contains("customCijfersItem")) {
        const vak = tr.querySelector(`td[data-ng-bind="cijfer.vak.omschrijving"]`).innerHTML
        const dag = tr.querySelector(`td[data-ng-bind^="cijfer.ingevoerdOp"]`).innerHTML
        const wat = tr.querySelector(`td[data-ng-bind="cijfer.omschrijving"]`).innerHTML
        const cijfer = tr.querySelector(`td[data-ng-bind="cijfer.waarde"]`).innerHTML
        const weging = tr.children.item(4).innerHTML

        // Clear shit
        tr.innerHTML = ""

        // Make better shit

        // part 0

        const dagTd = document.createElement("td")
        dagTd.classList.add("c-dag")
        dagTd.innerHTML = dag

        // part 1

        const vakSpan = document.createElement("td")
        vakSpan.classList.add("c-vak")
        vakSpan.innerHTML = vak

        const watSpan = document.createElement("td")
        watSpan.classList.add("c-wat")
        watSpan.innerHTML = wat

        tr.appendChild(dagTd)
        tr.appendChild(vakSpan)
        tr.appendChild(watSpan)

        // part 2

        const backTd = document.createElement("td")
        backTd.classList.add("c-back-td")

        const cijferSpan = document.createElement("span")
        cijferSpan.classList.add("c-cijfer")
        cijferSpan.innerHTML = cijfer

        const wegingSpan = document.createElement("span")
        wegingSpan.classList.add("c-weging")
        wegingSpan.innerHTML = weging

        
        tr.appendChild(backTd)
        backTd.appendChild(wegingSpan)
        backTd.appendChild(cijferSpan)

        const endTd = document.createElement("td")
        endTd.classList.add("c-end")
        
        tr.appendChild(endTd)

        tr.classList.add("customCijfersItem")

      }
    })

  }

  //~ Opdrachten list new
  if (currentLocationSplit === "magister.net/magister/#/elo/opdrachten") {
    
    const opdrachtenTrs = document.querySelectorAll("#opdrachten-container > section > div > div > div.scroll-table.opdrachten-list.normaal > table > tbody > tr")

    opdrachtenTrs.forEach((tr) => {
      if (!tr.classList.contains("customOpdrachtenItem")) {
        const vak = tr.querySelector(`td[data-ng-bind="opdracht.Vak"]`).innerHTML
        const titel = tr.querySelector(`td[data-ng-bind="opdracht.Titel"]`).innerHTML
        const inleverenVoor = tr.querySelector(`td[data-ng-bind^="opdracht.InleverenVoor"]`).innerHTML
        const status = tr.querySelector(`td > div > span`).innerHTML
        const beoordeling = tr.querySelector(`td[data-ng-bind="getBeoordeling(opdracht)"]`).innerHTML

        tr.innerHTML = ""

        const inleverenVoorTd = document.createElement("td")
        inleverenVoorTd.classList.add("o-inleveren")
        const formatDate = inleverenVoor.split("-")[0] + "-" + inleverenVoor.split("-")[1] + "-" + "20" + inleverenVoor.split("-")[2]
        inleverenVoorTd.innerHTML = formatDate

        const vakTd = document.createElement("td")
        vakTd.classList.add("o-vak")
        vakTd.innerHTML = vak

        const titelTd = document.createElement("td")
        titelTd.classList.add("o-titel")
        titelTd.innerHTML = titel

        const beoordelingTd = document.createElement("td")
        beoordelingTd.classList.add("o-beoordeling")
        beoordelingTd.innerHTML = beoordeling

        const statusTd = document.createElement("td")
        statusTd.classList.add("o-status")
        statusTd.innerHTML = status

        tr.appendChild(inleverenVoorTd)
        tr.appendChild(vakTd)
        tr.appendChild(titelTd)
        tr.appendChild(statusTd)
        tr.appendChild(beoordelingTd)

        const endTd = document.createElement("td")
        endTd.classList.add("o-end")

        tr.appendChild(endTd)

        tr.classList.add("customOpdrachtenItem")
      }
    })

  }

  //~ Leermiddelen list new
  if (currentLocationSplit === "magister.net/magister/#/leermiddelen") {
    
    const leermiddelenTrs = document.querySelectorAll("#leermiddelen-container table.data-overview > tbody > tr")

    leermiddelenTrs.forEach((tr) => {
      if (!tr.classList.contains("customLeermiddelenItem")) {
        const soort = tr.querySelector(`td[data-on="leermiddel.Soort"] span`)
        const soorten = {
          "School": "S",
          "Huur": "H",
          "Koop": "K",
          "Digitaal": "D"
        }

        soort.innerHTML = soorten[soort.innerHTML]

        const endTd = document.createElement("td")
        endTd.classList.add("l-end")
        
        tr.appendChild(endTd)

        tr.classList.add("customLeermiddelenItem")

      }
    })

  }
  
  //~ Agenda list new
  if (currentLocationSplit === "magister.net/magister/#/agenda") {
    
    document.querySelectorAll("#afsprakenLijst .inhoud-opmerking").forEach((span) => {
      span.innerHTML = span.innerHTML.replace(/&amp;nbsp;*$/, "")
    })

    const agendaTrs = document.querySelectorAll("#afsprakenLijst > div.k-grid-content > table > tbody > tr")

    agendaTrs.forEach((tr) => {
      if (!tr.classList.contains("customOpdrachtenItem")) {
        if (tr.classList.contains("k-grouping-row")) { /// dagen

          tr.querySelector("td > p > a.k-i-collapse").remove()
          tr.querySelector("td > p > span > span.iconic").remove()

          const dagText = tr.querySelector("td > p > span > strong")

          dagText.innerHTML = dagText.innerHTML.charAt(0).toUpperCase() + dagText.innerHTML.slice(1);


        }else {  /// afspraken

          const tijd = tr.querySelector(`td:nth-child(2) > span > span`).innerHTML

          var uur = ""

          try {
            uur = tr.querySelector(`td:nth-child(3) > span > span[ng-bind="dataItem.lesuur"]`).innerHTML
          }catch {

          }

          const les = tr.querySelector(`td:nth-child(3) > span > span[data-ng-bind-template]`).innerHTML

          var locatie = ""

          try {
            locatie = tr.querySelector(`td:nth-child(3) > span > span:nth-child(3)`).innerHTML
          }catch {

          }

          var opmerking = ""

          try {
            opmerking = tr.querySelector(`td:nth-child(4) > span > span.inhoud-opmerking`).innerHTML
          }catch {

          }

          var iconText = ""

          try {
            iconText = tr.querySelector(`td:nth-child(6) > span.agenda-text-icon`).innerHTML
          }catch {

          }
          
          // console.log(tijd, uur, les, locatie, opmerking, iconText)
        


          tr.innerHTML = ""

          const tijdTd = document.createElement("td")
          tijdTd.classList.add("a-tijd")
          
          var formatTime1 = ""
          var formatTime2 = ""

          if (tijd === "hele dag") {
            formatTime1 = "hele"
            formatTime2 = "dag"
          }else {
            formatTime1 = tijd.split("-")[0].slice(0, -1)
            formatTime2 = tijd.split("-")[1].substring(1)
          }

          const tijdSpan1 = document.createElement("span")
          const tijdSpan2 = document.createElement("span")
          
          tijdSpan1.innerHTML = formatTime1
          tijdSpan2.innerHTML = formatTime2

          tr.appendChild(tijdTd)
          tijdTd.appendChild(tijdSpan1)
          tijdTd.appendChild(tijdSpan2)



          const uurTd = document.createElement("td")
          uurTd.classList.add("a-uur")
          uurTd.innerHTML = uur

          const lesTd = document.createElement("td")
          lesTd.classList.add("a-les")
          lesTd.innerHTML = les


          
          const divTd = document.createElement("td")
          divTd.classList.add("a-div")
          divTd.innerHTML = "—"


          const locatieTd = document.createElement("td")
          locatieTd.classList.add("a-locatie")
          locatieTd.innerHTML = locatie.replace(/^\((.*)\)$/, '$1');


          const opmerkingTd = document.createElement("td")
          opmerkingTd.classList.add("a-opmerking")
          opmerkingTd.innerHTML = opmerking

          const iconTd = document.createElement("td")
          iconTd.classList.add("a-icon")
          iconTd.innerHTML = iconText

          const endTd = document.createElement("td")
          endTd.classList.add("a-end")


          tr.appendChild(uurTd)
          tr.appendChild(lesTd)
          tr.appendChild(divTd)
          tr.appendChild(locatieTd)
          tr.appendChild(iconTd)
          tr.appendChild(opmerkingTd)
          tr.appendChild(endTd)

        }
        

        tr.classList.add("customOpdrachtenItem")

      }
    })

  }


  //~ Activiteiten list new

  if (currentLocationSplit === "magister.net/magister/#/elo/activiteiten") {
    
    const activiteiten = document.querySelectorAll("#activiteiten-container > section > div > sm-grid > div > div.ngViewport.ng-scope > div > .ngRow")

    activiteiten.forEach((act) => {
      if (!act.classList.contains("customActiviteitenItem")) {
        const activ = act.querySelector(`.ng-scope > .col0 > div > .ngCellText > span`).innerHTML
        const perio = act.querySelector(`.ng-scope > .col1 > div > .ngCellText > span`).innerHTML
        const insch = act.querySelector(`.ng-scope > .col2 > div > .ngCellText > span`).innerHTML

        act.innerHTML = ""

        const inschSpan = document.createElement("span")
        inschSpan.classList.add("act-insch")
        inschSpan.title = "Inschrijvingen (min/max)"
        inschSpan.innerHTML = insch
        
        const activSpan = document.createElement("span")
        activSpan.classList.add("act-activ")
        activSpan.innerHTML = activ

        const perioSpan = document.createElement("span")
        perioSpan.classList.add("act-perio")
        perioSpan.title = "Inschrijvingsperiode"
        perioSpan.innerHTML = perio


        act.appendChild(inschSpan)
        act.appendChild(activSpan)
        act.appendChild(perioSpan)

        act.classList.add("customActiviteitenItem")
        act.classList.remove("ngRow")
      }
    })

  }



  //~ Search box

  if (!document.getElementById("searchBox")) {
    const searchBox = document.createElement("div")
    searchBox.id = "searchBox"
    searchBox.style.display = "none"
    searchBox.addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        toggleSearchBox()
      }
    })

    const searchInput = document.createElement("input")
    searchInput.type = "text"
    searchInput.id = "searchInput"
    searchInput.setAttribute("autocomplete", "off")
    searchInput.addEventListener("input", search)

    const searchResults = document.createElement("ul")
    searchResults.id = "searchResults"

    const resultsPages = document.createElement("li")
    resultsPages.id = "resultsPages"

    const resultsStudiewijzers = document.createElement("li")
    resultsStudiewijzers.id = "resultsStudiewijzers"
    
    document.body.appendChild(searchBox)
    searchBox.appendChild(searchInput)
    searchBox.appendChild(searchResults)
    searchResults.appendChild(resultsPages)
    searchResults.appendChild(resultsStudiewijzers)
  }

  //~ Open search button
  if (!document.getElementById("searchButton")) {
    const searchButtonDiv = document.createElement("div")
    searchButtonDiv.id = "searchButton"
    searchButtonDiv.classList.add("menu-button")
    searchButtonDiv.innerHTML = `<a id="searchButtonA"><i class="fa-solid fa-magnifying-glass"></i><span>Zoeken (CTRL+K)</span></a>`
  
    const appbar = document.querySelector("body > div.container > div.appbar-host > mg-appbar > div.appbar")
    appbar.insertBefore(searchButtonDiv, appbar.firstChild)
    document.getElementById("searchButtonA").addEventListener("click", toggleSearchBox)
  }
  
  //! Delete first afwezigheid btn
  const afwezigheidBtns = document.querySelectorAll('#menu-afwezigheid'); 
  if (afwezigheidBtns.length > 1) {
    afwezigheidBtns[0].parentElement.remove();
  }

  // Set iframe event listeners for key up/down
  if (zoekenActive) {
    const berichtenIframe = document.getElementById("berichten-nieuw-frame");

    if (berichtenIframe){
      if (setBerichtenIframeDown){
        berichtenIframe.contentWindow.document.addEventListener("keydown", (event) => {
          document.dispatchEvent(
            new KeyboardEvent('keydown', {key: event.key, code: event.code})
          )
        })
        setBerichtenIframeDown = false
      }
      if (setBerichtenIframeUp){
        berichtenIframe.contentWindow.document.addEventListener("keyup", (event) => {
          document.dispatchEvent(
            new KeyboardEvent('keyup', {key: event.key, code: event.code})
          )
        })
        setBerichtenIframeUp = false
      }
    }
  }
  

  // if (document.querySelectorAll("#customButtonKeuze").length > 1) {
  //   let btns = document.querySelectorAll("#customButtonKeuze")
  //   for (let i = 0; i < btns.length - 1; i++) {
  //     let btn = btns[i]
  //     btn.parentElement.remove()
  //     console.log("aaaaaaaaaaaaaaaaaahhhhhhhhhhhhhhhhhh meerdere keuze")
  //   }
  // }

  //~ new cijfers icon so its not an image
  if (document.querySelector("#menu-cijfers > img")) {
    document.querySelector("#menu-cijfers > img").remove()
    var i = document.createElement("i")
    i.classList.add("fa-hundred-points")
    i.classList.add("far")
    document.querySelector("#menu-cijfers").insertBefore(i, document.querySelector("#menu-cijfers").firstChild)
  }



  //~ add number to studiewijzer bronnen

  // let uls = document.querySelectorAll(".studiewijzer-onderdeel ul.sources")

  // uls.forEach((ul) => {
  //   ul.querySelectorAll("li").forEach((li) => {
  //     if (!li.classList.contains("done") && li.querySelectorAll("div > span.icon-map-closed").length == 0) {
  //       let sp = document.createElement("span")
  //       sp.textContent = " " + (Array.from(li.parentNode.children).indexOf(li)+1).toString();
  //       sp.classList.add("number")
  //       li.querySelector("div").insertBefore(sp, li.querySelector("div").children[1])
  //       li.classList.add("done")
  //     }
      
  //   })
  // })



}, 100);

window.navigation.addEventListener("navigate", (event) => {
  setTimeout(() => {
    setBerichtenIframeDown = true
    setBerichtenIframeUp = true
  }, 500);
})

function extractBodyContent(htmlString) {
  const bodyContentMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return bodyContentMatch ? bodyContentMatch[1] : ""
}


function createMededelingen(mededelingenCard) {
  mededelingenCard.classList.remove("content")
  mededelingenCard.innerHTML = ""
  const mededelingenTitle = document.createElement("span")
  mededelingenTitle.id = "mededelingenTitle"
  mededelingenTitle.textContent = "Mededelingen"
  mededelingenCard.appendChild(mededelingenTitle)


  MagisterApi.mededelingen().then(mededelingen => {
    
    mededelingen.forEach(med => {

      const medCard = document.createElement("div")
      medCard.classList.add("medCard")
      if (med.isGelezen) medCard.classList.add("gelezen")
      mededelingenCard.appendChild(medCard)

      const medSender = document.createElement("span")
      medSender.classList.add("medSender")
      medSender.textContent = `${med.eigenaar.voorletters} ${med.eigenaar.achternaam}`
      medCard.appendChild(medSender)

      const medTitle = document.createElement("span")
      medTitle.classList.add("medTitle")
      medTitle.textContent = med.onderwerp
      medCard.appendChild(medTitle)

      const medDate = document.createElement("span")
      medDate.classList.add("medDate")
      medDate.textContent = `${formatYMDtoDmY(med.begin)} - ${formatYMDtoDmY(med.einde)}`
      medCard.appendChild(medDate)

      medCard.addEventListener("click", () => {
        MagisterApi.mededeling(med.id).then(content => {
          mededelingenCard.innerHTML = ""
          mededelingenCard.classList.add("content")

          const contentTitle = document.createElement("span")
          contentTitle.id = "contentTitle"
          contentTitle.textContent = med.onderwerp
          mededelingenCard.appendChild(contentTitle)

          const contentAfzender = document.createElement("span")
          contentAfzender.id = "contentAfzender"
          contentAfzender.textContent = `Afzender: ${content.eigenaar.voorletters} ${content.eigenaar.achternaam}`
          mededelingenCard.appendChild(contentAfzender)

          let ontvangers = []
          content.ontvangers.forEach(ontv => ontvangers.push(ontv.omschrijving))

          const contentAan = document.createElement("span")
          contentAan.id = "contentAan"
          contentAan.textContent = `Aan: ${ontvangers.join(", ")}`
          mededelingenCard.appendChild(contentAan)

          const contentDate = document.createElement("span")
          contentDate.id = "contentDate"
          contentDate.textContent = `${formatYMDtoDmY(content.begin)} - ${formatYMDtoDmY(content.einde)}`
          mededelingenCard.appendChild(contentDate)

          const contentInhoud = document.createElement("div")
          contentInhoud.id = "contentInhoud"
          contentInhoud.innerHTML = extractBodyContent(content.inhoud)
          mededelingenCard.appendChild(contentInhoud)

          const contentTerug = document.createElement("div")
          contentTerug.id = "contentTerug"
          contentTerug.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`
          contentTerug.addEventListener("click", () => {
            createMededelingen(mededelingenCard)
          })
          mededelingenCard.appendChild(contentTerug)
        })
      })

    })

  })
}


function loadDayEvents() {
  dagRooster.innerHTML = ""

  const { start , end } = getDayStartAndEndString(getCurrentDateFormatted(currentDag))

  MagisterApi.roosterwijzigingen(start, end).then(roosterResults => {
    
    const wijzigingen = roosterResults.filter(event => {
      const eventStart = new Date(event.Start)

      const [sd, sm, sy] = start.split("-").map(Number)
      const startAsDate = new Date(sy, sm - 1, sd)

      const [ed, em, ey] = end.split("-").map(Number)
      const endAsDate = new Date(ey, em - 1, ed)


      return eventStart >= startAsDate && eventStart <= endAsDate
    })


    if (wijzigingen.length !== 0) {
  
      createEventsDay(wijzigingen)

    }else {
      MagisterApi.events(start, end, 1).then(result => {
        const events = result.filter(event => {
          const eventStart = new Date(event.Start)
    
          const [sd, sm, sy] = start.split("-").map(Number)
          const startAsDate = new Date(sy, sm - 1, sd)
    
          const [ed, em, ey] = end.split("-").map(Number)
          const endAsDate = new Date(ey, em - 1, ed)
    
    
          return eventStart >= startAsDate && eventStart <= endAsDate
        })
    
        createEventsDay(events)
      })
    }

    

  })

  const [day, month, year] = getCurrentDateFormatted(currentDag).split("-").map(Number);
  const modDate = new Date(year, month - 1, day);

  const dateString = modDate.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const capitalDate = dateString.charAt(0).toUpperCase() + dateString.slice(1)
  const index = capitalDate.indexOf(" ");

  const finalDate = capitalDate.slice(0, index) + "," + capitalDate.slice(index);
  
  const pensumSuffix = weekToPensum[getISOWeekNumber(modDate)]

  document.getElementById("dateText").textContent = finalDate
  document.getElementById("pensumText").textContent = pensumSuffix
  
}

function createEventsDay(e) {

  e.forEach(event => {
    
    const eventDiv = document.createElement("li")
    eventDiv.classList.add("roosterEvent")
    eventDiv.addEventListener("click", () => {
      const newUrl = "https://" + window.location.href.split(".")[0].split("//")[1] + ".magister.net/magister/#/agenda/huiswerk/" + event.Id
      // console.log(newUrl)
      window.location.href = newUrl
    })
    dagRooster.appendChild(eventDiv)

    const vakSpan = document.createElement("span")
    // if (event.Vakken[0]) vakSpan.textContent = event.Vakken[0].Naam
    // else vakSpan.textContent = event.Omschrijving
    vakSpan.textContent = event.Omschrijving
    vakSpan.classList.add("eventVak")
    eventDiv.appendChild(vakSpan)

  })

}


function getDayStartAndEnd(dateString) {
  const [day, month, year] = dateString.split("-").map(Number)

  const start = new Date(year, month - 1, day, 0, 0, 0, 0)
  const end = new Date(year, month - 1, day, 23, 59, 59, 999)

  return { start, end }
}

function getDayStartAndEndString(dateString) {
  const [day, month, year] = dateString.split("-").map(Number)
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 1);

  const nextDay = String(date.getDate()).padStart(2, "0");
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextYear = date.getFullYear();

  endString = `${nextDay}-${nextMonth}-${nextYear}`

  return { start: dateString , end: endString }
}

function getCurrentDateFormatted(skipDays = 0) {
  const currentDate = new Date()
  
  currentDate.setDate(currentDate.getDate() + skipDays)

  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()

  return `${day}-${month}-${year}`
}


// const asyncFunc = async () => {
//   const { start, end } = getDayStartAndEnd("02-10-2024")

//   const events = await MagisterApi.events(start, end)

//   const filteredEvents = events.filter(event => {
//     const eventStart = new Date(event.Start)

//     return eventStart >= start && eventStart <= end
//   });

//   console.log(filteredEvents)
// }

// asyncFunc()

function toggleSearchBox() {
  const searchBox = document.getElementById("searchBox")

  if (searchBox.style.display === "none") {
    browser.storage.sync.get({ hideZoekenBtn: true })
	  .then((items) => {
        if (!items.hideZoekenBtn) {
          searchBox.style.display = "block"
          const searchInput = document.getElementById("searchInput")
          searchInput.focus()
          searchInput.value = ""
          document.getElementById("resultsPages").innerHTML = ""
          document.getElementById("resultsStudiewijzers").innerHTML = ""
          selectedSearchIndex = 0
          search()
        }
      }
    )
  }else {
    searchBox.style.display = "none"
  }
}

function formatText(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\//g, ' ').replace(/\s/g, '')
}

function toggleSidebar() {
  document.querySelector("body > div.container > div.menu-host.loading > nav > div.menu-footer > a").click()
}

async function search() {
  const searchInput = document.getElementById("searchInput")
  const searchResults = document.getElementById("searchResults")
  const resultsPages = document.getElementById("resultsPages")
  const resultsStudiewijzers = document.getElementById("resultsStudiewijzers")
  const input = searchInput.value.toLowerCase()

  const studiewijzers = await MagisterApi.studiewijzers()

  const pages = [
    {
      "title": "Vandaag",
      "btnId": "menu-vandaag"
    },
    {
      "title": "Agenda",
      "btnId": "menu-agenda"
    },
    {
      "title": "Afwezigheid",
      "btnId": "menu-afwezigheid"
    },
    {
      "title": "Cijfers",
      "btnId": "menu-cijfers"
    },
    {
      "title": "Examen",
      "btnId": "menu-examen"
    },
    {
      "title": "LVS/Logboeken",
      "btnId": "menu-logboeken"
    },
    {
      "title": "LVS/Toetsen",
      "btnId": "menu-toetsen"
    },
    {
      "title": "OPP",
      "btnId": "menu-opp"
    },
    {
      "title": "ELO/Bronnen",
      "btnId": "menu-bronnen"
    },
    {
      "title": "ELO/Studiewijzers",
      "btnId": "menu-studiewijzers"
    },
    {
      "title": "ELO/Opdrachten",
      "btnId": "menu-opdrachten"
    },
    {
      "title": "Portfolio/Profiel",
      "btnId": "menu-profiel"
    },
    {
      "title": "Portfolio/Portfoliodocumenten",
      "btnId": "menu-portfoliodocumenten"
    },
    {
      "title": "Portfolio/Beoordeelde documenten",
      "btnId": "menu-beoordeelde-producten"
    },
    {
      "title": "Activiteiten",
      "btnId": "menu-activiteiten"
    },
    {
      "title": "Leermiddelen",
      "btnId": "menu-leermiddelen"
    },
    {
      "title": "Berichten",
      "btnId": "menu-berichten-new"
    },
    {
      "title": "Mijn gegevens",
      "btnId": "mijnGegevens"
    },
    {
      "title": "Keuzes",
      "btnId": "customButtonKeuze"
    }
  ]

  // check search
  var matches = []

  pages.forEach((page) => {
    const position = formatText(page.title).indexOf(formatText(input))

    if (position !== -1) { 
      matches.push({ page, position })
    }

    // if (formatText(page.title).includes(formatText(input))) {
    //   matches.push({ page })
    // }
  })


  studiewijzers.forEach((studiewijzer) => {
    const position = formatText(studiewijzer.Titel).indexOf(formatText(input))

    if (position !== -1) { 
      matches.push({ studiewijzer, position })
    }

    // if (formatText(studiewijzer.Titel).includes(formatText(input))) {
    //   matches.push({ studiewijzer })
    // }
  })

  matches.sort((a, b) => a.position - b.position);

  // console.log(matches)

  resultsPages.innerHTML = ""
  resultsStudiewijzers.innerHTML = ""
  selectedSearchIndex = 0
  resultsStudiewijzers.style.display = "block"
  resultsPages.style.display = "block"

  matches.forEach(match => {
    if (match.studiewijzer) {
      const li = document.createElement("li")
      li.classList.add("searchResult")
      li.addEventListener("click", () => {
        if (window.location.href.includes("magister.net/magister/#/berichten")) {
          toggleSearchBox()
          window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
          setTimeout(() => {
            window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
          }, 100);
        }else {
          toggleSearchBox()
          window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/elo/studiewijzer/${match.studiewijzer.Id}?overzichtType=0&geselecteerdVak=Alle%20vakken`)
        }
      })

      const title = document.createElement("span")
      title.classList.add("resultTitle")
      title.textContent = match.studiewijzer.Titel

      resultsStudiewijzers.appendChild(li)
      li.appendChild(title)
    }
    else if(match.page) {
      const li = document.createElement("li")
      li.classList.add("searchResult")
      if (match.page.btnId === "mijnGegevens") {
        li.addEventListener("click", () => {
          if (window.location.href.includes("magister.net/magister/#/berichten")) {
            document.getElementById("menu-vandaag").click()
            toggleSearchBox()
            setTimeout(() => {
              document.getElementById("menu-vandaag").click()
            }, 100)
            setTimeout(() => {
              window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/mijn-instellingen`)
            }, 500)
          }else {
            toggleSearchBox()
            document.getElementById("menu-vandaag").click()
            setTimeout(() => {
              window.location.replace(window.location.href.split(".")[0] + `.magister.net/magister/#/mijn-instellingen`)
            }, 100)
          }
        })
      }else {
        li.addEventListener("click", () => {
          if (window.location.href.includes("magister.net/magister/#/berichten")) {
            document.getElementById(match.page.btnId).click()
            toggleSearchBox()
            setTimeout(() => {
              document.getElementById(match.page.btnId).click()
            }, 100)
          }else {
            toggleSearchBox()
            document.getElementById(match.page.btnId).click()
          }
        })
      }
      

      const title = document.createElement("span")
      title.classList.add("resultTitle")
      title.textContent = match.page.title

      resultsPages.appendChild(li)
      li.appendChild(title)
    }
    
  })

  if (resultsPages.childElementCount == 0) {
    resultsPages.style.display = "none"
  }
  
  if (resultsStudiewijzers.childElementCount == 0) {
    resultsStudiewijzers.style.display = "none"
  }

  const pagesTitle = document.createElement("h1")
  pagesTitle.textContent = "Pagina's"
  resultsPages.insertBefore(pagesTitle, resultsPages.firstChild)

  const studiewijzersTitle = document.createElement("h1")
  studiewijzersTitle.textContent = "Studiewijzers"
  resultsStudiewijzers.insertBefore(studiewijzersTitle, resultsStudiewijzers.firstChild)


  searchResults.querySelector(".searchResult").classList.add("selected")
}

function formatDate(dateString) {
  const date = new Date(dateString)

  const day = date.getDate();
  const monthName = new Intl.DateTimeFormat("nl-NL", { month: "long" }).format(date)
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day} ${monthName} ${year}, ${hours}:${minutes}`
}


function moveSelectedIndexDown() {
  const results = document.querySelectorAll(".searchResult")

  results[selectedSearchIndex].classList.remove("selected")
  
  selectedSearchIndex = (selectedSearchIndex + 1) % results.length
  
  results[selectedSearchIndex].classList.add("selected")
}

function moveSelectedIndexUp() {
  const results = document.querySelectorAll(".searchResult")

  results[selectedSearchIndex].classList.remove("selected")
  
  selectedSearchIndex = (selectedSearchIndex - 1 + results.length) % results.length
  
  results[selectedSearchIndex].classList.add("selected")
}

function clickSelectedIndex() {
  const selectedItem = document.querySelector('#searchResults .selected');
  
  selectedItem.click();
  
}

document.addEventListener('keydown', (e) => {

  // In textbox

  if (document.getElementById("searchBox").style.display === "block") {

    if (e.key === 'Escape' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
      e.preventDefault()
      toggleSearchBox()
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      clickSelectedIndex()
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveSelectedIndexDown()
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveSelectedIndexUp()
    }
  }

  const active = document.activeElement;
  const isTyping = active && (
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA' ||
    active.isContentEditable
  );

  if (isTyping) return;

  // not in textbox

  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    toggleSearchBox()
  }

  
  if (spaceToggleSidebar && e.key == " ") {
    toggleSidebar()
  }

  if (document.getElementById("dagRooster")) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      currentDag++
      loadDayEvents()
    }
  
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      currentDag--
      loadDayEvents()
    }
  }

});

//* TMP berichten download


// setTimeout(async () => {
  
//   var total = []

//   for (let i = 0; i < 8; i++) {
//     const messages = await MagisterApi.messages(100, 100*i)
//     total.push(...messages)
//   }


//   var allContents = []

//   for (let j = 0; j < total.length; j++) {
//     const element = total[j];
//     const content = await MagisterApi.messageContent(element.id)
//     allContents.push(content)
//     if (j % 30 === 0) {
//       await delay(2000)
//     }
//   }

//   /// download file
//   browser.runtime.sendMessage({
//     action: "download",
//     filename: "data.txt",
//     text: JSON.stringify(allContents, null, 4)
//   });

// }, 2000);

// function delay(time) {
//   return new Promise(resolve => setTimeout(resolve, time));
// }
