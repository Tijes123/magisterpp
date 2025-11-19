var colorsJson = {}

fetch('https://jmlu.tekar.dev/data/colors.json')
  .then(res => res.json())
  .then(colors => {
    colorsJson = colors
    // console.log(colorsJson)
});

let update200ms = window.setInterval(function(){

    chrome.storage.sync.get(
        { customColor: "default" },
        (items) => {

            if (items.customColor != "default" && colorsJson[items.customColor]) {

                const selectedColors = colorsJson[items.customColor]

                let root = document.querySelector(":root");

                // grijze bg licht
                let mooieBgColor = selectedColors["mooieBgColor"]
                // grijze bg mid
                let mooieBgColorMid = selectedColors["mooieBgColorMid"]
                // grijze bg donker
                let mooieBgColorHover = selectedColors["mooieBgColorHover"]
                // tekst           
                let mooieTextColor = selectedColors["mooieTextColor"]
                // tekst die altijd wit is ; op blauwe bg
                let mooieTextColorWhite = selectedColors["mooieTextColorWhite"]

                let blueTextColorLight = selectedColors["blueTextColorLight"]
                // lichtere bg
                let background1 = selectedColors["background1"]
                // lichte bg
                let primaryBackground = selectedColors["primaryBackground"]
                // donkere bg
                let secondaryBackground = selectedColors["secondaryBackground"]
                // donkere bg met opacity .2
                let secondaryBackgroundDarker = selectedColors["secondaryBackgroundDarker"]
                // mid tekst
                let midGray = selectedColors["midGray"]

				// Dit was misschien niet de beste oplossing.
                // body.style = `--mooie-bg-color:${mooieBgColor} !important;--mooie-bg-color-mid:${mooieBgColorMid} !important;--mooie-bg-color-hover:${mooieBgColorHover} !important;--mooie-text-color: ${mooieTextColor} !important;--mooie-text-color-white: ${mooieTextColorWhite} !important;--blue-text-color-light: ${blueTextColorLight} !important;background-color: var(--mooie-bg-color) !important;--dna-primary: var(--mooie-text-color) !important;--dna-secondary: transparent !important;--dna-background: transparent !important;--background-1: ${background1} !important;--primary-background: ${primaryBackground} !important;--secondary-background: ${secondaryBackground} !important;--secondary-background-darker: ${secondaryBackgroundDarker} !important;--mid-gray: ${midGray} !important;`

				body.style.setProperty("--mooie-bg-color", mooieBgColor);
				body.style.setProperty("--mooie-bg-color-mid", mooieBgColorMid);
				body.style.setProperty("--mooie-bg-color-hover", mooieBgColorHover);
				body.style.setProperty("--mooie-text-color", mooieTextColor);
				body.style.setProperty("--mooie-text-color-white", mooieTextColorWhite);
				body.style.setProperty("--blue-text-color-light", blueTextColorLight);
				body.style.setProperty("--background-1", background1);
				body.style.setProperty("--primary-background", primaryBackground);
				body.style.setProperty("--secondary-background", secondaryBackground);
				body.style.setProperty("--secondary-background-darker", secondaryBackgroundDarker);
				body.style.setProperty("--mid-gray", midGray);
            }else {
                let body = document.getElementsByTagName("body")[0]
                body.style = ``
            }

        }
    )


}, 200);
