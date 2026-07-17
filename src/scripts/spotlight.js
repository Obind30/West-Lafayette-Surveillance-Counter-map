const spotlight_container = document.getElementById("spotlight-container");
const spotlight = document.getElementById("spotlight");

//Scale the spotlight's aspect ratio to fit to screen (account for resizing eventually)
spotlight.setAttribute("transform", "scale(" + 1 + "," + window.innerHeight/window.innerWidth + ")");


const bredth = 100;
const max_angle = Math.atan((window.innerWidth/2) / (window.innerHeight)) * (180/Math.PI);

document.addEventListener("mousemove", function(event) {
    const angle = Math.atan((event.clientX-(window.innerWidth/2)) / (event.clientY)) * (180/Math.PI);
    if (Math.abs(angle) < max_angle) {
        setInterval(spotlight.setAttribute("transform", "skewX("+ angle + ")"), 100);
    } else {
        setInterval(spotlight.setAttribute("transform", "skewX("+ max_angle*(angle/Math.abs(angle)) + ")"), 100);
    }
})
