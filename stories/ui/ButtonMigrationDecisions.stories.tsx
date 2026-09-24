import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'UI/Button (Migration Targets)',
  parameters: { layout: 'padded' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/** Legacy pink-outline buttons map to Figma's outlined primary family. */
export const OutlinedButtons: Story = {
  render: () => (
    <div className="flex flex-col gap-10 bg-white p-8">
      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Current — legacy &quot;outline&quot; (pink stroke pill)
        </p>
        <div className="flex gap-3">
          <Button variant="outline">Billing History</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Migration target — outlined primary
        </p>
        <p className="max-w-md text-sm text-neutral-600">
          Figma&apos;s outlined primary: pink content and 2px pink border. This
          preserves the semantic role and visual weight of the existing
          pink-outline call sites.
        </p>
        <div className="flex gap-3">
          <Button variant="outlinedPrimary" size="medium">
            Billing History
          </Button>
          <Button variant="outlinedPrimary" size="medium">
            Cancel
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Other Figma outline tones
        </p>
        <div className="flex gap-3">
          <Button variant="outlinedSecondary" size="medium">
            Secondary
          </Button>
          <Button variant="outlinedTertiary" size="medium">
            Tertiary
          </Button>
        </div>
      </section>
    </div>
  ),
}

/** Legacy ghost actions map to Figma's text-button family. */
export const TextButtons: Story = {
  render: () => (
    <div className="flex flex-col gap-10 bg-white p-8">
      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Current — legacy &quot;ghost&quot; (no fill, no border)
        </p>
        <div className="flex gap-3">
          <Button variant="ghost">← Back to Profile</Button>
          <Button variant="ghost">FAQs</Button>
          <Button variant="ghost" className="text-red-600 hover:bg-red-50">
            Remove Member
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Migration target — text primary
        </p>
        <p className="max-w-md text-sm text-neutral-600">
          Figma&apos;s text primary: pink content, no fill, no border. This is
          the direct design-system replacement for the existing ghost actions.
        </p>
        <div className="flex gap-3">
          <Button variant="textPrimary" size="medium">
            ← Back to Profile
          </Button>
          <Button variant="textPrimary" size="medium">
            FAQs
          </Button>
          <Button variant="textPrimary" size="medium" className="text-red-600">
            Remove Member
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="font-body-bold text-xs uppercase text-neutral-500">
          Other Figma text tones
        </p>
        <div className="flex gap-3">
          <Button variant="textSecondary" size="medium">
            Secondary
          </Button>
          <Button variant="textTertiary" size="medium">
            Tertiary
          </Button>
        </div>
      </section>
    </div>
  ),
}
