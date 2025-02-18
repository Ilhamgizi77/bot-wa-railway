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
let userFishingRod = {}
let userBait = {}

if (fs.existsSync(userConfigFile)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigFile));

  userCoins = userConfig.userCoins || {};
  claimedTime = userConfig.claimedTime || {};
  userInventory = userConfig.userInventory || {};  
  userLastFishingTime = userConfig.userLastFishingTime || {};
  userFishCount = userConfig.userFishCount || {};
  userFishingRod = userConfig.userFishingRod || {};
  userBait = userConfig.userBait || {};
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
  ],
  zeus: [
    { name: "Zeus Heart", price: 3000},
    { name: "Poseidon wrath", price: 2000},
    { name: "Zeus GK PUNYA BIJI😹😹😹", price: 100},
    { name: "Zeus Slot", price: -111},
    { name: "Zeus Murka", price: 999},
    { name: "Babbang Zeus😹😹", price: 100},
    { name: "JEUS ZEUS", price: 1000},
    { name: "Ikan Zeus", price: 66},
    { name: "Zeus Jomok😹😹😹", price: 99},
    { name: "Zeus", price: 777},
    { name: "Zeoes(1900-an)", price: 10},
    { name: "Biji Zeus", price: 200},
    { name: "P", price: 10},
    { name: "HAH APA??", price: 100},
    { name: "Broken Home Zeus", price: 333},
    { name: "Cicak", price: 0},
    { name: "Sepatu", price: 0},
    { name: "Coconut Milk", price: 200},
    { name: "Koceng", price: 100},
    { name: "Lah??", price: 0},
    { name: "Admin kehabisan ide", price: 333}
  ], 
  poseidon: [
    { name: "Poseidon Ghost", price: 999},
    { name: "Turkey", price: 1000},
    { name: "Kalkun", price: 999},
    { name: "PosayDone", price: 3000},
    { name: "IKAN KERAPU!!!!!", price: 9999},
    { name: "Eternal Samfah", price: -100},
    { name: "Poseidon FIsh", price: 2500},
    { name: "Sepatu", price: 7},
    { name: "BAtu", price: 5},
    { name: "Jam Tangan Super(simpan untuk update kedepan!)", price: 100},
    { name: "Zeus Storm", price: 500},
    { name: "Eldritch Horror", price: 99},
    { name: "Tentacle Eel", price: 33},
    { name: "Abyssal Devourer", price: 100},
    { name: "Cicak", price: 0},
    { name: "Salesman", price: NaN},
    { name: "PhanTat", price: -1},
    { name: "Ikan Matahari", price: 20},
    { name: "Iii Kentut", price: -99},
    { name: "Poseidon Rawr", price: 19},
    { name: "Hah Apa?", price: -19},
    { name: "Payung", price: 9},
    { name: "Pisang", price: 777},
    { name: "Ipil", price: -50},
    { name: "Amer", price: -100 },
    { name: "BOjainah", price: 10},
    { name: "Blolock", price: 9},
    { name: "Kelapa", price: 9}
  ], 
  aurora: [
    { name: "Aurora Pemberkatan", price: 20000 },
    { name: "Kelapa Pemberkatan(lite)", price: 9999 },
    { name: "Jam Tangan Pemberkatan(lite)", price: 8800 },
    { name: "Muahal rek", price: 9999 },
    { name: "ayam gorang", price: 100 },
    { name: "Shiny Sparkling Giant Aurora Phantom Megalodon", price: 25000 },
    { name: "mUANI", price: -1999 },
    { name: "Aurora Totem", price: 500 },
    { name: "HALO REK", price: 200 },
    { name: "Aurora Pemberkatan(lite)", price: 2000 },
    { name: "Aurora Megalodon", price: 10000 },
    { name: "Aurora Kraken", price: 10000 },
    { name: "Aurora Trout", price: 1000 },
    { name: "Aurora Aurora trout", price: 7000 },
    { name: "Aurora Long Pike", price: 1000 },
    { name: "Aurora banana", price: 1000 },
    { name: "Aurora sailfish", price: 1000 },
    { name: "Aurora zeus", price: 1000 },
    { name: "Aurora treble bass", price: 1000 },
    { name: "Aurora pike", price: 1000 },
    { name: "Aurora Orca", price: 10000 },
    { name: "Aurora Ashcloud archerfish", price: 1000 },
    { name: "Aurora Kelapa Pemberkatan", price: 99999 },
    { name: "Aurora f", price: 7000 },
    { name: "Aurora e", price: 5000 },
    { name: "Aurora d", price: 4000 },
    { name: "Aurora c", price: 2000 },
    { name: "Aurora b", price: 1000 },
    { name: "Aurora a", price: 400 },
    { name: "Aurora NORTHSTAR SERPENTE", price: 10000 },
    { name: "Aurora cuch", price: 600 },
    { name: "Aurora fish", price: 1000 },
    { name: "Aurora catch", price: 1000 },
    { name: "Aurora luck", price: 700 },
    { name: "Aurora rock", price: 1000 },
    { name: "Aurora Umbrella", price: 900 },
    { name: "Aurora Glacial Sturgeon", price: 5000 },
    { name: "Kehabisan ide", price: 600 },
    { name: "loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong piiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiike", price: 3000 },
    { name: "kunci", price: 100 },
    { name: "ayam pemberkatan", price: 5000 },
    { name: "tuna pemberkatan", price: 10000 },
    { name: "CUYY", price: 200 },
    { name: "Payah", price: 2300 },
    { name: "Gurame", price: 10000 },
    { name: "GARENA API GRATIS MENGAMUK", price: 1000 }
  ],
  dewa: [
    { name: "Phantom Megalodon", price: 9999},
    { name: "Ancient Megalodon", price: 9999},
    { name: "Glacial Sturgeon", price: 9999},
    { name: "Babi", price: 1000},
    { name: "Zeus", price: 9999},
    { name: "KonCI", price: 9999},
    { name: "Anjeng Pukimak", price: 9999},
    { name: "P apa loe", price: 9999},
    { name: "Israel", price: "-Inf"},
    { name: "Milk", price: 1000000},
    { name: "Ambatukaaam!!!!", price: 999999999999999999},
    { name: "SAUS TOMAT", price: 1091829818278723},
    { name: "upil", price: -100},
    { name: "AYAM GORENG", price: 9288738929},
    { name: "ASU", price: 99999},
    { name: "POSEIDON", price: 10000},
    { name: "Harga Diri", price: "Inf"},
    { name: "Jam Tangan Pemberkatan", price: 98978738289783238728782393209},
    { name: "Lonte", price: -100},
    { name: "Memang AYAM", price: 912982919283972},
    { name: "Kelapa Pemberkatan", price: 199999999121732867362536562564},
    { name: "Shiny Sparkling Giant King Blessing Mythical Aurora Crystalized Fossillizzed Electric Shock Greedy Subspace Ancient Kraken", price: 1e+2000},
  ]
};

