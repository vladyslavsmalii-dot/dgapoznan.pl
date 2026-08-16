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

    // Mobile menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const header = document.querySelector('.header');

    if (mobileToggle && header) {
        const setMenuOpen = (isOpen) => {
            header.classList.toggle('menu-open', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            mobileToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
            const icon = mobileToggle.querySelector('iconify-icon');
            if (icon) icon.setAttribute('icon', isOpen
                ? 'solar:close-circle-linear'
                : 'solar:hamburger-menu-linear');
            document.documentElement.classList.toggle('scroll-locked', isOpen);
        };

        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('type', 'button');
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen(!header.classList.contains('menu-open'));
        });

        // Close on link click
        header.querySelectorAll('.nav__link, .nav__dropdown-link, .header__action .btn').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                setMenuOpen(false);
                if (href === '#') {
                    e.preventDefault();
                    if (typeof openModal === 'function') openModal(e);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && header.classList.contains('menu-open')) {
                setMenuOpen(false);
                mobileToggle.focus();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && header.classList.contains('menu-open')) {
                setMenuOpen(false);
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
        if (modal) {
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
            document.documentElement.classList.add('scroll-locked');
        }
    };

    const closeModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.documentElement.classList.remove('scroll-locked');
            setTimeout(() => {
                if (modalFormContent) modalFormContent.style.display = 'block';
                if (modalSuccessContent) modalSuccessContent.style.display = 'none';
                if (contactForm) contactForm.reset();
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

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    if (contactForm) {
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
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const origBtnText = submitBtn ? submitBtn.innerText : 'Отправить заявку';
                if (submitBtn) {
                    submitBtn.innerText = 'Отправка...';
                    submitBtn.disabled = true;
                }

                const formData = new FormData(contactForm);
                const payload = {
                    name: formData.get('name') || '',
                    phone: formData.get('phone') || '',
                    email: formData.get('email') || '',
                    course: formData.get('course') || '',
                    date: formData.get('date') || '',
                    message: formData.get('message') || ''
                };

                const isContactsPage = window.location.pathname.includes('contacts.html');

                fetch("https://dgapoznan-pl.vercel.app/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.success) {
                            if (isContactsPage) {
                                if (modal) modal.classList.add('active');
                            } else {
                                if (modalFormContent) modalFormContent.style.display = 'none';
                                if (modalSuccessContent) modalSuccessContent.style.display = 'flex';
                            }
                            contactForm.reset();
                        } else {
                            throw new Error((data && data.message) || "Server response error");
                        }
                    })
                    .catch(error => {
                        console.error('Submission error:', error);
                        alert("Произошла ошибка при отправке заявки. Пожалуйста, проверьте подключение и попробуйте позже.");
                    })
                    .finally(() => {
                        if (submitBtn) {
                            submitBtn.innerText = origBtnText;
                            submitBtn.disabled = false;
                        }
                    });
            }
        });
    }

    // 5. Scroll Top Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 400) {
                        scrollTopBtn.classList.add('visible');
                    } else {
                        scrollTopBtn.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. Tab Switching Logic (programs.html)
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    window.showTab = function (targetId) {
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

    if (tabs.length > 0) {
        // Bind click events on tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const btn = e.currentTarget;
                const target = btn ? btn.dataset.target : null;
                if (target) {
                    history.pushState(null, null, `#${target}`);
                    window.showTab(target);
                }
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
                if (window.showTab) window.showTab(target);
            }
        });
    });

    // 8. Schedule Switcher (index.html)
    const scheduleBtns = document.querySelectorAll('.schedule-btn');
    const scheduleLists = document.querySelectorAll('[data-schedule-lang]');
    if (scheduleBtns.length > 0) {
        scheduleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                scheduleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const targetLang = btn.dataset.lang;
                scheduleLists.forEach(list => {
                    if (list.dataset.scheduleLang === targetLang) {
                        list.style.display = 'block';
                    } else {
                        list.style.display = 'none';
                    }
                });
            });
        });
    }
});
