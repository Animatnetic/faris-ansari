var binaryChars = ["0", "1"]; // Characters I literally only want to be scrambled are 0 and 1


function randomCharIndex() {
    return Math.floor(Math.random() * binaryChars.length);
};


function randomString(amount)  {
    var string = ""

    for (var i = 0; i < amount; i++) { 
        string += binaryChars[randomCharIndex()]
    }

    return string
};


function initializeDecodingEffect(string, element) {
    var length = string.length
    var delay = 10;
    
    element.textContent = "" // Resetting the text to be blank (will be replaced by paramter 'string' in the end when all of the effects are done)

    var gen = setInterval(() => {
        element.setAttribute("data-before", randomString(length));
        element.setAttribute("data-after", randomString(length));

        if (delay > 0) {
            delay--;
        } else {
            if (length < string.length) {
                element.textContent += string[string.length - length - 1]
                console.log(element.textContent)
            }
            console.log(string)
            length--; // Think of it as the length left of the word

            if (length === -1) {
                clearInterval(gen)
            }
        }

    }, 32);
};


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) { // If it is shown on screen
            var el = entry.target
            var originalText = el.textContent

            initializeDecodingEffect(originalText, el)
            // console.log(originalText);
            // console.log(el)

        }
    }); // Think of this goofy syntax with "callback" function as rather the ":Connect()" function like it is in roblox lua for events
});

const hiddenElements = document.querySelectorAll(".decipher");
hiddenElements.forEach((element) => {
    observer.observe(element);
});
