export function Button({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}) {
  const baseClass = 'px-4 py-2 rounded font-medium transition disabled:opacity-50'
  const variantClass = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'

  return (
    <button className={`${baseClass} ${variantClass}`} {...props}>
      {children}
    </button>
  )
}
