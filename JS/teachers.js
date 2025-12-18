document.addEventListener('DOMContentLoaded', () => initTeachers());

const searchInput = document.getElementById('teacherSearch')

const params = new URLSearchParams(window.location.search);
const urlSearch = params.get("search");

if (urlSearch) {
  searchInput.value = urlSearch;
}

async function seedIfEmptyTeachers(key, path) {
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

async function initTeachers() {

  renderTeachers();

  document.getElementById('addTeacherBtn').addEventListener('click', () => {
    showTeacherForm();
  });

  document.getElementById('teacherForm').addEventListener('submit', saveTeacher);
  document.getElementById('cancelTeacher').addEventListener('click', hideTeacherForm);
  document.getElementById('teacherSearch').addEventListener('input', renderTeachers);
  const filterTeacherCourse = document.getElementById('filterTeacherCourse');
  if (filterTeacherCourse) filterTeacherCourse.addEventListener('change', renderTeachers);

  await seedIfEmptyTeachers('courses', '../data/courses.json');
  const courses = JSON.parse(localStorage.getItem('courses') || '[]').filter(c => c && c.title);
  if (filterTeacherCourse) {
    filterTeacherCourse.innerHTML = '<option value="">All Courses</option>';
    courses.forEach(c => { const opt = document.createElement('option'); opt.value = c.id; opt.text = c.title; filterTeacherCourse.appendChild(opt); });
  }
}

function getTeachers() {
  return JSON.parse(localStorage.getItem('teachers') || '[]');
}

function getCourses() {
  return JSON.parse(localStorage.getItem('courses') || '[]');
}

function saveTeachers(arr) {
  localStorage.setItem('teachers', JSON.stringify(arr));
}

function renderTeachers() {
  const tbody = document.querySelector('#teachersTable tbody');
  const searchValue = searchInput.value.toLowerCase();
  const filterCourse = document.getElementById('filterTeacherCourse') ? document.getElementById('filterTeacherCourse').value : '';
  const list = getTeachers().filter(s => {
    const matchesText = (s.name || '').toLowerCase().startsWith(searchValue) ;
    const matchesCourse = !filterCourse || (s.courses || []).includes(Number(filterCourse));
    return matchesText && matchesCourse;
  });
  tbody.innerHTML = '';
  list.forEach(s => {
    const courses = getCourses();
    const courseNames = (s.courses || []).map(id => (courses.find(c => c.id == id) || {}).title).filter(Boolean).join('<br>');
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${s.name}</td><td>${s.email}</td><td>${courseNames}</td>
      <td style="display:flex; gap:4px;">
        <button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="viewTeacher(${s.id})">View</button>
        <button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="editTeacher(${s.id})">Edit</button>
        <button class="btn small muted" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteTeacher(${s.id})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function showTeacherForm(teacher) {
  document.getElementById('teacherModal').classList.add('active');
  if (teacher) {
    document.getElementById('teacherFormTitle').innerText = 'Edit Teacher';
    document.getElementById('teacherId').value = teacher.id;
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherEmail').value = teacher.email;

    const courses = getCourses().filter(c => c.title);
    const sel = document.getElementById('teacherCourses');
    if (sel) {
      sel.innerHTML = '<option value="">Select Course</option>';
      courses.forEach(c => {
        const opt = document.createElement('option'); opt.value = c.id; opt.text = c.title;
        if ((teacher.courses || []).includes(c.id)) opt.selected = true;
        sel.appendChild(opt);
      });
    }
  } else {
    document.getElementById('teacherFormTitle').innerText = 'Add Teacher';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = '';

    const sel = document.getElementById('teacherCourses');
    if (sel) {
      sel.innerHTML = '<option value="">Select Course</option>';
      getCourses().filter(c => c.title).forEach(c => { const opt = document.createElement('option'); opt.value = c.id; opt.text = c.title; sel.appendChild(opt); });
    }
  }
}

function hideTeacherForm() {
  document.getElementById('teacherModal').classList.remove('active');
}

function saveTeacher(e) {
  e.preventDefault();
  const id = document.getElementById('teacherId').value;
  const name = document.getElementById('teacherName').value.trim();
  const email = document.getElementById('teacherEmail').value.trim();

  const courseVal = document.getElementById('teacherCourses').value;
  const courses = courseVal ? [Number(courseVal)] : [];

  if (!name || !email) {
    alert('Name and email required');
    return;
  }

  const teachers = getTeachers();
  if (id) {
    const idx = teachers.findIndex(s => s.id == id);
    if (idx !== -1) {
      teachers[idx] = { ...teachers[idx], name, email, courses };
    }
  } else {
    const newId = Date.now();
    teachers.push({ id: newId, name, email, courses });
  }
  saveTeachers(teachers);
  hideTeacherForm();
  renderTeachers();
}

window.editTeacher = function (id) {
  const teachers = getTeachers();
  const s = teachers.find(x => x.id == id);
  if (s) showTeacherForm(s);
}

window.deleteTeacher = function (id) {
  if (!confirm('Delete this teacher?')) return;
  let teachers = getTeachers();
  teachers = teachers.filter(s => s.id != id);
  saveTeachers(teachers);
  renderTeachers();
}

window.viewTeacher = function (id) {
  const s = getTeachers().find(x => x.id == id);
  if (!s) return;
  const courses = getCourses();
  const courseNames = (s.courses || []).map(id => (courses.find(c => c.id == id) || {}).title).filter(Boolean).join(', ');
  const content = `Name: ${s.name}\nEmail: ${s.email}\nCourses: ${courseNames || 'None'}`;
  document.getElementById('teacherViewContent').innerText = content;
  document.getElementById('teacherViewModal').classList.add('active');
}


renderTeachers()