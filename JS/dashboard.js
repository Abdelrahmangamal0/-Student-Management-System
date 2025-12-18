const searchInput = document.getElementById('globalSearch');


let adminName = document.getElementById('adminName')
let statStudents =document.getElementById('statStudents')
let statTeachers =document.getElementById('statTeachers')
let statCourses =document.getElementById('statCourses')

const students = JSON.parse(localStorage.getItem('students') || '[]');
const teachers = JSON.parse(localStorage.getItem('teachers')||'[]');
const courses = JSON.parse(localStorage.getItem('courses')||'[]');


// stats

statStudents.textContent = students.length
statTeachers.textContent = teachers.length
statCourses.textContent = courses.length


const enrollCounts = {};
students.forEach(s=>{
 console.log(s);
 
  const list = s.courses || (s.course ? [s.course] : []);
  list.forEach(c=>{ if(!c) return; enrollCounts[c] = (enrollCounts[c] || 0) + 1; });
});

const labels = Object.keys(enrollCounts).length ? Object.keys(enrollCounts) : courses.map(c => c.name);
const data = Object.keys(enrollCounts).length ? Object.values(enrollCounts) : courses.map(c=> c.enrolled || 0);
const ctx = document.getElementById('chartEnroll').getContext('2d');
const barColors = labels.map((_,i)=> `hsl(${(i*45)%360} 70% 55%)`);
console.log('data',data);


new Chart(ctx, {
  type: 'bar',
    data: {
        labels,
        datasets: [{
            label: 'Students per Course',
            data,
            backgroundColor: barColors,
            borderRadius: 6,
            barThickness: 50, 
             }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
        scales: {
            x: {
                ticks: { color: '#9aa4b2' }
            }
        }
    },
    plugins: [{
    beforeDraw: chart => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = '#172131'; 
      ctx.fillRect(0, 0, chart.width, chart.height);      
          ctx.restore();
    }
  }]
});




// Pie chart for distribution

const chartSize = 500; 

const canvas = document.getElementById('chartPie');
canvas.width = chartSize;
canvas.height = chartSize;

const ctxPie = document.getElementById('chartPie').getContext('2d');
const pieColors = labels.map((_,i)=> `hsl(${(i*55)%360} 65% 55%)`);
new Chart(ctxPie, {
    type: 'pie',
    data: { labels, datasets: [{ data: data, backgroundColor: pieColors }] },
    options: {
        responsive: false,           
        maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { font: { size: 10 } } } },
  
    }
});


//search

function globalSearch(query) {
  if (!query) return;
  query = query.toLowerCase();
  console.log(query);
  
  // student-search
  const studentMatch = students.find(student =>
    
    student.name.toLowerCase().startsWith(query)
 
  );

  
  if (studentMatch) {
    window.location.href =
    `students.html?search=${encodeURIComponent(query)}`;
    return;
  }
  
  
  // teacher-search
  const teacherMatch = teachers.find(teacher =>
    teacher.name.toLowerCase().startsWith(query)
    
  );
  console.log('teacherMatch',teacherMatch);
  
  
  if (teacherMatch) {
    window.location.href =
    `teachers.html?search=${encodeURIComponent(query)}`;
  }
  
 
  // course-search
  
  const courseMatch = courses.find(course =>
    course.title.toLowerCase().startsWith(query)
    
  );
  
  console.log('courseMatch',courseMatch);
  
  if (courseMatch) {
    window.location.href =
      `courses.html?search=${encodeURIComponent(query)}`;
  }
}


searchInput.addEventListener('keydown', e => {
  
  if (e.key === 'Enter') {
     e.preventDefault();
    globalSearch(searchInput.value);
  }
});



















