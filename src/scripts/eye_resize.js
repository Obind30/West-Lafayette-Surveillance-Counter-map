const left_move = document.getElementsByClassName("stretch_left");
const right_move = document.getElementsByClassName("stretch_right");

var last_move = 0;

function resize_eye() {
    var container_rect = document.getElementById("eye_container").getBoundingClientRect();
    var leftmost_point = document.getElementById("leftmost").getBoundingClientRect().left;
    // Calculate how far to translate elements
    var transform_amount = (last_move+leftmost_point-container_rect.left-5)*(2000/(container_rect.right-container_rect.left));
    last_move = last_move+leftmost_point-container_rect.left-5; //The distance moved last time, avoids flashing
    // Translate traces/vias right
    for (let elem = 0; elem < right_move.length; elem++){
        let transform = ""
        transform += "translate(";
        transform += transform_amount;
        transform += ", 0)";

        right_move[elem].setAttribute("transform", transform);
    }
    // Translate traces/vias left
    for (let elem = 0; elem < left_move.length; elem++){
        let transform = ""
        transform += "translate(";
        transform += -1*transform_amount;
        transform += ", 0)";

        left_move[elem].setAttribute("transform", transform);
    }
    // Stretch traces to meet center eye
    document.getElementById("stretch_1").setAttribute("x2", 612.16458+transform_amount+5);
    document.getElementById("stretch_2").setAttribute("x2", 832.81648-transform_amount-4);
    document.getElementById("stretch_3").setAttribute("x2", 1129+transform_amount+4);
    document.getElementById("stretch_4").setAttribute("x2", 1136+transform_amount+5);
}

resize_eye();
