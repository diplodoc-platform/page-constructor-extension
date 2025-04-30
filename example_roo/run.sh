#!/bin/bash

# Переходим в корневую директорию проекта
cd "$(dirname "$0")/.."

# Создаем директорию для сборки, если она не существует
mkdir -p dist_roo

# Собираем плагин
echo "Building plugin..."
node esbuild/build_roo.js

# Переходим в директорию примера
cd example_roo

# Создаем директорию для результатов, если она не существует
mkdir -p dist

# Запускаем пример
echo "Running example..."
node index.js

# Определяем команду для открытия браузера в зависимости от ОС
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open dist/index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open dist/index.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start dist/index.html
else
    echo "Please open dist/index.html in your browser"
fi

echo "Done!"