import React from 'react'
import { Icon } from '@/components/ui/icon'

// Import all icons - this enables tree-shaking and avoids dynamic imports
// Badges
import BadgeVerified from '@/icons/ui/badges/badge-verified.svg'
import BadgeAmbassador from '@/icons/ui/badges/badge-ambassador.svg'
import BadgeProRide from '@/icons/ui/badges/badge-pro-ride.svg'
import BadgeProRun from '@/icons/ui/badges/badge-pro-run.svg'
import BadgeProTri from '@/icons/ui/badges/badge-pro-tri.svg'
import BadgeParadeLeader from '@/icons/ui/badges/badge-parade-leader.svg'
import BadgeRoute from '@/icons/ui/badges/badge-route.svg'
import BadgeCommunityLeader from '@/icons/ui/badges/badge-community-leader.svg'

// Powerups
import PowerupAero from '@/icons/ui/powerups/powerup-aero.svg'
import PowerupAnvil from '@/icons/ui/powerups/powerup-anvil.svg'
import PowerupDraft from '@/icons/ui/powerups/powerup-draft.svg'
import PowerupFeatherweight from '@/icons/ui/powerups/powerup-featherweight.svg'
import PowerupInvisibility from '@/icons/ui/powerups/powerup-invisibility.svg'
import PowerupXp from '@/icons/ui/powerups/powerup-xp.svg'
import PowerupBigXp from '@/icons/ui/powerups/powerup-big-xp.svg'

// Emotes
import EmoteHonk from '@/icons/ui/emotes/emote-honk.svg'
import EmoteFullSpeed from '@/icons/ui/emotes/emote-full-speed.svg'
import EmoteBell from '@/icons/ui/emotes/emote-bell.svg'
import EmoteToast from '@/icons/ui/emotes/emote-toast.svg'
import EmoteWave from '@/icons/ui/emotes/emote-wave.svg'
import EmoteHappy from '@/icons/ui/emotes/emote-happy.svg'
import EmoteYourTurn from '@/icons/ui/emotes/emote-your-turn.svg'
import EmoteOop from '@/icons/ui/emotes/emote-oop.svg'
import EmotePoint from '@/icons/ui/emotes/emote-point.svg'

// Sports
import SportScooter from '@/icons/ui/sports/sport-scooter.svg'
import SportRunning from '@/icons/ui/sports/sport-running.svg'
import SportRowing from '@/icons/ui/sports/sport-rowing.svg'
import SportTriathlon from '@/icons/ui/sports/sport-triathlon.svg'
import SportYoga from '@/icons/ui/sports/sport-yoga.svg'

// Categories
import CategoryA from '@/icons/ui/categories/category-a.svg'
import CategoryB from '@/icons/ui/categories/category-b.svg'
import CategoryC from '@/icons/ui/categories/category-c.svg'
import CategoryD from '@/icons/ui/categories/category-d.svg'
import CategoryE from '@/icons/ui/categories/category-e.svg'

// Metrics
import Power from '@/icons/ui/power.svg'
import AveragePower from '@/icons/ui/metrics/average-power.svg'
import PowerToWeight from '@/icons/ui/metrics/power-to-weight.svg'
import CadenceKick from '@/icons/ui/metrics/cadence-kick.svg'
import CadenceRun from '@/icons/ui/metrics/cadence-run.svg'
import HeartRate from '@/icons/ui/metrics/heart-rate.svg'
import Speed from '@/icons/ui/metrics/speed.svg'
import Calories from '@/icons/ui/metrics/calories.svg'
import Distance from '@/icons/ui/metrics/distance.svg'
import Elevation from '@/icons/ui/metrics/elevation.svg'

// Connections
import ConnectionBluetooth from '@/icons/ui/connections/connection-bluetooth.svg'
import ConnectionWifi from '@/icons/ui/connections/connection-wifi-strong-signal.svg'
import ConnectionApp from '@/icons/ui/connections/connection-app.svg'
import ConnectionDirect from '@/icons/ui/connections/connection-direct.svg'

// Icon map for lookup
const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  // Badges
  'badges/badge-verified': BadgeVerified,
  'badges/badge-ambassador': BadgeAmbassador,
  'badges/badge-pro-ride': BadgeProRide,
  'badges/badge-pro-run': BadgeProRun,
  'badges/badge-pro-tri': BadgeProTri,
  'badges/badge-parade-leader': BadgeParadeLeader,
  'badges/badge-route': BadgeRoute,
  'badges/badge-community-leader': BadgeCommunityLeader,

  // Powerups
  'powerups/powerup-aero': PowerupAero,
  'powerups/powerup-anvil': PowerupAnvil,
  'powerups/powerup-draft': PowerupDraft,
  'powerups/powerup-featherweight': PowerupFeatherweight,
  'powerups/powerup-invisibility': PowerupInvisibility,
  'powerups/powerup-xp': PowerupXp,
  'powerups/powerup-big-xp': PowerupBigXp,

  // Emotes
  'emotes/emote-honk': EmoteHonk,
  'emotes/emote-full-speed': EmoteFullSpeed,
  'emotes/emote-bell': EmoteBell,
  'emotes/emote-toast': EmoteToast,
  'emotes/emote-wave': EmoteWave,
  'emotes/emote-happy': EmoteHappy,
  'emotes/emote-your-turn': EmoteYourTurn,
  'emotes/emote-oop': EmoteOop,
  'emotes/emote-point': EmotePoint,

  // Sports
  'sports/sport-scooter': SportScooter,
  'sports/sport-running': SportRunning,
  'sports/sport-rowing': SportRowing,
  'sports/sport-triathlon': SportTriathlon,
  'sports/sport-yoga': SportYoga,

  // Categories
  'categories/category-a': CategoryA,
  'categories/category-b': CategoryB,
  'categories/category-c': CategoryC,
  'categories/category-d': CategoryD,
  'categories/category-e': CategoryE,

  // Metrics
  'metrics/power': Power,
  'metrics/average-power': AveragePower,
  'metrics/power-to-weight': PowerToWeight,
  'metrics/cadence-kick': CadenceKick,
  'metrics/cadence-run': CadenceRun,
  'metrics/heart-rate': HeartRate,
  'metrics/speed': Speed,
  'metrics/calories': Calories,
  'metrics/distance': Distance,
  'metrics/elevation': Elevation,

  // Connections
  'connections/connection-bluetooth': ConnectionBluetooth,
  'connections/connection-wifi': ConnectionWifi,
  'connections/connection-app': ConnectionApp,
  'connections/connection-ant-plus': ConnectionDirect,
}

// Size mapping
const sizeMap = {
  small: 16,
  medium: 20,
  large: 24,
} as const

interface InlineIconProps {
  value?: {
    icon?: string
    size?: 'small' | 'medium' | 'large'
  }
}

export function InlineIcon({ value }: InlineIconProps) {
  if (!value?.icon) {
    return null
  }

  const IconComponent = iconMap[value.icon]

  if (!IconComponent) {
    console.warn(`Icon not found: ${value.icon}`)
    return null
  }

  const size = sizeMap[value.size || 'medium']
  const iconName = value.icon.split('/').pop()?.replace(/-/g, ' ') || 'icon'

  return (
    <span className="inline-flex items-center align-middle mx-1">
      <Icon
        as={IconComponent}
        size={size}
        label={iconName}
        className="shrink-0"
      />
    </span>
  )
}
