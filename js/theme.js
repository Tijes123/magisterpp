chrome.storage.sync.get(
	{theme: "auto"},
	(items) => {
		setTheme(items.theme)
	}
)

function preferenceChanged(e) {
	document.documentElement.dataset["theme"] = e.matches ? "dark" : "light";
};

// This checks if the browser prefers a dark colorscheme.
const predicate = window.matchMedia("(prefers-color-scheme: dark)");


function setTheme(theme) {
	if (theme == "auto") {

		// Change the theme when the theme preference changes.
		predicate.addEventListener("change", preferenceChanged);

		// Call the preferenceChanged to update the value.
		preferenceChanged(predicate);
	} else {
		// Do not change the theme when the browser theme changes.
		predicate.removeEventListener("change", preferenceChanged);
		document.documentElement.dataset["theme"] = theme;
	}
}

chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace = "sync", changes.theme) {
		const theme = changes.theme.newValue;
		setTheme(theme)
	}
})
