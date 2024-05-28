import { useI18n } from 'vue-i18n'

export const useTimeFormat = () => {
  const { t } = useI18n()

  const formatTime = (time: string | number | Date) => {
    const now = new Date().getTime()
    const date = new Date(time).getTime()
    const diffInSeconds = Math.floor((now - date) / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${t('time.secondsAgo')}`
    } else if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? t('time.minuteAgo') : `${diffInMinutes} ${t('time.minutesAgo')}`
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? t('time.hourAgo') : `${diffInHours} ${t('time.hoursAgo')}`
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? t('time.dayAgo') : `${diffInDays} ${t('time.daysAgo')}`
    } else if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? t('time.weekAgo') : `${diffInWeeks} ${t('time.weeksAgo')}`
    } else if (diffInMonths < 12) {
      return diffInMonths === 1 ? t('time.monthAgo') : `${diffInMonths} ${t('time.monthsAgo')}`
    } else {
      return diffInYears === 1 ? t('time.yearAgo') : `${diffInYears} ${t('time.yearsAgo')}`
    }
  }

  return {
    formatTime
  }
}
