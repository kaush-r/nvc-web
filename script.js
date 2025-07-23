// Global variables
let currentRating = 0;
let mobileNavOpen = false;

// DOM Content Loaded event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAnimations();
    
    // Initialize testimonial form
    initializeTestimonialForm();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize gallery modals
    initializeGalleryModals();
    
    // Initialize blog filters
    initializeBlogFilters();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for slide-up animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all slide-up elements
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });

    // Alternative scroll-based animation for fallback
    window.addEventListener('scroll', slideUpOnScroll);
    window.addEventListener('load', slideUpOnScroll);
}

function slideUpOnScroll() {
    const elements = document.querySelectorAll('.slide-up');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Mobile Navigation
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn i');
    
    mobileNavOpen = !mobileNavOpen;
    
    if (mobileNavOpen) {
        mobileNav.classList.add('active');
        menuBtn.classList.remove('fa-bars');
        menuBtn.classList.add('fa-times');
    } else {
        mobileNav.classList.remove('active');
        menuBtn.classList.remove('fa-times');
        menuBtn.classList.add('fa-bars');
    }
}

// Testimonial Form Functions
function initializeTestimonialForm() {
    // Star Rating System
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('testimonial-rating');
    const ratingText = document.getElementById('ratingText');
    
    const ratingLabels = {
        1: 'Poor - Needs significant improvement',
        2: 'Fair - Below expectations',
        3: 'Good - Meets expectations',
        4: 'Very Good - Exceeds expectations',
        5: 'Excellent - Outstanding experience'
    };

    if (stars.length > 0) {
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', function() {
                highlightStars(index + 1);
            });
            
            star.addEventListener('mouseleave', function() {
                const currentRating = parseInt(ratingInput?.value) || 0;
                highlightStars(currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = index + 1;
                if (ratingInput) {
                    ratingInput.value = rating;
                }
                if (ratingText) {
                    ratingText.textContent = ratingLabels[rating];
                }
                highlightStars(rating);
                currentRating = rating;
            });
        });
    }

    // Character Counter
    const testimonialText = document.getElementById('testimonial-text');
    const charCount = document.getElementById('charCount');
    
    if (testimonialText && charCount) {
        testimonialText.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 450) {
                charCount.style.color = '#ef4444';
            } else if (count > 400) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#6b7280';
            }
        });
    }

    // Testimonial Form Submission
    const testimonialForm = document.getElementById('testimonialForm');
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('testimonialSubmitBtn');
            const submitText = document.getElementById('testimonialSubmitText');
            const loadingText = document.getElementById('testimonialLoadingText');
            const successMsg = document.getElementById('testimonialSuccess');
            const errorMsg = document.getElementById('testimonialError');
            
            // Hide previous messages
            if (successMsg) successMsg.classList.add('hidden');
            if (errorMsg) errorMsg.classList.add('hidden');
            
            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.classList.add('hidden');
            if (loadingText) loadingText.classList.remove('hidden');
            
            try {
                const formData = new FormData(testimonialForm);
                
                // Add rating label to form data
                const rating = formData.get('testimonial_rating');
                formData.append('rating_label', ratingLabels[rating] || 'Not specified');
                
                const response = await fetch(testimonialForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    testimonialForm.reset();
                    
                    // Reset star rating
                    if (ratingInput) ratingInput.value = '';
                    if (ratingText) ratingText.textContent = 'Please select a rating';
                    highlightStars(0);
                    currentRating = 0;
                    
                    // Reset character counter
                    if (charCount) {
                        charCount.textContent = '0';
                        charCount.style.color = '#6b7280';
                    }
                    
                    // Save to local storage for backup
                    saveTestimonialToLocalStorage(formData);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                if (errorMsg) {
                    errorMsg.classList.remove('hidden');
                    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                // Reset button state
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.classList.remove('hidden');
                if (loadingText) loadingText.classList.add('hidden');
            }
        });
    }
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Contact Form Functions
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const loadingText = document.getElementById('loadingText');
            const successMsg = document.getElementById('formSuccess');
            const errorMsg = document.getElementById('formError');
            
            // Hide previous messages
            if (successMsg) successMsg.classList.add('hidden');
            if (errorMsg) errorMsg.classList.add('hidden');
            
            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.classList.add('hidden');
            if (loadingText) loadingText.classList.remove('hidden');
            
            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    if (successMsg) successMsg.classList.remove('hidden');
                    form.reset();
                    
                    // Save to local storage for backup
                    saveContactToLocalStorage(formData);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                if (errorMsg) errorMsg.classList.remove('hidden');
            } finally {
                // Reset button state
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.classList.remove('hidden');
                if (loadingText) loadingText.classList.add('hidden');
            }
        });
    }
}

