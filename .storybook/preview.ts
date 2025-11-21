import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Components',
          ['Button', 'Badge', 'Tag', 'Table'],
          '*',
        ],
      },
    },
  },
};

export default preview;