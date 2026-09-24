// lib/locally.ts

export const MOCK_LOCALLY_RESPONSE = {
  stores: [
    {
      id: 101,
      name: 'Cycle Bar Tokyo',
      address: '1-1-1 Shibuya, Tokyo, JP',
      distance: 2.4,
      inventory_status: 'in_stock',
      directions_url: 'https://maps.google.com',
      phone: '+81 3-1234-5678',
      logo: 'https://placehold.co/100x100?text=CBT',
    },
    // ... other stores
  ],
}

// 👇 FIX: Add underscores to _upc, _lat, and _long
export async function fetchLocallyStores(
  _upc: string,
  _lat: number,
  _long: number
) {
  // SIMULATE NETWORK LATENCY (So your demo spinner shows!)
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Return mock data
  return MOCK_LOCALLY_RESPONSE
}
