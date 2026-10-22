const scrollElement = document.getElementById("homepage_content");
const listElements = document.getElementsByClassName("entry-container");
const spacerElement = document.getElementById("screen-spacer");

scrollElement.addEventListener("scroll", function () {
    let element = document.getElementById("scroll-notifier");
    if (spacerElement.offsetHeight > (window.innerHeight * 0.35)) {
        element.style.opacity = 0;
    } else {
        let scrollTop = scrollElement.scrollTop;
        let opacity = Math.max(0, 1 - scrollTop / 400);
        element.style.opacity = opacity;
    }
    for (let element of listElements) {
        let rect = element.getBoundingClientRect()
        let opacity = Math.min(
                            Math.max(
                                0,
                                rect.top / 100
                            ),
                            (window.innerHeight + 100 - rect.bottom) / 100
                        );
        if (opacity < 0) {opacity = 0;} else if (opacity > 1) {opacity = 1;}

        element.style.opacity = opacity;
        console.log(opacity);
        if (Math.max(0, rect.top / 100) < ((window.innerHeight + 100 - rect.bottom) / 100)) {
            element.style.transform = "translate(0, " + (-50 + ((opacity * 50))) +"px)";
        } else {
            element.style.transform = "translate(0, " + (30 - (opacity * 30)) +"px)";
        }
    }
});

window.addEventListener("resize", function() {
    let element = document.getElementById("scroll-notifier");
    if (spacerElement.offsetHeight > (window.innerHeight * 0.35)) {
        element.style.opacity = 0;
    } else {
        let scrollTop = scrollElement.scrollTop;
        let opacity = Math.max(0, 1 - scrollTop / 400);
        element.style.opacity = opacity;
    }
});
