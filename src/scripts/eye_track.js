const pupil = document.getElementById("pupil");

const eye = document.getElementById("eye_icon").getBoundingClientRect();
pupil_center = [((eye.right-eye.left)/2) + eye.left, ((eye.bottom-eye.top)/2) + eye.top];

document.addEventListener("mousemove", function(event) {
   console.log(event.clientX-pupil_center[0], event.clientY-pupil_center[1]);
   pupil.setAttribute("transform", "translate(" + (event.clientX-pupil_center[0])/30 + " " + (event.clientY-pupil_center[1])/30 +")")
});