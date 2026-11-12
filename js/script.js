// Проверка загрузки иконок
const iconFiles = ['home.png', 'gimnastka.png', 'ball.png', 'feedback.png'];
iconFiles.forEach(file => {
    const img = new Image();
    img.src = `icon/${file}`;
    img.onerror = function() {
        let className = '';
        if(file === 'home.png') className = '.icon-home';
        if(file === 'gimnastka.png') className = '.icon-gymnast';
        if(file === 'ball.png') className = '.icon-ball';
        if(file === 'feedback.png') className = '.icon-validation';
        
        if(className) {
            document.querySelectorAll(className).forEach(el => {
                if(el.parentElement) el.parentElement.classList.add('img-failed');
            });
        }
    };
});

// Функция переключения страниц
function navigate(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Обновляем активные пункты
    const navBtns = document.querySelectorAll('.sidebar-nav .nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) activeBtn.classList.add('active');
}

// Функция сворачивания/разворачивания меню
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
    // На мобильных устройствах (ширина < 900px) меню по умолчанию свернуто (узкая полоса)
    if (window.innerWidth <= 900) {
        document.body.classList.remove('menu-open');
    } else {
        document.body.classList.add('menu-open');
    }
});