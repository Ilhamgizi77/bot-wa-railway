const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const googleTTS = require('google-tts-api');
const userConfigFile = './userconfig.json';
let userCoins = {};
let claimedTime = {};
let userInventory = {};
let userLastFishingTime = {};
let userFishCount = {}

if (fs.existsSync(userConfigFile)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigFile));

  // Initialize missing properties if not present
  userCoins = userConfig.userCoins || {};
  claimedTime = userConfig.claimedTime || {};
  userInventory = userConfig.userInventory || {};  
  userLastFishingTime = userConfig.userLastFishingTime || {};
  userFishCount = userConfig.userFishCount || {};
}

const fishData = {
  biasa: [
    { name: "Makarel", price: 10 },
    { name: "Gabus", price: 15 },
    { name: "Mas", price: 20 },
    { name: "Udang", price: 12 },
    { name: "Nila", price: 25 },
    { name: "Gurame", price: 30 },
    { name: "Lele", price: 18 },
    { name: "Bawal", price: 22 },
    { name: "Ikan Kerapu", price: 35 }
  ],
  stabil: [
    { name: "Tuna Sirip Kuning", price: 50 },
    { name: "Hiu Ginsu", price: 80 },
    { name: "Cumi-cumi Raksasa", price: 100 },
    { name: "Hiu Paus", price: 200 },
    { name: "Ikan Napoleon", price: 120 },
    { name: "Ikan Kakap", price: 150 },
    { name: "Ikan Belanak", price: 130 },
    { name: "Makarel", price: 10 },
    { name: "Gabus", price: 15 },
    { name: "Mas", price: 20 },
    { name: "Udang", price: 12 },
    { name: "Nila", price: 25 },
    { name: "Gurame", price: 30 },
    { name: "Lele", price: 18 },
    { name: "Bawal", price: 22 },
    { name: "Ikan Kerapu", price: 35 }
  ],
  super: [
    { name: "Mosasaurus", price: 1000 },
    { name: "Megalodon", price: 1500 },
    { name: "Ikan Arapaima", price: 2000 },
    { name: "Ikan Beluga", price: 2500 },
    { name: "Ikan Sturgeon", price: 3000 },
    { name: "Tuna Sirip Kuning", price: 50 },
    { name: "Hiu Ginsu", price: 80 },
    { name: "Cumi-cumi Raksasa", price: 100 },
    { name: "Hiu Paus", price: 200 },
    { name: "Makarel", price: 10 },
    { name: "Gabus", price: 15 },
    { name: "Mas", price: 20 },
    { name: "Udang", price: 12 },
    { name: "Nila", price: 25 },
    { name: "Gurame", price: 30 },
    { name: "Lele", price: 18 },
    { name: "Bawal", price: 22 },
    { name: "Ikan Kerapu", price: 35 },
    { name: "Ikan Napoleon", price: 120 },
    { name: "Ikan Kakap", price: 150 },
    { name: "Ikan Belanak", price: 130 },
    { name: "Sepatu", price: 5},
    { name: "Sepatu", price: 6},
    { name: "Sepatu", price: 7}
  ]
};


const shopItems = [
  { id: 1, name: 'Pancingan Biasa', price: 10, description: 'Pancingan biasa untuk menangkan ikan-ikan yang harganya tidak seberapa.' },
  { id: 2, name: 'Pancingan Stabil', price: 50, description: 'Pancingan Stabil, Bagus untuk menangkan ikan yang besar dan harganya yang mahal.' },
  { id: 3, name: 'Pancingan Super', price: 300, description: 'Pancingan super, Sangat bagus untuk menangkap ikan yang beratnya ratusan-ribuan kilogram dan harganya yang sangat mahal.' }
];


// Group and allowed number settings
let id = [
  "120363374625480499@g.us",
  "120363357573486906@g.us",
  "120363393093596905@g.us"
];
const allowedNumber = "6289510305764@c.us";
let message = "P";
let blacklisted = "6288985231746@c.us";
let clientInstance;

