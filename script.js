/* ============================================
   gosio Coaching Landing Page — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initFAQ();
    initScrollAnimations();
    initCountUp();
    initParticles();
    initForm();
});

/* === Navbar scroll effect === */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });
}

/* === Mobile menu === */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const links = menu.querySelectorAll('a');

    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* === FAQ accordion === */
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            items.forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* === Scroll animations (intersection observer) === */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* === Counter animation === */
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

                    const current = Math.floor(eased * target);

                    if (target >= 10000) {
                        // Format as "X.XX万"
                        counter.textContent = (current / 10000).toFixed(2) + '万';
                    } else {
                        counter.textContent = current.toLocaleString();
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        if (target >= 10000) {
                            counter.textContent = (target / 10000).toFixed(2) + '万';
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        observer.observe(counters[0].closest('.hero-stats'));
    }
}

/* === Hero particles === */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 8 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';

        container.appendChild(particle);
    }
}

/* === Form handling with Discord webhook === */
function initForm() {
    const form = document.getElementById('applyForm');
    if (!form) return;

    // ================================================
    // ★ Discord Webhook URL をここに設定してください ★
    // ================================================
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1512140470120353914/lecbVH6b-Fk9JPe7u_G4ejKopLQnfYZwB08LB6lvgOdJff1s6Z_mS0l6900cMI9N6jVJ';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '送信中...';
        submitBtn.disabled = true;

        const formData = {
            name: form.name.value,
            discordId: form.discordId.value,
            rank: form.rank.options[form.rank.selectedIndex].text,
            course: form.course.options[form.course.selectedIndex].text,
            intensity: form.intensity.selectedIndex > 0
                ? form.intensity.options[form.intensity.selectedIndex].text
                : '未選択',
            date1: form.date1.value || '未入力',
            timeStart1: form.timeStart1.value || '',
            timeEnd1: form.timeEnd1.value || '',

            date2: form.date2.value || '',
            timeStart2: form.timeStart2.value || '',
            timeEnd2: form.timeEnd2.value || '',

            date3: form.date3.value || '',
            timeStart3: form.timeStart3.value || '',
            timeEnd3: form.timeEnd3.value || '',

            message: form.message.value || 'なし',
        };

        // Format date strings
        const dateStr1 = formData.date1 + (formData.timeStart1 ? ` ${formData.timeStart1}〜${formData.timeEnd1}` : '');
        const dateStr2 = formData.date2 ? (formData.date2 + (formData.timeStart2 ? ` ${formData.timeStart2}〜${formData.timeEnd2}` : '')) : 'なし';
        const dateStr3 = formData.date3 ? (formData.date3 + (formData.timeStart3 ? ` ${formData.timeStart3}〜${formData.timeEnd3}` : '')) : 'なし';

        // Build Discord embed
        const embed = {
            title: '🎮 新しいコーチング申し込み',
            color: 0xff4655,
            fields: [
                { name: 'お名前', value: formData.name, inline: true },
                { name: 'Discord', value: formData.discordId, inline: true },
                { name: 'ランク帯', value: formData.rank, inline: true },
                { name: '希望コース', value: formData.course, inline: true },
                { name: '強度プラン', value: formData.intensity, inline: true },
                { name: '📅 第1候補', value: dateStr1, inline: false },
                { name: '📅 第2候補', value: dateStr2, inline: false },
                { name: '📅 第3候補', value: dateStr3, inline: false },
                { name: 'メッセージ', value: formData.message },
            ],
            timestamp: new Date().toISOString(),
        };

        let success = false;

        if (DISCORD_WEBHOOK_URL) {
            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: '@here 新しいコーチング申し込みが届きました！',
                        embeds: [embed],
                    }),
                });
                success = response.ok;
            } catch (err) {
                console.error('Webhook error:', err);
                success = false;
            }
        } else {
            // No webhook configured - just log and show success for demo
            console.log('Form submission (no webhook configured):', formData);
            success = true;
        }

        if (success) {
            form.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">✓</div>
                    <h3>お申し込みありがとうございます！</h3>
                    <p>内容を確認次第、Discordでご連絡いたします。<br>
                    （申請が届きますので承認をお願いします）<br>
                    通常1〜2日以内にご返信いたします。</p>
                </div>
            `;
        } else {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('送信に失敗しました。お手数ですが、XのDM (@fps_user01) から直接ご連絡ください。');
        }
    });
}

/* === Smooth scroll for anchor links === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
