/**
 * Simple spam filter for comments
 * Checks for common spam patterns and suspicious content
 */

interface SpamCheckResult {
  isSpam: boolean;
  reason?: string;
  score: number; // 0-100, higher = more likely spam
}

/**
 * Check if a comment is likely spam
 */
export function checkForSpam(data: {
  authorName: string;
  authorEmail: string;
  content: string;
  ipAddress?: string;
}): SpamCheckResult {
  let score = 0;
  const reasons: string[] = [];

  const { authorName, authorEmail, content } = data;

  // Check 1: Excessive links (more than 3 links is suspicious)
  const linkCount = (content.match(/https?:\/\//gi) || []).length;
  if (linkCount > 3) {
    score += 40;
    reasons.push(`Excessive links (${linkCount})`);
  } else if (linkCount > 1) {
    score += 15;
  }

  // Check 2: Suspicious keywords
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'poker', 'lottery', 'prize',
    'click here', 'buy now', 'limited time', 'act now',
    'weight loss', 'make money', 'work from home', 'free money',
    'crypto', 'bitcoin investment', 'forex', 'trading signals'
  ];
  
  const lowerContent = content.toLowerCase();
  const foundKeywords = spamKeywords.filter(keyword => lowerContent.includes(keyword));
  if (foundKeywords.length > 0) {
    score += foundKeywords.length * 20;
    reasons.push(`Spam keywords: ${foundKeywords.join(', ')}`);
  }

  // Check 3: Excessive capitalization (more than 50% caps)
  const capsCount = (content.match(/[A-Z]/g) || []).length;
  const lettersCount = (content.match(/[a-zA-Z]/g) || []).length;
  if (lettersCount > 0 && capsCount / lettersCount > 0.5) {
    score += 25;
    reasons.push('Excessive capitalization');
  }

  // Check 4: Very short content (less than 10 characters)
  if (content.trim().length < 10) {
    score += 20;
    reasons.push('Very short content');
  }

  // Check 5: Suspicious email patterns
  const suspiciousEmailDomains = [
    'tempmail', 'throwaway', 'guerrillamail', 'mailinator',
    '10minutemail', 'fakeinbox'
  ];
  
  const emailDomain = authorEmail.split('@')[1]?.toLowerCase() || '';
  if (suspiciousEmailDomains.some(domain => emailDomain.includes(domain))) {
    score += 30;
    reasons.push('Temporary email address');
  }

  // Check 6: Name contains URLs
  if (/https?:\/\//i.test(authorName)) {
    score += 35;
    reasons.push('URL in name field');
  }

  // Check 7: Repeated characters (e.g., "aaaaaaa" or "!!!!!!")
  if (/(.)\1{6,}/.test(content)) {
    score += 20;
    reasons.push('Repeated characters');
  }

  // Check 8: All numbers in name
  if (/^\d+$/.test(authorName.trim())) {
    score += 15;
    reasons.push('Name is all numbers');
  }

  // Determine if spam based on score
  const isSpam = score >= 50;

  return {
    isSpam,
    score,
    reason: reasons.length > 0 ? reasons.join('; ') : undefined,
  };
}

/**
 * Check if an IP address has submitted too many comments recently
 * (Basic rate limiting check)
 */
export function checkRateLimit(
  ipAddress: string | undefined,
  recentComments: Array<{ ipAddress?: string; createdAt: Date }>
): boolean {
  if (!ipAddress) return false;

  // Count comments from this IP in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentFromIp = recentComments.filter(
    comment => 
      comment.ipAddress === ipAddress && 
      new Date(comment.createdAt) > oneHourAgo
  );

  // More than 5 comments in an hour is suspicious
  return recentFromIp.length > 5;
}
