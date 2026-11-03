const scrollElement = document.getElementById("homepage_content");
const listElements = document.getElementsByClassName("entry-container");

scrollElement.addEventListener("scroll", function () {
    for (let element of listElements) {
        let rect = element.getBoundingClientRect()
        let opacity = Math.min(
                            Math.max(
                                0,
                                (rect.top - 300) / 100
                            ),
                            (window.innerHeight + 100 - rect.bottom) / 100
                        );
        if (opacity < 0) {opacity = 0;} else if (opacity > 1) {opacity = 1;}

        element.style.opacity = opacity;
        if (Math.max(0, (rect.top - 300) / 100) < ((window.innerHeight + 100 - rect.bottom) / 100)) {
            element.style.transform = "translate(0, " + (-50 + ((opacity * 50))) +"px)";
        } else {
            element.style.transform = "translate(0, " + (30 - (opacity * 30)) +"px)";
        }
    }
});
