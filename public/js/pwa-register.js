// Регистрация Service Worker для PWA
// Этот скрипт должен быть подключен на всех страницах сайта

// Проверяем поддержку Service Worker браузером
if ('serviceWorker' in navigator) {
    // Регистрируем SW после полной загрузки страницы
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration.scope);
                
                // Проверяем обновления SW каждые 60 секунд
                // Это позволит быстро применять изменения в коде
                setInterval(() => {
                    registration.update();
                }, 60000);
            })
            .catch(error => {
                console.error('❌ Ошибка регистрации Service Worker:', error);
            });
    });
    
    // Обработка обновлений Service Worker
    // Автоматически перезагружаем страницу при обновлении SW
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

// === Обработка установки PWA ===

// Переменная для хранения события установки
let deferredPrompt;

// Перехватываем стандартный промпт браузера об установке
window.addEventListener('beforeinstallprompt', (e) => {
    // Предотвращаем автоматическое появление промпта
    e.preventDefault();
    
    // Сохраняем событие для последующего использования
    deferredPrompt = e;
    
    // Показываем собственную кнопку установки (если она есть на странице)
    const installButton = document.getElementById('install-pwa-button');
    if (installButton) {
        installButton.style.display = 'block';
        
        // Обработчик клика по кнопке установки
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Показываем стандартный промпт браузера
                deferredPrompt.prompt();
                
                // Ждём ответа пользователя
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Пользователь ${outcome === 'accepted' ? 'установил' : 'отклонил'} приложение`);
                
                // Очищаем сохранённое событие
                deferredPrompt = null;
                
                // Скрываем кнопку после установки
                installButton.style.display = 'none';
            }
        });
    }
});

// Отслеживание успешной установки PWA
// Можно использовать для аналитики
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA установлено успешно!');
    deferredPrompt = null;
    
    // Опционально: отправить событие в Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', 'app_installed', {
    //         'event_category': 'PWA',
    //         'event_label': 'Letovo Math'
    //     });
    // }
});
