import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'validationTask',
  title: 'Validation Task',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      readOnly: true,
    }),
    defineField({
      name: 'severity',
      title: 'Severity',
      type: 'string',
      options: {
        list: [
          { title: 'Critical', value: 'critical' },
          { title: 'Warning', value: 'warning' },
          { title: 'Info', value: 'info' },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: 'documentReference',
      title: 'Related Document',
      type: 'reference',
      to: [
        { type: 'product' },
        { type: 'campaign' },
        { type: 'page' },
        { type: 'post' },
        { type: 'membershipPage' },
      ],
      readOnly: true,
    }),
    defineField({
      name: 'issues',
      title: 'Issues Found',
      type: 'array',
      of: [{ type: 'string' }],
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: '🔴 Open', value: 'open' },
          { title: '🟡 In Progress', value: 'in_progress' },
          { title: '🟢 Resolved', value: 'resolved' },
          { title: '⚪ Ignored', value: 'ignored' },
        ],
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'assignedTo',
      title: 'Assigned To',
      type: 'string',
      description: 'Email or name of person assigned',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Add notes about fixing this issue',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'resolvedAt',
      title: 'Resolved At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      severity: 'severity',
    },
    prepare({ title, status, severity }: any) {
      const severityEmoji: Record<string, string> = {
        critical: '🔴',
        warning: '🟡',
        info: 'ℹ️',
      }

      return {
        title: title,
        subtitle: `${severityEmoji[severity] || 'ℹ️'} ${status || 'open'}`,
      }
    },
  },
})
