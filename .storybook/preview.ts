import type { Preview } from '@storybook/react-vite'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../src/index.css'
import '../src/storybook/typography.css'
import '../src/storybook/design-tokens.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      story: {
        inline: true,
      },
    },
    designToken: {
      files: ['src/storybook/design-tokens.css'],
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Getting Started',
          'CLI Reference',
          'MCP Server',
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Accessibility'],
          'Components',
          'Custom',
          '*',
        ],
      },
    },
  },
};

export default preview;