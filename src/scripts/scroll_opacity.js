const scrollElement = document.getElementById("homepage_content");
scrollElement.addEventListener("scroll", function () {
    let element = document.getElementById("scroll-notifier");
    let scrollTop = scrollElement.scrollTop;
    let opacity = Math.max(0, 1 - scrollTop / 400);
    element.style.opacity = opacity;
});