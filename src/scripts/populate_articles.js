const article_list = [
    {title: "Article 1", bio: "Heres a short description of the article being proposed. Please read it here we want it roughly this length."},
    {title: "Article 2", bio: "Heres a short description of the article being proposed. Please read it here we want it roughly this length."},
    {title: "Article 3", bio: "Heres a short description of the article being proposed. Please read it here we want it roughly this length."}
];

// Get HTML element to insert into
const list_container = document.getElementById("Articles_body");

// Create an empty string to append HTML of project list
let inner = '<h1>Articles</h1>';
let i=0;

// Iterate through the projects list from the json file
while (article_list[i]) {
    // Append an HTML block to our string with desired elements from json file
    inner += 
    `
        <a class="blank_link" href="src/articles/`+article_list[i].title+`.html">
            <div class="summ_body">
                <h2 class="text pix_text title">`+article_list[i].title+` </h2>
                <p class="text pix_text proj_bio">`+article_list[i].bio+`</p>
            </div>
        </a>
    `;
    i++;
}

// Inject our string of HTML elements into our page
list_container.innerHTML = inner;

//TODO: Define hover functions
/*
// Define animation functions to fade in/out pointer images on hover
const hover_elems = document.getElementsByClassName("summ_container")
for(let i=0; i<hover_elems.length; i++) {
    hover_elems[i].onmouseenter = function fade_out () {
        const fade_elems = this.getElementsByClassName("fade_img");
        for(let j=0; j<fade_elems.length; j++) {
            fade_elems[j].classList.add("visible")
        }
    }
    hover_elems[i].onmouseleave = function fade_in () {
        const fade_elems = this.getElementsByClassName("fade_img");
        for(let j=0; j<fade_elems.length; j++) {
            fade_elems[j].classList.remove("visible")
        }
    }
}
*/