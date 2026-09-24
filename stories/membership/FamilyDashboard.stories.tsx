import type { Meta, StoryObj } from '@storybook/react'
import { FamilyDashboard } from '@/components/membership/FamilyDashboard'

const meta = {
  title: 'Membership/FamilyDashboard',
  component: FamilyDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="min-h-screen bg-neutral-50 p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FamilyDashboard>

export default meta
type Story = StoryObj<typeof meta>

// Base plan data
const basePlan = {
  name: 'Family Pass',
  price: '$39.99',
  renewalDate: 'Feb 15, 2026',
  seatsUsed: 3,
  seatsTotal: 5,
}

// Default story with typical usage
export const Default: Story = {
  args: {
    plan: basePlan,
    members: [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'admin',
        isCurrentUser: true,
      },
      {
        id: '2',
        name: 'Sarah Thompson',
        role: 'member',
        status: 'Active since Jan 2024',
      },
      {
        id: '3',
        name: 'mike.j@example.com',
        email: 'mike.j@example.com',
        role: 'pending',
        inviteSent: '2 days ago',
      },
    ],
    onManagePlan: () => console.log('Manage plan'),
    onViewBilling: () => console.log('View billing'),
    onRemoveMember: id => console.log('Remove member:', id),
    onCopyInviteLink: id => console.log('Copy invite:', id),
    onRevokeInvite: id => console.log('Revoke invite:', id),
    onAddMember: () => console.log('Add member'),
    onBack: () => console.log('Back'),
  },
}

// Full capacity - all 5 seats used
export const FullCapacity: Story = {
  args: {
    plan: {
      ...basePlan,
      seatsUsed: 5,
      seatsTotal: 5,
    },
    members: [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'admin',
        isCurrentUser: true,
      },
      {
        id: '2',
        name: 'Sarah Thompson',
        role: 'member',
        status: 'Active since Jan 2024',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'member',
        status: 'Active since Dec 2024',
      },
      {
        id: '4',
        name: 'Emma Wilson',
        role: 'member',
        status: 'Active since Feb 2025',
      },
      {
        id: '5',
        name: 'Jake Davis',
        role: 'member',
        status: 'Active since Jan 2026',
      },
    ],
    onManagePlan: () => console.log('Manage plan'),
    onViewBilling: () => console.log('View billing'),
    onRemoveMember: id => console.log('Remove member:', id),
    onBack: () => console.log('Back'),
  },
}

// Multiple pending invites
export const MultiplePendingInvites: Story = {
  args: {
    plan: basePlan,
    members: [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'admin',
        isCurrentUser: true,
      },
      {
        id: '2',
        name: 'sarah.t@example.com',
        email: 'sarah.t@example.com',
        role: 'pending',
        inviteSent: '5 days ago',
      },
      {
        id: '3',
        name: 'mike.j@example.com',
        email: 'mike.j@example.com',
        role: 'pending',
        inviteSent: '2 days ago',
      },
    ],
    onManagePlan: () => console.log('Manage plan'),
    onViewBilling: () => console.log('View billing'),
    onCopyInviteLink: id => console.log('Copy invite:', id),
    onRevokeInvite: id => console.log('Revoke invite:', id),
    onAddMember: () => console.log('Add member'),
    onBack: () => console.log('Back'),
  },
}

// Just admin (empty family)
export const JustAdmin: Story = {
  args: {
    plan: {
      ...basePlan,
      seatsUsed: 1,
      seatsTotal: 5,
    },
    members: [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'admin',
        isCurrentUser: true,
      },
    ],
    onManagePlan: () => console.log('Manage plan'),
    onViewBilling: () => console.log('View billing'),
    onAddMember: () => console.log('Add member'),
    onBack: () => console.log('Back'),
  },
}

// Near capacity with mix of statuses
export const NearCapacity: Story = {
  args: {
    plan: {
      ...basePlan,
      seatsUsed: 4,
      seatsTotal: 5,
    },
    members: [
      {
        id: '1',
        name: 'Alex Thompson',
        role: 'admin',
        isCurrentUser: true,
      },
      {
        id: '2',
        name: 'Sarah Thompson',
        role: 'member',
        status: 'Active since Jan 2024',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'member',
        status: 'Active since Mar 2025',
      },
      {
        id: '4',
        name: 'emma.w@example.com',
        email: 'emma.w@example.com',
        role: 'pending',
        inviteSent: '1 day ago',
      },
    ],
    onManagePlan: () => console.log('Manage plan'),
    onViewBilling: () => console.log('View billing'),
    onRemoveMember: id => console.log('Remove member:', id),
    onCopyInviteLink: id => console.log('Copy invite:', id),
    onRevokeInvite: id => console.log('Revoke invite:', id),
    onAddMember: () => console.log('Add member'),
    onBack: () => console.log('Back'),
  },
}
