const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const googleTTS = require('google-tts-api');

const userConfigFile = './userconfig.json';
let userCoins = {}; // Store user coins
let claimedTime = {}; // Store last claim time

// Load user config from file if exists
if (fs.existsSync(userConfigFile)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigFile));
  userCoins = userConfig.userCoins || {};
  claimedTime = userConfig.claimedTime || {};
}

// Group and allowed number settings
let id = [
  "120363374625480499@g.us",
  "120363357573486906@g.us",
  "120363393093596905@g.us"
];
const allowedNumber = "6289510305764@c.us";
let message = "P";
let clientInstance;

function createClient() {
  venom.create({
    session: 'botwa',
    multidevice: true,
    headless: true,
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
  };
  fs.writeFileSync(userConfigFile, JSON.stringify(userConfig, null, 2));
}

function start(client) {
  id.forEach((groupId) => {
    client.sendText(groupId, message);
  });

  client.onMessage(async (message) => {
    try {
      if (message.body === '.menu') {
        const menuText = `✨ *Menu Bot* ✨\n` +
                         `.menu - Tampilkan Menu\n` +
                         `.says <pesan> - Bot mengulangi pesan\n` +
                         `.tts <teks> - Ubah teks ke suara\n` +
                         `.love <nama 1> <nama 2> - Cek kecocokan cinta\n` +
                         `.groupid - Cek ID Grup\n` +
                         `.identity - Lihat identitas bot\n` +
                         `.confess <pesan> <nomor> <dari siapa> - Kirim pesan rahasia\n` +
                         `.confesstts <pesan> <nomor> <dari siapa> - Kirim pesan suara rahasia\n` +
                         `.spam <pesan> <nomor> - (Hanya pemilik bot)\n` +
                         `.restartclient - Restart bot(hanya pemilik bot)\n` +
                         `.math <angka1> <operator> <angka2> - Kalkulator sederhana\n` +
                         `.c / .coinly - Klaim 1 koin per 24 jam\n` +
                         `.mycoin - Mengecek koin anda saat ini\n` +
                         `.quiz - Selesaikan 6 pertanyan bayar 30 koin jika salah semua Jika beruntung mendapat 1000 koin!`;
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

      // Text-to-Speech (TTS) command
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

