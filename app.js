import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials integrated directly
const supabaseUrl = 'https://sajakdazfndrqwfdlzqp.supabase.co' // Ka sanya url ɗinka anan idan ya bambanta, ko ka barshi idan yana daidai da na pro ɗinka
const supabaseKey = 'sb_publishable_hA9oc89Gcg1M7KoH08fJAQ_BJDb6GeM'
const supabase = createClient(supabaseUrl, supabaseKey)

// 1. Initialize user when Telegram Mini App opens
async function initUser() {
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    if (!user) {
        console.log("Telegram user not found.");
        return;
    }

    const telegramId = user.id;
    const username = user.username || user.first_name;

    // Check if user already exists in Supabase
    let { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

    if (!existingUser) {
        const startParam = tg.initDataUnsafe?.start_param;
        let referredBy = null;

        if (startParam && startParam.startsWith('ref_')) {
            referredBy = parseInt(startParam.replace('ref_', ''));
        }

        // Create new user account with 0 ZVR balance
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
                { 
                    telegram_id: telegramId, 
                    username: username, 
                    balance_zvr: 0, 
                    referred_by: referredBy,
                    level: 1,
                    daily_streak: 0
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error("Error creating user account:", insertError);
        } else {
            console.log("New user account created successfully with 0 ZVR!");
            if (referredBy) {
                await giveReferralBonus(referredBy);
            }
        }
    } else {
        console.log("User already exists:", existingUser);
        updateUI(existingUser.balance_zvr);
    }
}

// 2. Give referral bonus (+5,000 ZVR)
async function giveReferralBonus(referrerId) {
    let { data: referrer } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', referrerId)
        .single();

    if (referrer) {
        const newBalance = (referrer.balance_zvr || 0) + 5000;
        await supabase
            .from('users')
            .update({ balance_zvr: newBalance })
            .eq('telegram_id', referrerId);
    }
}

// 3. Create Club restriction (Requires minimum 10,000 ZVR)
async function createClub(clubName) {
    const tg = window.Telegram?.WebApp;
    const telegramId = tg?.initDataUnsafe?.user?.id;

    if (!telegramId) return;

    let { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

    if (!user) return;

    if (user.balance_zvr < 10000) {
        alert("You need at least 10,000 ZVR to create a Club!");
        return;
    }

    const { error } = await supabase
        .from('clubs')
        .insert([
            { club_name: clubName, creator_id: telegramId, members_count: 1 }
        ]);

    if (error) {
        alert("Error creating club.");
    } else {
        alert("Club created successfully!");
    }
}

// 4. Update UI with balance
function updateUI(balance) {
    const balanceElement = document.getElementById('zvr-balance');
    if (balanceElement) {
        balanceElement.innerText = balance.toLocaleString();
    }
}

// Run initialization on load
window.onload = initUser;
