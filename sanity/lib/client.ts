import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio',
  },
})
