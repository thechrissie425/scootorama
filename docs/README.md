# Scootorama Next-Gen Documentation

_Updated: February 19, 2026_

This directory contains comprehensive documentation and guides for the Scootorama Next-Gen project, covering everything from schema design to localization implementation, schema refactoring, and Shopify integration.

## 📋 Documentation Index

### 🏗️ **Architecture & System Design**

- [**REPLATFORM_STRATEGY_BRIEF.md**](./REPLATFORM_STRATEGY_BRIEF.md) - Strategy brief for the replatforming conversation: content-model argument, audience segmentation thesis, framework portability analysis
- [**ARCHITECTURE_GUIDE.md**](./ARCHITECTURE_GUIDE.md) - Complete "idiot's guide" to understanding the entire system architecture
- [**COMPREHENSIVE_APPLICATION_AUDIT.md**](./COMPREHENSIVE_APPLICATION_AUDIT.md) - Complete application architecture and performance audit
- [**SCHEMA_AUDIT.md**](./SCHEMA_AUDIT.md) - Content schema analysis for Universal ContentDisplay System

### 🌐 **Localization & Translation**

- [**ENTERPRISE_LOCALIZATION_GUIDE.md**](./ENTERPRISE_LOCALIZATION_GUIDE.md) - Complete guide for field-level localization implementation
- [**TRANSLATION_AUTOMATION_IMPLEMENTATION.md**](./TRANSLATION_AUTOMATION_IMPLEMENTATION.md) - Translation automation and workflow management
- [**TRANSLATION_TECHNICAL_GUIDE.md**](./TRANSLATION_TECHNICAL_GUIDE.md) - Technical implementation guide

### 📦 **Content & Components**

- [**CONTENT_BLOCK_GUIDE.md**](./CONTENT_BLOCK_GUIDE.md) - Guide to building pages with persona-driven blocks (NEW)
- [**PERSONA_CONTENT_STRATEGY.md**](./PERSONA_CONTENT_STRATEGY.md) - Persona-driven content strategy guide (NEW)
- [**STARTER_CONTENT.md**](./STARTER_CONTENT.md) - Complete content library (6 personas, 6 goals, 8 benefits, 23 features) (NEW)
- [**UNIVERSAL_CONTENTDISPLAY_GUIDE.md**](./UNIVERSAL_CONTENTDISPLAY_GUIDE.md) - Universal content display system guide
- [**FIRECRACKER_OPTIMIZATION_REPORT.md**](./FIRECRACKER_OPTIMIZATION_REPORT.md) - Firecracker component optimization report
- [**CAMPAIGN_BRANDING_GUIDE.md**](./CAMPAIGN_BRANDING_GUIDE.md) - Campaign branding and customization guide

### 🛠️ **Development & Integration**

- [**DESIGN_SYSTEM_WORKFLOW.md**](./DESIGN_SYSTEM_WORKFLOW.md) - Runbook: Figma token sync, design-to-component process, Code Connect (NEW)
- [**COMPONENT_GENERATOR.md**](./COMPONENT_GENERATOR.md) - Automated block component generation (saves 30-60 min/component)
- [**PRE_COMMIT_HOOKS.md**](./PRE_COMMIT_HOOKS.md) - Pre-commit quality checks with Husky and lint-staged
- [**CONTENT_VALIDATION.md**](./CONTENT_VALIDATION.md) - Automated content validation with Sanity task integration
- [**STRUCTURED_DATA_GUIDE.md**](./STRUCTURED_DATA_GUIDE.md) - Schema.org JSON-LD implementation for SEO (NEW)
- [**SHADCN_INTEGRATION_STATUS.md**](./SHADCN_INTEGRATION_STATUS.md) - Shadcn/UI component integration status
- [**SHOPIFY_INTEGRATION_INSIGHTS.md**](./SHOPIFY_INTEGRATION_INSIGHTS.md) - Shopify integration architecture
- [**CLIENT_SERVER_AUDIT.md**](./CLIENT_SERVER_AUDIT.md) - Client/server architecture and security audit
- [**IMAGE_PERFORMANCE_OPTIMIZATIONS.md**](./IMAGE_PERFORMANCE_OPTIMIZATIONS.md) - Image optimization strategies

### 📋 **Planning & Roadmap**

- [**PRODUCTION_READINESS_TIMELINE.md**](./PRODUCTION_READINESS_TIMELINE.md) - Production launch timeline and requirements
- [**FEET_INCHES_INPUT_GUIDE.md**](./FEET_INCHES_INPUT_GUIDE.md) - Measurement input patterns

### 📚 **Archived Documentation**

Outdated or superseded documentation moved to [**archive/**](./archive/) folder:

- PRODUCT_MIGRATION_GUIDE.md (outdated plugin-based i18n)
- LOCALIZATION_AUDIT_COMPREHENSIVE.md (superseded by ENTERPRISE_LOCALIZATION_GUIDE.md)
- DEMO_ANALYSIS_COMPREHENSIVE.md (time-specific demo prep)
- TRANSLATION_BUSINESS_GUIDE.md (generic business case)
- HOW_TO_WRITE_TECH_SPECS.md (generic guide)
- FeaturesCarousel-Usage-Example.tsx (code example)

## 🚀 **Quick Start**

For new developers joining the project:

1. **Start with**: [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) for visual system overview and "big picture"
2. **Then read**: [COMPREHENSIVE_APPLICATION_AUDIT.md](./COMPREHENSIVE_APPLICATION_AUDIT.md) for detailed technical architecture
3. **Then review**: [ENTERPRISE_LOCALIZATION_GUIDE.md](./ENTERPRISE_LOCALIZATION_GUIDE.md) for localization patterns
4. **Reference**: [SCHEMA_AUDIT.md](./SCHEMA_AUDIT.md) for content structure understanding

## 🔄 **Recently Updated (February 2026)**

- **NEW: Persona-Driven Content Architecture** - Complete content system with personas, goals, benefits, features
- **NEW: Page Block Components** - GoalsSection, BenefitsSection, TransformationTabs, FeaturesByCategory
- **NEW: Content Guides** - CONTENT_BLOCK_GUIDE.md, PERSONA_CONTENT_STRATEGY.md, STARTER_CONTENT.md
- **SCHEMA_AUDIT.md** - Updated with persona, goal, benefit, feature schemas
- **ARCHITECTURE_GUIDE.md** - Updated with persona-driven content patterns

## 🎯 **System Status Overview**

- ✅ **Sanity Studio v5**: Upgraded from v3.63.0 to v5.2.0
- ✅ **Next.js 16**: Updated to 16.1.6 with React 19
- ✅ **Persona-Driven Content** (NEW): Personas, goals, benefits, features with cross-references
- ✅ **Page Block Components** (NEW): GoalsSection, BenefitsSection, TransformationTabs, FeaturesByCategory
- ✅ **Schema Refactoring**: 17 schemas with field helpers and emotional targeting
- ✅ **SEO Metadata**: Standardized across all content types
- ✅ **Field-Level Localization**: Implemented with toggle controls
- ✅ **Translation Automation**: Enterprise-grade workflow system
- ✅ **Universal Content Display**: Supports all content types
- ✅ **Multi-Market Routing**: Complete market/language routing
- ✅ **Shopify Integration**: Live pricing and inventory
- ✅ **Component System**: Scootorama design system + shadcn/ui
- ✅ **Quality Automation**: Pre-commit hooks, content validation, SEO/translation audits

---

_This documentation is maintained as part of the Scootorama Next-Gen project and updated regularly to reflect the current system state._
