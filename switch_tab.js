function switch_tab(active_tab) {
    const tab_names = ["Home", "Articles", "News", "Contacts"];
    for (let i = 0; i < tab_names.length; i++) {
        const body_element = document.getElementById(tab_names[i]+"_body");
        const link_element = document.getElementById(tab_names[i]+"_link");

        if (active_tab == tab_names[i]) {
            body_element.style.display = "inline";
            link_element.classList += "active";
        } else {
            body_element.style.display = "none";
            link_element.classList = [];
        }
    }
}