const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const { transform } = require('../dist_roo/index-node');

// Создаем экземпляр markdown-it
const md = new MarkdownIt({ html: true });

// Регистрируем наш плагин
md.use(transform({
    bundle: true,
    runtime: {
        script: '/react-components.js',
        style: '/react-components.css'
    }
}));

// Пример markdown с React компонентом
const markdown = `
# Пример использования React компонентов в Markdown

Обычный текст в markdown.

## Вот наша кнопка:

:::react-component
component: TestButton
props:
  text: Нажми на меня!
  color: blue
:::

## Еще одна кнопка:

:::react-component
component: TestButton
props:
  text: Другая кнопка
  color: green
:::

## Компонент счетчика с несколькими событиями:

:::react-component
component: Counter
props:
  initialCount: 5
:::

## Еще один счетчик:

:::react-component
component: Counter
props:
  initialCount: 10
:::
`;

// Рендерим markdown в HTML
const result = md.render(markdown);

// Создаем полную HTML страницу
const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>React Components in Markdown</title>
    <!-- Подключаем React и ReactDOM -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <!-- Подключаем наш бандл -->
    <script src="/react-components.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        h2 {
            color: #444;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    ${result}
    
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee;">
        <h2>Информация о работе плагина:</h2>
        <p>
            Этот пример демонстрирует работу markdown-it плагина, который добавляет React компоненты в markdown.
            Компоненты рендерятся на сервере, а затем "оживают" на клиенте благодаря гидратации.
        </p>
        <p>
            Все события (onClick, onChange и т.д.) работают после гидратации.
            Откройте консоль разработчика, чтобы увидеть логи при взаимодействии с компонентами.
        </p>
    </div>
</body>
</html>
`;

// Создаем директорию dist, если она не существует
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Записываем HTML в файл
fs.writeFileSync(path.join(distDir, 'index.html'), html);

// Копируем клиентский бандл
fs.copyFileSync(
    path.join(__dirname, '../dist_roo/react-components.js'),
    path.join(distDir, 'react-components.js')
);

console.log('Пример успешно сгенерирован в директории dist');
console.log('Откройте файл dist/index.html в браузере для просмотра результата');