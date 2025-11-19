chrome.storage.sync.get(
	{theme: "auto", studiewijzersGrid: false, darkMode: null, customColor: "default"},
	(items) => {
		let theme = items.theme;
		if (items.darkMode) {
			chrome.storage.sync.remove("darkMode");
			theme = items.darkMode ? "dark" : "light";
			chrome.storage.sync.set({theme: theme});
		}

		setGrid(items.studiewijzersGrid);
		setTheme(theme);
		setCustomTheme(items.customColor);
	}
)

chrome.storage.onChanged.addListener((changes) => {
	if (changes.theme) {
		const theme = changes.theme.newValue;
		setTheme(theme);
	}

	if (changes.studiewijzersGrid) {
		setGrid(changes.studiewijzersGrid.newValue);
	}

	if (changes.customColor) {
		setCustomTheme(changes.customColor.newValue)
	}
})

// This only gets called when the preference was changed.
function preferenceChanged(e) {
	console.log("preference changed: ", e);
	document.documentElement.dataset["theme"] = e.matches ? "dark" : "light";
};


// This checks if the browser prefers a dark colorscheme.
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function setTheme(theme) {
	if (theme == "auto") {

		// Change the theme when the theme preference changes.
		mediaQuery.addEventListener("change", preferenceChanged);

		// Call the preferenceChanged to update the value.
		preferenceChanged(mediaQuery);
	} else {
		// Do not change the theme when the browser theme changes.
		mediaQuery.removeEventListener("change", preferenceChanged);
		document.documentElement.dataset["theme"] = theme;
	}
}

function setGrid (value) {
	if (value) {
		document.documentElement.setAttribute("grid", "");
	} else {
		document.documentElement.removeAttribute("grid", "");
	}
}

var colorsJson = {}

fetch('https://jmlu.tekar.dev/data/colors.json')
  .then(res => res.json())
  .then(colors => {
    colorsJson = colors
    // console.log(colorsJson)
});

function setCustomTheme(customColor) {
	let root = document.querySelector(":root");

	if (customColor == "default") {
		root.style = "";
		return;
	}

	const selectedColors = colorsJson[customColor]

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
