// Initialization da haɗin Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const SUPABASE_URL = 'https://sajakdazfndrqwfdlzqp.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_hA9oc89Gcg1M7KoH08fJAQ_BJDb6GeM'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Telegram WebApp User Data
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
let telegramId = user ? user.id : null;
let username = user ? user.username || user.first_name : 'Guest';

// UI Elements & State
let balance = 0;

async function initUser() {
    if (!telegramId) {
        // Idan ana gwadawa a browser ta al'ada (ba a Telegram ba)
        telegramId = 123456789; 
    }

    // Duba ko mai amfani yana cikin Supabase
    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

    if (!data) {
        // Idan sabon user ne, sai mu ƙirƙira shi a Supabase
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
                telegram_id: telegramId, 
                username: username, 
                balance_zvr: 0, 
                level: 1, 
                daily_streak: 1 
            }]);
            
        if (insertError) console.error("Kuskure wajen ƙirƙirar user:", insertError);
    } else {
        balance = data.balance_zvr;
        updateUI();
    }
}

// Aikin Mining (Latsawa domin tara ZVR)
async function claimMining() {
    balance += 10; // Ƙarin ZVR 10 a kowane click
    updateUI();

    // Adana sabon balance a Supabase
    const { error } = await supabase
        .from('users')
        .update({ balance_zvr: balance })
        .eq('telegram_id', telegramId);

    if (error) {
        console.error("Kuskure wajen adana mining:", error);
    }
}

// Daily Check-in Logic
async function dailyCheckIn() {
    let { data } = await supabase
        .from('users')
        .select('daily_streak, balance_zvr')
        .eq('telegram_id', telegramId)
        .single();

    if (data) {
        let newStreak = (data.daily_streak || 0) + 1;
        let newBalance = data.balance_zvr + 50; // Ladar daily check-in
        
        balance = newBalance;
        updateUI();

        await supabase
            .from('users')
            .update({ daily_streak: newStreak, balance_zvr: newBalance })
            .eq('telegram_id', telegramId);
            
        alert("An ba da ladarka ta yau! +50 ZVR");
    }
}

function updateUI() {
    const balanceElement = document.getElementById('balance-display');
    if (balanceElement) {
        balanceElement.innerText = balance + " ZVR";
    }
}

// Tura aiki yayin shigowa
window.onload = () => {
    initUser();
    
    // Haɗa maɓallan HTML ɗinka da waɗannan ayyukan
    const mineBtn = document.getElementById('mine-btn');
    if (mineBtn) mineBtn.onclick = claimMining;

    const checkinBtn = document.getElementById('checkin-btn');
    if (checkinBtn) checkinBtn.onclick = dailyCheckIn;
};
