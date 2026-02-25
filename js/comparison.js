/* ========================================
   VirtualModel.us — Comparison & Filtering
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initComparisonSliders();
    initFilterTabs();
    initFaqAccordion();
});

/* --- Before/After Comparison Slider --- */
function initComparisonSliders() {
    document.querySelectorAll('.comparison-slider').forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const beforeLayer = slider.querySelector('.before-layer');
        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let pct = ((x - rect.left) / rect.width) * 100;
            pct = Math.max(5, Math.min(95, pct));
            handle.style.left = pct + '%';
            beforeLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        }

        // Mouse
        slider.addEventListener('mousedown', e => {
            isDragging = true;
            updateSlider(e.clientX);
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) updateSlider(e.clientX);
        });
        document.addEventListener('mouseup', () => { isDragging = false; });

        // Touch
        slider.addEventListener('touchstart', e => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });
        document.addEventListener('touchmove', e => {
            if (isDragging) updateSlider(e.touches[0].clientX);
        }, { passive: true });
        document.addEventListener('touchend', () => { isDragging = false; });
    });
}

/* --- Category Filter Tabs --- */
function initFilterTabs() {
    const tabContainers = document.querySelectorAll('.filter-tabs');

    tabContainers.forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.filter-tab');
        const targetId = tabContainer.dataset.target;
        const grid = document.getElementById(targetId);
        if (!grid) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                if (grid.classList.contains('portfolio-grid')) {
                    // Filter portfolio cards
                    const cards = grid.querySelectorAll('.ba-card');
                    cards.forEach(card => {
                        const match = filter === 'all' || card.dataset.category === filter;
                        card.style.display = match ? '' : 'none';
                        if (match) {
                            card.style.animation = 'fadeUp 0.4s ease';
                        }
                    });
                } else {
                    // Toggle content sections (catalog page)
                    const sections = grid.querySelectorAll('.category-content');
                    sections.forEach(section => {
                        section.classList.toggle('active', section.dataset.category === filter || filter === 'all');
                    });
                }
            });
        });
    });
}

/* --- FAQ Accordion --- */
function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all others in the same list
            item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('open');
                const otherAnswer = other.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}