// Gallery Modal Functions
function initializeGalleryModals() {
    // Create modals HTML if they don't exist
    if (!document.getElementById('imageModal')) {
        const modalHTML = `
            <div id="imageModal" class="modal">
                <div class="modal-content">
                    <button class="modal-close" onclick="closeModal('imageModal')">&times;</button>
                    <div id="modalImageContent"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    if (!document.getElementById('blogModal')) {
        const modalHTML = `
            <div id="blogModal" class="modal">
                <div class="modal-content">
                    <button class="modal-close" onclick="closeModal('blogModal')">&times;</button>
                    <div id="modalBlogContent"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

function openModal(modalId) {
    const modal = document.getElementById('imageModal');
    const content = document.getElementById('modalImageContent');
    
    // Sample modal content - you can customize this based on modalId
    const modalContents = {
'modal1': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2025/06/Orientation-Programme-for-June-2025-Intake-20-1037x600.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4"> NSBM 25.2 ORIENTATION PROGRAMME 2025</h3>
            <p class="text-center">Our orientation program warmly welcomes new students, helping them connect with peers and explore the exciting life at NSBM. It’s the first chapter of an unforgettable journey.</p>
        `,
        'modal2': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                 <img src="https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2025/05/siyapathsiya-udanaya2025.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">NSBM SIYAPTH SIYA UDANAYA 2025</h3>
            <p class="text-center">Siyapath Siya Udanaya celebrates the vibrant traditions and creative talents of NSBM students, fostering cultural unity through performances and joyful festivities.</p>
        `,
        'modal3': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://www.nsbm.ac.lk/wp-content/uploads/2025/03/NSBM-Sports-Fiesta-2025-Grand-Finale-5.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">NSBM SPORT FIESTA 2025</h3>
            <p class="text-center">An energetic celebration of sportsmanship where students showcase their athletic talents, team spirit, and determination in various sporting events.</p>
        `,
        'modal4': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2023/08/PHOTO-2023-06-01-17-54-32.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">ICOBI 2024</h3>
            <p class="text-center">The International Conference on Business Innovation (ICOBI) brings together scholars and industry professionals to discuss innovative business ideas and global market trends</p>
        `,
        'modal5': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2024/11/NSBMColoursHonorsSportingStarsfor2023and20241-1037x600.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">NSBM COLOURS 2024</h3>
            <p class="text-center">A glamorous awards ceremony recognizing and rewarding outstanding student achievements in sports, academics, and extra-curricular activities.</p>
        `,
        'modal6': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://d3c539pel8wzjz.cloudfront.net/wp-content/uploads/2025/01/IMG_2626.jpg" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">NSBM ICTAR 2024</h3>
            <p class="text-center">The ICT Academic and Research Conference (ICTAR) promotes technological advancement by encouraging research, knowledge sharing, and innovation within the IT industry.</p>
        `,
        'modal7': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src="https://media.licdn.com/dms/image/v2/C5622AQGWzyQkq7NnmQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1673588948732?e=2147483647&v=beta&t=ML5cOrovjSYzww7-EPQ_JoHSYx88JHixsgHMlVUjYl4" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">SPIRITOUS</h3>
            <p class="text-center">Spirituous is the official installation ceremony of the NSBM Volunteer Club, celebrating leadership, volunteerism, and the positive impact students make in the community.</p>
        `,
        'modal8': `
            <div class="gallery-image" style="height: 400px; font-size: 4rem;">
                <img src=https://www.nsbm.ac.lk/wp-content/uploads/2023/08/media-cover-1024x356.jpg"" alt="Siyapath Siya Udanaya 2025" style="width: 100%; height: 400px; object-fit: cover; border-radius: 10px;">
            </div>
            <h3 class="text-center mt-4">ADM 24</h3>
            <p class="text-center">The Annual General Meeting marks the yearly review of activities, presenting accomplishments and plans while appreciating the dedicated efforts of all members.</p>
        `
    };
    
    if (content) {
        content.innerHTML = modalContents[modalId] || '<p class="text-center">Content not available</p>';
    }
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function openBlogModal(blogId) {
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('modalBlogContent');
    
    const blogContents = {
        'blog1': {
            title: 'TechVolunteers Wins University Innovation Award',
            content: `
                <p>We are thrilled to announce that TechVolunteers has been awarded the prestigious University Innovation Award for 2024. This recognition comes after our successful implementation of the "Digital Bridge" project, which connected over 500 senior citizens with essential digital literacy skills.</p>
                <p>The project utilized a custom-built learning management system developed entirely by our student volunteers, featuring adaptive learning paths and multilingual support. Key achievements include:</p>
                <ul>
                    <li>Development of a mobile app for local food banks</li>
                    <li>Creation of digital literacy programs for seniors</li>
                    <li>Implementation of sustainable technology solutions</li>
                    <li>Successful coordination of 50+ community projects</li>
                </ul>
                <p>We couldn't have achieved this without the dedication of our 200+ active members and the support of our university community.</p>
            `
        },
        'blog2': {
            title: 'Successful Digital Literacy Workshop Series Concludes',
            content: `
                <p>Our six-month Digital Literacy Workshop Series has successfully concluded, marking a significant milestone in our community outreach efforts. The program, which ran from September 2023 to February 2024, provided comprehensive digital skills training to over 200 community members.</p>
                <p>The workshops covered fundamental computer skills, internet safety, social media literacy, and practical applications for daily life. Participants ranged from teenagers looking to improve their digital skills to seniors learning to connect with family online.</p>
                <p>Program highlights include:</p>
                <ul>
                    <li>95% completion rate among participants</li>
                    <li>Average skill improvement of 75%</li>
                    <li>30+ volunteer instructors involved</li>
                    <li>Partnerships with 5 local libraries</li>
                </ul>
                <p>The positive feedback and success stories from participants have motivated us to expand the program next semester.</p>
            `
        },
        'blog3': {
            title: 'Announcing Our Spring 2024 Hackathon: Code for Change',
            content: `
                <p>We are excited to announce our upcoming Spring 2024 Hackathon: "Code for Change", scheduled for April 12-14, 2024. This 48-hour intensive event will bring together students, professionals, and community leaders to develop innovative technology solutions addressing local social challenges.</p>
                <p>The hackathon will focus on four key areas:</p>
                <ul>
                    <li>Environmental sustainability solutions</li>
                    <li>Educational technology for underserved communities</li>
                    <li>Healthcare accessibility applications</li>
                    <li>Community safety and emergency response systems</li>
                </ul>
                <p>Registration is now open with prizes totaling $10,000 and mentorship opportunities with industry professionals.</p>
            `
        },
        'blog4': {
            title: 'Partnership with Local Food Bank Launches Tech Initiative',
            content: `
                <p>TechVolunteers is proud to announce our new partnership with the Metro Community Food Bank, launching an innovative technology initiative to revolutionize food distribution efficiency.</p>
                <p>Our team of computer science and business students has developed a comprehensive inventory management system that tracks food donations, manages expiration dates, and optimizes distribution routes. The system has already shown remarkable results:</p>
                <ul>
                    <li>40% increase in distribution efficiency</li>
                    <li>50% reduction in food waste</li>
                    <li>Real-time tracking of inventory levels</li>
                    <li>Automated reporting for donors and stakeholders</li>
                </ul>
                <p>This partnership exemplifies our commitment to using technology for social good and creating sustainable solutions for community challenges.</p>
            `
        },
        'blog5': {
            title: 'Member Spotlight: Building Apps for Accessibility',
            content: `
                <p>This month, we are highlighting Jessica Liu, a junior Computer Science major whose passion for accessibility has led to the development of "CampusNavigate", an innovative mobile app designed to make our university more accessible for students with disabilities.</p>
                <p>Jessica joined TechVolunteers in her freshman year and quickly became involved in our accessibility initiatives. Her app features:</p>
                <ul>
                    <li>Audio navigation for visually impaired students</li>
                    <li>Real-time accessibility status of campus facilities</li>
                    <li>Emergency assistance features</li>
                    <li>Integration with campus transportation services</li>
                </ul>
                <p>"Technology should be inclusive by design, not as an afterthought," says Jessica. Her work has inspired other members to focus on accessibility in their projects.</p>
            `
        },
        'blog6': {
            title: 'Fundraising Success: $15K Raised for Local STEM Education',
            content: `
                <p>We are thrilled to report that our annual "Tech for Tomorrow" fundraising campaign has exceeded all expectations, raising $15,000 for STEM education programs in underserved local schools.</p>
                <p>The campaign, which ran throughout February, included various activities:</p>
                <ul>
                    <li>Charity gaming tournament</li>
                    <li>Tech skill workshops with donation-based admission</li>
                    <li>Crowdfunding initiative supported by our alumni network</li>
                    <li>Corporate sponsorship partnerships</li>
                </ul>
                <p>These funds will directly support the purchase of computers, robotics kits, and programming resources for three local elementary schools, impacting over 500 students in their STEM learning journey.</p>
            `
        }
    };
    
    const blog = blogContents[blogId];
    if (blog && content) {
        content.innerHTML = `
            <h2 class="gradient-text mb-4">${blog.title}</h2>
            ${blog.content}
        `;
    }
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Blog Filter Functions
function initializeBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.textContent;
            filterPosts(category);
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterPosts(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'All' || cardCategory === category) {
            card.style.display = 'block';
            // Add animation class
            setTimeout(() => {
                card.classList.add('fade-in');
            }, 100);
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mobileNavOpen) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Local Storage Functions
function saveTestimonialToLocalStorage(formData) {
    const data = {
        timestamp: new Date().toISOString(),
        name: formData.get('testimonial_name'),
        role: formData.get('testimonial_role'),
        email: formData.get('testimonial_email'),
        organization: formData.get('testimonial_organization'),
        category: formData.get('testimonial_category'),
        rating: formData.get('testimonial_rating'),
        testimonial: formData.get('testimonial_text'),
        consent: formData.get('testimonial_consent'),
        contact_permission: formData.get('testimonial_contact')
    };
    
    let testimonials = JSON.parse(localStorage.getItem('testimonialSubmissions') || '[]');
    testimonials.push(data);
    
    // Keep only last 50 testimonials
    if (testimonials.length > 50) {
        testimonials = testimonials.slice(-50);
    }
    
    localStorage.setItem('testimonialSubmissions', JSON.stringify(testimonials));
}

function saveContactToLocalStorage(formData) {
    const data = {
        timestamp: new Date().toISOString(),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        inquiry_type: formData.get('inquiry_type'),
        message: formData.get('message')
    };
    
    let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push(data);
    
    // Keep only last 100 submissions
    if (submissions.length > 100) {
        submissions = submissions.slice(-100);
    }
    
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
}

// Export Functions (Admin use)
function exportTestimonialsToCSV() {
    const testimonials = JSON.parse(localStorage.getItem('testimonialSubmissions') || '[]');
    
    if (testimonials.length === 0) {
        alert('No testimonial submissions found in local storage.');
        return;
    }
    
    const headers = ['Timestamp', 'Name', 'Role', 'Email', 'Organization', 'Category', 'Rating', 'Testimonial', 'Consent', 'Contact Permission'];
    let csvContent = headers.join(',') + '\n';
    
    testimonials.forEach(testimonial => {
        const row = [
            testimonial.timestamp,
            `"${testimonial.name || ''}"`,
            `"${testimonial.role || ''}"`,
            testimonial.email || '',
            `"${testimonial.organization || ''}"`,
            testimonial.category || '',
            testimonial.rating || '',
            `"${(testimonial.testimonial || '').replace(/"/g, '""')}"`,
            testimonial.consent || '',
            testimonial.contact_permission || ''
        ];
        csvContent += row.join(',') + '\n';
    });
    
    downloadCSV(csvContent, `testimonial_submissions_${new Date().toISOString().split('T')[0]}.csv`);
}

function exportContactSubmissionsToCSV() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    if (submissions.length === 0) {
        alert('No contact form submissions found in local storage.');
        return;
    }
    
    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Inquiry Type', 'Message'];
    let csvContent = headers.join(',') + '\n';
    
    submissions.forEach(submission => {
        const row = [
            submission.timestamp,
            `"${submission.name || ''}"`,
            submission.email || '',
            submission.phone || '',
            submission.inquiry_type || '',
            `"${(submission.message || '').replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    downloadCSV(csvContent, `contact_form_submissions_${new Date().toISOString().split('T')[0]}.csv`);
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Event Listeners for Modal Closing
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Admin keyboard shortcuts
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        exportTestimonialsToCSV();
    }
    
    if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        exportContactSubmissionsToCSV();
    }
});

// Utility Functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Parallax effect for hero background (optional)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});
