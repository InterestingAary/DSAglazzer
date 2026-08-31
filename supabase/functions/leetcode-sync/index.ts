// Supabase Edge Function for LeetCode Sync
// Deploy with: supabase functions deploy leetcode-sync

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncRequest {
  token: string;
  userId: string;
}

interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  statusDisplay: string;
  lang: string;
  timestamp: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token, userId }: SyncRequest = await req.json();

    if (!token || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing token or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's connected account
    const { data: account } = await supabase
      .from('connected_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', 'leetcode')
      .single();

    if (!account) {
      return new Response(
        JSON.stringify({ error: 'LeetCode account not connected' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use provided token or stored token
    const leetcodeToken = token || account.access_token;
    if (!leetcodeToken) {
      return new Response(
        JSON.stringify({ error: 'No LeetCode token available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user profile to get username
    const profileResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${leetcodeToken}`,
      },
      body: JSON.stringify({
        query: `
          query getCurrentUser {
            user {
              username
              profile {
                userSlug
              }
            }
          }
        `,
      }),
    });

    const profileData = await profileResponse.json();
    const username = profileData.data?.user?.username;

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Invalid LeetCode token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch solved problems
    const submissionsResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `LEETCODE_SESSION=${leetcodeToken}`,
      },
      body: JSON.stringify({
        query: `
          query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
              id
              title
              titleSlug
              statusDisplay
              lang
              timestamp
            }
          }
        `,
        variables: { username, limit: 100 },
      }),
    });

    const submissionsData = await submissionsResponse.json();
    const submissions: LeetCodeSubmission[] = submissionsData.data?.recentAcSubmissionList || [];

    let newImported = 0;
    let duplicatesSkipped = 0;

    for (const sub of submissions) {
      // Check if problem exists in our database
      const { data: existingProblem } = await supabase
        .from('problems')
        .select('id')
        .eq('slug', sub.titleSlug)
        .single();

      let problemId: string;

      if (existingProblem) {
        problemId = existingProblem.id;
      } else {
        // Fetch problem details
        const problemResponse = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query questionData($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                  title
                  titleSlug
                  difficulty
                  topicTags { name slug }
                  acRate
                  paidOnly
                  content
                }
              }
            `,
            variables: { titleSlug: sub.titleSlug },
          }),
        });

        const problemData = await problemResponse.json();
        const question = problemData.data?.question;

        if (!question || question.paidOnly) continue;

        // Create problem in database
        const { data: newProblem, error: problemError } = await supabase
          .from('problems')
          .insert({
            title: question.title,
            slug: question.titleSlug,
            difficulty: question.difficulty,
            topics: question.topicTags.map((t: { name: string }) => t.name),
            acceptance_rate: question.acRate,
            description: question.content,
          })
          .select('id')
          .single();

        if (problemError) {
          console.error('Error creating problem:', problemError);
          continue;
        }

        problemId = newProblem.id;

        // Create problem source
        await supabase
          .from('problem_sources')
          .insert({
            problem_id: problemId,
            platform: 'leetcode',
            platform_problem_id: sub.id,
            platform_slug: sub.titleSlug,
            url: `https://leetcode.com/problems/${sub.titleSlug}/`,
            is_canonical: true,
          });
      }

      // Check if user already has this problem
      const { data: existingUserProblem } = await supabase
        .from('user_problems')
        .select('id')
        .eq('user_id', userId)
        .eq('problem_id', problemId)
        .single();

      if (existingUserProblem) {
        duplicatesSkipped++;
        continue;
      }

      // Get topic from tags
      const topic = sub.titleSlug.includes('array') ? 'Arrays' : 'Arrays'; // TODO: better mapping

      // Create user problem
      const { error: upError } = await supabase
        .from('user_problems')
        .insert({
          user_id: userId,
          problem_id: problemId,
          status: 'solved',
          difficulty: sub.statusDisplay === 'Accepted' ? 'Easy' : 'Medium', // TODO: get actual difficulty
          topic: topic,
          solved_at: new Date(sub.timestamp * 1000).toISOString(),
          attempts: 1,
          solved_languages: [sub.lang],
          source_platform: 'leetcode',
          source_submission_id: sub.id,
        });

      if (!upError) {
        newImported++;

        // Create revision card
        await supabase
          .from('revision_cards')
          .upsert({
            user_id: userId,
            problem_id: problemId,
            ease_factor: 2.5,
            interval_days: 1,
            repetitions: 0,
            next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            retention: 100,
            status: 'learning',
          }, { onConflict: 'user_id,problem_id' });

        // Log activity
        await supabase
          .from('activities')
          .insert({
            user_id: userId,
            type: 'import',
            title: `Imported from LeetCode`,
            detail: `${sub.title}`,
            problem_id: problemId,
            difficulty: 'Easy',
          });
      }
    }

    // Update connected account
    await supabase
      .from('connected_accounts')
      .update({
        last_synced_at: new Date().toISOString(),
        last_sync_status: 'completed',
        last_sync_count: newImported,
      })
      .eq('user_id', userId)
      .eq('platform', 'leetcode');

    return new Response(
      JSON.stringify({ newImported, duplicatesSkipped, totalFetched: submissions.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});