function createClient() {
  venom.create({
    session: 'botwa',
    multidevice: true,
    headless: 'new',
  })
  .then((client) => {
    clientInstance = client;
    start(client);
  })
  .catch((err) => {
    console.log('Error saat membuat sesi:', err);
    setTimeout(createClient, 5000);
  });
}


// Fungsi untuk mendapatkan ikan berdasarkan tipe rod
function getRandomFish(rodType) {
  let fishCategory;
  if (rodType === "super") {
    fishCategory = fishData.super;
  } else if (rodType === "stabil") {
    fishCategory = fishData.stabil;
  } else {
    fishCategory = fishData.biasa;
  }

  // Pilih ikan secara acak dari kategori yang sesuai
  const randomFish = fishCategory[Math.floor(Math.random() * fishCategory.length)];
  return randomFish;
}


function restartClient() {
  if (clientInstance) {
    console.log("Restarting bot...");
    clientInstance.close().then(() => {
      console.log("Bot stopped. Restarting...");
      createClient();
    });
  }
}

function getCurrentTime() {
  return Date.now();
}

function formatTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  seconds %= 60;
  minutes %= 60;
  return `${hours} jam ${minutes} menit ${seconds} detik`;
}

function saveUserConfig() {
  const userConfig = {
    userCoins,
    claimedTime,
    userInventory,
    userLastFishingTime,
    userFishCount,
  };
  fs.writeFileSync(userConfigFile, JSON.stringify(userConfig, null, 2));
}


