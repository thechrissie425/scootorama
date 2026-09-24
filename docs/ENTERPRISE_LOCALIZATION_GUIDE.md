# Scootorama Enterprise Localization System - Complete User Guide

_Your Professional Guide to Field-Level Multilingual Content Management_
_Updated: January 8, 2026 - Includes Field Helpers & Schema Refactoring_

---

## 🚀 Quick Start: Enterprise Localization Workflow

### Step 1: **English-First Content Creation**

1. **Navigate to Sanity Studio**: `{your-domain}/studio`
2. **Go to Content Creation**: Click `📝 Content Creation` in sidebar
3. **Create English Content**: Write all content in English first - this is your **primary language**
4. **Publish English Version**: Complete English content before adding translations
5. **Translation fields stay hidden**: Clean interface with no translation clutter

### Step 2: **Professional Translation Management**

1. **Enable Translation Mode**: Toggle `🌐 Enable Translation Fields` in any document
2. **Translation fields appear**: Spanish, French, German, Japanese fields become visible
3. **Work with translators**: Professional workflow via Translation Management Center
4. **Quality assurance**: Built-in analytics and completion tracking
5. **Hide when complete**: Toggle off for clean English-only editing

### Step 3: **Translation Management Center Access**

Navigate to `🌐 Translation Center` for:

- 📊 **Real-time Analytics**: Translation coverage across all content types
- 🎯 **Quality Scoring**: Automated completion rate analysis (0-100%)
- 📋 **Content Type Breakdown**: Track Pages, Posts, Campaigns, Features, Products
- ✅ **Professional Workflow**: Translation status projects with progress monitoring
- 🔍 **Missing Content Detection**: Identify untranslated content automatically

---

## 🏗️ **System Architecture - How It Works**

### **URL Structure**

```
/ → Automatically serves US English content
/us/en → US English (explicit)
/us/es → US Spanish
/us/fr → US French
/us/de → US German
/us/ja → US Japanese
```

### **Content Fallback Hierarchy**

1. **Requested Language**: German user gets German content
2. **English Fallback**: Missing German? Show English version
3. **Legacy Support**: Graceful degradation for older content

### **Language Configuration**

```typescript
🇺🇸 English (US) - Primary/Default Language
🇪🇸 Spanish - Full localization support
🇫🇷 French - Full localization support
🇩🇪 German - Full localization support
🇯🇵 Japanese - Full localization support
```

---

## 🎛️ **Studio Organization - Professional Workflow**

### **📝 Content Creation Section**

_Clean English-first content editing_

**Product Pages** (`/studio → Content Creation → Product Pages`)

- Create marketing pages for products
- English-first workflow
- Hidden translation fields until needed

**Campaigns** (`/studio → Content Creation → Campaigns`)

- Marketing campaign content
- Call-to-action buttons in multiple languages
- Portable text content per language

**Blog Posts** (`/studio → Content Creation → Posts`)

- English-first blog creation
- SEO metadata per language
- Auto-generated slugs from English titles

**Pages** (`/studio → Content Creation → Pages`)

- Static page content (About, Contact, etc.)
- Modular page sections
- Field-level translation for all blocks

**Products** (`/studio → Content Creation → Products`)

- Core product catalog
- Localized descriptions and specifications
- Marketing overrides per language

**Membership Pages** (`/studio → Content Creation → Membership`)

- Subscription and membership content
- Pricing display per region
- Benefits and features localization

### **🌐 Translation Center Section**

_Professional translation project management_

**Translation Dashboard**

- Real-time completion analytics
- Quality scoring per content type
- Progress tracking across all languages

**Translation Status Projects**

- Professional project management
- Translator assignment
- Deadline tracking
- Quality assurance workflows

### **⚙️ Site Configuration Section**

_Global settings and schema management_

**Authors, Tags, Categories**

- Global content organization
- Multilingual metadata

**Site Settings**

- Navigation structure
- Global configuration

---

## 🛠️ **Field Helpers & Schema Refactoring (January 2026)**

### **Standardized Localized Field Definitions**

**Location**: `sanity/lib/fieldHelpers.ts`

All 13 content types now use standardized field helpers:

