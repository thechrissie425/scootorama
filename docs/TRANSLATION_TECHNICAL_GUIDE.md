# 🔧 Translation System - Technical Implementation Guide

_Comprehensive technical documentation of the OpenAI-powered translation system_
_Updated: January 8, 2026_

---

## 🏗️ **System Architecture**

### **Tech Stack**

- **Frontend:** Next.js 16.1.1 with TypeScript and React 19
- **CMS:** Sanity Studio v5 with field-level localization
- **Schema:** Field helpers system for standardized localized fields
- **AI Provider:** OpenAI GPT-3.5-turbo
- **Fallback:** Google Translate API + Mock translations
- **Storage:** Sanity documents with multilingual fields

### **Translation Strategy: Field-Level Localization**

Instead of creating separate documents for each language, we store translations as fields within the same document:

```typescript
// Document structure
{
  _id: "product-kick-stand",
  _type: "product",
  title: {
    en: "Kick-Stand Trainer",
    de: "Kick-Stand Trainer",
    fr: "Entraîneur Kick-Stand",
    es: "Entrenador Kick-Stand",
    ja: "Scootorama ハブトレーナー"
  },
  description: {
    en: "Smart trainer for indoor scootering",
    de: "Smart-Trainer für Indoor-Rollerfahren",
    // ... other languages
  }
}
```

**Benefits:**

- Single source of truth per content item
- No duplicate document management
- Clean CMS interface
- Atomic updates across languages

---

## 🚀 **API Endpoints**

### **Primary Translation API**

`POST /api/auto-translate`

**Individual Document Translation:**

```json
{
  "documentId": "product-kick-stand",
  "fromLanguage": "en",
  "targetLanguages": ["de", "fr", "es", "ja"],
  "provider": "openai",
  "overwriteExisting": false
}
```

**Batch Translation:**

```json
{
  "type": "product",
  "batchSize": 10,
  "provider": "openai"
}
```

**Response:**

```json
{
  "success": true,
  "documentId": "product-kick-stand",
  "translations": {
    "de": { "title": "...", "description": "..." },
    "fr": { "title": "...", "description": "..." }
  },
  "updated": true,
  "fieldsUpdated": 4
}
```

### **Management APIs**

- `GET /api/list-documents?type=product` - List documents by type
- `POST /api/cleanup-translations` - Remove old duplicate documents
- `GET /api/check-old-translations` - Audit old translation system

---

## 🤖 **OpenAI Integration**

### **Translation Function**

```typescript
async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text from ${from} to ${to}. Maintain the tone and context. For product/marketing content, keep it engaging and natural. Return only the translated text, no explanations.`,
        },
        { role: 'user', content: text },
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for consistent translations
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content.trim()
}
```

### **Error Handling & Quotas**

```typescript
// Quota detection
if (
  response.status === 429 ||
  errorData?.error?.type === 'insufficient_quota'
) {
  console.error('🚫 OpenAI quota exceeded')
  // Fallback to mock translations or queue for later
}

// Response validation
if (!data.choices || !data.choices[0] || !data.choices[0].message) {
  throw new Error('Invalid OpenAI API response structure')
}
```

---

## 📝 **Content Processing**

### **Field Detection**

The system automatically detects translatable fields:

```typescript
const TRANSLATABLE_FIELDS = [
  'title',
  'description',
  'content',
  'summary',
  'name',
  'headline',
  'tagline',
  'callToAction',
]

