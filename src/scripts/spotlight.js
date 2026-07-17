const spotlight_container = document.getElementById("spotlight-container");
const spotlight = document.getElementById("spotlight");

//Scale the spotlight's aspect ratio to fit to screen (account for resizing eventually)
spotlight.setAttribute("transform", "scale(" + 1 + "," + window.innerHeight/window.innerWidth + ")");

//The proportion of the viewport width when soft limits kick in
const soft_limit_boundary = 0.9;
//The maximum angle the spotlight will follow the mouse
const max_angle = Math.atan((soft_limit_boundary*window.innerWidth/2) / (window.innerHeight)) * (180/Math.PI);

document.addEventListener("mousemove", function(event) {
    // Calculate the angle from top center to mouse as measured from the vertical
    const angle = Math.atan((event.clientX-(window.innerWidth/2)) / (event.clientY)) * (180/Math.PI);

    if (Math.abs(angle) < max_angle) {
        // Follow the mouse exactly
        spotlight.setAttribute("transform", "skewX("+ angle + ")");
    } else {
        // Stop following the mouse, soft limit kicks in

        // Angle that soft limit adds to max
        const soft_limit_angle = Math.sqrt(Math.abs(angle)-max_angle);
        // Sign of the angle being set
        const sign = angle/Math.abs(angle);
        
        spotlight.setAttribute("transform", "skewX("+ (max_angle+soft_limit_angle)*sign + ")");
    }
})
