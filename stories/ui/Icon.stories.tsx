import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Icon } from '@/components/ui/icon'

// UI Icons - Badges
import BadgeAmbassador from '@/icons/ui/badges/badge-ambassador.svg?react'
import BadgeCommunityLeader from '@/icons/ui/badges/badge-community-leader.svg?react'
import BadgeProRide from '@/icons/ui/badges/badge-pro-ride.svg?react'
import BadgeProRun from '@/icons/ui/badges/badge-pro-run.svg?react'
import BadgeProTri from '@/icons/ui/badges/badge-pro-tri.svg?react'
import BadgeParadeLeader from '@/icons/ui/badges/badge-parade-leader.svg?react'
import BadgeRoute from '@/icons/ui/badges/badge-route.svg?react'
import BadgeVerified from '@/icons/ui/badges/badge-verified.svg?react'

// UI Icons - Powerups
import PowerupAero from '@/icons/ui/powerups/powerup-aero.svg?react'
import PowerupAnvil from '@/icons/ui/powerups/powerup-anvil.svg?react'
import PowerupBigXp from '@/icons/ui/powerups/powerup-big-xp.svg?react'
import PowerupDraft from '@/icons/ui/powerups/powerup-draft.svg?react'
import PowerupFeatherweight from '@/icons/ui/powerups/powerup-featherweight.svg?react'
import PowerupInvisibility from '@/icons/ui/powerups/powerup-invisibility.svg?react'
import PowerupXp from '@/icons/ui/powerups/powerup-xp.svg?react'

// UI Icons - Emotes
import EmoteBell from '@/icons/ui/emotes/emote-bell.svg?react'
import EmoteYourTurn from '@/icons/ui/emotes/emote-your-turn.svg?react'
import EmoteFullSpeed from '@/icons/ui/emotes/emote-full-speed.svg?react'
import EmoteHappy from '@/icons/ui/emotes/emote-happy.svg?react'
import EmoteOop from '@/icons/ui/emotes/emote-oop.svg?react'
import EmotePoint from '@/icons/ui/emotes/emote-point.svg?react'
import EmoteHonk from '@/icons/ui/emotes/emote-honk.svg?react'
import EmoteToast from '@/icons/ui/emotes/emote-toast.svg?react'
import EmoteWave from '@/icons/ui/emotes/emote-wave.svg?react'

// UI Icons - Sports
import SportScooter from '@/icons/ui/sports/sport-scooter.svg?react'
import SportRunning from '@/icons/ui/sports/sport-running.svg?react'
import SportRowing from '@/icons/ui/sports/sport-rowing.svg?react'
import SportTriathlon from '@/icons/ui/sports/sport-triathlon.svg?react'
import SportYoga from '@/icons/ui/sports/sport-yoga.svg?react'

// UI Icons - Categories
import CategoryA from '@/icons/ui/categories/category-a.svg?react'
import CategoryB from '@/icons/ui/categories/category-b.svg?react'
import CategoryC from '@/icons/ui/categories/category-c.svg?react'
import CategoryD from '@/icons/ui/categories/category-d.svg?react'
import CategoryE from '@/icons/ui/categories/category-e.svg?react'

// UI Icons - Metrics
import AveragePower from '@/icons/ui/metrics/average-power.svg?react'
import CadenceKick from '@/icons/ui/metrics/cadence-kick.svg?react'
import CadenceRun from '@/icons/ui/metrics/cadence-run.svg?react'
import Calories from '@/icons/ui/metrics/calories.svg?react'
import Distance from '@/icons/ui/metrics/distance.svg?react'
import Elevation from '@/icons/ui/metrics/elevation.svg?react'
import HeartRate from '@/icons/ui/metrics/heart-rate.svg?react'
import PowerBiasDecrease from '@/icons/ui/metrics/power-bias-decrease.svg?react'
import PowerBiasIncrease from '@/icons/ui/metrics/power-bias-increase.svg?react'
import PowerToWeight from '@/icons/ui/metrics/power-to-weight.svg?react'
import RunSpeed from '@/icons/ui/metrics/run-speed.svg?react'
import Speed from '@/icons/ui/metrics/speed.svg?react'

// UI Icons - Connections
import ConnectionBluetooth from '@/icons/ui/connections/connection-bluetooth.svg?react'
import ConnectionApp from '@/icons/ui/connections/connection-app.svg?react'
import ConnectionDirect from '@/icons/ui/connections/connection-direct.svg?react'
import ConnectionWifiNoSignal from '@/icons/ui/connections/connection-wifi-no-signal.svg?react'
import ConnectionWifiStrongSignal from '@/icons/ui/connections/connection-wifi-strong-signal.svg?react'

