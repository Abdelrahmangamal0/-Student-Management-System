document.addEventListener('DOMContentLoaded', () => initStudents());

const searchInput = document.getElementById('studentSearch')

const params = new URLSearchParams(window.location.search);
const urlSearch = params.get("search");

if (urlSearch) {
  searchInput.value = urlSearch;
}


async function seedIfEmpty(key, path) {
  if (!localStorage.getItem(key)) {
    try {
      const res = await fetch(path);
      const data = await res.json();
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to seed', key, e);
      localStorage.setItem(key, JSON.stringify([]));
    }
  }
}

async function initStudents() {

  renderStudents();

  document.getElementById('addStudentBtn').addEventListener('click', () => {
    showStudentForm();
  });

  document.getElementById('studentForm').addEventListener('submit', saveStudent);
  document.getElementById('cancelStudent').addEventListener('click', hideStudentForm);
  document.getElementById('studentSearch').addEventListener('input', renderStudents);
  const filterGrade = document.getElementById('filterGrade');
  if (filterGrade) filterGrade.addEventListener('change', renderStudents);
  const filterCourse = document.getElementById('filterCourse');
  if (filterCourse) filterCourse.addEventListener('change', renderStudents);

  await seedIfEmpty('courses', '../data/courses.json');
  const courses = JSON.parse(localStorage.getItem('courses') || '[]').filter(c => c && c.title);
  if (filterCourse) {
    filterCourse.innerHTML = '<option value="">All Courses</option>';
    courses.forEach(c => { const opt = document.createElement('option'); opt.value = c.title; opt.text = c.title; filterCourse.appendChild(opt); });
  }
}

function getStudents() {
  return JSON.parse(localStorage.getItem('students') || '[]');
}

function getCourses() {
  return JSON.parse(localStorage.getItem('courses') || '[]');
}

function saveStudents(arr) {
  localStorage.setItem('students', JSON.stringify(arr));
}

function renderStudents() {
  const tbody = document.querySelector('#studentsTable tbody');
  const searchValue = searchInput.value.toLowerCase();
  const filterCourse = document.getElementById('filterCourse') ? document.getElementById('filterCourse').value : '';
  const filterGrade = document.getElementById('filterGrade') ? document.getElementById('filterGrade').value : '';

  const list = getStudents().filter(s => {
   
    const matchesText = (s.name || '').toLowerCase().startsWith(searchValue);
    console.log('matchesText',matchesText);
    
    const matchesCourse = !filterCourse || (s.courses || []).includes(Number(filterCourse));

    let matchesGrade = true;
    if (filterGrade && s.gpa) {
      const gpa = parseFloat(s.gpa);
      if (filterGrade === '<2') matchesGrade = gpa < 2;
      else if (filterGrade === '>=2') matchesGrade = gpa >= 2;
      else if (filterGrade === '>=2.5') matchesGrade = gpa >= 2.5;
      else if (filterGrade === '>=3') matchesGrade = gpa >= 3;
      else if (filterGrade === '>=3.5') matchesGrade = gpa >= 3.5;
    } else if (filterGrade && !s.gpa) {
      matchesGrade = false;
    }

    return matchesText && matchesCourse && matchesGrade;
  });
  tbody.innerHTML = '';
  list.forEach(s => {
    const courses = getCourses();
    console.log(s.courses);
    
    const courseNames = (s.courses || []).map(name => (courses.find(c => c.title == name) || {}).title).filter(Boolean).join('<br>');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${s.gender || ''}</td><td>${s.gpa || ''}</td><td>${courseNames}</td>
      <td style="display:flex; gap:4px;">
        <button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="viewStudent(${s.id})">View</button>
        <button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="editStudent(${s.id})">Edit</button>
        <button class="btn small muted" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteStudent(${s.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function showStudentForm(student) {
  document.getElementById('studentModal').classList.add('active');
  if (student) {
    document.getElementById('formTitle').innerText = 'Edit Student';
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentEmail').value = student.email;
    document.getElementById('studentGender').value = student.gender || '';
    document.getElementById('studentGPA').value = student.gpa || '';

    const courses = getCourses().filter(c => c.title);
    const sel = document.getElementById('studentCourses');
    if (sel) {
      sel.innerHTML = '<option value="">Select Course</option>';
      courses.forEach(c => {
        const opt = document.createElement('option'); opt.value = c.title; opt.text = c.title;
        if ((student.courses || []).includes(c.id)) opt.selected = true;
        sel.appendChild(opt);
      });
    }
  } else {
    document.getElementById('formTitle').innerText = 'Add Student';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';

    const sel = document.getElementById('studentCourses');           
   
    if (sel) {
      sel.innerHTML = '<option value="">Select Course</option>';
      getCourses().filter(c => c.title).forEach(c => { const opt = document.createElement('option'); opt.value = c.title; opt.text = c.title; sel.appendChild(opt); });
    }
  }
}

function hideStudentForm() {
  document.getElementById('studentModal').classList.remove('active');
}

function saveStudent(e) {
  e.preventDefault();
  const id = document.getElementById('studentId').value;
  const name = document.getElementById('studentName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const gender = document.getElementById('studentGender').value;
  const gpa = document.getElementById('studentGPA').value.trim();

  const courseVal = document.getElementById('studentCourses').value;
 
  console.log('courseVal',courseVal);
  
  
  const courses = courseVal ? [courseVal] : [];
 
  if (!name || !email) {
    alert('Name and email required');
    return;
  }

  const students = getStudents();
  if (id) {
    const idx = students.findIndex(s => s.id == id);
    if (idx !== -1) {
      students[idx] = { ...students[idx], name, email, gender, gpa, courses };
    }
  } else {
    const newId = Date.now();
    students.push({ id: newId, name, email, gender, gpa, courses });
  }
  saveStudents(students);
  hideStudentForm();
  renderStudents();
}

window.editStudent = function (id) {
  const students = getStudents();
  const s = students.find(x => x.id == id);
  if (s) showStudentForm(s);
}

window.deleteStudent = function (id) {
  if (!confirm('Delete this student?')) return;
  let students = getStudents();
  students = students.filter(s => s.id != id);
  saveStudents(students);
  renderStudents();
}

window.viewStudent = function (id) {
  const s = getStudents().find(x => x.id == id);
  if (!s) return;
  const courses = getCourses();
  const courseNames = (s.courses || []).map(id => (courses.find(c => c.id == id) || {}).title).filter(Boolean).join(', ');
  const content = `Name: ${s.name}\nEmail: ${s.email}\nGender: ${s.gender || 'N/A'}\nGPA: ${s.gpa || 'N/A'}\nCourses: ${courseNames || 'None'}`;
  document.getElementById('studentViewContent').innerText = content;
  document.getElementById('studentViewModal').classList.add('active');
}

renderStudents()