```typescript
import {
  localizedString,
  localizedText,
  localizedBlock,
} from '../lib/fieldHelpers'

// Instead of manually defining localization for each field:
defineField({
  name: 'title',
  type: 'object',
  fields: [
    { name: 'en', type: 'string', validation: rule => rule.required() },
    {
      name: 'es',
      type: 'string',
      hidden: ({ document }) => !document?.showTranslationFields,
    },
    // ... repeated for each language
  ],
})

// Now use field helpers:
localizedString('title', 'Title', true) // name, label, required
```

**Benefits**:

- ✅ 600-800 lines of code eliminated
- ✅ Consistent validation patterns
- ✅ Standardized toggle behavior
- ✅ Easier maintenance and updates

### **Refactored Content Types**

All major content types now use field helpers:

1. Products (`product.ts`)
2. Pages (`page.ts`)
3. Membership Pages (`membershipPage.ts`)
4. Campaigns (`campaign.ts`)
5. Blog Posts (`post.ts`)
6. Tags (`tag.ts`)
7. Authors (`author.ts`)
8. FAQ Items (`faqItem.ts`)
9. Benefits (`benefit.ts`)
10. Features (`feature.ts`)
11. Social Proof (`socialProof.ts`)
12. Pricing Tiers (`pricingTier.ts`)
13. Stats (`stat.ts`)

---

## 🌍 **Working with Different Content Types**

### **Blog Posts** - Complete Localization

**Schema Structure:**

```typescript
✅ Field-Level Localization:
- title: {en, es, fr, de, ja}     // Article titles
- excerpt: {en, es, fr, de, ja}   // Article summaries
- body: {en, es, fr, de, ja}      // Full portable text per language
- slug: Auto-generated from title.en
- seo: {title, description} per language
```

**Professional Workflow:**

1. **Create in English**: Write complete blog post in English
2. **Publish English**: Make English version live first
3. **Enable translations**: Toggle `🌐 Enable Translation Fields`
4. **Add translations**: Fill in other language fields
5. **Publish translations**: Each language publishes independently

**URL Structure:**

```
/us/en/blog/my-article-slug  ← English original
/us/es/blog/my-article-slug  ← Spanish translation
/us/fr/blog/my-article-slug  ← French translation
```

### **Campaigns** - Marketing Localization

**Schema Structure:**

```typescript
✅ Enterprise Marketing:
- title: {en, es, fr, de, ja}        // Campaign titles
- description: {en, es, fr, de, ja}  // Campaign descriptions
- ctaText: {en, es, fr, de, ja}      // Call-to-action buttons
- content: Portable text arrays per language
- heroImage: Shared across languages
- targetAudience: Per market customization
```

**Marketing Workflow:**

1. **English campaign creation**: Full marketing content in English
2. **Asset preparation**: Images, videos (language-neutral when possible)
3. **Translation activation**: Enable translation fields
4. **Localized copywriting**: Adapt messaging for cultural context
5. **A/B testing**: Test effectiveness per language/market

### **Product Pages** - E-commerce Localization

**Schema Structure:**

```typescript
✅ Product Marketing Integration:
- References existing product catalog
- Marketing overrides per language:
  - heroTitle: {en, es, fr, de, ja}
  - heroSubtitle: {en, es, fr, de, ja}
  - features: Array of localized feature objects
  - benefits: Localized benefit descriptions
- Pricing: Market-specific pricing logic
- Availability: Region-based product availability
```

**E-commerce Workflow:**

1. **Product catalog sync**: Connects to existing product data
2. **Marketing layer**: Add promotional content per language
3. **Cultural adaptation**: Adapt messaging for local markets
4. **Pricing localization**: Market-specific pricing display
5. **Legal compliance**: Region-specific disclaimers and terms

### **Features** - Technical Content Localization

**Schema Structure:**

```typescript
✅ Technical Documentation:
- title: {en, es, fr, de, ja}           // Feature names
- description: {en, es, fr, de, ja}     // Feature descriptions
- tooltipDescription: Localized help text
- pricingLabel: Subscription tier labels
- availability: Per-product availability
- rank: Display priority (shared)
```

