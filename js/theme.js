chrome.storage.sync.get(
	{theme: "auto", studiewijzersGrid: false, darkMode: null},
	(items) => {
		let theme = items.theme;
		if (items.darkMode) {
			chrome.storage.sync.remove("darkMode");
			theme = items.darkMode ? "dark" : "light";
			chrome.storage.sync.set({theme: theme});
		}

		setGrid(items.studiewijzersGrid);
		setTheme(theme);
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

})

// This only gets called when the preference was changed.
function preferenceChanged(e) {
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
