const spotlight_container = document.getElementById("spotlight-container");
const spotlight = document.getElementById("spotlight");

//Scale the spotlight's aspect ratio to fit to screen (account for resizing eventually)
spotlight.setAttribute("transform", "scale(" + 1 + "," + window.innerHeight/window.innerWidth + ")");
