
var update100msAccount = window.setInterval(function(){
    browser.storage.sync.get({ 
		autoLogin: false,
		username: "",
		password: "",
		inlogText: "Bonjour",
		customHtml: false
	})
		.then((items) => {

            //~ Custom text
            if (!document.getElementById("customLoginText")) {
                const form = document.getElementsByClassName("podium")
                const h1 = document.createElement("h1")

                h1.id = "customLoginText"
                if (items.customHtml) h1.innerHTML = items.inlogText
                else h1.textContent = items.inlogText

                form[0].prepend(h1)
            }
            
            /// Delete side panel
            var appContainer = document.querySelector('.app-container')
            var secondDiv = appContainer.children[1]
            if (secondDiv) appContainer.removeChild(secondDiv)

            /// Delete more shit

            if (document.querySelector("body > div.app-container > div > footer")) document.querySelector("body > div.app-container > div > footer").remove()
            


            //~ Auto login
            if (items.autoLogin && items.username !== "" && items.password !== "" && ( !document.querySelector(".dna-form-error") || document.querySelector(".dna-form-error").textContent.includes("is niet ingevuld."))) {

                const usernameField = document.getElementById("username")

                if (usernameField) {
                    usernameField.value = items.username
                    usernameField.dispatchEvent(new Event('input', { bubbles: true }))
                    document.getElementById("username_submit").click()
                }
                    
                const passwordField = document.getElementById("password")
                
                if (passwordField) {
                    passwordField.value = items.password
                    passwordField.dispatchEvent(new Event('input', { bubbles: true }))
                    document.getElementById("password_submit").click()
                    
                }

            }
        }
    );
}, 100);
