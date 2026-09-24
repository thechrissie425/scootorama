import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Convenience components that match your existing button patterns
// Migrated to the design system's primary variant. Callers that pass their
// own `variant`/`size` (e.g. the modal-close icon buttons in Carousel and
// FeatureGrid, which use variant="ghost" size="icon") are unaffected — these
// are just the defaults when neither prop is provided.
export const BrandButton = ({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button variant={variant} size={size} className={cn(className)} {...props}>
    {children}
  </Button>
)

export const BrandCTAButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button
    variant="playful"
    size="lg"
    className={cn('w-full', className)}
    {...props}
  >
    {children}
  </Button>
)

export const BrandOutlineButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" className={cn(className)} {...props}>
    {children}
  </Button>
)

export const BrandSecondaryButton = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button variant="secondary" className={cn(className)} {...props}>
    {children}
  </Button>
)
