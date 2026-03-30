import Icon from './Icon'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  isPopular?: boolean
  popularBadgeText?: string
  buttonText: string
  buttonVariant?: 'primary' | 'secondary' | 'disabled'
  className?: string
  onClick?: () => void
}

export default function PricingCard({
  name,
  price,
  period = '/ 월',
  description,
  features,
  isPopular = false,
  popularBadgeText = '인기',
  buttonText,
  buttonVariant = 'secondary',
  className = '',
  onClick,
}: PricingCardProps) {
  const isPrimary = buttonVariant === 'primary' || isPopular
  const isDisabled = buttonVariant === 'disabled'

  const buttonClass = isDisabled
    ? 'flex h-12 w-full cursor-not-allowed items-center justify-center rounded-xl bg-[#f3f4f6] text-sm font-bold text-[#9ca3af] dark:bg-gray-800 dark:text-gray-600'
    : isPrimary
    ? 'flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg'
    : 'flex h-12 w-full items-center justify-center rounded-xl border border-[#e5e7eb] bg-slate-100 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:border-gray-600 dark:bg-transparent dark:text-white dark:hover:bg-gray-800'

  return (
    <div
      className={`relative flex flex-col gap-6 rounded-2xl border bg-white p-6 shadow-sm dark:bg-[#1a2632] lg:p-8 transition-shadow hover:shadow-md ${
        isPopular ? 'scale-105 border-2 border-primary shadow-lg ring-4 ring-primary/5 z-10' : 'border-[#e5e7eb] dark:border-gray-700'
      } ${className}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold text-white shadow-sm">
          {popularBadgeText}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className={`text-lg font-bold ${isPopular ? 'text-primary' : 'text-[#111418] dark:text-white'}`}>{name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl lg:text-4xl font-black tracking-tight text-[#111418] dark:text-white">{price}</span>
          <span className="text-sm font-bold text-[#637588] dark:text-gray-400">{period}</span>
        </div>
        {description && <p className="text-sm text-[#637588] dark:text-gray-400">{description}</p>}
      </div>
      
      <div className="mt-4 flex flex-col gap-3 flex-1">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm font-medium text-[#111418] dark:text-gray-200">
            <Icon name="check_circle" className={`text-[20px] ${isPopular ? 'text-primary' : 'text-[#637588] dark:text-gray-500'}`} />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-4">
        <button className={buttonClass} disabled={isDisabled} onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  )
}