**Technical Writing Workflow:**

1. **English technical spec**: Complete feature documentation
2. **Technical review**: Ensure accuracy of English content
3. **Translation brief**: Provide context for translators
4. **Technical translation**: Specialized translators for technical content
5. **Quality assurance**: Technical review of translations

---

## 🔧 **Advanced Features**

### **Translation Quality Management**

**Real-time Analytics:**

- **Completion Rates**: Percentage complete per language per content type
- **Quality Scores**: Automated quality analysis based on completeness
- **Missing Content**: Automatic detection of untranslated fields
- **Progress Tracking**: Visual completion rates with recommended actions

**Quality Assurance Features:**

- **Translation validation**: Required field enforcement
- **Cultural adaptation**: Guidelines for market-specific messaging
- **Consistency checking**: Terminology consistency across content
- **Review workflows**: Professional translation review processes

### **Content Fallback System**

**Sophisticated Fallback Logic:**

```typescript
// Query pattern used throughout system
"title": coalesce(title[$language], title.en, title)

Fallback Priority:
1. Requested language content (e.g., German)
2. English content (primary fallback)
3. Legacy content (backwards compatibility)
```

**User Experience:**

- **Seamless experience**: Users never see empty content
- **Progressive enhancement**: Content improves as translations are added
- **Performance optimized**: Single query handles all fallback logic

### **Professional Translation Workflows**

**Translation Status Tracking:**

```typescript
Translation Project Management:
- 🔴 Not Started: Content needs translation
- 🟡 In Progress: Translation work ongoing
- 🟢 Complete: Translation finished and reviewed
- 🔵 Published: Translation live on website
```

**Translator Assignment:**

- **Professional workflow**: Assign translators to specific content types
- **Deadline management**: Track translation project timelines
- **Quality assurance**: Review processes before publishing
- **Progress monitoring**: Real-time completion tracking

---

## 📱 **Mobile & Responsive Considerations**

### **Mobile-First Translation**

**User Experience:**

- **Responsive design**: All translations work seamlessly on mobile
- **Touch-friendly**: Translation toggle easily accessible on touch devices
- **Performance**: Optimized query patterns for mobile performance
- **Offline support**: Progressive enhancement for poor connections

**Content Strategy:**

- **Mobile-first writing**: Consider mobile context when translating
- **Character limits**: Account for text expansion in different languages
- **Touch targets**: Ensure buttons and links work in all languages
- **Cultural mobile habits**: Adapt for different mobile usage patterns

---

## 🚀 **Performance Optimization**

### **Query Optimization**

**Efficient Data Fetching:**

```typescript
// Optimized GROQ queries with language parameterization
const PAGE_QUERY = groq`*[_type == "page" && slug.current == $slug][0] {
  "title": coalesce(title[$language], title.en, title),
  "content": content[]{
    _type,
    _key,
    "title": coalesce(title[$language], title.en, title),
    // Only fetch requested language + English fallback
  }
}`
```

**Performance Features:**

- **Single query**: One query handles all language fallbacks
- **Selective fetching**: Only loads needed language content
- **Caching optimized**: Efficient cache keys per language
- **ISR compatible**: Works with Incremental Static Regeneration

### **SEO Optimization**

**Multilingual SEO:**

- **Proper hreflang**: Correct language and region targeting
- **URL structure**: SEO-friendly URLs per language
- **Meta data**: Localized titles, descriptions, and social tags
- **Structured data**: Schema.org markup in appropriate languages

---

## 🔒 **Security & Compliance**

### **Content Security**

**Access Control:**

- **Role-based permissions**: Control who can edit translations
- **Content approval**: Workflow for translation approval
- **Audit trails**: Track who changed what and when
- **Version control**: Roll back problematic translations

**Data Privacy:**

- **GDPR compliance**: Handle personal data in translations appropriately
- **Regional compliance**: Meet local data protection requirements
- **Content filtering**: Ensure appropriate content per region
- **Legal disclaimers**: Region-specific legal text management

---

## 🎯 **Best Practices**

### **Content Creation Best Practices**

