# Student Management System – Frontend

Frontend application for a Student Management System, designed to simplify the management of students, teachers, courses, and enrollments, with an intuitive and user-friendly dashboard.

---

## 🚀 Features

* Dashboard with statistics overview
* Manage students (Add / Edit / Delete)
* Manage teachers
* Manage courses
* Enroll students in courses
* Data storage using LocalStorage (can connect to API later)
* Responsive and user-friendly interface

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* BootStrap5
* Chart.js for charts and graphs
* LocalStorage (or Backend API)

---

## 📂 Project Structure

```bash
student-management-frontend/
│
├── index.html                # Home page / Dashboard
├── pages/                    # HTML pages for different sections
│   ├── dashboard.html
│   ├── students.html
│   ├── teachers.html
│   ├── courses.html
│   ├── logout.html
│   └── register.html
├── components/               # Reusable components
│   ├── index.html
│   └── sidebar.html
├── assets/
│   ├── css/                  # Stylesheets
│   │   ├── auth.css
│   │   ├── courses.css
│   │   ├── dashboard.css
│   │   └── styles.css
│   └── images/                # Project images
├── JS/                       # JavaScript logic
│   ├── auth.js
│   ├── authService.js
│   ├── courses.js
│   ├── dashboard.js
│   ├── sidebar.js
│   ├── students.js
│   ├── logout.js
│   └── teachers.js
├── data/                     # Sample data or JSON files
├── README.md                 # Project documentation
└── .gitignore                # Ignored files for Git
```

---

## ⚙️ Setup & Run

1. Clone the repository:

```bash
git clone https://github.com/Abdelrahmangamal0/-Student-Management-System.git
```

2. Navigate to the project folder:

```bash
cd student-management-System
```

3. Run the project:

* Open `index.html` directly in a browser, OR
* Use the Live Server extension in VS Code

---

## 📊 Screenshots

![Dashboard Screenshot](./assets/images/dashboard.png)
![Studens Screenshot](./assets/images/students.png)
![Teachers Screenshot](./assets/images/teachers.png)
![Courses Screenshot](./assets/images/courses.png)


---

## 🔮 Future Improvements

* Connect the frontend to a backend (Node.js / NestJS)
* Add Authentication & Authorization
* Implement user roles (Admin / Teacher / Student)
* Advanced search, filter, and pagination
* Deploy to GitHub Pages or another hosting platform

---

## 📄 License

This project is licensed under the MIT License.
