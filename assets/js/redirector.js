const VALID_PATHS = ["", "index.html", "success.html"];

document.addEventListener("DOMContentLoaded", () => {
    const currentFile = window.location.pathname.split("/").pop();
    const isValid = VALID_PATHS.includes(currentFile);

    if (!isValid) {
        window.location.href = "index.html";
    }
});