const shopText = "Halo!\nKamu Mau Beli Apaan Nih?\nKetik .rodShop untuk liat Pancingan apa yg dijual😁\nNanti Kedepannya Update Lagi Jadi Lebih Banyak Barang Jualannya!"

const shopItems = [
  { id: 1, name: 'Pancingan Biasa', price: 10, description: 'Pancingan biasa untuk menangkan ikan-ikan yang harganya tidak seberapa.' },
  { id: 2, name: 'Pancingan Stabil', price: 50, description: 'Pancingan Stabil, Bagus untuk menangkan ikan yang besar dan harganya yang mahal.' },
  { id: 3, name: 'Pancingan Super', price: 300, description: 'Pancingan super, Sangat bagus untuk menangkap ikan yang beratnya ratusan-ribuan kilogram dan harganya yang sangat mahal.' },
  { id: 4, name: 'Pancingan Zeus', price: 5000, description: 'Pancingan zeus, GACOR WAK!!!'},
  { id: 5, name: 'Pancingan Poseidon', price: 10000, description: 'Pancingan poseidon, GACOR WAK!!!'},
  { id: 6, name: 'Pancingan Aurora', price: 50000, description: 'Pancingan Aurora, sangat bagus apalagi ketika lagi aurora'},
  { id: 7, name: 'Pancingan Dewa', price: 999999999999999999, description: 'Pancingan Dewa, Auto dapat Ikan Bagus!'}
];

