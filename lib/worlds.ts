/**
 * Scootorama worlds and routes.
 *
 * The in-game catalog: every world is an over-romanticized "wonder of the
 * world" re-imagined as a scooter playland. This module is the source of
 * truth for route data; the seed script copies it into Sanity, and the
 * Studio route picker reads it via /api/routes.
 */

/** KICK = structured workout, CRUISE = free-roam sightseeing */
export type RideMode = 'KICK' | 'CRUISE'

export const RIDE_MODE_LABELS: Record<RideMode, string> = {
  KICK: '🛴 Kick',
  CRUISE: '🍦 Cruise',
}

export interface World {
  id: string
  name: string
  tagline: string
  description: string
  /** Scene palette, used for illustrations and world badges */
  colors: { sky: string; ground: string; accent: string }
}

export interface WorldRoute {
  id: string
  name: string
  world: string
  distanceKm: number
  elevationMeters: number
  /** 1 (toddler-friendly) to 5 (hold onto your bow tie) */
  difficulty: number
  sportType: RideMode
  description: string
  highlights: string
  tags: string[]
  featured?: boolean
}

export const WORLDS: World[] = [
  {
    id: 'bora-bora-bungalow-bay',
    name: 'Bora Bora Bungalow Bay',
    tagline: 'Where every boardwalk ends in a coconut.',
    description:
      'A turquoise lagoon ringed with thatched bungalows, tiki torches and a volcano that only erupts confetti. Glide the planks at golden hour and try not to get distracted by the singing flamingos.',
    colors: { sky: '#FF9AC8', ground: '#2CC4C4', accent: '#FFD21F' },
  },
  {
    id: 'alamo-rama',
    name: 'Alamo-Rama',
    tagline: 'Remember it? You will now.',
    description:
      'A gloriously over-the-top frontier fort with a gift shop the size of Texas. Ride through the courtyard, down the souvenir-lined main drag and, rumor has it, into a basement nobody can find.',
    colors: { sky: '#FFB36B', ground: '#E8B77A', accent: '#D6117A' },
  },
  {
    id: 'dino-detour',
    name: 'Dino Detour',
    tagline: 'Big reptiles. Bigger roadside charm.',
    description:
      'A sun-baked desert highway guarded by giant concrete dinosaurs, a diner shaped like a coffee pot and a motel sign that has not been fully lit since 1962. Scoot between the tail and the teeth.',
    colors: { sky: '#FFD27F', ground: '#E9A15B', accent: '#7CC21E' },
  },
  {
    id: 'niagara-honeymoon-heights',
    name: 'Niagara Honeymoon Heights',
    tagline: 'Heart-shaped everything. Mist included.',
    description:
      'Thundering falls, heart-shaped hot tubs and a barrel museum with questionable safety standards. The lookout loop is pure romance; the plunge descent is pure screaming.',
    colors: { sky: '#B084FF', ground: '#00858C', accent: '#FF4FA8' },
  },
  {
    id: 'petit-paree',
    name: 'Petit Paree',
    tagline: 'Ooh la la, the tower is made of cake.',
    description:
      'A storybook Paris where the Eiffel Tower is a seven-layer gateau, the berets are mandatory and every café serves croissants the size of hubcaps. Cobbles have been lovingly sanded for your wheels.',
    colors: { sky: '#9FD8FF', ground: '#F6C7DA', accent: '#8B5CF6' },
  },
  {
    id: 'roswell-saucer-speedway',
    name: 'Roswell Saucer Speedway',
    tagline: 'Out of this world. Literally, check the signage.',
    description:
      'A neon motel strip in the high desert where the diners hover and the locals are little and green. Race the tractor-beam straightaway at night for bonus glow.',
    colors: { sky: '#2B1E5C', ground: '#5B2FC9', accent: '#7CC21E' },
  },
]

const worldName = (id: string) => WORLDS.find(w => w.id === id)!.name

type RouteInput = Omit<WorldRoute, 'world'> & { worldId: string }

