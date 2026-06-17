document.addEventListener("DOMContentLoaded", () => {
    // 1. Element animators
    const animateElements = document.querySelectorAll('.animate-up, .animate-fade');
    setTimeout(() => {
        animateElements.forEach(el => el.classList.add('in-view'));
    }, 150);

    // 2. Mobile Menu & Lang Switcher
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        document.addEventListener('click', (e) => {
            const isLangBtnClick = e.target.closest('.lang-switcher__btn');
            const isInsideSwitcher = e.target.closest('#langSwitcher');

            if (isLangBtnClick) {
                langSwitcher.classList.toggle('active');
            } else if (!isInsideSwitcher) {
                langSwitcher.classList.remove('active');
            }
        });
    }

    // 3. FAQ Accordion Logic (index.html)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const currentActive = document.querySelector('.faq-item.active');
            if (currentActive && currentActive !== item) {
                currentActive.classList.remove('active');
                currentActive.querySelector('.faq-answer').style.maxHeight = null;
            }
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

    // 4. Modal & Form Logic
    const modal = document.getElementById('contactModal');
    const openModalBtns = document.querySelectorAll('a[href="#"], .pricing-card__btn, .btn--primary');
    const closeModalBtn = document.getElementById('closeModal');
    const contactForm = document.getElementById('contactForm');
    const modalFormContent = document.getElementById('modalFormContent');
    const modalSuccessContent = document.getElementById('modalSuccessContent');

    const openModal = (e) => {
        if (e && e.target.tagName === 'A' && e.target.getAttribute('href') !== '#') return;
        if (e) e.preventDefault();
        if(modal) {
            // Check for data-course to pre-select it
            const courseToSelect = e.currentTarget.dataset.course;
            if (courseToSelect) {
                const selectCourse = contactForm.querySelector('select[name="course"]');
                if (selectCourse) {
                    selectCourse.value = courseToSelect;
                }
            } else {
                // Reset select if no specific course is set
                const selectCourse = contactForm.querySelector('select[name="course"]');
                if (selectCourse) selectCourse.selectedIndex = 0;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                if(modalFormContent) modalFormContent.style.display = 'block';
                if(modalSuccessContent) modalSuccessContent.style.display = 'none';
                if(contactForm) contactForm.reset();
                document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
            }, 500);
        }
    };

    openModalBtns.forEach(btn => {
        const text = btn.innerText.toLowerCase();
        if (text.includes('заявку') || text.includes('консультация') || text.includes('связаться')) {
            btn.addEventListener('click', openModal);
        }
    });

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = contactForm.querySelectorAll('.form-input');

            inputs.forEach(input => {
                const value = input.value.trim();
                input.classList.remove('error');

                if (!value) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                    isValid = false;
                    input.classList.add('error');
                } else if (input.name === 'phone' && value.length < 9) {
                    isValid = false;
                    input.classList.add('error');
                }
            });

            // Course selection validation
            const selectCourse = contactForm.querySelector('select[name="course"]');
            if (selectCourse) {
                selectCourse.classList.remove('error');
                if (!selectCourse.value) {
                    isValid = false;
                    selectCourse.classList.add('error');
                }
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('button');
                submitBtn.innerText = 'Отправка...';
                submitBtn.disabled = true;

                const formData = new FormData(contactForm);
                // Optional: avoid captcha redirect if confirmed
                formData.append("_captcha", "false"); 
                
                const isContactsPage = window.location.pathname.includes('contacts.html');
                formData.append("_subject", isContactsPage ? "Новое сообщение (Контакты)" : "Новая заявка на курс ADR!");

                fetch("https://formsubmit.co/ajax/vladyslavsmalii@gmail.com", {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (isContactsPage) {
                        if (modal) modal.classList.add('active');
                    } else {
                        if (modalFormContent) modalFormContent.style.display = 'none';
                        if (modalSuccessContent) modalSuccessContent.style.display = 'flex';
                    }
                })
                .catch(error => {
                    console.error('Submission error:', error);
                    alert("Произошла ошибка при отправке заявки. Пожалуйста, проверьте подключение и попробуйте позже.");
                })
                .finally(() => {
                    submitBtn.innerText = 'Отправить заявку';
                    submitBtn.disabled = false;
                    contactForm.reset();
                });
            }
        });
    }

    // 5. Scroll Top Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const featuresSection = document.getElementById('features') || document.querySelector('.programs-content');
    
    if (scrollTopBtn && featuresSection) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > featuresSection.offsetTop - 100) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Tab Switching Logic (programs.html)
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    window.showTab = function(targetId) {
        const targetTab = Array.from(tabs).find(t => t.dataset.target === targetId);
        const targetPane = document.querySelector(`.tab-pane[data-pane="${targetId}"]`);
        
        if (targetTab && targetPane) {
            // Update buttons
            tabs.forEach(t => t.classList.remove('active'));
            targetTab.classList.add('active');

            // Update panes with smooth transition
            panes.forEach(p => {
                p.classList.remove('active');
                p.style.opacity = '0';
            });
            
            targetPane.classList.add('active');
            
            // Allow display block to apply before animating opacity
            setTimeout(() => {
                targetPane.style.opacity = '1';
            }, 30);
        }
    }

    if(tabs.length > 0) {
        // Bind click events on tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault(); 
                const target = tab.dataset.target;
                history.pushState(null, null, `#${target}`);
                window.showTab(target);
            });
        });

        // Handle initial load hash
        if (window.location.hash) {
            const hashItem = window.location.hash.substring(1);
            if (['basic', 'tanks', 'class1', 'class7'].includes(hashItem)) {
                window.showTab(hashItem);
            } else {
                window.showTab('basic');
            }
        } else {
            // Default to basic if on programs.html and no hash
            if (window.location.pathname.includes('programs.html')) {
                window.showTab('basic');
            }
        }
    }

    // 7. Handle dropdown clicks for programs on identical page
    const dropdownLinks = document.querySelectorAll('.nav__dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('programs.html#') && window.location.pathname.includes('programs.html')) {
                e.preventDefault(); // Prevent native jump
                const target = href.split('#')[1];
                history.pushState(null, null, `#${target}`);
                if(window.showTab) window.showTab(target);
            }
        });
    });
});
