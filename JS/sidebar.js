
document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/sidebar.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("sidebar-placeholder").innerHTML = data;
        
        const event = new Event("sidebar-loaded");
        document.dispatchEvent(event);
    });
});



document.addEventListener("sidebar-loaded", function () {
    const links = document.querySelectorAll(".nav-link");
    const currentPath = window.location.pathname.toLowerCase();

    links.forEach(link => {
        const linkPath = link.getAttribute("href").toLowerCase();

        link.classList.remove("active");

        if (currentPath === linkPath) {
            link.classList.add("active");
            link.style.transform = "scale(1.05)";
        }
    });
});
