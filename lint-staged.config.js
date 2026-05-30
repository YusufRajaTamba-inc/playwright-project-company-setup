const config = {
  'packages/web-automation/**/*.{js,mjs,cjs}': [
    'eslint --fix --no-error-on-unmatched-pattern',
  ],
  'packages/api-automation/**/*.{js,mjs,cjs}': [
    'eslint --fix --no-error-on-unmatched-pattern',
  ],
  'packages/common-module/**/*.{js,mjs,cjs}': [
    'eslint --fix --no-error-on-unmatched-pattern',
  ],
  'packages/mobile-automation/**/*.{js,mjs,cjs}': [
    'eslint --fix --no-error-on-unmatched-pattern',
  ],
};

export default config;
