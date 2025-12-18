(function () {
    document.addEventListener("DOMContentLoaded", () => {
      const currentUser = JSON.parse(
        localStorage.getItem("loggedInUser")
      );
  
      if (!currentUser) {
        window.location.replace("../index.html");
        return;
      }
  
      const adminName = document.getElementById("adminName");
      if (adminName && currentUser.fullName) {
        adminName.textContent = currentUser.fullName;
      }
    });
  })();
  