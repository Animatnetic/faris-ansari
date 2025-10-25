import projectsInfo from "./projectsInfo.json" with { type: "json" };

const binaryChars = ["0", "1"]; // Characters I literally only want to be scrambled are 0 and 1
var decipheringElements = []; // Array which stores the element that the "decoding" animation is currently doing the animaiton

const hiddenElements = document.querySelectorAll(".decipher");
const binaryPaddingElements = document.querySelectorAll(".binary-padding");

const PROJECT_NAME_DECOR = "🔗";

const screen = document.getElementById("screen");
const projectNameHeader = document.getElementById("project-name");
const projectLinkElement = document.getElementById("project-link");
const projectTagsContainer = document.getElementById("tags-container");
const descriptionTextElement = document.getElementById("description-text");
const projectImageElement = document.getElementById("project-image");

const forwardProjectButton = document.getElementById("forward-project");
const backProjectButton = document.getElementById("back-project");
let currentProjectIndex = 0;

let parallaxElements = [];
const elementsData = [];

let isTicking = false;

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


function showProjectDetailsAtIndex(index) {
    let projectData = projectsInfo[index];

    projectNameHeader.innerText = `${PROJECT_NAME_DECOR} ${projectData.Name}`;
    projectLinkElement.setAttribute("href", projectData.Link);
    
    let spanChildren = projectTagsContainer.querySelectorAll("span");
    
    for (let spanIndex = 0; spanIndex < spanChildren.length; spanIndex ++) { 
        console.log(projectData.Tags[spanIndex]);
        spanChildren[spanIndex].innerText = projectData.Tags[spanIndex];
    }

    descriptionTextElement.innerText = projectData.Description;
    projectImageElement.setAttribute("src", projectData.Image);


    screen.style.opacity = "0";
    screen.classList.remove("roll-in");

    setTimeout(() => {
        void screen.offsetWidth;
        
        screen.style.opacity = "1";
        screen.classList.add("roll-in");
    }, 300);
}


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

hiddenElements.forEach((element, key) => {
    observer.observe(element);
});

binaryPaddingElements.forEach((element, key) => {
    if (element.tagName == "DIV") {
        for (let i = 0; i < 10; i ++) {
            const binaryRowSpan = document.createElement("span");
            binaryRowSpan.classList.add("binary-row");
            binaryRowSpan.textContent = randomString(100);
            element.appendChild(binaryRowSpan);

            parallaxElements.push(binaryRowSpan);
        };
    } else {
        element.textContent += randomString(100);
    };
});

parallaxElements.forEach(element => {
    const factor = (Math.random() - 0.5) * 1.5;
    elementsData.push({
        element: element,
        factor: factor
    });
});

function applyParallax() {
    const scrollY = window.scrollY;

    elementsData.forEach(item => {
        const { element, factor }  = item;
        const offsetX = (scrollY * factor * 0.4) - (window.innerWidth / 2);
        element.style.transform = `translateX(${offsetX}px)`;
    })
}

window.addEventListener("scroll", () => {
    if (!isTicking) { 
        window.requestAnimationFrame(() => {
            applyParallax();
            isTicking = false;
        });

        isTicking = true;
    }
});


document.addEventListener("DOMContentLoaded", () => {
 setTimeout(() => {
    applyParallax();
 }, 50);
});


showProjectDetailsAtIndex(0);


forwardProjectButton.onclick = () => {
    currentProjectIndex += 1;

    if (currentProjectIndex > projectsInfo.length) {
        currentProjectIndex = 0; // clamping it
    }

    showProjectDetailsAtIndex(currentProjectIndex);
};


backProjectButton.onclick = () => {
    currentProjectIndex -= 1;

    if (currentProjectIndex < 0) {
        currentProjectIndex = projectsInfo.length - 1;
    }

    showProjectDetailsAtIndex(currentProjectIndex);
};

