import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

interface BrandAccordionProps {
  children: React.ReactNode
  type?: 'single' | 'multiple'
  collapsible?: boolean
  className?: string
}

interface BrandAccordionItemProps {
  children: React.ReactNode
  value: string
  className?: string
}

interface BrandAccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

interface BrandAccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function BrandAccordion({
  children,
  type = 'single',
  collapsible = true,
  className,
}: BrandAccordionProps) {
  return (
    <Accordion
      type={type}
      collapsible={collapsible}
      className={cn('w-full space-y-4', className)}
    >
      {children}
    </Accordion>
  )
}

export function BrandAccordionItem({
  children,
  value,
  className,
}: BrandAccordionItemProps) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 data-[state=open]:border-brand-primary/50',
        className
      )}
    >
      {children}
    </AccordionItem>
  )
}

export function BrandAccordionTrigger({
  children,
  className,
}: BrandAccordionTriggerProps) {
  return (
    <AccordionTrigger
      className={cn(
        'w-full p-8 text-left hover:bg-white/5 transition-colors duration-200 hover:no-underline group [&[data-state=open]>*]:text-brand-primary',
        className
      )}
    >
      {children}
    </AccordionTrigger>
  )
}

export function BrandAccordionContent({
  children,
  className,
}: BrandAccordionContentProps) {
  return (
    <AccordionContent className={cn('px-8 pb-8', className)}>
      <div className="bg-white/5 rounded-xl p-6 border-l-4 border-brand-primary">
        {children}
      </div>
    </AccordionContent>
  )
}