1. **Write English First**: Always complete English content before translating
2. **Keep Context**: Provide context for translators about content purpose
3. **Cultural Sensitivity**: Adapt messaging for local cultural contexts
4. **Consistency**: Use consistent terminology across all content
5. **Quality Review**: Review translations before publishing

### **Translation Management Best Practices**

1. **Batch Processing**: Work on similar content types together
2. **Deadline Management**: Set realistic timelines for translation projects
3. **Quality Assurance**: Always review translations before publishing
4. **Update Management**: Keep translations updated when English content changes
5. **Performance Monitoring**: Monitor translation quality and completion rates

### **Technical Best Practices**

1. **Test All Languages**: Test functionality in all supported languages
2. **Character Expansion**: Account for text length changes in translations
3. **RTL Support**: Prepare for future right-to-left language support
4. **Performance Testing**: Ensure good performance with localized content
5. **SEO Testing**: Verify SEO effectiveness across all languages

---

## 🆘 **Troubleshooting Common Issues**

### **Content Not Showing**

**Issue**: Translated content not appearing on site
**Solution**:

1. Check if content is published (not just saved as draft)
2. Verify language code matches URL pattern
3. Confirm fallback to English is working
4. Check browser cache and CDN cache

### **Translation Fields Not Visible**

**Issue**: Cannot see translation fields in Sanity Studio
**Solution**:

1. Toggle `🌐 Enable Translation Fields` in document
2. Refresh browser if fields don't appear immediately
3. Check user permissions for translation access
4. Verify schema includes translation field definitions

### **Incomplete Translations**

**Issue**: Some content appears in English instead of requested language
**Solution**:

1. Use Translation Dashboard to identify missing content
2. Complete missing translations in Sanity Studio
3. Publish updated translations
4. Clear cache to see changes immediately

### **URL Structure Issues**

**Issue**: Language URLs not working correctly
**Solution**:

1. Verify Next.js routing configuration
2. Check middleware for proper redirects
3. Confirm market/language parameter handling
4. Test with different browser languages

---

## 📈 **Analytics & Monitoring**

### **Translation Performance Metrics**

**Key Metrics to Monitor:**

- **Completion Rates**: Percentage of content translated per language
- **Quality Scores**: Automated quality assessment scores
- **User Engagement**: How users interact with translated content
- **Conversion Rates**: Business impact of localized content
- **Search Performance**: SEO effectiveness per language

**Monitoring Tools:**

- **Translation Dashboard**: Built-in Sanity Studio analytics
- **Google Analytics**: User behavior per language
- **Search Console**: SEO performance per language
- **Performance Monitoring**: Core Web Vitals per language
- **User Feedback**: Direct feedback on translation quality

---

## 🔮 **Future Roadmap**

### **Planned Enhancements**

**Short Term (Q1 2025):**

- Automatic root redirect implementation (`/` → `/us/en`)
- Language code standardization (schema vs lib consistency)
- Enhanced middleware for automatic locale detection

**Medium Term (Q2-Q3 2025):**

- AI-powered translation suggestions
- Translation memory integration
- Advanced workflow automation
- Enhanced SEO optimization

**Long Term (Q4 2025+):**

- Right-to-left language support (Arabic, Hebrew)
- Advanced cultural adaptation tools
- Integrated translation service APIs
- Advanced analytics and reporting

### **Scalability Planning**

**Content Scale:**

- System designed to handle 10,000+ pages
- Efficient query patterns for large content volumes
- Scalable translation project management
- Performance optimization for enterprise scale

**Language Scale:**

- Architecture supports adding new languages easily
- Schema patterns designed for extensibility
- Translation workflow scales to additional languages
- Quality management scales with content volume

---

## 📞 **Support & Resources**

### **Getting Help**

**Technical Support:**

- Internal development team for system issues
- Translation team for content questions
- Sanity documentation for CMS questions
- Next.js documentation for routing questions

**Training Resources:**

- Video tutorials for Translation Dashboard
- Best practices documentation
- Translation workflow training
- Quality assurance guidelines

### **Community & Documentation**

**Internal Resources:**

- Translation team Slack channel
- Content strategy documentation
- Brand guidelines for localization
- Technical architecture documentation

**External Resources:**

