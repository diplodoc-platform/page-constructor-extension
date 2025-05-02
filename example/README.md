# Simple example

```
npm i
npm start
```

Then this documentation will be rendered by [@diplodoc/transform](https://github.com/diplodoc-platform/transform) and opened in your default browser.

## Page constructor block

::: page-constructor
- type: 'header-block'
  width: 's'
  offset: 'default'
  title: 'Diplodoc'
  resetPaddings: true
  verticalOffset: 'l'
  description: 'Платформа для создания технической доd by [@diplodoc/transform](https://github.com/diplodoc-platform/transform) and openedкументации в концепции Docs as Сode с открытым исходным кодом. Простое и удобное решение для развёртывания документации больших и маленьких команд.'
  background:
    light:
      image:
        mobile: '../_images/cover.png'
        desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover.png'
        disableCompress: true
      color: '#C6FE4D'
      fullWidth: false
    dark:
      image:
        mobile: '../_images/cover-dark.png'
        desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover-dark.png'
        disableCompress: true
      color: '#C6FE4D'
      fullWidth: false
  buttons:
    - text: 'Начать'
      theme: 'outlined'
      size: 'promo'
      url: '/'
    - text: 'GitHub'
      theme: 'outlined'
      size: 'promo'
      url: 'https://github.com/diplodoc-platform'
- type: 'extended-features-block'
  title:
    text: 'Преимущества платформы'
  items:
    - title: 'Простота использования'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-1.svg'
      text: 'Работа с документами как с кодом: в привычной среде и с минимальными усилиями по развёртыванию и поддержке.'
    - title: 'Скорость работы'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Быстрая сборка, валидация и выкладка документации любого размера. Полная интеграция в существующие CI/CD-системы для ускорения работы.'
    - title: 'Общепринятый формат Markdown'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-3.svg'
      text: 'Простой, понятный и широко распространенный синтаксис с поддержкой базового Markdown. Концентрируйтесь на контенте, а не на том, как доставить его до пользователя.'
    - title: 'Обширная функциональность'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-4.svg'
      text: 'Создание документов любой сложности, в том числе генерация из единого источника и работа с переменными. Широкие возможности по кастомизации и отображению гарантируют удовлетворённость конечных пользователей.'
    - title: 'Интеграция с системами автоматической документации'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-5.svg'
      text: 'Поддержка широко распространённой OpenAPI-спецификации «из коробки». Обеспечение работы специализированных систем через интерфейс подключаемых внешних документов.'
    - title: 'Интегрированный поиск'
      icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-6.svg'
      text: 'Самый частотный пользовательский сцd by [@diplodoc/transform](https://github.com/diplodoc-platform/transform) and opened енарий по поиску документов на базе платформы без дополнительных затрат и усилий по поддержке.'
:::

```
npm i
npm start
```

Then this documentation will be rendered by [@diplodoc/transform](https://github.com/diplodoc-platform/transform) and opened in your default browser.

::: page-constructor
- type: 'filter-block'
  centered: true
  title:
    text: 'Нам доверяют'
  tags:
    - id: 'one'
      label: 'DoubleСloud'
    - id: 'two'
      label: 'Yandex Support'
    - id: 'three'
      label: 'Yandex Cloud'
    - id: 'four'
      label: 'YDB'
    - id: 'five'
      label: 'CatBoost'
  colSizes:
    all: 12
    xl: 12
    md: 12
    sm: 12
  items:
    - tags:
        - 'one'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-tab-1.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://double.cloud/docs/en/'
              theme: 'normal'
              arrow: true
              color: #54BA7E

    - tags:
        - 'two'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-trust-support.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://yandex.ru/support2/audience/ru/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'three'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-yandex-cloud.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://cloud.yandex.ru/docs/compute/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'four'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-ydb.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://ydb.tech/en/docs/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'five'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-yandex-cat.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://catboost.ai/en/docs/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
:::

::: page-constructor
- type: 'filter-block'
  centered: true
  title:
    text: 'Нам доверяют'
  tags:
    - id: 'one'
      label: 'DoubleСloud'
    - id: 'two'
      label: 'Yandex Support'
    - id: 'three'
      label: 'Yandex Cloud'
    - id: 'four'
      label: 'YDB'
    - id: 'five'
      label: 'CatBoost'
  colSizes:
    all: 12
    xl: 12
    md: 12
    sm: 12
  items:
    - tags:
        - 'one'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-tab-1.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://double.cloud/docs/en/'
              theme: 'normal'
              arrow: true
              color: #54BA7E

    - tags:
        - 'two'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-trust-support.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://yandex.ru/support2/audience/ru/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'three'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-yandex-cloud.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://cloud.yandex.ru/docs/compute/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'four'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-ydb.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://ydb.tech/en/docs/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
    - tags:
        - 'five'
      card:
        type: 'layout-item'
        media:
          image: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/ddos-index-trust-yandex-cat.png'
          disableCompress: true
        border: true
        content:
          links:
            - text: 'Посмотреть документацию'
              url: 'https://catboost.ai/en/docs/'
              theme: 'normal'
              arrow: true
              color: #54BA7E
:::
