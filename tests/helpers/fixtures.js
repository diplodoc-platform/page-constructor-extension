const simpleHeaderBlock = {
  type: 'header-block',
  title: 'Test Header',
  description: 'Test Description'
};

const complexPage = {
  blocks: [
    {
      type: 'header-block',
      title: 'Welcome to Our Platform',
      description: 'The most comprehensive solution for your needs',
      image: 'header-image.jpg',
      buttons: [
        {
          text: 'Get Started',
          url: '/get-started',
          theme: 'primary'
        },
        {
          text: 'Learn More',
          url: '/learn-more',
          theme: 'secondary'
        }
      ]
    },
    {
      type: 'features-block',
      title: 'Key Features',
      features: [
        {
          title: 'Easy Integration',
          description: 'Integrate with your existing systems seamlessly',
          icon: 'integration-icon.svg'
        },
        {
          title: 'Powerful Analytics',
          description: 'Gain insights with comprehensive analytics',
          icon: 'analytics-icon.svg'
        },
        {
          title: 'Secure Platform',
          description: 'Enterprise-grade security for your data',
          icon: 'security-icon.svg'
        }
      ]
    },
    {
      type: 'testimonials-block',
      title: 'What Our Customers Say',
      testimonials: [
        {
          quote: 'This platform has transformed our business operations.',
          author: 'John Smith',
          company: 'Acme Inc.',
          avatar: 'john-smith.jpg'
        },
        {
          quote: 'The best solution we have found after years of searching.',
          author: 'Jane Doe',
          company: 'XYZ Corp',
          avatar: 'jane-doe.jpg'
        }
      ]
    },
    {
      type: 'cta-block',
      title: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today',
      button: {
        text: 'Sign Up Now',
        url: '/signup',
        theme: 'primary'
      }
    }
  ]
};

const markdownContent = {
  type: 'content-block',
  content: `# Markdown Header
  
This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2

[Link to example](https://example.com)`
};

const yfmContent = {
  type: 'content-block',
  content: `# Header with YFM

{% note info %}
This is a note inside page constructor
{% endnote %}

- List item 1
- List item 2

[Link](https://example.com)`
};

module.exports = {
  simpleHeaderBlock,
  complexPage,
  markdownContent,
  yfmContent
};