import { Event } from '@prisma/client'

/**
 * Generate an ICS file content for an event
 */
export function generateICS(event: Event): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escape = (str: string): string => {
    return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Relocation Quest//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape([event.category, event.venue, event.address].filter(Boolean).join(' - '))}`,
    event.venue ? `LOCATION:${escape([event.venue, event.address].filter(Boolean).join(', '))}` : '',
    `UID:${event.id}@relocation-quest`,
    `DTSTAMP:${formatDate(new Date())}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.filter(Boolean).join('\r\n')
}
