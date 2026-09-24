'use server'

import { sanityFetch } from '@/sanity/lib/live'

export async function getCampaign(slug: string) {
  const { data } = await sanityFetch({
    query: `*[_type == "campaign" && slug.current == $slug][0]{
      title,
      slug {
        current
      },
      status,
      dates,
      "image": image,
      hook,
      mechanics,
      faqs[]{
        question,
        answer
      },
      unlocks[]{
        name,
        requirement,
        description,
        "image": image
      },
      cta,
      resources
    }`,
    params: { slug },
  })

  return data
}
