'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FamilyDashboard } from '@/components/membership/FamilyDashboard'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SvgIcon from '@/components/ui/SvgIcon'
import crownIcon from '@/icons/ui/crown.svg'
import profileIcon from '@/icons/system/profile.svg'

// ─────────────────────────────────────────────────────────────
// SIMPLE PLUS/MINUS ICONS (matching design system stroke style)
// ─────────────────────────────────────────────────────────────

function MinusIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PlusIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
// SEAT SELECTOR COMPONENT
// A clever, interactive way to add/remove family seats
// ─────────────────────────────────────────────────────────────

const BASE_PRICE = 39.99
const SEAT_PRICE = 10
const MAX_ADDITIONAL_SEATS = 4
const MIN_SEATS = 1 // The admin seat (always included)

interface SeatSelectorProps {
  currentSeats: number
  onSeatsChange: (seats: number) => void
  onConfirm: () => void
}

function SeatSelector({
  currentSeats,
  onSeatsChange,
  onConfirm,
}: SeatSelectorProps) {
  const additionalSeats = currentSeats - MIN_SEATS
  const totalPrice = BASE_PRICE + additionalSeats * SEAT_PRICE
  const canRemove = additionalSeats > 0
  const canAdd = additionalSeats < MAX_ADDITIONAL_SEATS

  const handleRemove = useCallback(() => {
    if (canRemove) onSeatsChange(currentSeats - 1)
  }, [canRemove, currentSeats, onSeatsChange])

  const handleAdd = useCallback(() => {
    if (canAdd) onSeatsChange(currentSeats + 1)
  }, [canAdd, currentSeats, onSeatsChange])

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-brand-primary/20 bg-white p-6 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-display text-xl uppercase tracking-tight">
            Customize Your Family Plan
          </h3>
          <p className="mt-1 font-heading-semibold text-sm text-neutral-600">
            Add seats for $10/month each • Up to 4 additional members
          </p>
        </div>

        {/* Seat Visualization */}
        <div className="flex items-center justify-center gap-3">
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={!canRemove}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
              canRemove
                ? 'border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white active:scale-95'
                : 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-300'
            }`}
            aria-label="Remove seat"
          >
            <MinusIcon size={20} />
          </button>

          {/* Seat Icons */}
          <div className="flex items-center gap-2 px-4">
            {/* Admin seat (always shown, highlighted) */}
            <motion.div
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <SvgIcon
                src={profileIcon}
                width={28}
                height={28}
                className="text-white"
              />
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-brand-primary shadow">
                <SvgIcon src={crownIcon} width={12} height={12} />
              </span>
            </motion.div>

            {/* Additional seats */}
            <AnimatePresence mode="popLayout">
              {Array.from({ length: additionalSeats }).map((_, i) => (
                <motion.div
                  key={`seat-${i}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/80 shadow-md"
                >
                  <SvgIcon
                    src={profileIcon}
                    width={28}
                    height={28}
                    className="text-white"
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty seat placeholders */}
            {Array.from({ length: MAX_ADDITIONAL_SEATS - additionalSeats }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50"
                >
                  <SvgIcon
                    src={profileIcon}
                    width={28}
                    height={28}
                    className="text-neutral-300"
                  />
                </div>
              )
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
              canAdd
                ? 'border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white active:scale-95'
                : 'cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-300'
            }`}
            aria-label="Add seat"
          >
            <PlusIcon size={20} />
          </button>
        </div>

        {/* Seat Count Display */}
        <div className="text-center">
          <motion.div
            key={currentSeats}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-4xl text-brand-primary"
          >
            {currentSeats}
          </motion.div>
          <p className="font-heading-semibold text-sm text-neutral-600">
            {currentSeats === 1 ? 'seat' : 'seats'} total
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="rounded-xl bg-white/80 p-4 backdrop-blur">
          <div className="space-y-2">
            <div className="flex justify-between font-heading-semibold text-sm text-neutral-600">
              <span>Base plan (includes 1 seat)</span>
              <span>${BASE_PRICE.toFixed(2)}</span>
            </div>
            <AnimatePresence>
              {additionalSeats > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex justify-between font-heading-semibold text-sm text-neutral-600"
                >
                  <span>
                    {additionalSeats} additional{' '}
                    {additionalSeats === 1 ? 'seat' : 'seats'} × $10
                  </span>
                  <span>+${(additionalSeats * SEAT_PRICE).toFixed(2)}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex justify-between">
                <span className="font-display text-lg">Monthly Total</span>
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="font-display text-2xl text-brand-primary"
                >
                  ${totalPrice.toFixed(2)}
                </motion.span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          className="w-full bg-brand-primary py-6 font-display text-lg uppercase tracking-wider hover:bg-brand-primary-dark"
        >
          {additionalSeats > 0 ? 'Update Plan' : 'Continue with Current Plan'}
        </Button>

        {/* Fine Print */}
        <p className="text-center font-heading-semibold text-xs text-neutral-500">
          Changes take effect on your next billing cycle. You can add or remove
          seats anytime.
        </p>
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// DOWNGRADE PLAN COMPONENT
// Handles the downgrade flow with family member warnings
// ─────────────────────────────────────────────────────────────

interface DowngradePlanProps {
  members: Array<{
    id: string
    name: string
    role: 'admin' | 'member' | 'pending'
  }>
  onConfirm: () => void
  onCancel: () => void
}

function DowngradePlan({ members, onConfirm, onCancel }: DowngradePlanProps) {
  const familyMembers = members.filter(m => m.role !== 'admin')
  const hasMembers = familyMembers.length > 0

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-brand-primary/20 bg-white p-6 shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-display text-xl uppercase tracking-tight text-red-600">
            Downgrade to Individual Plan
          </h3>
        </div>

        {/* Warning for family members */}
        {hasMembers && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <p className="mb-2 font-heading-bold text-sm uppercase tracking-wider text-red-800">
              ⚠️ Family Members Will Lose Access
            </p>
            <div className="space-y-2">
              {familyMembers.map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 font-heading-semibold text-sm text-red-700"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-200">
                    <span className="font-heading-bold text-xs text-red-800">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>
                    {member.name}
                    {member.role === 'pending' && ' (Pending Invite)'}
                  </span>
                  <span className="ml-auto rounded-full bg-red-200 px-2 py-0.5 text-xs font-bold text-red-800">
                    Access Lost
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timing Information */}
        <div className="rounded-xl bg-neutral-100 p-4">
          <p className="mb-1 font-heading-bold text-sm text-neutral-700">
            When does this happen?
          </p>
          <p className="font-heading-semibold text-sm text-neutral-600">
            This change will take effect at the{' '}
            <span className="font-heading-bold text-neutral-800">
              end of your current billing cycle
            </span>
            . Family members will retain access until then.
          </p>
        </div>

        {/* Price Comparison */}
        <div className="rounded-xl bg-white p-4">
          <div className="space-y-2">
            <div className="flex justify-between font-heading-semibold text-sm text-neutral-600 line-through">
              <span>Family Plan</span>
              <span>$49.99/mo</span>
            </div>
            <div className="flex justify-between font-heading-bold text-lg text-neutral-800">
              <span>Individual Plan</span>
              <span className="text-brand-primary">$14.99/mo</span>
            </div>
            <div className="border-t border-neutral-200 pt-2">
              <p className="font-heading-semibold text-sm text-green-600">
                You'll save $35.00/month
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-6 font-display uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 py-6 font-display uppercase tracking-wider hover:bg-red-700"
          >
            Confirm Downgrade
          </Button>
        </div>

        {/* Fine Print */}
        <p className="text-center font-heading-semibold text-xs text-neutral-500">
          You can upgrade back to Family Plan anytime. No refunds for remaining
          time on current plan.
        </p>
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function FamilyDashboardPage() {
  const [totalSeats, setTotalSeats] = useState(3) // 1 admin + 2 additional
  const [showSeatSelector, setShowSeatSelector] = useState(false)
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)

  // Dynamic plan based on seat selection
  const samplePlan = {
    name: 'Family Pass',
    price: `$${(BASE_PRICE + (totalSeats - 1) * SEAT_PRICE).toFixed(2)}`,
    renewalDate: 'Feb 15, 2026',
    seatsUsed: 3, // Current members
    seatsTotal: totalSeats,
  }

  const sampleMembers = [
    {
      id: '1',
      name: 'Alex',
      role: 'admin' as const,
      isCurrentUser: true,
    },
    {
      id: '2',
      name: 'Sarah',
      role: 'member' as const,
      status: 'Active since Jan 2024',
      avatar: undefined,
    },
    {
      id: '3',
      name: 'mike.j@example.com',
      email: 'mike.j@example.com',
      role: 'pending' as const,
      inviteSent: '2 days ago',
    },
  ]

  const handleConfirmSeats = () => {
    setShowSeatSelector(false)
    console.log(`Plan updated to ${totalSeats} seats`)
  }

  const handleConfirmDowngrade = () => {
    setShowDowngradeModal(false)
    console.log('Downgrade confirmed - will process at end of billing cycle')
    // TODO: API call to schedule downgrade
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Seat Selector Modal/Section */}
      <AnimatePresence>
        {showSeatSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowSeatSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <SeatSelector
                currentSeats={totalSeats}
                onSeatsChange={setTotalSeats}
                onConfirm={handleConfirmSeats}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Downgrade Modal */}
      <AnimatePresence>
        {showDowngradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowDowngradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <DowngradePlan
                members={sampleMembers}
                onConfirm={handleConfirmDowngrade}
                onCancel={() => setShowDowngradeModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FamilyDashboard
        plan={samplePlan}
        members={sampleMembers}
        onManagePlan={() => setShowSeatSelector(true)}
        onDowngradePlan={() => setShowDowngradeModal(true)}
        onViewBilling={() => console.log('View billing clicked')}
        onRemoveMember={id => console.log('Remove member:', id)}
        onCopyInviteLink={id => console.log('Copy invite link:', id)}
        onRevokeInvite={id => console.log('Revoke invite:', id)}
        onAddMember={() => console.log('Add member clicked')}
        onBack={() => console.log('Back clicked')}
      />
    </div>
  )
}