let id = [
  "120363374625480499@g.us",
  "120363357573486906@g.us",
  "120363393093596905@g.us",
  "120363384388628693@g.us"
];
const allowedNumber = "6289510305764@c.us";
let message = "woi bot dah on!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
let clientInstance;

const STABILITY_API_KEY = 'sk-wEJr399ZbW0RmZXphcIRGwgSOGjs6Bs2E7f4M1J0FhjRzXuC';

const axios = require('axios');
const FormData = require('form-data');
const { parseArgs } = require('util');

async function generateImage(prompt) {
  try {
    const form = new FormData();
    form.append('prompt', prompt);
    form.append('output_format', 'jpeg');
    form.append('model', 'stable-diffusion-xl');

    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      form,
      {
        headers: {
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
          ...form.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    );

    const imagePath = `./imagine.png`;
    fs.writeFileSync(imagePath, response.data);

    return imagePath;
  } catch (error) {
    throw new Error('❌ Gagal membuat gambar.');
  }
}

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


function getRandomFish(rodType) {
  let fishCategory = fishData[rodType]

  console.log(`Rod Type: ${rodType}, Selected Category:`, fishCategory);

  if (!fishCategory || fishCategory.length === 0) {
    console.log("⚠ Error: Kategori ikan kosong!");
    return { name: "Ikan Tidak Dikenal", price: 0 };
  }

  return fishCategory[Math.floor(Math.random() * fishCategory.length)];
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
    userFishingRod,
    userBait,
  };
  fs.writeFileSync(userConfigFile, JSON.stringify(userConfig, null, 2));
}