const ROUTE_INPUT: RouteInput[] = [
  // Bora Bora Bungalow Bay
  {
    id: 'lei-line-loop',
    worldId: 'bora-bora-bungalow-bay',
    name: 'Lei-Line Loop',
    distanceKm: 4.2,
    elevationMeters: 12,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A breezy lap of the lagoon boardwalk, past every bungalow and at least one ukulele.',
    highlights: 'Sunset planks, flamingo choir, free virtual lei.',
    tags: ['flat', 'beginner', 'scenic', 'popular'],
    featured: true,
  },
  {
    id: 'volcano-vroom',
    worldId: 'bora-bora-bungalow-bay',
    name: 'Volcano Vroom',
    distanceKm: 7.8,
    elevationMeters: 210,
    difficulty: 4,
    sportType: 'KICK',
    description:
      'Switchbacks up the confetti volcano, then a lava-slide descent back to the beach.',
    highlights: 'Summit confetti blast, 14% ramp, tiki torch tunnel.',
    tags: ['climbing', 'hilly', 'advanced'],
  },
  {
    id: 'coconut-crossing',
    worldId: 'bora-bora-bungalow-bay',
    name: 'Coconut Crossing',
    distanceKm: 2.6,
    elevationMeters: 4,
    difficulty: 1,
    sportType: 'KICK',
    description:
      'A sprint across the palm-lined causeway. Watch for falling coconuts; they count as power-ups.',
    highlights: 'Timed sprint banner, palm tunnel.',
    tags: ['sprint', 'flat'],
  },
  {
    id: 'hula-hoop-hustle',
    worldId: 'bora-bora-bungalow-bay',
    name: 'Hula Hoop Hustle',
    distanceKm: 5.5,
    elevationMeters: 36,
    difficulty: 2,
    sportType: 'KICK',
    description:
      'Rolling boardwalk intervals through a gauntlet of giant spinning hula hoops.',
    highlights: 'Hoop gates, lagoon jump, shaved-ice finish.',
    tags: ['race', 'popular'],
  },
  {
    id: 'tiki-torch-twilight',
    worldId: 'bora-bora-bungalow-bay',
    name: 'Tiki Torch Twilight',
    distanceKm: 9.4,
    elevationMeters: 58,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'The long way round the atoll after dark, lit only by tiki torches and bioluminescent fish.',
    highlights: 'Glow lagoon, night market, fire-dancer finale.',
    tags: ['scenic'],
  },

  // Alamo-Rama
  {
    id: 'remember-the-ramp',
    worldId: 'alamo-rama',
    name: 'Remember-the-Ramp',
    distanceKm: 3.1,
    elevationMeters: 64,
    difficulty: 3,
    sportType: 'KICK',
    description:
      'Launch off the fort walls via the famous souvenir ramp. You will, in fact, remember it.',
    highlights: 'Wall launch, courtyard jump, cannon confetti.',
    tags: ['sprint', 'hilly', 'popular'],
    featured: true,
  },
  {
    id: 'tumbleweed-two-step',
    worldId: 'alamo-rama',
    name: 'Tumbleweed Two-Step',
    distanceKm: 6.3,
    elevationMeters: 22,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'A dance-along cruise down Main Street with a tumbleweed escort who really wants to lead.',
    highlights: 'Line-dance plaza, saloon doors, cactus garden.',
    tags: ['flat', 'beginner', 'scenic'],
  },
  {
    id: 'gift-shop-gauntlet',
    worldId: 'alamo-rama',
    name: 'Gift Shop Gauntlet',
    distanceKm: 2.2,
    elevationMeters: 8,
    difficulty: 3,
    sportType: 'KICK',
    description:
      'Weave through the world’s largest gift shop without knocking over a single snow globe.',
    highlights: 'Snow globe slalom, coonskin cap corner.',
    tags: ['race', 'advanced'],
  },
  {
    id: 'basement-hunt',
    worldId: 'alamo-rama',
    name: 'The Basement Hunt',
    distanceKm: 8.8,
    elevationMeters: 45,
    difficulty: 4,
    sportType: 'CRUISE',
    description:
      'An exploration route searching every corridor for the fort’s legendary basement. Spoiler: keep looking.',
    highlights: 'Secret passages, tour-guide cameo, false floors.',
    tags: ['scenic', 'advanced'],
  },
  {
    id: 'river-walk-roll',
    worldId: 'alamo-rama',
    name: 'River Walk Roll',
    distanceKm: 5.0,
    elevationMeters: 10,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A mellow roll along the canal under strings of papel picado and mariachi serenades.',
    highlights: 'Canal bridges, mariachi boat, churro stand.',
    tags: ['flat', 'beginner', 'scenic', 'popular'],
  },

  // Dino Detour
  {
    id: 't-rex-tailspin',
    worldId: 'dino-detour',
    name: 'T-Rex Tailspin',
    distanceKm: 4.9,
    elevationMeters: 88,
    difficulty: 3,
    sportType: 'KICK',
    description:
      'Climb the stairs inside the giant T-Rex, then spiral down its tail at top speed.',
    highlights: 'Mouth lookout, tail spiral, gift shop in the belly.',
    tags: ['hilly', 'popular'],
    featured: true,
  },
  {
    id: 'brontosaurus-belly-run',
    worldId: 'dino-detour',
    name: 'Brontosaurus Belly Run',
    distanceKm: 3.4,
    elevationMeters: 18,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A gentle loop that passes directly underneath the world’s friendliest brontosaurus.',
    highlights: 'Belly tunnel, fossil photo op.',
    tags: ['flat', 'beginner', 'scenic'],
  },
  {
    id: 'coffee-pot-climb',
    worldId: 'dino-detour',
    name: 'Coffee Pot Climb',
    distanceKm: 6.7,
    elevationMeters: 245,
    difficulty: 5,
    sportType: 'KICK',
    description:
      'A brutal mesa ascent to the diner shaped like a coffee pot. The refill at the top is earned.',
    highlights: 'Mesa hairpins, bottomless-mug summit.',
    tags: ['climbing', 'advanced'],
  },
  {
    id: 'neon-motel-mile',
    worldId: 'dino-detour',
    name: 'Neon Motel Mile',
    distanceKm: 1.6,
    elevationMeters: 2,
    difficulty: 2,
    sportType: 'KICK',
    description:
      'One flat-out mile under the flickering VACANCY sign. Drafting behind a tumbleweed is legal.',
    highlights: 'Timed mile, neon arch finish.',
    tags: ['sprint', 'flat', 'race'],
  },
  {
    id: 'route-sixty-sightseer',
    worldId: 'dino-detour',
    name: 'Route Sixty-Sightseer',
    distanceKm: 12.5,
    elevationMeters: 96,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'The grand tour of every roadside attraction: giant boot, giant donut, giant ball of twine.',
    highlights: 'Six giant things, one tiny gas station.',
    tags: ['scenic', 'popular'],
  },

  // Niagara Honeymoon Heights
  {
    id: 'barrel-roll-plunge',
    worldId: 'niagara-honeymoon-heights',
    name: 'Barrel Roll Plunge',
    distanceKm: 3.8,
    elevationMeters: 150,
    difficulty: 5,
    sportType: 'KICK',
    description:
      'A white-knuckle descent beside the falls, finishing in an optional (virtual) barrel.',
    highlights: 'Falls-side drop, barrel museum, mist tunnel.',
    tags: ['hilly', 'advanced', 'race'],
    featured: true,
  },
  {
    id: 'mist-kissed-mile',
    worldId: 'niagara-honeymoon-heights',
    name: 'Mist-Kissed Mile',
    distanceKm: 1.7,
    elevationMeters: 6,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A short, soggy, swoon-worthy roll along the railing. Ponchos provided.',
    highlights: 'Rainbow arch, poncho station.',
    tags: ['flat', 'beginner', 'scenic'],
  },
  {
    id: 'heart-tub-hairpins',
    worldId: 'niagara-honeymoon-heights',
    name: 'Heart-Tub Hairpins',
    distanceKm: 5.9,
    elevationMeters: 132,
    difficulty: 4,
    sportType: 'KICK',
    description:
      'Climb past the honeymoon resorts on a road shaped, naturally, like a heart.',
    highlights: 'Heart-shaped switchbacks, champagne-fountain summit.',
    tags: ['climbing', 'hilly'],
  },
  {
    id: 'lovers-lookout-loop',
    worldId: 'niagara-honeymoon-heights',
    name: 'Lover’s Lookout Loop',
    distanceKm: 7.2,
    elevationMeters: 74,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'Every scenic overlook in one loop, each with a coin-operated telescope and a kissing booth.',
    highlights: 'Five lookouts, one very busy kissing booth.',
    tags: ['scenic', 'popular'],
  },
  {
    id: 'maid-of-the-mist-sprint',
    worldId: 'niagara-honeymoon-heights',
    name: 'Maid-of-the-Mist Sprint',
    distanceKm: 2.4,
    elevationMeters: 3,
    difficulty: 3,
    sportType: 'KICK',
    description:
      'Race the tour boat along the river path. The boat has a head start and no shame.',
    highlights: 'Boat race, splash zone.',
    tags: ['sprint', 'race'],
  },

  // Petit Paree
  {
    id: 'croissant-crescent',
    worldId: 'petit-paree',
    name: 'Croissant Crescent',
    distanceKm: 4.4,
    elevationMeters: 20,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A buttery-smooth crescent through the bakery district. Arrive hungry.',
    highlights: 'Bakery row, accordion busker, flaky finish line.',
    tags: ['flat', 'beginner', 'scenic', 'popular'],
    featured: true,
  },
  {
    id: 'beret-boulevard',
    worldId: 'petit-paree',
    name: 'Beret Boulevard',
    distanceKm: 3.0,
    elevationMeters: 9,
    difficulty: 2,
    sportType: 'KICK',
    description:
      'A tempo effort down the grand boulevard. Berets must stay on for the time to count.',
    highlights: 'Arc de Tri-Scoot, mime checkpoint.',
    tags: ['flat', 'race'],
  },
  {
    id: 'gateau-tower-grind',
    worldId: 'petit-paree',
    name: 'Gâteau Tower Grind',
    distanceKm: 5.6,
    elevationMeters: 230,
    difficulty: 5,
    sportType: 'KICK',
    description:
      'Spiral up all seven layers of the cake tower. The frosting ramps are steeper than they look.',
    highlights: 'Seven layers, candle summit, whipped-cream descent.',
    tags: ['climbing', 'advanced', 'popular'],
  },
  {
    id: 'mime-maze',
    worldId: 'petit-paree',
    name: 'The Mime Maze',
    distanceKm: 2.8,
    elevationMeters: 14,
    difficulty: 3,
    sportType: 'CRUISE',
    description:
      'Navigate a maze of invisible walls. The mimes insist they are there.',
    highlights: 'Invisible walls, silent cheering section.',
    tags: ['scenic'],
  },
  {
    id: 'seine-cheese-cruise',
    worldId: 'petit-paree',
    name: 'Seine Cheese Cruise',
    distanceKm: 10.2,
    elevationMeters: 42,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'A long, lazy riverside roll with a fromagerie at every bridge.',
    highlights: 'Twelve bridges, twelve cheeses.',
    tags: ['flat', 'scenic'],
  },

  // Roswell Saucer Speedway
  {
    id: 'probe-parkway',
    worldId: 'roswell-saucer-speedway',
    name: 'Probe Parkway',
    distanceKm: 6.1,
    elevationMeters: 55,
    difficulty: 3,
    sportType: 'KICK',
    description:
      'Intervals under a hovering mothership that occasionally beams up the leader. Stay humble.',
    highlights: 'Tractor-beam straight, crop-circle chicane.',
    tags: ['race', 'popular'],
    featured: true,
  },
  {
    id: 'little-green-lap',
    worldId: 'roswell-saucer-speedway',
    name: 'Little Green Lap',
    distanceKm: 2.0,
    elevationMeters: 5,
    difficulty: 1,
    sportType: 'CRUISE',
    description:
      'A friendly lap of the motel strip with the locals waving from their tiny saucers.',
    highlights: 'Alien welcome committee, glow-in-the-dark mini golf.',
    tags: ['flat', 'beginner'],
  },
  {
    id: 'crop-circle-criterium',
    worldId: 'roswell-saucer-speedway',
    name: 'Crop Circle Criterium',
    distanceKm: 4.0,
    elevationMeters: 11,
    difficulty: 4,
    sportType: 'KICK',
    description:
      'Tight, fast laps around a freshly made crop circle. Nobody knows who made it. Everyone knows.',
    highlights: 'Spiral corners, cornfield sprint.',
    tags: ['race', 'sprint', 'advanced'],
  },
  {
    id: 'area-fifty-fun',
    worldId: 'roswell-saucer-speedway',
    name: 'Area Fifty-Fun',
    distanceKm: 8.6,
    elevationMeters: 128,
    difficulty: 4,
    sportType: 'KICK',
    description:
      'A climb to the restricted zone, where the signs say KEEP OUT and the snack bar says COME IN.',
    highlights: 'Mesa climb, classified snack bar.',
    tags: ['climbing', 'hilly'],
  },
  {
    id: 'moonlit-motel-meander',
    worldId: 'roswell-saucer-speedway',
    name: 'Moonlit Motel Meander',
    distanceKm: 11.3,
    elevationMeters: 64,
    difficulty: 2,
    sportType: 'CRUISE',
    description:
      'A starry-night cruise past every neon sign, diner and gift shop on the strip.',
    highlights: 'Neon canyon, saucer diner, meteor shower.',
    tags: ['scenic', 'popular'],
  },
]

export const ROUTES: WorldRoute[] = ROUTE_INPUT.map(({ worldId, ...r }) => ({
  ...r,
  world: worldName(worldId),
}))

export const getWorldById = (id: string) => WORLDS.find(w => w.id === id)

export const getWorldByName = (name: string) =>
  WORLDS.find(w => w.name === name)
