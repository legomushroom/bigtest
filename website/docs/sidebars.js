module.exports = {
  interactors: [
    'interactors/quick-start',
    {
      type: 'category',
      label: 'Interactors',
      items: [
        'interactors/interactors/introduction',
        'interactors/interactors/built-in-dom',
        'interactors/interactors/locators-filters-actions',
        'interactors/interactors/write-your-own'
      ]
    },
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'interactors/integrations/overview',
        'interactors/integrations/jest',
        'interactors/integrations/cypress'
      ]
    }
  ],
  platform: [
    'platform/installation',
    'platform/writing-your-first-test',
    'platform/running-tests'
  ],
};