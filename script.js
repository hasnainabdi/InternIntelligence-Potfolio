// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
setTheme(savedTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
            hamburger.classList.remove('active');
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formProps);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Add animation classes to cards
    document.querySelectorAll('.service-card, .project-card').forEach(el => {
        observer.observe(el);
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

// Show button when user scrolls down 300px
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Smooth scroll to top when button is clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Rating and Comment System
const modal = document.getElementById('rating-modal');
const closeModal = document.querySelector('.close-modal');
const stars = document.querySelectorAll('.stars i');
const commentForm = document.getElementById('comment-form');
let currentProjectId = null;
let currentRating = 0;

// Initialize project comments and ratings
const projectData = {};

// Add rate & comment button to each project card
document.querySelectorAll('.project-card').forEach((card, index) => {
    const projectId = `project-${index}`;
    card.setAttribute('data-project-id', projectId);
    
    // Initialize project data
    projectData[projectId] = {
        title: card.querySelector('h3').textContent,
        comments: [],
        averageRating: 0
    };

    // Add rating button
    const buttonContainer = card.querySelector('.project-buttons');
    const rateButton = document.createElement('button');
    rateButton.className = 'project-btn rate-comment-btn';
    rateButton.textContent = 'Rate & Comment';
    buttonContainer.appendChild(rateButton);

    // Add rating display
    const projectInfo = card.querySelector('.project-info');
    const ratingDisplay = document.createElement('div');
    ratingDisplay.className = 'project-rating';
    ratingDisplay.innerHTML = `
        <div class="rating-stars">
            ${'<i class="fas fa-star"></i>'.repeat(5)}
        </div>
        <span class="rating-count">(0 reviews)</span>
    `;
    projectInfo.insertBefore(ratingDisplay, projectInfo.firstChild);
});

// Open modal when clicking rate button
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('rate-comment-btn')) {
        const projectCard = e.target.closest('.project-card');
        currentProjectId = projectCard.dataset.projectId;
        const projectTitle = projectData[currentProjectId].title;
        
        document.getElementById('modal-project-title').textContent = `Rate & Comment: ${projectTitle}`;
        resetModal();
        displayComments();
        modal.style.display = 'block';
    }
});

// Close modal
closeModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// Handle star rating
stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        updateStars();
    });
});

// Handle comment submission
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentRating) {
        alert('Please select a rating before submitting.');
        return;
    }

    const name = document.getElementById('commenter-name').value;
    const comment = document.getElementById('comment-text').value;
    
    addComment(name, comment, currentRating);
    updateProjectRating();
    commentForm.reset();
    currentRating = 0;
    updateStars();
});

// Helper functions
function resetModal() {
    commentForm.reset();
    currentRating = 0;
    updateStars();
}

function updateStars() {
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < currentRating);
    });
}

function addComment(name, comment, rating) {
    const newComment = {
        name,
        comment,
        rating,
        date: new Date().toLocaleDateString()
    };
    
    projectData[currentProjectId].comments.push(newComment);
    displayComments();
}

function displayComments() {
    const container = document.querySelector('.comments-container');
    const comments = projectData[currentProjectId].comments;
    
    container.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <span class="commenter-name">${comment.name}</span>
                <span class="comment-rating">${'★'.repeat(comment.rating)}</span>
            </div>
            <p class="comment-text">${comment.comment}</p>
            <div class="comment-date">${comment.date}</div>
        </div>
    `).join('');
}

function updateProjectRating() {
    const project = projectData[currentProjectId];
    const ratings = project.comments.map(c => c.rating);
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    project.averageRating = average;

    // Update the display on the project card
    const projectCard = document.querySelector(`[data-project-id="${currentProjectId}"]`);
    const ratingStars = projectCard.querySelector('.rating-stars');
    const ratingCount = projectCard.querySelector('.rating-count');

    ratingStars.innerHTML = `${'<i class="fas fa-star"></i>'.repeat(Math.round(average))}`;
    ratingCount.textContent = `(${ratings.length} reviews)`;
} 