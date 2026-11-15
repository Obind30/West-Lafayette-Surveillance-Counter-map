const entryElements = document.getElementsByClassName("full-entry");

for (let element of entryElements) {
    element.children[0].addEventListener("click", function () {
        if (element.children[1].style.display == "none") {
            element.children[1].style.display = "block";
        } else {
            element.children[1].style.display = "none";
        }
    });
}