function start(client) {
  id.forEach((groupId) => {
    client.sendText(groupId, message);
  });

  client.onMessage(async (message) => {
    try {
      if (message.sender.id === blacklisted) {
        return;
      }
      else if (message.body === '.menu') {
        const Ids = message.sender.id;
        const currentTime = new Date();
       const options = {
       timeZone: 'Asia/Jakarta', // Zona waktu WIB
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       hour12: false
  };
  
  const timeInWIB = new Intl.DateTimeFormat('id-ID', options).format(currentTime);

        const menuText = `Hai ${Ids}\n` +
                         `Kamu Ngechat Jam : ${timeInWIB}\n` +
                         `✨ *Menu Bot* ✨\n` +
                         `.menu\n` +
                         `.fish\n` +
                         `.sell\n` +
                         `.myinven\n` +
                         `.says <pesan>\n` +
                         `.tts <teks>\n` +
                         `.love <nama 1> <nama 2>\n` +
                         `.groupid\n` +
                         `.identity\n` +
                         `.confess <pesan> <nomor> <dari siapa>\n` +
                         `.confesstts <pesan> <nomor> <dari siapa>\n` +
                         `.math <angka1> <operator> <angka2>\n` +
                         `.c / .coinly\n` +
                         `.mycoin\n` +
                         `.tfcoin <jumlah> <nomor tujuan>\n` +
                         `*Owner Command*\n` +
                         `.spam <pesan> <nomor>\n` +
                         `.restartclient\n`;
        await client.sendText(message.from, menuText);
      }
      // Restart client command
      else if (message.body === '.restartclient') {
        if (message.sender.id !== allowedNumber) {
          await client.sendText(message.from, '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.');
        }
        await client.sendText(message.from, '⚙ Restarting bot...');
        restartClient();
      }

      // Repeat message command
      else if (message.body.startsWith('.says ')) {
        const response = message.body.slice(6);
        await client.sendText(message.from, response);
      }

      else if (message.body === '.fish') {
        const userId = message.sender.id;
        const currentTime = new Date().getTime(); // Mendapatkan waktu saat ini dalam milidetik
        
        // Cek apakah pengguna sudah memancing sebelumnya
        if (!userFishCount[userId]) {
          userFishCount[userId] = {};
        }
       
        // Jika belum ada waktu memancing terakhir atau sudah lebih dari 24 jam, reset jumlah hari ini
        if (!userLastFishingTime[userId] || currentTime - userLastFishingTime[userId] > 24 * 60 * 60 * 1000) {
          userFishCount[userId].today = 0;  // Reset jumlah memancing hari ini
          userLastFishingTime[userId] = currentTime;  // Update waktu memancing terakhir
        }
      
        // Cek apakah pengguna sudah mencapai batas maksimal 10 kali memancing per hari
        if (userFishCount[userId].today >= 10) {
          await client.sendText(message.from, '⚠ Kamu sudah memancing 10 kali hari ini. Coba lagi besok.');
          return;
        }
      
        // Proses memancing ikan
        // Misalnya, dapatkan ikan acak
        const fish = getRandomFish();  // Fungsi untuk mendapatkan ikan acak
        if (!userInventory[userId]) {
          userInventory[userId] = [];
        }
      
        userInventory[userId].push(fish);
        userFishCount[userId].today++;  // Increment jumlah memancing hari ini
        userLastFishingTime[userId] = currentTime;  // Update waktu memancing terakhir
        
        await client.sendText(message.from, `🎣 Kamu berhasil memancing *${fish.name}*!`);
      
        // Tampilkan jumlah ikan yang ada di inventori
        let inventoryText = '📦 *Inventori Kamu* 📦\n\n';
        userInventory[userId].forEach(item => {
          inventoryText += `🎒 ${item.name} - Harga: ${item.price} koin\n`;
        });
      
        await client.sendText(message.from, inventoryText);
      }
      

else if (message.body === '.sell') {
  const userId = message.sender.id;

  // Pastikan pengguna memiliki ikan di inventori
  if (!userInventory[userId] || userInventory[userId].length === 0) {
    await client.sendText(message.from, '⚠ Kamu tidak memiliki ikan untuk dijual. Mulailah dengan memancing ikan menggunakan perintah .fish.');
    return;
  }

  // Daftar ikan yang ada di inventori untuk dijual
  let fishListText = '🐟 *Ikan yang bisa dijual:* 🐟\n\n';
  userInventory[userId].forEach((item, index) => {
    fishListText += `${index + 1}. ${item.name} - Harga: ${item.price} koin\n`;
  });

  // Minta pengguna memilih ikan untuk dijual
  fishListText += '\nKetik nomor ikan yang ingin dijual (misalnya: .sell 1)';
  await client.sendText(message.from, fishListText);
}

// Periksa jika pengguna memilih ikan dengan mengetik .sell <nomor>
if (message.body === '.sell') {
  const userId = message.sender.id;

  // Pastikan pengguna memiliki ikan di inventori
  if (!userInventory[userId] || userInventory[userId].length === 0) {
    await client.sendText(message.from, '⚠ Kamu tidak memiliki ikan untuk dijual. Mulailah dengan memancing ikan menggunakan perintah .fish.');
    return;
  }

  // Daftar ikan yang ada di inventori untuk dijual
  let fishListText = '🐟 *Ikan yang bisa dijual:* 🐟\n\n';
  userInventory[userId].forEach((item, index) => {
    fishListText += `${index + 1}. ${item.name} - Harga: ${item.price} koin\n`;
  });

  // Minta pengguna memilih ikan untuk dijual
  fishListText += '\nKetik nomor ikan yang ingin dijual (misalnya: .sell 1)';
  await client.sendText(message.from, fishListText);
}

// Periksa jika pengguna memilih ikan dengan mengetik .sell <nomor>
else if (message.body.startsWith('.sell ')) {
  const userId = message.sender.id;
  const fishIndex = parseInt(message.body.split(' ')[1]) - 1; // Mengambil nomor ikan yang ingin dijual

  // Pastikan input yang diberikan adalah angka yang valid
  if (isNaN(fishIndex) || fishIndex < 0 || fishIndex >= userInventory[userId].length) {
    await client.sendText(message.from, '⚠ Pilihan tidak valid. Masukkan nomor ikan yang benar.');
    return;
  }

  // Ambil ikan yang dipilih
  const fishToSell = userInventory[userId][fishIndex];

  // Hapus ikan yang dijual dari inventori
  userInventory[userId].splice(fishIndex, 1);

  // Pastikan userCoins sudah ada untuk pengguna tersebut
  if (!userCoins[userId]) {
    userCoins[userId] = 0;  // Jika belum ada koin, inisialisasi dengan 0
  }

  // Berikan koin berdasarkan harga ikan
  userCoins[userId] += fishToSell.price;

  await client.sendText(message.from, `💰 Kamu berhasil menjual *${fishToSell.name}* seharga ${fishToSell.price} koin!`);

  // Tampilkan saldo koin terbaru
  await client.sendText(message.from, `💸 Saldo koin kamu sekarang: ${userCoins[userId]} koin.`);

  // Tampilkan inventori terbaru
  let inventoryText = '📦 *Inventori Kamu* 📦\n\n';
  userInventory[userId].forEach(item => {
    inventoryText += `🛒 ${item.name} - Harga: ${item.price} koin\n`;
  });

  await client.sendText(message.from, inventoryText);

  saveUserConfig();  // Simpan data inventori dan koin pengguna
}
      else if (message.body.startsWith('.tts ')) {
        const textToConvert = message.body.slice(5);
        const url = googleTTS.getAudioUrl(textToConvert, { lang: 'id', slow: false, host: 'https://translate.google.com' });

        const response = await fetch(url);
        const buffer = await response.buffer();
        const audioFile = path.join(__dirname, 'tts.mp3');
        fs.writeFileSync(audioFile, buffer);

        await client.sendVoice(message.from, audioFile);
        fs.unlinkSync(audioFile);
      }
else if (message.body === '.shop') {
  let shopText = '🛍️ *BOT I MARKET* 🛍️\n\n';

  shopItems.forEach(item => {
    shopText += `ID: ${item.id} - ${item.name}\nHarga: ${item.price} koin\nDeskripsi: ${item.description}\n\n`;
  });

  await client.sendText(message.from, shopText);
}


// Command to check user's inventory
else if (message.body === '.myinven') {
  const userId = message.sender.id;
  
  // Check if the user has an inventory, if not, initialize it
  if (!userInventory[userId] || userInventory[userId].length === 0) {
    await client.sendText(message.from, "📦 Kamu tidak memiliki item dalam inventori.");
    return;
  }

  // Build the inventory text
  let inventoryText = '📦 *Inventori Kamu* 📦\n\n';
  userInventory[userId].forEach(item => {
    inventoryText += `🛒 ${item.name} - ${item.description}\n`;
  });

  // Send the inventory text to the user
  await client.sendText(message.from, inventoryText);
}



// Command for buying items
else if (message.body.startsWith('.buy ')) {
  const parts = message.body.split(' ');
  const itemId = parseInt(parts[1]); // ID item yang ingin dibeli

  const userId = message.sender.id;
  const userCoinBalance = userCoins[userId] || 0;

  // Find the item in the shop
  const item = shopItems.find(item => item.id === itemId);

  if (!item) {
    return await client.sendText(message.from, '⚠ Item tidak ditemukan!');
  }

  // Check if the user has enough coins
  if (userCoinBalance < item.price) {
    return await client.sendText(message.from, `❌ Kamu tidak memiliki cukup koin untuk membeli ${item.name}. Koin yang dibutuhkan: ${item.price}`);
  }

  // Deduct coins from the user
  userCoins[userId] -= item.price;
  saveUserConfig(); // Save updated user coins

  // Add item to the user's inventory
  if (!userInventory[userId]) {
    userInventory[userId] = []; // Initialize inventory if it doesn't exist
  }
  userInventory[userId].push(item); // Add the bought item

  // Send confirmation message
  await client.sendText(message.from, `✅ Kamu berhasil membeli ${item.name}! Koinmu sekarang: ${userCoins[userId]}`);
}


      // Love compatibility command
      else if (message.body.startsWith('.love ')) {
        const parts = message.body.slice(6).split(' ');
        if (parts.length >= 2) {
          const name1 = parts[0];
          const name2 = parts.slice(1).join(' ');
          const percentage = Math.floor(Math.random() * 100) + 1;

          const loveText = `💖 *Cek Kecocokan Cinta* 💖\n` +
                           `❤ ${name1} ❤ ${name2} ❤\n` +
                           `💘 Tingkat kecocokan: *${percentage}%* 💘`;
          
          await client.sendText(message.from, loveText);
        } else {
          await client.sendText(message.from, '⚠ Format salah! Gunakan: .love <nama 1> <nama 2>');
        }
      }

      // Send a secret message (text)
      else if (message.body.startsWith('.confess ')) {
        const parts = message.body.slice(9).split(' ');
        if (parts.length >= 3) {
          const confessMessage = parts.slice(0, -2).join(' ');
          const targetNumber = parts[parts.length - 2];
          const fromWho = parts[parts.length - 1];

          const confessText = `💌 *Pesan Rahasia*\n"${confessMessage}"\nDari: ${fromWho}`;
          await client.sendText(targetNumber + '@c.us', confessText);
          await client.sendText(message.from, '✅ Pesan rahasia telah dikirim!');
        } else {
          await client.sendText(message.from, '⚠ Format salah. Gunakan: .confess <pesan> <nomor> <dari siapa>');
        }
      }

      // Send a secret message (TTS)
      else if (message.body.startsWith('.confesstts ')) {
        const parts = message.body.slice(12).split(' ');
        if (parts.length >= 3) {
          const confessMessage = parts.slice(0, -2).join(' ');
          const targetNumber = parts[parts.length - 2];
          const fromWho = parts[parts.length - 1];

          const textToConvert = `Kamu mendapatkan pesan suara dari ${fromWho}. Isi pesan tersebut: ${confessMessage}`;
          const url = googleTTS.getAudioUrl(textToConvert, { lang: 'id', slow: false, host: 'https://translate.google.com' });

          const response = await fetch(url);
          const buffer = await response.buffer();

          const audioFile = path.join(__dirname, 'confess.mp3');
          fs.writeFileSync(audioFile, buffer);

          await client.sendVoice(targetNumber + '@c.us', audioFile);
          await client.sendText(message.from, '✅ Pesan suara rahasia telah dikirim!');
          fs.unlinkSync(audioFile);
        } else {
          await client.sendText(message.from, '⚠ Format salah. Gunakan: .confesstts <pesan> <nomor> <dari siapa>');
        }
      }

      // Spam command (only for owner)
      else if (message.body.startsWith('.spam ')) {
        if (message.sender.id !== allowedNumber) {
          return await client.sendText(message.from, '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.');
        }

        const parts = message.body.slice(6).split(' ');
        if (parts.length >= 2) {
          const spamMessage = parts.slice(0, -1).join(' ');
          const targetNumber = parts[parts.length - 1];

          for (let i = 0; i < 25; i++) {
            await client.sendText(targetNumber + '@c.us', spamMessage);
          }
          await client.sendText(message.from, '✅ Pesan telah dikirim berkali-kali!');
        } else {
          await client.sendText(message.from, '⚠ Format salah. Gunakan: .spam <pesan> <nomor>');
        }
      }
// Math operation command
else if (message.body.startsWith('.math ')) {
  const parts = message.body.slice(6).split(' '); // Splitting the input into parts

  if (parts.length === 3) {  // If the user has provided exactly 3 arguments
    const number1 = parseFloat(parts[0]);
    const operator = parts[1];
    const number2 = parseFloat(parts[2]);

    let result;
    let isValid = true;

    // Check if the numbers are valid
    if (isNaN(number1) || isNaN(number2)) {
      isValid = false;
      result = '⚠ Input invalid. Pastikan kedua nilai adalah angka.';
    }

    // Perform the operation based on the operator
    if (isValid) {
      switch (operator) {
        case '+':
          result = `Hasil: ${number1} + ${number2} = ${number1 + number2}`;
          break;
        case '-':
          result = `Hasil: ${number1} - ${number2} = ${number1 - number2}`;
          break;
        case '*':
          result = `Hasil: ${number1} * ${number2} = ${number1 * number2}`;
          break;
        case '/':
          if (number2 !== 0) {
            result = `Hasil: ${number1} / ${number2} = ${number1 / number2}`;
          } else {
            result = '⚠ Error: Tidak bisa membagi dengan 0!';
          }
          break;
        default:
          result = '⚠ Operator tidak dikenali. Gunakan: +, -, *, atau /';
      }
    }

    // Send the result to the user
    await client.sendText(message.from, result);

  } else {
    await client.sendText(message.from, '⚠ Format salah. Gunakan: .math <angka1> <operator> <angka2>');
  }
}
      // Command to check user's coin balance
else if (message.body === '.mycoin') {
  const userId = message.sender.id;

  // Get the user's coin balance, default to 0 if not found
  const coinBalance = userCoins[userId] || 0;

  // Send the user's coin balance to them
  await client.sendText(message.from, `💰 *Koinmu saat ini* 💰\nKamu memiliki: ${coinBalance} koin.`);
}
// Command to transfer coins
else if (message.body.startsWith('.tfcoin ')) {
  const parts = message.body.slice(8).split(' ');  // Remove '.tfcoin ' and split the rest into parts

  if (parts.length === 2) {
    const transferAmount = parseInt(parts[0]); // The amount to transfer
    const targetNumber = parts[1]; // The target number to send coins to

    const senderId = message.sender.id;

    // Check if the transfer amount is a valid number
    if (isNaN(transferAmount) || transferAmount <= 0) {
      await client.sendText(message.from, '⚠ Masukkan jumlah koin yang valid untuk transfer.');
      return;
    }

    // Check if the sender has enough coins
    if (userCoins[senderId] < transferAmount) {
      await client.sendText(message.from, `❌ Kamu tidak cukup koin untuk mentransfer ${transferAmount} koin.`);
      return;
    }

    // Deduct coins from the sender
    userCoins[senderId] -= transferAmount;

    // Add coins to the recipient (target number with @c.us)
    const targetUserId = targetNumber + '@c.us';
    userCoins[targetUserId] = (userCoins[targetUserId] || 0) + transferAmount;

    // Save the updated user data to userconfig.json
    saveUserConfig();

    // Notify both sender and recipient
    await client.sendText(message.from, `✅ Kamu telah mentransfer ${transferAmount} koin ke ${targetNumber}@c.us.`);
    await client.sendText(targetUserId, `💰 Kamu telah menerima ${transferAmount} koin dari ${message.sender.pushname || message.sender.id}.`);
  } else {
    await client.sendText(message.from, '⚠ Format salah. Gunakan: .tfcoin <jumlah> <nomor tujuan>');
  }
}



      // Coin claim command
      else if (message.body === '.c' || message.body === '.coinly') {
        let userId = message.sender.id;
        let now = getCurrentTime();
        let cooldown = 24 * 60 * 60 * 1000; // 24 hours

        if (claimedTime[userId]) {
          let lastClaim = claimedTime[userId];
          let timePassed = now - lastClaim;

          if (timePassed < cooldown) {
            let remainingTime = cooldown - timePassed;
            return client.sendText(message.from, `⏳ Kamu sudah klaim! Coba lagi dalam ${formatTime(remainingTime)}.`);
          }
        }

        claimedTime[userId] = now;
        userCoins[userId] = (userCoins[userId] || 0) + 1;

        saveUserConfig(); // Save user coins and claim time to file

        client.sendText(message.from, `✅ Kamu berhasil klaim 1 koin! Total koinmu sekarang: ${userCoins[userId]}`);
      }
      // Identity command
      else if (message.body.startsWith('.identity')) {
        await client.sendText(message.from, `🤖 *Identitas Bot* 🤖\nNama: Bot i\nDiciptakan pada: 1 Februari 2025`);
      }

    } catch (error) {
      console.log("Error:", error);
    }
  });
}

// Run the bot
createClient();