// UI Icons - Navigation
import TurnLeft from '@/icons/ui/navigation/turn-left.svg?react'
import TurnReverse from '@/icons/ui/navigation/turn-reverse.svg?react'
import TurnRight from '@/icons/ui/navigation/turn-right.svg?react'
import TurnStraight from '@/icons/ui/navigation/turn-straight.svg?react'
import TurnLeftRight from '@/icons/ui/navigation/turn-left-right.svg?react'

// UI Icons - Battery
import BatteryCharging from '@/icons/ui/battery/battery-charging.svg?react'
import BatteryFull from '@/icons/ui/battery/battery-full.svg?react'
import BatteryHalf from '@/icons/ui/battery/battery-half.svg?react'
import BatteryLow from '@/icons/ui/battery/battery-low.svg?react'

// UI Icons - Signal
import SignalNone from '@/icons/ui/signal/signal-none.svg?react'
import SignalStrong from '@/icons/ui/signal/signal-strong.svg?react'
import SignalWeak from '@/icons/ui/signal/signal-weak.svg?react'

// UI Icons - Score
import ScoreDecrease from '@/icons/ui/score/score-decrease.svg?react'
import ScoreFloor from '@/icons/ui/score/score-floor.svg?react'
import ScoreIncrease from '@/icons/ui/score/score-increase.svg?react'

// UI Icons - Time
import TimeAdd from '@/icons/ui/time/time-add.svg?react'
import TimeAdjust from '@/icons/ui/time/time-adjust.svg?react'
import TimeRefresh from '@/icons/ui/time/time-refresh.svg?react'
import TimeRefresh1 from '@/icons/ui/time/time-refresh-1.svg?react'
import TimeSubtract from '@/icons/ui/time/time-subtract.svg?react'

// UI Icons - Markers
import MarkerGroupLeader from '@/icons/ui/markers/marker-group-leader.svg?react'
import MarkerGhost from '@/icons/ui/markers/marker-ghost.svg?react'
import MarkerPlayer from '@/icons/ui/markers/marker-player.svg?react'
import MarkerPaceBot from '@/icons/ui/markers/marker-pace-bot.svg?react'

// UI Icons - Root Level (Only existing ones)
import Camera from '@/icons/ui/camera.svg?react'
import Crown from '@/icons/ui/crown.svg?react'
import StartFlag from '@/icons/ui/start-flag.svg?react'
import StopWatch from '@/icons/ui/stop-watch.svg?react'
import Teleport from '@/icons/ui/teleport.svg?react'
import Temperature from '@/icons/ui/temperature.svg?react'
import TrainingPlan from '@/icons/ui/training-plan.svg?react'
import Trophy from '@/icons/ui/trophy.svg?react'
import Video from '@/icons/ui/video.svg?react'
import Weight from '@/icons/ui/weight.svg?react'
import Women from '@/icons/ui/women.svg?react'
import Workout from '@/icons/ui/workout.svg?react'

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper component for consistent icon sizing and accessibility. Import SVGs from public/icons/ and use with the Icon component.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    as: BadgeVerified,
    size: 24,
    label: 'Verified badge',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon as={BadgeVerified} size={16} label="Small verified badge" />
      <Icon as={BadgeVerified} size={24} label="Medium verified badge" />
      <Icon as={BadgeVerified} size={32} label="Large verified badge" />
      <Icon as={BadgeVerified} size={48} label="Extra large verified badge" />
    </div>
  ),
}

export const Colored: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Icon
        as={BadgeVerified}
        size={32}
        className="text-blue-500"
        label="Blue badge"
      />
      <Icon
        as={PowerupAero}
        size={32}
        className="text-green-500"
        label="Green powerup"
      />
      <Icon
        as={EmoteHonk}
        size={32}
        className="text-brand-primary"
        label="Orange emote"
      />
      <Icon
        as={SportScooter}
        size={32}
        className="text-purple-500"
        label="Purple sport"
      />
    </div>
  ),
}

