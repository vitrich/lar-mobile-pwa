<!-- PWA Meta Tags -->
<!-- Эти теги необходимы для работы Progressive Web App -->
<!-- Подключать в <head> основного layout: @include('components.pwa-meta') -->

<!-- Манифест PWA (описание приложения) -->
<link rel="manifest" href="/manifest.json">

<!-- Цвет темы (строка статуса на Android) -->
<meta name="theme-color" content="#4f46e5">

<!-- Включение режима веб-приложения -->
<meta name="mobile-web-app-capable" content="yes">

<!-- === iOS-специфичные теги === -->
<!-- iOS: включение полноэкранного режима (standalone) -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- iOS: стиль строки статуса (black-translucent = прозрачная чёрная) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- iOS: название приложения на главном экране -->
<meta name="apple-mobile-web-app-title" content="Letovo Math">

<!-- === Иконки для iOS (Apple Touch Icons) === -->
<!-- Стандартная иконка для всех устройств -->
<link rel="apple-touch-icon" href="/images/icon-192.png">

<!-- iPhone 6s, 7, 8, X, XS, 11 Pro -->
<link rel="apple-touch-icon" sizes="152x152" href="/images/icon-192.png">

<!-- iPhone 6s Plus, 7 Plus, 8 Plus, XS Max, XR, 11, 11 Pro Max -->
<link rel="apple-touch-icon" sizes="180x180" href="/images/icon-192.png">

<!-- iPad Pro 10.5" -->
<link rel="apple-touch-icon" sizes="167x167" href="/images/icon-192.png">

<!-- === Регистрация Service Worker === -->
<!-- Скрипт для регистрации Service Worker и обработки установки PWA -->
<!-- defer = загрузка после парсинга HTML, не блокирует отрисовку -->
<script src="/js/pwa-register.js" defer></script>

{{-- 
ПРИМЕР ИСПОЛЬЗОВАНИЯ:

В resources/views/layouts/app.blade.php:

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Letovo Math</title>
    
    <!-- Подключение PWA -->
    @include('components.pwa-meta')
    
    <!-- Остальные стили и скрипты -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Опционально: кнопка для установки PWA -->
    <button id="install-pwa-button" style="display: none;">
        Установить приложение
    </button>
    
    @yield('content')
</body>
</html>
--}}
