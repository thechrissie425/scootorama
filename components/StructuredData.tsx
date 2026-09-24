/**
 * StructuredData Component
 * Renders JSON-LD structured data in Next.js App Router
 */

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[]
}

export function StructuredData({ data }: StructuredDataProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  )
}
