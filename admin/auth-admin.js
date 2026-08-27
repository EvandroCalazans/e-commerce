const token = localStorage.getItem("tokenAdmin");

if (!token) {
    window.location.href = "login.html";
}