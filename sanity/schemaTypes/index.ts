import { type SchemaTypeDefinition } from 'sanity'

// Documents
import page from './page'
import post from './post'
import author from './author'
import campaign from './campaign'
import product from './product'
import pricingTier from './pricingTier'
import membershipPage from './membershipPage'
import socialProof from './socialProof'
import tag from './tag'
import feature from './feature'
import benefit from './benefit'
import stat from './stat'
import faqItem from './faqItem'
import sticker from './sticker'
import siteSettings from './siteSettings'
import productPage from './productPage'
import translationStatus from './translationStatus'
import validationTask from './validationTask'
import takeoverTheme from './takeoverTheme'
import takeoverActivation from './takeoverActivation'
import route from './route'
import instagramVideoCard from './instagramVideoCard'
import campaignExperience from './campaignExperience'
import persona from './persona'
import fitnessGoal from './fitnessGoal'

// Objects
import hero from './objects/hero'
import navItem from './objects/navItem'
import featureGrid from './objects/featureGrid'
import carousel from './objects/carousel'
import contentDisplay from './objects/contentDisplay'
import pricingBlock from './objects/pricingBlock'
import firecracker from './objects/firecracker'
import river from './objects/river'
import socialProofSection from './objects/socialProofSection'
import link from './objects/link'
import seo from './objects/seo'
import faqSection from './objects/faqSection'
import statsGrid from './objects/statsGrid'
import tabs from './objects/tabs'
import smartNumber from './objects/smartNumber'
import productGrid from './objects/productGrid'
import heroSplit from './objects/heroSplit'
import heroProduct from './objects/heroProduct'
import techSpec from './objects/techSpec'
import whoIsItFor from './objects/whoIsItFor'
import inlineIcon from './objects/inlineIcon'
import enhancedImage from './objects/enhancedImage'
import instagramVideoGrid from './objects/instagramVideoGrid'
import experienceScene from './objects/experienceScene'
import benefitsSection from './objects/benefitsSection'
import goalsSection from './objects/goalsSection'
import transformationTabs from './objects/transformationTabs'
import featuresByCategory from './objects/featuresByCategory'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    hero,
    siteSettings,
    navItem,
    product,
    featureGrid,
    carousel,
    contentDisplay,
    feature,
    pricingTier,
    pricingBlock,
    sticker,
    firecracker,
    river,
    tag,
    socialProof,
    socialProofSection,
    campaign,
    membershipPage,
    post,
    author,
    link,
    seo,
    faqItem,
    faqSection,
    stat,
    statsGrid,
    benefit,
    tabs,
    smartNumber,
    productGrid,
    heroSplit,
    heroProduct,
    techSpec,
    whoIsItFor,
    inlineIcon,
    enhancedImage,
    instagramVideoGrid,
    productPage,
    translationStatus,
    validationTask,
    takeoverTheme,
    takeoverActivation,
    route,
    instagramVideoCard,
    campaignExperience,
    experienceScene,
    benefitsSection,
    goalsSection,
    transformationTabs,
    featuresByCategory,
    persona,
    fitnessGoal,
  ],
}
