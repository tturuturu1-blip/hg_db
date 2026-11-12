// Проверка загрузки иконок (относительные пути)
const imagesToCheck = [
    { src: 'icon/home.png', wrapper: 'header-logo-icon' },
    { src: 'icon/home.png', wrapper: 'nav-sources' }, // Assuming sources uses home icon for now based on HTML
    { src: 'icon/gimnastka.png', wrapper: 'header-logo-icon' },
    { src: 'icon/ball.png', wrapper: 'nav-object-elements' },
    { src: 'icon/feedback.png', wrapper: 'nav-validation' }
];

// Функция для проверки доступности картинок (добавляет класс, если не найдена)
document.querySelectorAll('.icon-wrapper').forEach(wrapper => {
    const imgDiv = wrapper.querySelector('.nav-icon-img');
    if (imgDiv) {
        // Извлекаем URL из CSS маски (сложно), поэтому просто проверяем базовые имена
        // Проще проверить наличие файлов напрямую через fetch или Image
    }
});

// Упрощенная проверка: вешаем onerror на скрытые Image
const iconFiles = ['home.png', 'gimnastka.png', 'ball.png', 'feedback.png'];
iconFiles.forEach(file => {
    const img = new Image();
    img.src = `icon/${file}`;
    img.onerror = function() {
        // Если иконка не найдена, находим все элементы с этой маской и добавляем класс
        let className = '';
        if(file === 'home.png') className = '.icon-home';
        if(file === 'gimnastka.png') className = '.icon-gymnast';
        if(file === 'ball.png') className = '.icon-ball';
        if(file === 'feedback.png') className = '.icon-validation';
        
        if(className) {
            document.querySelectorAll(className).forEach(el => {
                el.parentElement.classList.add('img-failed');
            });
        }
    };
});

// Функция переключения страниц
function navigate(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Обновляем активные пункты меню (включая подменю)
    const navBtns = document.querySelectorAll('.sidebar-nav .nav-btn');
    navBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById('nav-' + pageId);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Закрываем меню на мобильном после клика
    if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// Функция сворачивания/разворачивания меню на мобильных
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}