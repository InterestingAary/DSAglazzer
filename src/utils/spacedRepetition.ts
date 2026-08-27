// SM-2 Spaced Repetition Algorithm
// Based on SuperMemo-2 by P.A. Wozniak

export interface SM2Result {
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number;
}

/**
 * Calculate next review schedule using SM-2 algorithm
 * @param quality - Rating 0-5 (0=complete blackout, 5=perfect)
 * @param currentEase - Current ease factor (default 2.5)
 * @param currentInterval - Current interval in days
 * @param currentRepetitions - Number of successful repetitions
 */
export function calculateSM2(
  quality: number,
  currentEase: number = 2.5,
  currentInterval: number = 0,
  currentRepetitions: number = 0
): SM2Result {
  let ease = currentEase;
  let interval = currentInterval;
  let repetitions = currentRepetitions;

  if (quality < 0) quality = 0;
  if (quality > 5) quality = 5;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions += 1;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return { ease, interval, repetitions, nextReview };
}

/**
 * Map user rating to SM-2 quality score
 */
export function ratingToQuality(rating: 'again' | 'hard' | 'good' | 'mastered'): number {
  switch (rating) {
    case 'again': return 1;
    case 'hard': return 3;
    case 'good': return 4;
    case 'mastered': return 5;
    default: return 0;
  }
}

/**
 * Get urgency level based on how overdue a review is
 */
export function getUrgency(nextReview: number): 'overdue' | 'due' | 'upcoming' | 'ok' {
  const now = Date.now();
  const diff = nextReview - now;
  const day = 24 * 60 * 60 * 1000;

  if (diff < -day * 3) return 'overdue';
  if (diff < 0) return 'due';
  if (diff < day * 2) return 'upcoming';
  return 'ok';
}

/**
 * Calculate retention percentage (decays over time since last review)
 */
export function calculateRetention(ease: number, interval: number, lastReview: number): number {
  const daysSinceReview = (Date.now() - lastReview) / (24 * 60 * 60 * 1000);
  const retention = Math.exp(-daysSinceReview / (interval * ease)) * 100;
  return Math.max(0, Math.min(100, Math.round(retention)));
}
