import { create } from 'storybook/theming';

export default create({
  base: 'light',

  // Brand
  brandTitle: 'myOperator UI',
  brandUrl: '/',

  // Typography
  fontBase: '"Source Sans Pro", sans-serif',
  fontCode: 'monospace',

  // Colors - myOperator brand colors
  colorPrimary: '#343E55',
  colorSecondary: '#343E55',

  // UI
  appBg: '#FFFFFF',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1F2937',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B7280',

  // Toolbar
  barTextColor: '#6B7280',
  barSelectedColor: '#343E55',
  barHoverColor: '#343E55',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  inputTextColor: '#1F2937',
  inputBorderRadius: 8,
});
