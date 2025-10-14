import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'f9rxg371',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
})
