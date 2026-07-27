const pupil = document.getElementById("pupil");

var eye = document.getElementById("eye_icon").getBoundingClientRect();
pupil_center = [((eye.right-eye.left)/2) + eye.left, ((eye.bottom-eye.top)/2) + eye.top];

onresize = (event) => {
    // Recalculate pupil positionr
    eye = document.getElementById("eye_icon").getBoundingClientRect();
    pupil_center = [((eye.right-eye.left)/2) + eye.left, ((eye.bottom-eye.top)/2) + eye.top];
    // Resize the eye svg
    resize_eye();
}

document.addEventListener("mousemove", function(event) {
    // Translate pupil according to mouse position
    pupil.setAttribute("transform", "translate(" + (event.clientX-pupil_center[0])/30 + " " + (event.clientY-pupil_center[1])/30 +")")
});