import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Card> = {
  title: 'shadcn/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Scootorama Membership</CardTitle>
        <CardDescription>Access unlimited scooter adventures</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Join millions of riders from around the world in the ultimate indoor
          scooter experience.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Subscribe Now</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Ride Stats</CardTitle>
        <CardDescription>Your weekly performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Distance</span>
            <span className="font-medium">124.5 km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Elevation</span>
            <span className="font-medium">1,247 m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Time</span>
            <span className="font-medium">4h 32m</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a minimal card with just title and content.</p>
      </CardContent>
    </Card>
  ),
}
