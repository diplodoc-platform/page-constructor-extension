# Page Constructor Extension Example

{% note info "Note" %}

This example demonstrates how to use the Page Constructor extension in Diplodoc documentation.

{% endnote %}

## Getting Started

Install dependencies and start the example:

```bash
npm i
npm run run:node    # Run the Node.js example
npm run run:browser # Run the browser example
```

These commands will render the documentation using [@diplodoc/transform](https://github.com/diplodoc-platform/transform). The browser example will open in your default browser, while the Node.js example will generate an HTML file.

## Example Structure

This example includes:

- **Browser Example**: Shows how to use the Page Constructor extension in a browser environment
  - `browser/browser.jsx`: Main entry point for the browser example
  - `browser/build.js`: Build script for the browser example
  - `browser/index-browser.html`: HTML template for the browser example

- **Node Example**: Shows how to use the Page Constructor extension in a Node.js environment
  - `node/node.js`: Example of using the extension in Node.js
  - `node/example.css`: Styles for the Node.js example

## Page Constructor Usage

The example demonstrates various Page Constructor blocks:

### Header Block

::: page-constructor
blocks:
  - type: 'header-block'
    width: 's'
    offset: 'default'
    title: 'Diplodoc'
    resetPaddings: true
    verticalOffset: 'l'
    description: 'A platform with [open-source code](https://github.com/diplodoc-platform) for creating technical documentation based on the concept of Docs as Code. A simple and convenient document management solution for large and small teams.'
    background:
      light:
        image:
          desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover.png'
          disableCompress: true
        color: '#C6FE4D'
        fullWidth: false
      dark:
        image:
          desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover-dark.png'
          disableCompress: true
        color: '#C6FE4D'
        fullWidth: false
    buttons:
      - text: 'Quickstart'
        theme: 'outlined'
        size: 'promo'
        url: '/'
      - text: 'GitHub'
        theme: 'outlined'
        size: 'promo'
        url: 'https://github.com/diplodoc-platform'
:::

```markdown
::: page-constructor
blocks:
  - type: 'header-block'
    width: 's'
    offset: 'default'
    title: 'Diplodoc'
    resetPaddings: true
    verticalOffset: 'l'
    description: 'A platform with [open-source code](https://github.com/diplodoc-platform) for creating technical documentation based on the concept of Docs as Code. A simple and convenient document management solution for large and small teams.'
    background:
      light:
        image:
          desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover.png'
          disableCompress: true
        color: '#C6FE4D'
        fullWidth: false
      dark:
        image:
          desktop: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-cover-dark.png'
          disableCompress: true
        color: '#C6FE4D'
        fullWidth: false
    buttons:
      - text: 'Quickstart'
        theme: 'outlined'
        size: 'promo'
        url: '/'
      - text: 'GitHub'
        theme: 'outlined'
        size: 'promo'
        url: 'https://github.com/diplodoc-platform'
:::
```

### Extended Features Block

::: page-constructor
blocks:
  - type: 'extended-features-block'
    title:
      text: 'Platform Benefits'
    items:
      - title: 'Ease of Use'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-1.svg'
        text: 'Manage documents as if they were source code: in a familiar environment with minimal deployment and maintenance effort.'
      - title: 'High Performance'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
        text: 'Quickly create, check, and format large documents. Accelerate your work with full integration into your CI/CD infrastructure.'
      - title: 'Standard Markdown Format'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-3.svg'
        text: 'Simple syntax with built-in support for basic Markdown. Focus on the content itself, not on how to deliver it to the user.'
      - title: 'Robust Functionality'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-4.svg'
        text: 'Create documents of any level of complexity, including those generated from a single source and containing variables. Flexible display and personalization options to ensure user satisfaction.'
      - title: 'Integration with document management systems'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-5.svg'
        text: 'OpenAPI support out of the box. Facilitating the operation of specialized systems via the interface of connected external documents'
      - title: 'Integrated Search Functionality'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-6.svg'
        text: 'The most typical use case for document searching on the platform, without extra costs or support efforts.'
:::

```markdown
::: page-constructor
blocks:
  - type: 'extended-features-block'
    title:
      text: 'Platform Benefits'
    items:
      - title: 'Ease of Use'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-1.svg'
        text: 'Manage documents as if they were source code: in a familiar environment with minimal deployment and maintenance effort.'
      - title: 'High Performance'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-2.svg'
        text: 'Quickly create, check, and format large documents. Accelerate your work with full integration into your CI/CD infrastructure.'
      - title: 'Standard Markdown Format'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-3.svg'
        text: 'Simple syntax with built-in support for basic Markdown. Focus on the content itself, not on how to deliver it to the user.'
      - title: 'Robust Functionality'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-4.svg'
        text: 'Create documents of any level of complexity, including those generated from a single source and containing variables. Flexible display and personalization options to ensure user satisfaction.'
      - title: 'Integration with document management systems'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-5.svg'
        text: 'OpenAPI support out of the box. Facilitating the operation of specialized systems via the interface of connected external documents'
      - title: 'Integrated Search Functionality'
        icon: 'https://storage.yandexcloud.net/cloud-www-assets/pages/index-diplodoc/diplodoc-icon-6.svg'
        text: 'The most typical use case for document searching on the platform, without extra costs or support efforts.'
:::
```

### Filter Block & Card layout block

::: page-constructor
blocks:
  - type: 'filter-block'
    centered: true
    title:
      text: 'Trusted by users'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
                url: 'https://catboost.ai/en/docs/'
                theme: 'normal'
                arrow: true
                color: #54BA7E
  - type: 'card-layout-block'
    title: 'How does it work?'
    colSizes:
      all: 12
      md: 4
      sm: 6
    children:
      - type: 'layout-item'
        content:
          title: 'Architecture'
          text: 'The Diplodoc platform has a client-server architecture, with the server part made up of Node.js components that generate and display documentation projects. This architecture ensures reliability and horizontal scaling, if needed.  '
        fullScreen: true
        border: true
        disableCompress: true
      - type: 'layout-item'
        content:
          title: 'Integration with GitHub'
          text: 'Diplodoc''s end-to-end integration with GitHub provides a simple and stable method for creating and deploying documentation projects. GitHub is used as a repository for document source code and the execution of project pipelines.'
        fullScreen: true
        border: true
        disableCompress: true
      - type: 'layout-item'
        content:
          title: 'Deployment'
          text: |
            Companies using the Diplodoc service employ built-in mechanisms for document layout, indexing, and version tracking. Documents can be updated automatically or semi-automatically with the help of an administrator on the user's side.
        fullScreen: true
        border: true
        disableCompress: true
:::

```markdown
::: page-constructor
blocks:
 - type: 'filter-block'
    centered: true
    title:
      text: 'Trusted by users'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
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
              - text: 'View documentation'
                url: 'https://catboost.ai/en/docs/'
                theme: 'normal'
                arrow: true
                color: #54BA7E

  - type: 'card-layout-block'
    title: 'How does it work?'
    colSizes:
      all: 12
      md: 4
      sm: 6
    children:
      - type: 'layout-item'
        content:
          title: 'Architecture'
          text: 'The Diplodoc platform has a client-server architecture, with the server part made up of Node.js components that generate and display documentation projects. This architecture ensures reliability and horizontal scaling, if needed.  '
        media:
          image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-01.png'
          disableCompress: true
        fullScreen: true
        border: true
        disableCompress: true
      - type: 'layout-item'
        content:
          title: 'Integration with GitHub'
          text: 'Diplodoc''s end-to-end integration with GitHub provides a simple and stable method for creating and deploying documentation projects. GitHub is used as a repository for document source code and the execution of project pipelines.'
        media:
          image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-02.png'
          disableCompress: true
        fullScreen: true
        border: true
        disableCompress: true
      - type: 'layout-item'
        content:
          title: 'Deployment'
          text: |
            Companies using the Diplodoc service employ built-in mechanisms for document layout, indexing, and version tracking. Documents can be updated automatically or semi-automatically with the help of an administrator on the user's side.
        media:
          image: 'https://storage.yandexcloud.net/diplodoc-www-assets/pages/index-diplodoc/ddos-index-item-01-03.png'
          disableCompress: true
        fullScreen: true
        border: true
        disableCompress: true
:::
```

## Customization

You can customize the Page Constructor blocks by modifying the YAML content in the page-constructor directive. See the [Page Constructor documentation](https://github.com/gravity-ui/page-constructor) for more information on available block types and their properties.
