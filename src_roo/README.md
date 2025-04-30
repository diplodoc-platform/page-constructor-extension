# React Component Plugin для Markdown-It

Этот плагин позволяет добавлять React компоненты в markdown-документы с помощью специального синтаксиса.

## Особенности

- Серверный рендеринг React компонентов в HTML
- Клиентская гидратация для обеспечения интерактивности
- Поддержка любых React компонентов с событиями
- Простой API для регистрации компонентов

## Установка

```bash
npm install @diplodoc/react-component-extension
```

## Использование

### Регистрация плагина

```javascript
const MarkdownIt = require('markdown-it');
const { transform } = require('@diplodoc/react-component-extension/plugin');

const md = new MarkdownIt();
md.use(transform({
    bundle: true,
    runtime: {
        script: '/assets/react-components.js',
        style: '/assets/react-components.css'
    }
}));
```

### Регистрация компонентов

```javascript
// components.js
import React, { useState } from 'react';
import { registerComponent } from '@diplodoc/react-component-extension/plugin';

// Простой компонент счетчика
const Counter = ({ initialCount = 0 }) => {
    const [count, setCount] = useState(initialCount);
    
    return (
        <div className="counter">
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
};

// Регистрируем компонент
registerComponent('Counter', Counter);
```

### Использование в Markdown

```markdown
# Мой документ

Вот компонент счетчика:

:::react-component
component: Counter
props:
  initialCount: 10
:::
```

## Как это работает

1. **Серверный рендеринг**:
   - Markdown преобразуется в HTML
   - React компонент рендерится в статический HTML
   - HTML включает все необходимые атрибуты и структуру, но без обработчиков событий
   - Данные о компоненте сохраняются в data-атрибутах

2. **Клиентская гидратация**:
   - Клиентский JavaScript находит все элементы с классом `react-component-container`
   - Извлекает данные о компоненте из data-атрибутов
   - Создает React-компонент с теми же props, что и на сервере
   - React выполняет гидратацию, сохраняя существующий DOM и добавляя обработчики событий

## Пример запуска

1. Соберите плагин:
   ```bash
   cd extensions/page-constructor
   node esbuild/build_roo.js
   ```

2. Запустите пример:
   ```bash
   cd example_roo
   node index.js
   ```

3. Откройте `example_roo/dist/index.html` в браузере