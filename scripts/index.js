const courses = [
    {
        "title": "Introduction to Computer Science",
        "subject": "CSE",
        "number": 110,
        "technology": ["Python", "Programming Fundamentals"],
        "description": "Learn the basics of computer science using Python.",
        "completed": true
    },
    {
        "title": "Web Development Fundamentals",
        "subject": "WDD",
        "number": 130,
        "technology": ["HTML", "CSS", "JavaScript"],
        "description": "Introduction to web development using HTML, CSS, and JavaScript.",
        "completed": true
    },
    {
        "title": "Introduction to Programming",
        "subject": "CSE",
        "number": 111,
        "technology": ["Java", "OOP"],
        "description": "Learn the fundamentals of programming and object-oriented design.",
        "completed": false
    },
    {
        "title": "Data Structures and Algorithms",
        "subject": "CSE",
        "number": 210,
        "technology": ["C++", "Data Structures"],
        "description": "An introduction to data structures and algorithms using C++.",
        "completed": false
    },
    {
        "title": "Advanced Web Development",
        "subject": "WDD",
        "number": 131,
        "technology": ["React", "Node.js"],
        "description": "Build dynamic web applications using React and Node.js.",
        "completed": false
    },
    {
        "title": "Mobile App Development",
        "subject": "WDD",
        "number": 231,
        "technology": ["React Native", "Mobile"],
        "description": "Develop mobile applications using React Native.",
        "completed": false
    }
];

const certificatesContainer = document.querySelector("#certificates_filtered_container");
certificatesContainer.innerHTML = "";

courses.forEach(course => {
    const courseItem = document.createElement("div");
    courseItem.classList.add("certificate-item");
    if (course.completed) {
        courseItem.classList.add("certificate-item-completed");
    }
    
    courseItem.innerHTML = `
        <h3 class="course-header">
            <span>${course.completed ? '<i class="fas fa-award"></i>' : ""}</span>
            ${course.subject} ${course.number}
        </h3>
        <div class="course-details">
            <p class="course-title">${course.title}</p>
            <ul class="course-tech" aria-label="Technologies used">
                ${course.technology.map(tech => `<li><span class="chip">${tech}</span></li>`).join('')}
            </ul>
        </div>
    `;

    courseItem.setAttribute('title', course.description);
    courseItem.setAttribute('data-subject', course.subject.toLowerCase());
    
    certificatesContainer.appendChild(courseItem);
});

courses.forEach(course => {
    course.credits = 2;
});

function updateCreditsTotal(visibleCourses) {
    const totalCredits = visibleCourses.reduce((total, course) => total + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        const items = certificatesContainer.querySelectorAll('.certificate-item');
        const visibleCourses = [];
        
        items.forEach((item, index) => {
            const isVisible = filter === 'all' || item.dataset.subject === filter;
            item.style.display = isVisible ? 'block' : 'none';
            if (isVisible) {
                visibleCourses.push(courses[index]);
            }
        });

        updateCreditsTotal(visibleCourses);

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn === button);
        });
    });
});

updateCreditsTotal(courses);