function isTranslatableField(fieldName: string, value: any): boolean {
  if (!TRANSLATABLE_FIELDS.some(field => fieldName.includes(field)))
    return false
  if (typeof value !== 'string') return false
  if (value.length < 3) return false
  if (/^https?:\/\//.test(value)) return false // Skip URLs
  return true
}
```

### **Document Processing Pipeline**

1. **Fetch Document** from Sanity
2. **Extract Translatable Fields** based on field names and content
3. **Check Existing Translations** (skip if exists and not overwriting)
4. **Batch Translation Requests** to OpenAI
5. **Update Document** with new translations
6. **Revalidate Cache** for instant frontend updates

---

## 🔄 **Batch Processing**

### **Translation Script**

```bash
npm run translate  # Translates all content types
```

**Configuration:**

```javascript
const CONTENT_TYPES = ['page', 'product', 'campaign', 'blogPost']
const TARGET_LANGUAGES = ['de', 'fr', 'es', 'ja']
const BATCH_SIZE = 3 // Avoid rate limits
const DELAY_BETWEEN_BATCHES = 2000ms
```

**Processing Logic:**

1. Check server health
2. Fetch documents by type
3. Process in small batches (rate limit protection)
4. Report success/failure rates
5. Wait between batches to avoid quota exhaustion

---

## 🌐 **Supported Languages**

```typescript
const SUPPORTED_LANGUAGES = [
  'en', // English (source)
  'de', // German
  'fr', // French
  'es', // Spanish
  'ja', // Japanese
  'ko', // Korean
  'zh', // Chinese (Simplified)
  'it', // Italian
  'pt', // Portuguese
  'nl', // Dutch
  // ... 90+ more supported by OpenAI
]
```

---

## 🎛️ **Web Interface**

### **Translation Manager** (`/translation-manager`)

- Individual document translation
- Bulk translation by content type
- Progress tracking
- Error reporting
- Provider selection (OpenAI/Google/Mock)

### **Translation QA** (`/translation-qa`)

- Review translated content
- Approve/reject translations
- Preview translated pages
- Access Sanity Studio for editing
- Cleanup old translation documents

---

## 🔧 **Environment Configuration**

### **Required Environment Variables**

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_write_token

# OpenAI (Primary translator)
OPENAI_API_KEY=sk-proj-your-openai-key

# Google Translate (Fallback - Optional)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
```

### **OpenAI Pricing & Limits**

- **Model:** GPT-3.5-turbo
- **Cost:** ~$0.0015 per 1K tokens (~750 words)
- **Rate Limits:** 3 RPM (free tier) → 3,500 RPM (paid tier)
- **Quality:** Professional-level translations

---

## 📊 **Monitoring & Analytics**

### **Error Tracking**

```typescript
// Detailed error logging for troubleshooting
console.log('🔍 OpenAI API response structure:', JSON.stringify(data, null, 2))

// Quota monitoring
if (error.type === 'insufficient_quota') {
  // Alert system administrators
  // Switch to fallback provider
  // Queue translations for later
}
```

### **Success Metrics**

- Translation success/failure rates
- Cost per translation
- Processing time per document
- API quota usage
- Field-level translation coverage

---

## 🛡️ **Fallback Systems**

### **1. Google Translate API**

```typescript
if (process.env.GOOGLE_TRANSLATE_API_KEY) {
  // Use Google Translate as fallback
  // Lower quality but more predictable costs
}
```

### **2. Mock Translations**

```typescript
// For development and quota emergencies
return `[MOCK-${to.toUpperCase()}] ${text}`
```

### **3. Graceful Degradation**

- Site continues working if translation API fails
- Original English content shown as fallback
- Translation queue for retry when service restored

---

## 🚦 **Production Deployment Checklist**

- [ ] **OpenAI API Key** configured with paid account
- [ ] **Sanity write token** configured
- [ ] **Rate limiting** configured for batch jobs
- [ ] **Error monitoring** set up
- [ ] **Backup translation provider** configured
- [ ] **Translation review workflow** established
- [ ] **Cache invalidation** working
- [ ] **Multi-language routing** tested

---

## 🔄 **Maintenance Tasks**

### **Regular**

- Monitor OpenAI quota usage
- Review translation quality
- Update batch processing schedules
- Clear old placeholder translations

### **Periodic**

- Audit translation coverage
- Update supported languages
- Optimize batch sizes based on usage patterns
- Review and update translation prompts

---

## 🐛 **Common Issues & Solutions**

### **OpenAI Quota Exceeded**

```bash
Error: "You exceeded your current quota"
Solution: Upgrade OpenAI account or switch to mock translations
```

### **Translation Not Appearing**

```bash
Issue: Translations saved but not showing on site
Solution: Check cache invalidation and revalidateTag calls
```

### **Poor Translation Quality**

```bash
Issue: Translations don't match brand voice
Solution: Update system prompt with specific brand guidelines
```

### **Rate Limiting**

```bash
Issue: Too many API calls too quickly
Solution: Increase delays between batches, reduce batch size
```

---

## 📈 **Scaling Considerations**

### **Current Capacity**

- **Free Tier:** ~50-100 translations/day
- **Paid Tier:** ~50,000+ translations/day
- **Processing Time:** ~2-5 seconds per field

### **Scale Optimization**

- **Batch Processing:** Group similar content types
- **Caching:** Store translations to avoid re-translation
- **Queue System:** Handle large translation jobs asynchronously
- **CDN:** Cache translated pages for performance

---

## 🔗 **API Documentation**

### **Rate Limits**

- OpenAI: 3 RPM (free) → 3,500 RPM (paid)
- Sanity: 10 writes/second
- Internal batching: 3 documents/batch, 2s delay

### **Error Codes**

- `400` - Invalid request parameters
- `404` - Document not found
- `429` - Rate limit exceeded
- `500` - OpenAI API error or quota exceeded

### **Response Times**

- Individual document: ~10-30 seconds
- Batch (10 documents): ~2-5 minutes
- Full site translation: ~10-30 minutes

This system provides enterprise-grade translation capabilities at consumer-grade costs, with comprehensive error handling and scaling capabilities.

---

## 🤔 Translation System Unknowns

The automation works, but several questions remain unanswered:

**Translation Quality:**

- How accurate are GPT-3.5-turbo translations vs. professional human translators?
- Are there domain-specific terms (scootering, fitness) where AI struggles?
- What's the error rate that requires manual review?
- Do translations maintain brand voice across markets?

**Cost at Scale:**

- What's the actual monthly cost when translating 1,000+ documents?
- Is GPT-3.5-turbo sufficient or do we need GPT-4 for quality?
- Should we negotiate enterprise pricing with OpenAI?
- What happens if OpenAI raises prices 2-3×?

**Cultural Adaptation:**

- Does the system handle cultural nuances (e.g., German formality)?
- Can it adapt marketing messaging for different markets?
- Are there idioms or phrases that don't translate well?
- Should we add market-specific review workflows?

**Workflow Integration:**

- Do content editors trust AI translations or always double-check?
- What's the feedback loop when translations are incorrect?
- Should we add a "flag for review" feature?
- How do we track translation quality over time?

**Reliability & Fallbacks:**

- How often does the OpenAI API actually fail in production?
- Is Google Translate fallback good enough or does quality drop noticeably?
- What happens when both services are down?
- Should we cache translations to reduce API dependency?

**Legal & Compliance:**

- Are AI translations legally sufficient for terms of service, privacy policies?
- Do we need human verification for regulatory content?
- What's our liability if translations are incorrect or misleading?
- Should we add disclaimers that content is AI-translated?

**Future Scaling:**

- Can this system handle 20+ markets (not just current 6)?
- What about right-to-left languages (Arabic, Hebrew)?
- Should we add translation memory to avoid re-translating unchanged content?
- Is there a point where hiring translators is cheaper than API costs?

These questions can only be answered through real-world usage, user feedback, and iterative improvement.
