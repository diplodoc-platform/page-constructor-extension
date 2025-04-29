import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
// import { PageContent } from '@gravity-ui/page-constructor';
// import { createPageConstructorElement } from '../runtime/index';
// import { PageConstructorProvider, PageConstructor } from '@gravity-ui/page-constructor';
import '../styles/index.scss'

// Простой компонент кнопки с console.log
const TestButton = () => {
    const handleClick = () => {
      console.log('Button clicked!');
    };
  
    return (
      <button 
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me
      </button>
    );
  };
  
  // Функция для создания HTML контента
  export function createPageConstructorContent() {
    console.log('createPageConstructorElement - browser')

    const div = document.createElement('div');
    const root = createRoot(div);
    
    flushSync(() => {
      root.render(<TestButton />);
    });
    
    const html = div.innerHTML;
    root.unmount();
    
    return html;
  }

// export function createPageConstructorContent(content: PageContent): string {
//     const div = document.createElement('div');
//     const root = createRoot(div);
//     console.log('111')
//     flushSync(() => {
//         root.render(
//             createPageConstructorElement(content, false)
//     //  <PageConstructorProvider ssrConfig={{isServer: false   }}>
//     //         <PageConstructor content={content} />
//     //     </PageConstructorProvider>
//         );
//     });
    
//     const html = div.innerHTML;
//     // root.unmount();
    
//     return html;
// }
