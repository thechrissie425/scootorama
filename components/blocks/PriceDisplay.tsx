// components/PriceDisplay.tsx

type Props = {
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  locale?: string; // e.g. 'en-US', 'de-DE', 'ja-JP'
};

export default function PriceDisplay({ amount, currency, locale = 'en-US' }: Props) {
  // This native browser API handles EVERYTHING:
  // - Symbols ($ vs ¥)
  // - Position (Symbol left vs right)
  // - Decimals (2 for USD, 0 for JPY)
  // - Separators (Comma vs Dot)
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    // Optional: Remove .00 if you want clean integers for round numbers
    minimumFractionDigits: currency === 'JPY' ? 0 : 0, 
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  });

  return <span>{formatter.format(amount)}</span>;
}