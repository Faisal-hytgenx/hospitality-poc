import { formatCurrency, formatPercentage } from '@/lib/calc';

export default function KPI({ title, value, subtitle, trend, type = 'number', icon }) {
  const formatValue = (val, type) => {
    switch (type) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
      default:
        return typeof val === 'number' ? val.toLocaleString() : val;
    }
  };

  const getTrendColor = (trend) => {
    if (!trend) return '';
    return trend > 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return '';
    return trend > 0 ? '↗️' : '↘️';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            {icon && <span className="text-2xl mr-3">{icon}</span>}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatValue(value, type)}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${getTrendColor(trend)}`}>
            <span className="mr-1">{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
