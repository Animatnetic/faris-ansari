var binaryChars = ["0", "1"]; // Characters I literally only want to be scrambled are 0 and 1
var decipheringElements = []; // Array which stores the element that the "decoding" animation is currently doing the animaiton

function randomCharIndex() {
    return Math.floor(Math.random() * binaryChars.length);
};


function randomString(amount)  {
    var string = "";

    for (var i = 0; i < amount; i++) { 
        string += binaryChars[randomCharIndex()];
    };

    return string;
};


async function initializeDecodingEffect(string, element) {
    var length = string.length;
    var delay = 10;
    
    element.textContent = ""; // Resetting the text to be blank (will be replaced by paramter 'string' in the end when all of the effects are done)

    var gen = setInterval(() => {
        element.setAttribute("data-before", randomString(length));
        element.setAttribute("data-after", randomString(length));

        if (delay > 0) {
            delay--;
        } else {
            if (length < string.length) {
                element.textContent += string[string.length - length - 1];
            };
            length--; // Think of it as the length *left* of the word

            if (length === -1) {
                clearInterval(gen); 
                decipheringElements.splice(decipheringElements.indexOf(element), decipheringElements.indexOf(element) + 1);
            };
        };

    }, 32);
};


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) { // If it is shown on screen
            var el = entry.target;
            var originalText = el.textContent;

            if (!decipheringElements.includes(el)) {
                initializeDecodingEffect(originalText, el);
                decipheringElements.push(el);
            };

        };
    }); // Think of this goofy syntax with "callback" function as rather the ":Connect()" function like it is in roblox lua for events
});

const hiddenElements = document.querySelectorAll(".decipher");
const binaryPaddingElements = document.querySelectorAll(".binary-padding");

hiddenElements.forEach((element, key) => {
    observer.observe(element);
});

binaryPaddingElements.forEach((element, key) => {
    console.log(element.tagName)
    if (element.tagName == "P") {
        for (let i = 0; i < 10; i ++) {
            console.log("Looping")
            element.innerHTML += `<p class="binary-row">${randomString(50)}</p>`;
        };
    } else {
        element.textContent += randomString(300);
    };
});
