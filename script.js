document.addEventListener("DOMContentLoaded", () => {
    let isTransitioning = false;
    const buttons = document.querySelectorAll('.nav-button');
    const mobile_buttons = document.querySelectorAll('.nav-button-1');
    const mobile_buttons_2 = document.querySelectorAll('.nav-button-1-2');
    const iframe = document.querySelector('.embedded-page');
    const container = document.querySelector('.rectangle-2');

    const pages = [
        "page.html",
        "page_2.html",
        "page_3.html"
    ];

    let currentIndex = 0;

    function updateActiveButtons(targetUrl) {
        // Обновление кнопок для десктопной навигации
        buttons.forEach(btn => {
            btn.classList.remove('active');
            const icon = btn.querySelector('i');
            icon.style.color = '#FFFFFF';
            if (btn.getAttribute('data-page') === targetUrl) {
                btn.classList.add('active');
                icon.style.color = '#a259ff';
            }
        });

        // Обновление мобильных кнопок
        [...mobile_buttons, ...mobile_buttons_2].forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === targetUrl) {
                btn.classList.add('active');
            }
        });
    }

    function updateIframe(page) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Определение целевой страницы
        let targetIndex;
        if (page === "next") {
            targetIndex = Math.min(currentIndex + 1, pages.length - 1);
        } else if (page === "prev") {
            targetIndex = Math.max(currentIndex - 1, 0);
        } else {
            targetIndex = pages.indexOf(page);
        }
        
        const targetUrl = pages[targetIndex];
        if (targetIndex === -1) return;

        // Запуск анимации исчезновения
        container.classList.add('fade-out');

        iframe.addEventListener('transitionend', function handler() {
            iframe.removeEventListener('transitionend', handler);
            
            // Обновление индекса и загрузка новой страницы
            currentIndex = targetIndex;
            iframe.src = targetUrl;

            iframe.addEventListener('load', function loadHandler() {
                container.classList.remove('fade-out');
                isTransitioning = false;
                updateActiveButtons(targetUrl);
            }, { once: true });
        }, { once: true });
    }

    // Обработчик загрузки iframe для обновления активных кнопок
    iframe.addEventListener('load', () => {
        const currentUrl = iframe.contentWindow.location.pathname.split('/').pop(); // Получаем текущую страницу
        updateActiveButtons(currentUrl);
    });

    // Обработчики событий для всех типов кнопок
    [...buttons, ...mobile_buttons, ...mobile_buttons_2].forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            console.log(`Нажата кнопка для загрузки: ${page}`);
            updateIframe(page);
            
            // Закрытие мобильного меню
            if (button.classList.contains('nav-button-1-2')) {
                document.querySelector('.mobile-menu').classList.remove('active');
            }
        });
    });

    // Остальной код остается без изменений
    function adjustIframeHeight() {
        if (window.innerWidth <= 768) {
            iframe.style.height = `${window.innerHeight}px`;
        }
    }

    window.addEventListener('resize', adjustIframeHeight);
    adjustIframeHeight();

    document.querySelector('.mobile-menu-toggle').addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelector('.mobile-menu').classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
        const menu = document.querySelector('.mobile-menu');
        if (!menu.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
            menu.classList.remove('active');
        }
    });
});



// Слушаем события мыши в родительском документе
window.addEventListener('mousemove', function (e) {
    const x = ((e.clientX / window.innerWidth) * 20) + 40;
    const y = ((e.clientY / window.innerHeight) * 20) + 40;
    document.body.style.setProperty('--x', `${x}%`);
    document.body.style.setProperty('--y', `${y}%`);
});

// Обрабатываем сообщения от iframe
window.addEventListener('message', (e) => {
    if (e.data.type === 'mousemove') {
        const rect = document.querySelector('.rectangle-2').getBoundingClientRect();
        const x = e.data.x + rect.left;
        const y = e.data.y + rect.top;
        document.body.style.setProperty('--x', `${((x / window.innerWidth) * 20) + 40}%`);
        document.body.style.setProperty('--y', `${((y / window.innerHeight) * 20) + 40}%`);
    }
});

