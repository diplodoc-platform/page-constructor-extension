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
  description: 'A platform for creating [@diplodoc/transform](https://github.com/diplodoc-platform/transform) documentation in the Docs as Code concept with open source. A simple and convenient solution for deploying documentation for large and small teams.'
  background:
    image:
      src: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover.png'
      disableCompress: true
  buttons:
    - text: 'Get Started'
      primary: true
      size: 'promo'
      url: ''
    - text: 'GitHub'
      primary: true
      theme: 'outlined'
      size: 'promo'
      url: ''
- adaptive: null
  children:
    - icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      title: 'Lorem ipsum dolor sit amet'
      type: 'basic-card'
      url: 'https://example.com'
    - icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      title: 'Lorem ipsum dolor sit amet'
      type: 'basic-card'
      url: 'https://example.com'
    - icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      title: 'Lorem ipsum dolor sit amet'
      type: 'basic-card'
      url: 'https://example.com'
    - icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      title: 'Lorem ipsum dolor sit amet'
      type: 'basic-card'
      url: 'https://example.com'
    - icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      title: 'Lorem ipsum dolor sit amet'
      type: 'basic-card'
      url: 'https://example.com'
  disclaimer: null
  dots: true
  randomOrder: null
  title:
    text: 'Slider'
    url: 'https://example.com'
  type: 'slider-block'
- allTag: false
  description: '<p>Three <strong>cards in a row on the desktop</strong>, two cards in a row on a tablet, one card in a row on a mobile phone.</p>\n'
  items:
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;1'
        type: 'layout-item'
      tags:
        - 'one'
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;2'
        type: 'layout-item'
      tags:
        - 'two'
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;3'
        type: 'layout-item'
      tags:
        - 'three'
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;4'
        type: 'layout-item'
      tags:
        - 'one'
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;5'
        type: 'layout-item'
      tags:
        - 'two'
    - card:
        content:
          title: 'Lorem&nbsp;ipsum&nbsp;6'
        type: 'layout-item'
      tags:
        - 'three'
  tags:
    - id: 'one'
      label: 'First very long label'
    - id: 'two'
      label: 'Second very long label'
    - id: 'three'
      label: 'Third very long label'
  title: 'Card Layout'
  type: 'filter-block'
:::

## Note block

{% note info %}

Note

{% endnote %}

## Another page constructor block

::: page-constructor
- type: 'card-layout-block'
  title: 'How it works?'
  children:
    - type: 'layout-item'
      content:
        title: 'Architecture'
        text: 'The Diplodoc platform has a client-server architecture: the server part consists of Node.js components that generate and display documentation projects. Such architecture ensures reliability and horizontal scaling when needed.'
      media:
        image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-01.png'
    - type: 'layout-item'
      content:
        title: 'GitHub Integration'
        text: 'The Diplodoc platform has end-to-end integration with GitHub to provide a simple and stable mechanism for building and deploying documentation projects. GitHub is used as a source code repository for documents and project pipeline execution.'
      media:
        image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-02.png'
    - type: 'layout-item'
      content:
        title: 'Deployment'
        text: 'Companies - service users use built-in mechanisms for deploying documentation projects with subsequent indexing and version tracking. Documents can be updated both automatically and semi-automatically with the involvement of an administrator on the user side.'
      media:
        image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-03.png'
:::
