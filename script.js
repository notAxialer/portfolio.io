document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.nav-button');
    const iframe = document.querySelector('.embedded-page');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute('data-page');
            console.log(`Нажата кнопка для загрузки: ${page}`);
            iframe.src = page;

            // Удаляем класс активной кнопки у всех кнопок
            buttons.forEach(btn => {
                btn.classList.remove('active');
                const icon = btn.querySelector('i');
                icon.style.color = '#FFFFFF'; // Сбрасываем цвет иконки к изначальному
            });

            // Добавляем класс активной кнопки и меняем цвет иконки
            button.classList.add('active');
            const activeIcon = button.querySelector('i');
            activeIcon.style.color = '#a259ff'; // Цвет активной иконки
        });
    });

    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        if(mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Закрытие меню при клике на пункт
    document.querySelectorAll('.mobile-menu .nav-button').forEach(button => {
        button.addEventListener('click', toggleMobileMenu);
    });
    
    // Адаптация высоты iframe
    function adjustIframeHeight() {
        const iframe = document.querySelector('.rectangle-2 iframe');
        if (window.innerWidth <= `768px`){
            iframe.style.height = `${window.innerHeight}px`;
        }
    }
    
    window.addEventListener('resize', adjustIframeHeight);
    adjustIframeHeight();
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

