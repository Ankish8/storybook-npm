import type { Preview } from '@storybook/react-vite'
import '../src/index.css'
import '../src/storybook/typography.css'

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
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'CLI Reference',
          'MCP Server',
          'Components',
          ['Button', 'Badge', 'Checkbox', 'Collapsible', 'Dropdown Menu', 'Input', 'MultiSelect', 'Select', 'SelectField', 'Table', 'Tag', 'TextField', 'Toggle'],
          'Custom',
          ['Event Selector'],
          '*',
        ],
      },
    },
  },
};

export default preview;