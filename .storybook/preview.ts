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
        order: [
          'Introduction',
          'Getting Started',
          'CLI Reference',
          'MCP Server',
          'Foundations',
          ['Colors', 'Typography', 'Spacing', 'Accessibility'],
          'Components',
          ['Button', 'Badge', 'Checkbox', 'Collapsible', 'Dropdown Menu', 'Input', 'MultiSelect', 'Select', 'SelectField', 'Table', 'Tag', 'TextField', 'Toggle'],
          'Custom',
          ['AI Bot', 'Event Selector', 'Plan & Payment', ['Plan & Pricing', ['PricingPage', '*']]],
          '*',
        ],
      },
    },
  },
};

export default preview;