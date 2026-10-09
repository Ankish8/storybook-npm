import baseConfig from '../tailwind.config.js'

export default {
  ...baseConfig,
  // v2 is documented on the docs site, not in Storybook, so its classes are not generated here. Scanning them
  // still put v2-only arbitrary variants into Storybook's CSS, which the pseudo-states addon then failed to insert.
  content: [...baseConfig.content, '!./src/components/ui/v2/**'],
  important: true,
}
