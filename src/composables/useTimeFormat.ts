import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears
} from 'date-fns'
import { useI18n } from 'vue-i18n'

export const useTimeFormat = () => {
  const { t } = useI18n()

  const formatTime = (time) => {
    const now = new Date()
    const date = new Date(time)
    const diffInSeconds = differenceInSeconds(now, date)
    const diffInMinutes = differenceInMinutes(now, date)
    const diffInHours = differenceInHours(now, date)
    const diffInDays = differenceInDays(now, date)
    const diffInWeeks = differenceInWeeks(now, date)
    const diffInMonths = differenceInMonths(now, date)
    const diffInYears = differenceInYears(now, date)

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
