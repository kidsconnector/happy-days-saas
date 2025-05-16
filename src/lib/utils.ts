import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, format, differenceInYears, addDays } from 'date-fns';

/**
 * Combine and merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format a date in a specified format
 */
export function formatDate(date: string | Date, dateFormat = 'MMM dd, yyyy'): string {
  return format(new Date(date), dateFormat);
}

/**
 * Calculate age based on birthdate
 */
export function calculateAge(birthdate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthdate));
}

/**
 * Calculate next birthday date
 */
export function getNextBirthdayDate(birthdate: string | Date): Date {
  const today = new Date();
  const birth = new Date(birthdate);
  
  let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  return nextBirthday;
}

/**
 * Calculate days until next birthday
 */
export function getDaysUntilBirthday(birthdate: string | Date): number {
  const nextBirthday = getNextBirthdayDate(birthdate);
  const today = new Date();
  const diffTime = nextBirthday.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine if child has upcoming birthday within specified days
 */
export function hasUpcomingBirthday(birthdate: string | Date, days: number): boolean {
  const daysUntil = getDaysUntilBirthday(birthdate);
  return daysUntil <= days && daysUntil > 0;
}

/**
 * Parse JWT without external libraries
 */
export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

/**
 * Generate template variables for email templates
 */
export function generateTemplateVariables(child: any, business: any, event?: any) {
  const age = calculateAge(child.birthdate);
  
  return {
    child_name: child.name,
    parent_name: child.parentName,
    child_age: age.toString(),
    child_age_next: (age + 1).toString(),
    business_name: business.businessName,
    event_name: event?.name || 'Birthday',
    days_until: getDaysUntilBirthday(child.birthdate).toString(),
  };
}

/**
 * Replace template variables in content
 */
export function replaceTemplateVariables(content: string, variables: Record<string, string>) {
  let result = content;
  
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
  });
  
  return result;
}