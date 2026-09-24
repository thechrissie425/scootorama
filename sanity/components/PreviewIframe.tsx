// sanity/components/PreviewIframe.tsx
import { Card, Text, Flex, Spinner } from '@sanity/ui'
import { useState } from 'react'
import { SanityDocument } from 'sanity'

interface PreviewProps {
  document: { displayed: SanityDocument }
  options?: { url?: (doc: SanityDocument) => string }
}

export default function PreviewIframe(props: PreviewProps) {
  const { document, options } = props
  const { displayed } = document
  const [loading, setLoading] = useState(true) // Track iframe load state

  // Resolve the URL
  const urlResolver = options?.url
  const url =
    typeof urlResolver === 'function'
      ? urlResolver(displayed)
      : 'http://localhost:3000'

  if (!url) {
    return (
      <Flex align="center" justify="center" height="fill">
        <Text>Missing Preview URL</Text>
      </Flex>
    )
  }

  return (
    <Card
      style={{ width: '100%', height: '100%', position: 'relative' }}
      tone="transparent"
    >
      {/* Optional: Keep the debug URL bar if you find it helpful, or delete this Card block */}
      <Card
        padding={2}
        tone="caution"
        style={{ fontSize: '12px', borderBottom: '1px solid #e6e8eb' }}
      >
        <Text size={0}>Previewing: {url}</Text>
      </Card>

      {/* 1. THE LOADING SPINNER (Uses Flex + Spinner) */}
      {loading && (
        <Flex
          align="center"
          justify="center"
          style={{
            position: 'absolute',
            top: '40px', // Push down below debug bar
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            zIndex: 1,
          }}
        >
          <Flex direction="column" align="center" gap={3}>
            <Spinner size={3} muted />
            <Text size={1} muted>
              Loading Preview...
            </Text>
          </Flex>
        </Flex>
      )}

      {/* 2. THE IFRAME */}
      <iframe
        src={url}
        onLoad={() => setLoading(false)} // Hides spinner when done
        style={{ width: '100%', height: 'calc(100% - 35px)', border: 'none' }}
      />
    </Card>
  )
}
