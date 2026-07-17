const spotlight_container = document.getElementById("spotlight-container");
const spotlight = document.getElementById("spotlight");

scale_factor = window.innerHeight/window.innerWidth;
scale = "scale(" + 1 + "," + scale_factor + ")";

//Scale the spotlight's aspect ratio to fit to screen (account for resizing eventually)
spotlight.setAttribute("transform", scale);

//The proportion of the viewport width when soft limits kick in
const soft_limit_boundary = 0.50;
//The maximum angle the spotlight will follow the mouse
const max_angle = Math.atan((soft_limit_boundary*window.innerWidth/2) / (window.innerHeight)) * (180/Math.PI);
// The angle of the spotlight as measured from the vertical
angle = 0;

onresize = (event) => {
    scale_factor = window.innerHeight/window.innerWidth;
    scale = "scale(" + 1 + "," + scale_factor + ")";
    spotlight.setAttribute("transform", scale + "skewX("+ angle + ")");
}

document.addEventListener("mousemove", function(event) {
    // Calculate the spotlight angle, correcting for horizontal scaling
    angle = Math.atan((event.clientX-(window.innerWidth/2)) / (event.clientY)) * (180/Math.PI) * scale_factor;

    if (Math.abs(angle) < max_angle) {
        // Follow the mouse exactly
        spotlight.setAttribute("transform", scale + "skewX("+ angle + ")");
    } else {
        // Stop following the mouse, soft limit kicks in

        // Angle that soft limit adds to max
        const soft_limit_angle = Math.sqrt(Math.abs(angle)-max_angle);
        // Sign of the angle being set
        const sign = angle/Math.abs(angle);

        spotlight.setAttribute("transform", scale + "skewX("+ (max_angle+soft_limit_angle)*sign + ")");
    }
})
