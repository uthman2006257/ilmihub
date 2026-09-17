const { createClient } = require('@supabase/supabase-js');

// Amfani da Environment Variables domin tsaro
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Tabbatar an ɗauki ainihin ID ko suna ta yadda asusun mutane ba zasu haɗu ba
  const username = (req.query.username || req.query.id || 'USER_' + Math.floor(Math.random() * 1000000)).toUpperCase();
  const action = req.query.action || 'home';

  try {
    let { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (!currentUser) {
      let { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ username: username, balance_zvr: 100.00, level: 1, daily_streak: 1 }])
        .select()
        .single();

      if (insertError) throw insertError;
      currentUser = newUser;
    }

    if (action === 'home' || action === 'get_user') {
      return res.status(200).json({
        success: true,
        project: "ZAVQERO",
        userProfile: {
          username: currentUser.username,
          balanceZVR: Number(currentUser.balance_zvr || 0),
          level: currentUser.level || 1,
          dailyStreak: currentUser.daily_streak || 0
        }
      });
    }

    if (action === 'checkin' || action === 'mine') {
      const addAmount = action === 'mine' ? 10 : 50;
      const newBalance = Number(currentUser.balance_zvr || 0) + addAmount;
      const newStreak = (currentUser.daily_streak || 0) + 1;

      await supabase
        .from('users')
        .update({ balance_zvr: newBalance, daily_streak: newStreak, last_checkin: new Date() })
        .eq('username', username);

      return res.status(200).json({
        success: true,
        message: action === 'mine' ? "Mining reward added!" : "Daily check-in successful!",
        rewardClaimed: `+${addAmount} ZVR`,
        newBalance: newBalance,
        currentStreak: newStreak
      });
    }

    return res.status(404).json({ success: false, error: "Action not found." });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
