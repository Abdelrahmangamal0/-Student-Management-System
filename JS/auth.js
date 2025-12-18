function registerUser(e) {
  e.preventDefault();
  const fullName = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  // Validate inputs
  if (!fullName || !email || !password || !confirm) {
    alert("Please fill all fields");
    return;
  }
  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some((u) => u.email === email);
  if (exists) {
    alert("Email already registered.");
    return;
  }
  const newUser = {
    fullName,
    email,
    password,
  };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully!");
  window.location.href = "../index.html";
}
window.addEventListener("load", () => {
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  if (emailInput) emailInput.value = "";
  if (passwordInput) passwordInput.value = "";
});

function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    alert("Invalid email or password!");
    return;
  }
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "/pages/dashboard.html";
}


