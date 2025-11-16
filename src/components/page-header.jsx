export function PageHeader({
  title,
  description,
  badge,
  children,
  className = ""
}) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
              {badge}
            </div>
          )}

          {title && (
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {title}
            </h1>
          )}

          {description && (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          {children && (
            <div className="pt-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