function start(client) {
  client.onMessage(async (message) => {
    try {
      if (message.body === '.menu') {
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
                         `.sendfeedback <pesan>\n` +
                         `.tfcoin <jumlah> <nomor tujuan>\n` +
                         `*Owner Command*\n` +
                         `.spam <pesan> <nomor>\n` +
                         `.restartclient\n` +
                         `.deductcoins <nomor>`;
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

      else if (message.body.startsWith('.resetfishingtime ')) {
        const userId = message.sender.id;
        if (userId !== allowedNumber) {
          return await client.sendText(message.from, '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.');
        }
        const args = message.body.split(' ');
        if (args.length < 2) {
          return await client.sendText(message.from, '⚠ Format salah! Gunakan: .resetfishingtime <nomor tujuan>');
        }
      
        let targetNumber = args[1] + '@c.us'; 
        if (!userLastFishingTime[targetNumber]) {
          return await client.sendText(message.from, `⚠ Pengguna ${args[1]} tidak ditemukan atau belum memancing.`);
        }
      
        delete userLastFishingTime[targetNumber]; 
        delete userFishCount[targetNumber]; 
      

        saveUserConfig();
      
        await client.sendText(message.from, `✅ Data fishing time untuk *${args[1]}* telah direset!`);
        await client.sendText(targetNumber, '🔄 Data fishing time kamu telah direset oleh admin.');
      }
      
      
      else if (message.body.startsWith('.says ')) {
        const response = message.body.slice(6);
        await client.sendText(message.from, response);
      }

      else if (message.body.startsWith('.imagine ')) {
        const prompt = message.body.slice(9).trim();
      
        if (!prompt) {
          await client.sendText(message.from, '⚠ Gunakan format: .imagine <deskripsi gambar>');
          return;
        }
      
        await client.sendText(message.from, `🎨 Membuat gambar untuk: *${prompt}*...`);
      
        try {
          const imagePath = await generateImage(prompt);
          await client.sendImage(message.from, imagePath, 'imagine.png', `🖼 Hasil gambar untuk: *${prompt}*`);
        } catch (error) {
          await client.sendText(message.from, '❌ Gagal membuat gambar.');
        }
      }
      
      else if (message.body === '.myfishingrod') {
        const userId = message.sender.id;
        if (!userFishingRod[userId]) {
          userFishingRod[userId] = "biasa"; 
        }
      
        const rodType = userFishingRod[userId];
      
        await client.sendText(message.from, `🎣 Pancinganmu saat ini: *${rodType}*`);
      }


      else if (message.body === '.fish') {
        const userId = message.sender.id;
        const currentTime = Date.now();
    
        // *Pastikan userFishingRod ada, default "biasa"*
        if (!userFishingRod[userId]) {
            userFishingRod[userId] = "biasa";
        }
    
        if (userFishingRod[userId] === "biasa") {
            // Membiarkan user memancing meskipun hanya punya pancingan biasa
            return await client.sendText(message.from, 
                '⚠ Kamu memancing dengan pancingan biasa.\n' +
                'Ketik .shop untuk melihat daftar pancingan.\n' +
                'Ketik .buy <nomor> untuk membeli pancingan yang lebih bagus.\n' +
                'Selamat memancing!');
        }
    
        // *Ambil jenis pancingan dari userFishingRod*
        const rodType = userFishingRod[userId];
    
        // *Pastikan userInventory ada sebagai array*
        if (!Array.isArray(userInventory[userId])) {
            console.log(`⚠ userInventory untuk ${userId} tidak valid, menginisialisasi ulang.`);
            userInventory[userId] = [];
        }
    
        // *Cek apakah kategori ikan tersedia*
        const fish = getRandomFish(rodType);
        if (!fish || !fish.name) {
            return await client.sendText(message.from, '❌ Error: Tidak bisa mendapatkan ikan. Coba lagi nanti.');
        }
    
        // *Batas memancing per hari*
        if (!userFishCount[userId]) {
            userFishCount[userId] = { today: 0 };
        }
    
        // Cek apakah user termasuk dalam daftar allowedNumber
        const isAllowed = allowedNumber.includes(userId); // Cek apakah userId ada di dalam array allowedNumber
    
        if (!userLastFishingTime[userId] || currentTime - userLastFishingTime[userId] > 24 * 60 * 60 * 1000) {
            userFishCount[userId].today = 0;
            userLastFishingTime[userId] = currentTime;
        }
    
        // Jika user bukan bagian dari allowedNumber dan sudah mencapai batas 10 kali memancing, beri peringatan
        if (userFishCount[userId].today >= 10 && !isAllowed) {
            return await client.sendText(message.from, '⚠ Kamu sudah memancing 10 kali hari ini. Coba lagi besok.');
        }
    
        // *Tambahkan ikan ke userInventory*
        userInventory[userId].push(fish);
        userFishCount[userId].today++;
    
        await client.sendText(message.from, `🎣 Kamu berhasil memancing *${fish.name}*!`);
    
        // *Tampilkan inventori terbaru*
        let inventoryText = '📦 Inventori Kamu 📦\n\n';
        userInventory[userId].forEach(item => {
            inventoryText += `🎒 ${item.name} - Harga: ${item.price} koin\n`;
        });
    
        await client.sendText(message.from, inventoryText);
    }

    else if (message.body.startsWith('.deductcoins')) {
      const args = message.body.split(' '); 
      const userId = message.sender.id;

      const ownerId = allowedNumber;  

      if (userId !== ownerId) {
          return await client.sendText(message.from, '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.');
      }

      if (args.length < 3) {
          return await client.sendText(message.from, '❌ Format salah. Gunakan: .deductcoins <jumlah> <nomor tujuan>');
      }
  
      const amount = parseInt(args[1]); 
      let targetUserId = args[2]; 

      targetUserId = targetUserId + "@c.us"; 
      if (isNaN(amount) || amount <= 0) {
          return await client.sendText(message.from, '❌ Jumlah koin tidak valid.');
      }

      if (!userCoins[targetUserId]) {
          return await client.sendText(message.from, `❌ User dengan ID ${targetUserId} tidak ditemukan.`);
      }
  
      if (userCoins[targetUserId] < amount) {
          return await client.sendText(message.from, '❌ Target tidak memiliki cukup koin.');
      }
      userCoins[targetUserId] -= amount;
      saveUserConfig();
  
      await client.sendText(message.from, `✅ Kamu berhasil mengurangi *${amount} koin* dari *${targetUserId}*.`);
  
      await client.sendText(targetUserId, `⚠ *${amount} koin* telah dikurangi dari saldo kamu oleh *${userId}*.`);
  
      let targetBalance = userCoins[targetUserId];
      await client.sendText(targetUserId, `💰 Saldo koin terkini kamu: *${targetBalance} koin*`);
  }
  
  

      else if (message.body === '.sell') {
        const userId = message.sender.id;

  // Pastikan pengguna memiliki ikan di inventori
  if (!userInventory[userId] || userInventory[userId].length === 0) {
    await client.sendText(message.from, '⚠ Kamu tidak memiliki ikan untuk dijual. Mulailah dengan memancing ikan menggunakan perintah .fish.');
    return;
  }

  let fishListText = '🐟 *Ikan yang bisa dijual:* 🐟\n\n';
  userInventory[userId].forEach((item, index) => {
    fishListText += `${index + 1}. ${item.name} - Harga: ${item.price} koin\n`;
  });

  fishListText += '\nKetik nomor ikan yang ingin dijual (misalnya: .sell 1)';
  await client.sendText(message.from, fishListText);
}

if (message.body === '.sell') {
  const userId = message.sender.id;

  if (!userInventory[userId] || userInventory[userId].length === 0) {
    await client.sendText(message.from, '⚠ Kamu tidak memiliki ikan untuk dijual. Mulailah dengan memancing ikan menggunakan perintah .fish.');
    return;
  }

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
        let shopText = '🛍 BOT I SHOP 🛍\n\n';
      
        shopItems.forEach(item => {
          shopText += `🆔 ID: ${item.id}\n📌 ${item.name}\n💰 Harga: ${item.price} koin\n📖 ${item.description}\n\n`;
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



else if (message.body.startsWith('.buy ')) {
  const parts = message.body.split(' ');
  const itemId = parseInt(parts[1]); // Ambil ID item yang mau dibeli
  const userId = message.sender.id;

  // *Cek apakah user sudah ada di sistem*
  if (!userCoins[userId]) {
    userCoins[userId] = 0; // Set default kalau belum ada koin
  }
  
  if (!userFishingRod[userId]) {
    userFishingRod[userId] = "biasa"; // Set default pancingan ke "biasa"
  }

  // *Cari item berdasarkan ID*
  const item = shopItems.find(i => i.id === itemId);

  if (!item) {
    return await client.sendText(message.from, '⚠ Item tidak ditemukan! Gunakan .shop untuk melihat daftar.');
  }

  // *Cek apakah user punya cukup koin*
  if (userCoins[userId] < item.price) {
    return await client.sendText(message.from, `❌ Koin tidak cukup! Harga ${item.name}: ${item.price} koin.`);
  }

  // *Kurangi koin user setelah pembelian berhasil*
  userCoins[userId] -= item.price;

  // *Jika yang dibeli adalah pancingan, update userFishingRod*
  if (item.id >= 1 && item.id <= 4) { // ID 1-4 = Pancingan
    userFishingRod[userId] = item.name.toLowerCase().replace("pancingan ", ""); // Simpan pancingan tanpa kata "Pancingan"
  }

  // *Simpan perubahan ke file*
  saveUserConfig();

  await client.sendText(message.from, `✅ Kamu berhasil membeli *${item.name}*!`);
  await client.sendText(message.from, `💰 Sisa koin kamu: ${userCoins[userId]} koin.`);
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

      else if (message.body.startsWith('.sendfeedback ')) {
        const parts = message.body.slice(15);
        if (parts.length <= 3) {
          const confessMessage = parts.slice(0, -2).join(' ');
          const targetNumber = "6289510305764@c.us";

          const confessText = `*Feedback*\n"${confessMessage}"`;
          await client.sendText(targetNumber, confessText);
          await client.sendText(message.from, '✅ Feedback telah dikirim Terimakasih Sudah Menfeedback agar kedepannya bot makin bagus & banyak fitur!😊');
        } else {
          await client.sendText(message.from, '⚠ Format salah. Gunakan: .sendfeedback <pesan>');
        }
      }



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

    if (isNaN(number1) || isNaN(number2)) {
      isValid = false;
      result = '⚠ Input invalid. Pastikan kedua nilai adalah angka.';
    }
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

else if (message.body === '.groupid') {
  if (message.isGroupMsg) {
    await client.sendText(message.from, `📌 Group ID: ${message.from}`);
  } else {
    await client.sendText(message.from, '❌ Perintah ini hanya bisa digunakan di dalam grup.');
  }
}
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
