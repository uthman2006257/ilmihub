module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const username = (req.query.username || 'OPERATOR').toUpperCase();
  const action = req.query.action || 'home';

  try {
    // Sabuntawa domin tabbatar da aiki cikin sauki da gaggawa
    if (action === 'home' || action === 'get_user') {
      return res.status(200).json({
        success: true,
        project: "ZAVQERO",
        userProfile: {
          username: username,
          balanceZVR: 150.00,
          level: 1,
          dailyStreak: 2
        }
      });
    }

    if (action === 'checkin' || action === 'mine') {
      const addAmount = action === 'mine' ? 10 : 50;
      return res.status(200).json({
        success: true,
        message: action === 'mine' ? "Mining reward added!" : "Daily check-in successful!",
        rewardClaimed: `+${addAmount} ZVR`,
        newBalance: 150.00 + addAmount,
        currentStreak: 3
      });
    }

    return res.status(404).json({ success: false, error: "Action not found." });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