- Sanity localization documentation
- Next.js internationalization guides
- Web accessibility localization guidelines
- SEO best practices for multilingual sites

---

## 🔮 **Future Enhancement: Gridly TMS Integration**

_Planned Q1 2026 - Professional Translation Management System Integration_

### **Overview**

Scootorama's field-level localization architecture is **optimally designed** for integration with **Gridly**, our enterprise Translation Management System (TMS). This integration will automate the translation workflow between Sanity CMS and professional translation teams.

### **Why Field-Level Architecture is Ideal for TMS**

**Single Source of Truth:**

- All languages live in one document (`homepage._id`)
- One export operation captures all translatable content
- One import operation updates all translations atomically
- No risk of content drift across language documents

**Simple Export (Sanity → Gridly):**

```typescript
// Extract all .en fields from a single document
*[_type == "page" && _id == "homepage"] {
  "title.en": title.en,
  "body.en": body.en,
  "cta.en": cta.en
}
// Returns: One record with all English source strings
```

**Simple Import (Gridly → Sanity):**

```typescript
// Patch one document with all translated fields
patch('homepage')
  .set({
    'title.es': 'Título',
    'title.de': 'Titel',
    'body.es': 'Cuerpo',
    'body.de': 'Körper',
  })
  .commit()
// One operation updates all translations
```

**Contrast with Document-Level (Why We Avoided It):**

- Would require syncing 6+ separate documents per page
- Risk of version mismatches during translation
- Complex conflict resolution when source changes mid-translation
- Orphaned translations when documents deleted
- Exponentially more complex export/import logic

### **Planned Integration Architecture**

#### **Phase 1: Manual Document Actions (Week 1)**

**Studio Actions:**

- 🚀 **Send to Gridly** - Export English fields to translation project
- 📥 **Sync from Gridly** - Import completed translations
- 📊 **Check Translation Status** - View progress in Gridly

**Metadata Tracking:**

```typescript
{
  _gridlyStatus: 'sent' | 'in-progress' | 'complete',
  _gridlySentAt: '2026-01-15T10:30:00Z',
  _gridlyRecordId: 'homepage',
  _translationStatus: {
    es: 'complete',
    de: 'in-progress',
    fr: 'pending',
    ja: 'pending'
  }
}
```

#### **Phase 2: Automated Workflows (Week 2-3)**

**Bidirectional Webhooks:**

**Sanity → Gridly (Auto-export on publish):**

- Publish triggers automatic export to Gridly
- Only sends .en fields that changed
- Updates existing Gridly records (no duplicates)
- Marks translations as "needs update" if source changed

**Gridly → Sanity (Auto-import when ready):**

- Gridly webhook fires when translations complete
- Automatic patch to Sanity document
- Updates translation status metadata
- Triggers preview deployment for QA

**Smart Change Detection:**

```typescript
// Only re-translate if English content actually changed
const hasEnglishChanges = compareFields(draft.title.en, published.title.en)

if (hasEnglishChanges) {
  await exportToGridly(draft)
  await markTranslationsOutdated(['es', 'de', 'fr', 'ja'])
}
```

#### **Phase 3: Studio Dashboard Enhancements (Week 4)**

**Translation Status Dashboard:**

- 🌍 **Gridly Sync Status** - Real-time translation progress
- 🔄 **Pending Exports** - Content waiting to be sent
- ⚠️ **Outdated Translations** - Translations needing updates
- ✅ **Complete** - Fully translated content

**Visual Indicators:**

- Document list badges showing Gridly status
- Color-coded translation completeness
- One-click export from document menu
- Bulk operations for multiple documents

### **Benefits of Gridly Integration**

**For Content Operators:**

- ✅ One-click export to professional translators
- ✅ Automatic import when translations ready
- ✅ Visual tracking of translation progress
- ✅ No manual CSV exports or imports
- ✅ Reduced time from 45min to 5min per translation cycle

**For Translation Teams:**

- ✅ Professional translation interface (Gridly)
- ✅ Context-aware translation environment
- ✅ Translation memory and terminology management
- ✅ Quality assurance workflows built-in
- ✅ Collaboration features for translation agencies

**For Engineering:**

