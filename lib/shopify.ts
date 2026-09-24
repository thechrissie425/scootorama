import { CartItem } from '@/contexts/CartContext'

interface ShopifyConfig {
  domain: string
  token: string
}

/**
 * Get Shopify credentials based on market
 */
function getShopifyConfig(market?: string): ShopifyConfig {
  const marketLower = (market || 'us').toLowerCase()

  switch (marketLower) {
    case 'uk':
      return {
        domain: process.env.UK_SHOPIFY_DOMAIN || '',
        token: process.env.UK_SHOPIFY_TOKEN || '',
      }
    case 'de':
    case 'fr':
    case 'es':
    case 'it':
    case 'eu':
      return {
        domain: process.env.EU_SHOPIFY_DOMAIN || '',
        token: process.env.EU_SHOPIFY_TOKEN || '',
      }
    case 'us':
    default:
      return {
        domain: process.env.US_SHOPIFY_DOMAIN || '',
        token: process.env.US_SHOPIFY_TOKEN || '',
      }
  }
}

/**
 * Creates a Shopify checkout URL with cart items
 */
export async function createCheckout(
  items: CartItem[],
  market?: string
): Promise<string> {
  const { domain, token } = getShopifyConfig(market)

  if (!domain || !token) {
    console.error('Missing Shopify credentials for market:', market)
    return buildCartPermalink(items, domain || 'shop.scootorama.example')
  }

  try {
    const lineItems = items.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }))

    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
          checkoutUserErrors {
            code
            field
            message
          }
        }
      }
    `

    const variables = {
      input: {
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    }

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    const data = await response.json()

    if (data.data?.checkoutCreate?.checkout?.webUrl) {
      return data.data.checkoutCreate.checkout.webUrl
    }

    if (data.data?.checkoutCreate?.checkoutUserErrors?.length > 0) {
      console.error(
        'Checkout errors:',
        data.data.checkoutCreate.checkoutUserErrors
      )
    }

    return buildCartPermalink(items, domain)
  } catch (error) {
    console.error('Error creating Shopify checkout:', error)
    return buildCartPermalink(items, domain)
  }
}

/**
 * Builds a Shopify cart permalink (fallback method)
 */
function buildCartPermalink(items: CartItem[], domain: string): string {
  const cartItems = items
    .map(item => {
      const variantId = item.variantId.includes('gid://')
        ? item.variantId.split('/').pop()
        : item.variantId
      return `${variantId}:${item.quantity}`
    })
    .join(',')

  return `https://${domain}/cart/${cartItems}`
}

/**
 * Check inventory availability and fetch live pricing AND IMAGE for a Shopify variant
 */
export async function checkInventory(
  variantId: string,
  market?: string
): Promise<{
  available: boolean
  quantity: number
  price?: number
  compareAtPrice?: number
  currencyCode?: string
  image?: string // 👈 Added this return type
}> {
  const { domain, token } = getShopifyConfig(market)

  if (!domain || !token || !variantId) {
    return { available: false, quantity: 0 }
  }

  const gid = variantId.startsWith('gid://')
    ? variantId
    : `gid://shopify/ProductVariant/${variantId}`

  try {
    const query = `
      query getVariant($id: ID!) {
        node(id: $id) {
          ... on ProductVariant {
            id
            availableForSale
            quantityAvailable
            currentlyNotInStock
            
            # 👇 ADDED: Fetch the specific image for this variant
            image {
              url
              altText
            }

            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
    `

    const variables = { id: gid }

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    })

    const data = await response.json()

    if (data.data?.node) {
      const variant = data.data.node
      return {
        available: variant.availableForSale && !variant.currentlyNotInStock,
        quantity: variant.quantityAvailable || 0,
        price: variant.price?.amount
          ? parseFloat(variant.price.amount)
          : undefined,
        compareAtPrice: variant.compareAtPrice?.amount
          ? parseFloat(variant.compareAtPrice.amount)
          : undefined,
        currencyCode: variant.price?.currencyCode,
        // 👇 Return the image URL
        image: variant.image?.url,
      }
    }

    return { available: false, quantity: 0 }
  } catch (error) {
    console.error('Error checking inventory:', error)
    return { available: false, quantity: 0 }
  }
}
