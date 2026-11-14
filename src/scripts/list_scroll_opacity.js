const scrollElement = document.getElementById("homepage_content");
const listElements = document.getElementsByClassName("entry-container");

const topOffsetElement = document.getElementById("title-container");
console.log(topOffsetElement);
var topOffset = topOffsetElement.offsetHeight;
topOffset += parseInt(window.getComputedStyle(topOffsetElement).getPropertyValue('margin-top'));
topOffset += parseInt(window.getComputedStyle(topOffsetElement).getPropertyValue('margin-bottom'));
topOffset /= 2;

const bottomOffset = 150;

console.log(topOffset);

function asPercentage(value) {return value / 100;}

function scrollOpacity() {
    for (let element of listElements) {
        let rect = element.getBoundingClientRect()
        let opacity = Math.min(
                            Math.max(
                                0,
                                asPercentage(rect.top - topOffset)
                            ),
                            asPercentage(window.innerHeight + bottomOffset - rect.bottom)
                        );

        // Clamp opacity
        if (opacity < 0) {opacity = 0;} else if (opacity > 1) {opacity = 1;}

        element.style.opacity = opacity;

        if (
            Math.max(0, asPercentage(rect.top - topOffset))
          < asPercentage(window.innerHeight + bottomOffset - rect.bottom)
        )
        {
            // Exiting to top (scroll down)
            element.style.transform = "translate(0, " + (-50 + ((opacity * 50))) +"px)";
        }
        else
        {
            // Exiting to bottom (scroll up)
            element.style.transform = "translate(0, " + (30 - (opacity * 30)) +"px)";
        }
    }
}

scrollOpacity();

scrollElement.addEventListener("scroll", scrollOpacity);
scrollElement.addEventListener("scrollEnd", scrollOpacity);
