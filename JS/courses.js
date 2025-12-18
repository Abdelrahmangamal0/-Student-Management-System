const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const params = new URLSearchParams(window.location.search);
const urlSearch = params.get("search");

if (urlSearch) {
  searchInput.value = urlSearch;
}


async function seedCourses() {
  if (!localStorage.getItem('courses')) {
    try {
      const res = await fetch('../data/courses.json');
      const data = await res.json();
      localStorage.setItem('courses', JSON.stringify(data));
    } catch (e) {
      console.error('seed courses failed', e);
      localStorage.setItem('courses', JSON.stringify([]));
    }
  }
}

function getCourses() { return JSON.parse(localStorage.getItem('courses') || '[]'); }
function saveCourses(list) { localStorage.setItem('courses', JSON.stringify(list)); }

function renderCourseCards() {
  const grid = document.querySelector('.courses-grid');
  if (!grid) return;
  const list = getCourses();

  grid.innerHTML = '';
  list.forEach(c => {
    const d = document.createElement('div');
    d.className = 'course-card';
    d.dataset.id = c.id;
    d.dataset.course = c.category || c.major || '';
    d.innerHTML = `<img src="${c.image || '../images/default.png'}" alt="${c.title}"><h4>${c.title}</h4>`;
    grid.appendChild(d);
  });

  attachCardFilters();
  attachCourseCardListeners();
}

function attachCardFilters() {
  if (!searchInput || !filterSelect) return;
  const cards = document.querySelectorAll('.course-card');
  const searchValue = searchInput.value.toLowerCase();
  const filterValue = filterSelect.value.toLowerCase();
  cards.forEach(card => {
    const courseMajor = (card.dataset.course || '').toLowerCase();
    const courseName = card.querySelector('h4').innerText.toLowerCase();

    const matchesSearch = courseName.startsWith(searchValue);
    const matchesFilter = filterValue === '' || courseMajor === filterValue;
    card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
  });
}

function renderCoursesTable() {
  const tbody = document.querySelector('#coursesTable');
  if (!tbody) return;
  const list = getCourses();
  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color: #9aa4b2;">No courses yet. Add one to get started!</td></tr>';
  } else {
    list.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.title}</td><td>${c.category}</td><td style="display:flex; gap:4px;"><button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="editCourse(${c.id})">Edit</button> <button class="btn small" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteCourse(${c.id})">Delete</button></td>`;
      tbody.appendChild(tr);
    });
  }
}





function showCourseForm(course) {
  const form = document.getElementById('courseForm');
  const admin = document.getElementById('coursesAdmin');
  const addBtn = document.getElementById('addCourseBtn');
  if (addBtn) addBtn.style.display = 'none';

  form.style.display = 'grid';
  admin.style.display = 'none';

  if (course) {
    if (form.querySelector('h4')) form.querySelector('h4').textContent = 'Edit Course';
    document.getElementById('courseId').value = course.id;
    document.getElementById('courseTitle').value = course.title;
    document.getElementById('courseCategory').value = course.major || course.category;
    document.getElementById('courseImage').value = course.image;
  } else {
    if (form.querySelector('h4')) form.querySelector('h4').textContent = 'Add Course';
    document.getElementById('courseId').value = '';
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseCategory').value = '';
    document.getElementById('courseImage').value = '';
  }
}

function hideCourseForm() {
  document.getElementById('courseForm').style.display = 'none';
  document.getElementById('coursesAdmin').style.display = 'block';
  const addBtn = document.getElementById('addCourseBtn');
  if (addBtn) addBtn.style.display = 'block';
}

function saveCourse(e) {
  e.preventDefault();
  const id = document.getElementById('courseId').value;
  const title = document.getElementById('courseTitle').value.trim();
  const category = document.getElementById('courseCategory').value.trim();
  const image = document.getElementById('courseImage').value.trim();

  if (!title || !category) {
    alert('Title and Major required');
    return;
  }

  let list = getCourses();

  if (id) {

    const index = list.findIndex(c => c.id == id);
    if (index !== -1) {
      list[index] = { ...list[index], title, category, image };
    }
  } else {

    list.push({ id: Date.now(), title, category, image });
  }

  saveCourses(list);
  populateCourseFilters();
  hideCourseForm();
  renderCourseCards();
  renderCoursesTable();
}



window.editCourse = function (id) {
  const list = getCourses();
  const c = list.find(x => x.id == id);
  if (c) showCourseForm(c);
}

window.deleteCourse = function (id) {
  if (!confirm('Delete this course?')) return;
  let list = getCourses();
  list = list.filter(x => x.id != id);
  saveCourses(list);
  renderCourseCards();
  renderCoursesTable();
}



async function seedCoursesAndInit() {
  await seedCourses();
  renderCourseCards();
  populateCourseFilters();
  attachCourseCardListeners();
  if (searchInput) searchInput.addEventListener('input', attachCardFilters);
  if (filterSelect) filterSelect.addEventListener('change', attachCardFilters);

  const manageBtn = document.getElementById('manageCoursesBtn');
  if (manageBtn) {
    manageBtn.addEventListener('click', () => {
      document.getElementById('courseManageModal').classList.add('active');
      renderCoursesTable();
      document.getElementById('coursesAdmin').style.display = 'block';
      document.getElementById('courseForm').style.display = 'none';
    });
  }

  const addBtn = document.getElementById('addCourseBtn');
  if (addBtn) addBtn.addEventListener('click', () => showCourseForm(null));

  const courseForm = document.getElementById('courseForm');
  if (courseForm) courseForm.addEventListener('submit', saveCourse);

  const cancelBtn = document.getElementById('cancelCourseBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', hideCourseForm);
}

function attachCourseCardListeners() {
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const courseId = card.dataset.id;
      showCourseDetails(courseId);
    });
  });
}

function showCourseDetails(courseId) {
  const courses = getCourses();
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');

  const course = courses.find(c => c.id == courseId);
  if (!course) return;


  const titleEl = document.getElementById('courseDetailsTitle');
  if (titleEl) titleEl.innerText = course.title;


  const teacher = teachers.find(t => (t.courses || []).includes(course.id));
  document.getElementById('courseTeacher').innerText = teacher ? teacher.name : 'Not assigned';


  const enrolledStudents = students.filter(s => (s.courses || []).includes(course.id));
  document.getElementById('courseStudentCount').innerText = `${enrolledStudents.length} student${enrolledStudents.length !== 1 ? 's' : ''}`;

  const studentList = document.getElementById('courseStudentList');
  studentList.innerHTML = '';
  if (enrolledStudents.length === 0) {
    studentList.innerHTML = '<p style="color: #9aa4b2; font-size: 13px;">No students enrolled</p>';
  } else {
    enrolledStudents.forEach(s => {
      const item = document.createElement('div');
      item.style.cssText = 'padding: 8px 12px; background: rgba(96, 165, 250, 0.08); border-radius: 6px; margin-bottom: 4px; font-size: 13px; color: #e6ebff;';
      item.textContent = s.name;
      studentList.appendChild(item);
    });
  }

  document.getElementById('courseModal').classList.add('active');
}

async function populateCourseFilters() {
  const courses = getCourses();
  const filterSelect = document.getElementById('filterSelect');

  if (filterSelect) {

    const unique = [...new Set(courses.map(c => c.category || c.title).filter(x => x))];

    filterSelect.innerHTML = '<option value="">All</option>';
    unique.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.text = name;
      filterSelect.appendChild(opt);
    });
  }
}

document.addEventListener('DOMContentLoaded', seedCoursesAndInit);
