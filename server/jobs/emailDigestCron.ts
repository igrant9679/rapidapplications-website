import cron from 'node-cron';
import { generateWeeklyDigest } from '../emailDigest';
import { notifyOwner } from '../_core/notification';

/**
 * Email Digest Cron Job
 * Runs every Monday at 9:00 AM to send weekly digest to subscribers
 * Cron expression: '0 9 * * 1' = At 09:00 on Monday
 */

let cronJob: any | null = null;

export function startEmailDigestCron() {
  // Run every Monday at 9:00 AM
  cronJob = cron.schedule('0 9 * * 1', async () => {
    console.log('[Email Digest Cron] Starting weekly digest generation...');
    
    try {
      const result = await generateWeeklyDigest();
      
      if (result.success) {
        const count = result.subscriberCount || 0;
        const posts = result.postCount || 0;
        console.log(`[Email Digest Cron] Successfully generated digest for ${count} subscribers`);
        
        // Notify owner about digest completion
        await notifyOwner({
          title: 'Weekly Email Digest Generated',
          content: `The weekly email digest was successfully generated for ${count} active subscribers.\n\nPosts included: ${posts}\n\nTime: ${new Date().toLocaleString()}`,
        });
      } else {
        console.error('[Email Digest Cron] Failed to generate digest:', result.message);
        
        // Notify owner about failure
        await notifyOwner({
          title: 'Weekly Email Digest Failed',
          content: `The weekly email digest failed to generate.\n\nError: ${result.message}\n\nTime: ${new Date().toLocaleString()}`,
        });
      }
    } catch (error) {
      console.error('[Email Digest Cron] Error in digest generation:', error);
      
      // Notify owner about error
      try {
        await notifyOwner({
          title: 'Weekly Email Digest Error',
          content: `An error occurred while generating the weekly email digest.\n\nError: ${error instanceof Error ? error.message : String(error)}\n\nTime: ${new Date().toLocaleString()}`,
        });
      } catch (notifyError) {
        console.error('[Email Digest Cron] Failed to send error notification:', notifyError);
      }
    }
  });

  console.log('[Email Digest Cron] Started - will run every Monday at 9:00 AM EST');
}

export function stopEmailDigestCron() {
  if (cronJob) {
    cronJob.stop();
    console.log('[Email Digest Cron] Stopped');
  }
}

// For testing: run digest immediately
export async function runDigestNow() {
  console.log('[Email Digest] Manual trigger - running digest now...');
  
  try {
    const result = await generateWeeklyDigest();
    
    if (result.success) {
      const count = result.subscriberCount || 0;
      console.log(`[Email Digest] Successfully generated digest for ${count} subscribers`);
      return { success: true, message: `Digest generated for ${count} subscribers` };
    } else {
      console.error('[Email Digest] Failed to generate digest:', result.message);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error('[Email Digest] Error in digest generation:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
