function storageChanged (colorMap) {
	return (changes) => {
		if (changes.customColor) {
			setCustomTheme(changes.customColor.newValue, colorMap)
		}
	}
}
fetch('https://jmlu.tekar.dev/data/colors.json')
.then((res) => res.json()) 
.then((res) => {

	// Set initial theme.
	chrome.storage.sync.get(
		{customColor: "default"},
		(items) => {
			setCustomTheme(items.customColor, res);
		}
	)

	chrome.storage.onChanged.addListener(storageChanged(res));
})

async function setCustomTheme(customColor, colorMap) {
	let root = document.querySelector(":root");

	if (customColor == "default") {
		root.style = "";
		return;
	}

	const selectedColors = colorMap[customColor]

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

	root.style.setProperty("--mooie-bg-color", mooieBgColor);
	root.style.setProperty("--mooie-bg-color-mid", mooieBgColorMid);
	root.style.setProperty("--mooie-bg-color-hover", mooieBgColorHover);
	root.style.setProperty("--mooie-text-color", mooieTextColor);
	root.style.setProperty("--mooie-text-color-white", mooieTextColorWhite);
	root.style.setProperty("--blue-text-color-light", blueTextColorLight);
	root.style.setProperty("--background-1", background1);
	root.style.setProperty("--primary-background", primaryBackground);
	root.style.setProperty("--secondary-background", secondaryBackground);
	root.style.setProperty("--secondary-background-darker", secondaryBackgroundDarker);
	root.style.setProperty("--mid-gray", midGray);
}
