'use client'

import React from 'react'
import { PortableText } from '@portabletext/react'
import type { TypedObject } from '@portabletext/types'

interface TechnicalSpecsProps {
  specs: TypedObject[] | null
}

export default function TechnicalSpecs({ specs }: TechnicalSpecsProps) {
  // If no specs provided, don't render the component
  if (!specs || specs.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-900 to-black relative z-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display uppercase text-white mb-4 tracking-tight">
            Technical Specifications
          </h2>
          <p className="text-gray-400 text-lg">
            Engineered for fun, built for the wackiest indoor ride on Earth
          </p>
        </div>

        <div className="space-y-4">
          {/* Use PortableText for actual specs */}
          <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 p-6">
            <div className="prose prose-invert prose-lg max-w-none">
              <PortableText value={specs} />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 pt-8 border-t border-neutral-700/50">
          <p className="text-gray-400 mb-4">
            Need more detailed specifications?
          </p>
          <button className="bg-brand-primary hover:bg-brand-primary-dark text-white px-6 py-3 rounded-full font-heading-bold transition-colors duration-200">
            Download Full Spec Sheet
          </button>
        </div>
      </div>
    </section>
  )
}