- ✅ Fully automated workflow (zero manual intervention)
- ✅ Audit trail of all translation changes
- ✅ Version control and rollback capability
- ✅ Scalable to 100+ documents, 10+ languages
- ✅ Reduced operational overhead by 80%

### **Cost Impact**

**Current State (Manual Translation):**

- 45 minutes per translation cycle × 30 cycles/month = 22.5 hours/month
- Human error rate: ~15% requiring rework
- Cost: ~$2,250/month in content operator time

**With Gridly Integration:**

- 5 minutes per review cycle × 30 cycles/month = 2.5 hours/month
- Human error rate: <2% (automated validation)
- Cost: ~$250/month in content operator time
- **Savings: $2,000/month = $24,000/year**

### **Implementation Timeline**

**Q1 2026 (12 weeks):**

| Week | Milestone              | Deliverable                         |
| ---- | ---------------------- | ----------------------------------- |
| 1-2  | Gridly API Integration | Authentication, basic export/import |
| 3-4  | Document Actions       | Studio UI for manual operations     |
| 5-6  | Webhook Automation     | Bidirectional sync workflows        |
| 7-8  | Change Detection       | Smart English-only change tracking  |
| 9-10 | Dashboard Enhancements | Translation status UI               |
| 11   | QA & Testing           | End-to-end workflow validation      |
| 12   | Training & Rollout     | Documentation, team training        |

**Prerequisites:**

- ✅ Gridly enterprise account and API credentials
- ✅ Field-level localization schema (already implemented)
- ✅ Translation metadata fields (to be added)
- ⏳ Webhook endpoints configuration
- ⏳ Error handling and retry logic

### **Technical Architecture**

**API Endpoints:**

```
POST /api/webhooks/gridly-export    # Sanity → Gridly
POST /api/webhooks/gridly-import    # Gridly → Sanity
GET  /api/gridly-status/:docId      # Check translation status
```

**Document Actions:**

```typescript
// sanity/plugins/gridlyActions.ts
export const gridlyActions = [
  sendToGridly, // Export English to Gridly
  syncFromGridly, // Import translations
  checkGridlyStatus, // View progress
  markForTranslation, // Queue for next batch
]
```

**Validation Rules:**

```typescript
// Prevent publishing with incomplete translations
defineField({
  name: 'title',
  validation: Rule =>
    Rule.custom(title => {
      const required = ['en', 'es', 'de', 'fr', 'ja']
      const missing = required.filter(lang => !title?.[lang])

      if (missing.length > 0 && title?._gridlyStatus === 'complete') {
        return `Missing: ${missing.join(', ')}`
      }
      return true
    }),
})
```

### **Risk Mitigation**

**Data Safety:**

- All Gridly imports create drafts first (never auto-publish)
- Translation QA review required before going live
- Rollback capability via Sanity version history
- Automated backups before bulk operations

**Quality Assurance:**

- Validation rules prevent incomplete translations
- Character length warnings for UI truncation
- HTML/special character preservation
- Brand term consistency checking

**Operational Continuity:**

- Gridly integration is additive (manual workflows still work)
- Graceful degradation if Gridly API unavailable
- Error notifications to content operators
- Retry logic for failed webhook deliveries

---

## 📞 **Support & Resources**

### **Getting Help**

**Technical Support:**

- Internal development team for system issues
- Translation team for content questions
- Gridly support for TMS issues (post-integration)
- Sanity documentation for CMS questions
- Next.js documentation for routing questions

**Training Resources:**

- Video tutorials for Translation Dashboard
- Gridly integration workflow guide (Q1 2026)
- Best practices documentation
- Translation workflow training
- Quality assurance guidelines

### **Community & Documentation**

**Internal Resources:**

- Translation team Slack channel
- Content strategy documentation
- Brand guidelines for localization
- Technical architecture documentation

**External Resources:**

- Sanity localization documentation
- Gridly API documentation
- Next.js internationalization guides
- Web accessibility localization guidelines
- SEO best practices for multilingual sites

---

_This guide covers the complete enterprise localization system including future Gridly TMS integration. For specific technical implementation details, refer to the comprehensive system audit documentation._