export const IconShowcase: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Badges */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Badges (9)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeAmbassador} size={32} label="Ambassador" />
            <span className="text-xs text-center">Ambassador</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon
              as={BadgeCommunityLeader}
              size={32}
              label="Community Leader"
            />
            <span className="text-xs text-center">Community Leader</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeProRide} size={32} label="Pro Ride" />
            <span className="text-xs text-center">Pro Ride</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeProRun} size={32} label="Pro Run" />
            <span className="text-xs text-center">Pro Run</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeProTri} size={32} label="Pro Tri" />
            <span className="text-xs text-center">Pro Tri</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeParadeLeader} size={32} label="Parade Leader" />
            <span className="text-xs text-center">Parade Leader</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeRoute} size={32} label="Route" />
            <span className="text-xs text-center">Route</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BadgeVerified} size={32} label="Verified" />
            <span className="text-xs text-center">Verified</span>
          </div>
        </div>
      </div>

      {/* Powerups */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Powerups (7)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupAero} size={32} label="Aero" />
            <span className="text-xs text-center">Aero</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupAnvil} size={32} label="Anvil" />
            <span className="text-xs text-center">Anvil</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupBigXp} size={32} label="Big XP" />
            <span className="text-xs text-center">Big XP</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupDraft} size={32} label="Draft" />
            <span className="text-xs text-center">Draft</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupFeatherweight} size={32} label="Featherweight" />
            <span className="text-xs text-center">Featherweight</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupInvisibility} size={32} label="Invisibility" />
            <span className="text-xs text-center">Invisibility</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerupXp} size={32} label="XP" />
            <span className="text-xs text-center">XP</span>
          </div>
        </div>
      </div>

      {/* Emotes */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Emotes (9)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteBell} size={32} label="Bell" />
            <span className="text-xs text-center">Bell</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteYourTurn} size={32} label="Your Turn" />
            <span className="text-xs text-center">Your Turn</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteFullSpeed} size={32} label="Full Speed" />
            <span className="text-xs text-center">Full Speed</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteHappy} size={32} label="Happy" />
            <span className="text-xs text-center">Happy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteOop} size={32} label="Oop" />
            <span className="text-xs text-center">Oop</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmotePoint} size={32} label="Point" />
            <span className="text-xs text-center">Point</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteHonk} size={32} label="Honk" />
            <span className="text-xs text-center">Honk</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteToast} size={32} label="Toast" />
            <span className="text-xs text-center">Toast</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={EmoteWave} size={32} label="Wave" />
            <span className="text-xs text-center">Wave</span>
          </div>
        </div>
      </div>

      {/* Sports */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Sports (5)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={SportScooter} size={32} label="Scooter" />
            <span className="text-xs text-center">Scooter</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SportRunning} size={32} label="Running" />
            <span className="text-xs text-center">Running</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SportRowing} size={32} label="Rowing" />
            <span className="text-xs text-center">Rowing</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SportTriathlon} size={32} label="Triathlon" />
            <span className="text-xs text-center">Triathlon</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SportYoga} size={32} label="Yoga" />
            <span className="text-xs text-center">Yoga</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Race Categories (5)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={CategoryA} size={32} label="Category A" />
            <span className="text-xs text-center">Category A</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CategoryB} size={32} label="Category B" />
            <span className="text-xs text-center">Category B</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CategoryC} size={32} label="Category C" />
            <span className="text-xs text-center">Category C</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CategoryD} size={32} label="Category D" />
            <span className="text-xs text-center">Category D</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CategoryE} size={32} label="Category E" />
            <span className="text-xs text-center">Category E</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Metrics (12)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={AveragePower} size={32} label="Average Power" />
            <span className="text-xs text-center">Avg Power</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CadenceKick} size={32} label="Cadence (Ride)" />
            <span className="text-xs text-center">Cadence (Ride)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={CadenceRun} size={32} label="Cadence (Run)" />
            <span className="text-xs text-center">Cadence (Run)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Calories} size={32} label="Calories" />
            <span className="text-xs text-center">Calories</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Distance} size={32} label="Distance" />
            <span className="text-xs text-center">Distance</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Elevation} size={32} label="Elevation" />
            <span className="text-xs text-center">Elevation</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={HeartRate} size={32} label="Heart Rate" />
            <span className="text-xs text-center">Heart Rate</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerBiasDecrease} size={32} label="Power Bias -" />
            <span className="text-xs text-center">Power Bias -</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerBiasIncrease} size={32} label="Power Bias +" />
            <span className="text-xs text-center">Power Bias +</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={PowerToWeight} size={32} label="W/kg" />
            <span className="text-xs text-center">W/kg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={RunSpeed} size={32} label="Run Speed" />
            <span className="text-xs text-center">Run Speed</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Speed} size={32} label="Speed" />
            <span className="text-xs text-center">Speed</span>
          </div>
        </div>
      </div>

      {/* Connections */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Connections (5)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={ConnectionBluetooth} size={32} label="Bluetooth" />
            <span className="text-xs text-center">Bluetooth</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={ConnectionApp} size={32} label="Mobile App" />
            <span className="text-xs text-center">Mobile App</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={ConnectionDirect} size={32} label="Direct" />
            <span className="text-xs text-center">Direct</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon
              as={ConnectionWifiNoSignal}
              size={32}
              label="WiFi (No Signal)"
            />
            <span className="text-xs text-center">WiFi (No Signal)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon
              as={ConnectionWifiStrongSignal}
              size={32}
              label="WiFi (Strong)"
            />
            <span className="text-xs text-center">WiFi (Strong)</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Navigation (5)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={TurnLeft} size={32} label="Turn Left" />
            <span className="text-xs text-center">Turn Left</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TurnReverse} size={32} label="Reverse" />
            <span className="text-xs text-center">Reverse</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TurnRight} size={32} label="Turn Right" />
            <span className="text-xs text-center">Turn Right</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TurnStraight} size={32} label="Straight" />
            <span className="text-xs text-center">Straight</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TurnLeftRight} size={32} label="Turn Left/Right" />
            <span className="text-xs text-center">Turn L/R</span>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Battery (4)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={BatteryCharging} size={32} label="Charging" />
            <span className="text-xs text-center">Charging</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BatteryFull} size={32} label="Full" />
            <span className="text-xs text-center">Full</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BatteryHalf} size={32} label="Half" />
            <span className="text-xs text-center">Half</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={BatteryLow} size={32} label="Low" />
            <span className="text-xs text-center">Low</span>
          </div>
        </div>
      </div>

      {/* Signal */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Signal (3)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={SignalNone} size={32} label="No Signal" />
            <span className="text-xs text-center">No Signal</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SignalStrong} size={32} label="Strong Signal" />
            <span className="text-xs text-center">Strong Signal</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={SignalWeak} size={32} label="Weak Signal" />
            <span className="text-xs text-center">Weak Signal</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Score (3)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={ScoreDecrease} size={32} label="Decrease" />
            <span className="text-xs text-center">Decrease</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={ScoreFloor} size={32} label="Floor" />
            <span className="text-xs text-center">Floor</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={ScoreIncrease} size={32} label="Increase" />
            <span className="text-xs text-center">Increase</span>
          </div>
        </div>
      </div>

      {/* Time */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Time (5)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={TimeAdd} size={32} label="Add Time" />
            <span className="text-xs text-center">Add Time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TimeAdjust} size={32} label="Adjust Time" />
            <span className="text-xs text-center">Adjust Time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TimeRefresh} size={32} label="Refresh Time" />
            <span className="text-xs text-center">Refresh Time</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TimeRefresh1} size={32} label="Refresh Time Alt" />
            <span className="text-xs text-center">Refresh Time Alt</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TimeSubtract} size={32} label="Subtract Time" />
            <span className="text-xs text-center">Subtract Time</span>
          </div>
        </div>
      </div>

      {/* Markers */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Markers (4)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={MarkerGroupLeader} size={32} label="Group Leader" />
            <span className="text-xs text-center">Group Leader</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={MarkerGhost} size={32} label="Ghost" />
            <span className="text-xs text-center">Ghost</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={MarkerPlayer} size={32} label="Player" />
            <span className="text-xs text-center">Player</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={MarkerPaceBot} size={32} label="Pace Bot" />
            <span className="text-xs text-center">Pace Bot</span>
          </div>
        </div>
      </div>

      {/* UI General */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">General UI (12)</h3>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex flex-col items-center gap-2">
            <Icon as={Camera} size={32} label="Camera" />
            <span className="text-xs text-center">Camera</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Crown} size={32} label="Crown" />
            <span className="text-xs text-center">Crown</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={StartFlag} size={32} label="Start Flag" />
            <span className="text-xs text-center">Start Flag</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={StopWatch} size={32} label="Stopwatch" />
            <span className="text-xs text-center">Stopwatch</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Teleport} size={32} label="Teleport" />
            <span className="text-xs text-center">Teleport</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Temperature} size={32} label="Temperature" />
            <span className="text-xs text-center">Temperature</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={TrainingPlan} size={32} label="Training Plan" />
            <span className="text-xs text-center">Training Plan</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Trophy} size={32} label="Trophy" />
            <span className="text-xs text-center">Trophy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Video} size={32} label="Video" />
            <span className="text-xs text-center">Video</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Weight} size={32} label="Weight" />
            <span className="text-xs text-center">Weight</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Women} size={32} label="Women" />
            <span className="text-xs text-center">Women</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon as={Workout} size={32} label="Workout" />
            <span className="text-xs text-center">Workout</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Browse the Scootorama UI icons (Lucide-based) organized by category. Icons include badges, powerups, emotes, sports, metrics, connections, and more.',
      },
    },
  },
}
