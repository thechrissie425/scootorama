'use client'

import { Link } from 'lucide-react'
import SvgIcon from '@/components/ui/SvgIcon'
import chevronLeft from '@/icons/system/arrow-left.svg'
import plusIcon from '@/icons/system/checkmark.svg'
import trashIcon from '@/icons/system/trash.svg'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface FamilyMember {
  id: string
  name: string
  email?: string
  avatar?: string
  role: 'admin' | 'member' | 'pending'
  status?: string
  joinedDate?: string
  inviteSent?: string
  isCurrentUser?: boolean
}

interface FamilyPlan {
  name: string
  price: string
  renewalDate: string
  seatsUsed: number
  seatsTotal: number
}

interface FamilyDashboardProps {
  plan: FamilyPlan
  members: FamilyMember[]
  onManagePlan?: () => void
  onDowngradePlan?: () => void
  onViewBilling?: () => void
  onRemoveMember?: (memberId: string) => void
  onCopyInviteLink?: (memberId: string) => void
  onRevokeInvite?: (memberId: string) => void
  onAddMember?: () => void
  onBack?: () => void
}

export function FamilyDashboard({
  plan,
  members,
  onManagePlan,
  onDowngradePlan,
  onViewBilling,
  onRemoveMember,
  onCopyInviteLink,
  onRevokeInvite,
  onAddMember,
  onBack,
}: FamilyDashboardProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 pl-0">
          <SvgIcon src={chevronLeft} className="shrink-0" />
          Back to Profile
        </Button>

        <div>
          <h1 className="font-display text-4xl tracking-tight">
            FAMILY PASS SETTINGS
          </h1>
        </div>
      </div>

      {/* Plan Information */}
      <Card className="rounded-2xl border-2 border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <p className="font-heading-semibold text-sm uppercase tracking-wider text-neutral-500">
              Your Plan
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <h2 className="font-display text-2xl">{plan.name}</h2>
              <Badge
                variant="secondary"
                className="bg-brand-primary/10 font-heading-bold text-brand-primary hover:bg-brand-primary/20"
              >
                {plan.seatsUsed}/{plan.seatsTotal} Seats
              </Badge>
            </div>
            <p className="mt-1 font-heading-semibold text-neutral-600">
              {plan.price} / month • Renews {plan.renewalDate}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="default" onClick={onManagePlan}>
              Manage Seats
            </Button>
            <Button variant="outline" onClick={onViewBilling}>
              Billing History
            </Button>
          </div>
        </div>
      </Card>

      {/* Family Members */}
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-2xl">FAMILY MEMBERS</h2>
            <Badge
              variant="secondary"
              className="bg-brand-primary/10 font-heading-bold text-brand-primary hover:bg-brand-primary/20"
            >
              {plan.seatsUsed}/{plan.seatsTotal} Seats Used
            </Badge>
          </div>
          <p className="mt-1 font-heading-semibold text-neutral-600">
            Manage your household access.
          </p>
        </div>

        <div className="space-y-3">
          {members.map(member => (
            <Card
              key={member.id}
              className="rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-sm transition-all hover:border-neutral-300"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      member.avatar
                        ? 'bg-cover bg-center'
                        : member.role === 'pending'
                          ? 'border-2 border-dashed border-neutral-300 bg-neutral-50'
                          : 'bg-gradient-to-br from-brand-primary to-brand-primary-dark'
                    }`}
                    style={
                      member.avatar
                        ? { backgroundImage: `url(${member.avatar})` }
                        : undefined
                    }
                  >
                    {!member.avatar && member.role !== 'pending' && (
                      <span className="font-display text-xl text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Member Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading-bold text-lg">
                        {member.name}
                        {member.isCurrentUser && ' (You)'}
                      </span>
                      <Badge
                        variant={
                          member.role === 'admin'
                            ? 'default'
                            : member.role === 'pending'
                              ? 'outline'
                              : 'secondary'
                        }
                        className={
                          member.role === 'admin'
                            ? 'bg-brand-primary font-heading-bold text-white'
                            : member.role === 'pending'
                              ? 'border-brand-primary font-heading-bold text-brand-primary'
                              : 'bg-neutral-200 font-heading-bold text-neutral-700'
                        }
                      >
                        {member.role.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="mt-1 font-heading-semibold text-sm text-neutral-600">
                      {member.role === 'pending' ? (
                        <>Invite sent: {member.inviteSent}</>
                      ) : member.status ? (
                        <>{member.status}</>
                      ) : (
                        <>Access: Unlimited</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {!member.isCurrentUser && (
                  <div className="flex gap-2">
                    {member.role === 'pending' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCopyInviteLink?.(member.id)}
                          className="gap-2"
                        >
                          <Link className="h-4 w-4" />
                          Copy Link
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRevokeInvite?.(member.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Revoke
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveMember?.(member.id)}
                        className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <SvgIcon src={trashIcon} className="shrink-0" />
                        Remove Member
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}

          {/* Add Member Button */}
          {plan.seatsUsed < plan.seatsTotal && (
            <Card
              className="cursor-pointer rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-5 transition-all hover:border-brand-primary hover:bg-brand-primary/5"
              onClick={onAddMember}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                  <SvgIcon
                    src={plusIcon}
                    width={24}
                    height={24}
                    className="text-brand-primary"
                  />
                </div>
                <div>
                  <span className="font-heading-bold text-lg text-brand-primary">
                    Add Family Member
                  </span>
                  <p className="mt-1 font-heading-semibold text-sm text-neutral-600">
                    Invite a partner or child (13+)
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Plan Management */}
      <div className="space-y-3">
        <h3 className="font-heading-bold text-sm uppercase tracking-wider text-neutral-500">
          Plan Options
        </h3>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-red-200 font-heading-bold text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            onClick={onDowngradePlan}
          >
            Downgrade to Individual
          </Button>
        </div>
        <p className="font-heading-semibold text-xs text-neutral-500">
          Downgrading removes all family members at the end of your billing
          cycle.
        </p>
      </div>

      <Separator className="my-8" />

      {/* Help Section */}
      <div className="space-y-3">
        <h3 className="font-heading-bold text-sm uppercase tracking-wider text-neutral-500">
          Need Help?
        </h3>
        <div className="flex gap-3">
          <Button variant="ghost" className="font-heading-bold">
            FAQs
          </Button>
          <Button variant="ghost" className="font-heading-bold">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  )
}
