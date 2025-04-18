const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require('nodemailer');
require('dotenv').config(); // .env dosyasını yükle

const app = express();
const PORT = 3000;

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:5173', // Vue uygulamasının çalıştığı adres
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware 
app.use(bodyParser.json());

const usersFilePath = "./users.json";
const appointmentsFilePath = "./appointments.json";

// Dosya oku
function readUsers() {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
}

function readAppointments() {
  if (fs.existsSync(appointmentsFilePath)) {
    const data = fs.readFileSync(appointmentsFilePath);
    return JSON.parse(data);
  }
  return [];
}

function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function saveAppointments(appointments) {
  fs.writeFileSync(appointmentsFilePath, JSON.stringify(appointments, null, 2));
}

// E-posta gönderici ayarları
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// E-posta gönderme fonksiyonu
async function sendAppointmentEmail(appointmentDetails) {
  const { user, services, date, time, totalPrice } = appointmentDetails;

  console.log('E-posta gönderiliyor...');
  console.log('Gönderen:', process.env.EMAIL_USER);
  console.log('Alıcı:', process.env.EMAIL_USER);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Yeni Randevu Bildirimi',
    html: `
      <h2>Yeni Randevu Bildirimi</h2>
      <p><strong>Müşteri Bilgileri:</strong></p>
      <ul>
        <li>Ad: ${user.name}</li>
        <li>Soyad: ${user.lastName}</li>
        <li>E-posta: ${user.email}</li>
      </ul>
      
      <p><strong>Randevu Detayları:</strong></p>
      <ul>
        <li>Tarih: ${date}</li>
        <li>Saat: ${time}</li>
      </ul>
      
      <p><strong>Seçilen Hizmetler:</strong></p>
      <ul>
        ${services.hair ? `<li>Saç Tıraşı: ${services.hair.name}</li>` : ''}
        ${services.beard ? `<li>Sakal Tıraşı: ${services.beard.name}</li>` : ''}
        ${services.skincare ? `<li>Cilt Bakımı: ${services.skincare.name}</li>` : ''}
        ${services.massage ? `<li>Masaj: ${services.massage.name}</li>` : ''}
      </ul>
      
      <p><strong>Toplam Tutar: ₺${totalPrice}</strong></p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta başarıyla gönderildi:', info.response);
    return true;
  } catch (error) {
    console.error('E-posta gönderilirken hata oluştu:', error);
    console.error('Hata detayı:', error.message);
    if (error.response) {
      console.error('SMTP yanıtı:', error.response);
    }
    return false;
  }
}

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  console.log("Bulunan kullanıcı:", user); 

  if (user) {
    res.json({
      message: "Giriş başarılı",
      user: user,
    });
  } else {
    res.status(401).json({ message: "Email veya şifre hatalı" });
  }
});

// Register endpoint
app.post("/register", (req, res) => {
  const { name, lastName, email, password } = req.body;

  if (!name || !lastName || !email || !password) {
    return res.status(400).json({ message: "Eksik bilgi var" });
  }

  const users = readUsers();

  // Aynı email varsa hata 
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ message: "Bu email zaten kayıtlı" });
  }

  // Yeni kullanıcıyı ekle
  const newUser = { name, lastName, email, password };
  users.push(newUser);

  saveUsers(users);

  res.json({ message: "Kayıt başarılı", user: newUser });
});

// Randevu oluşturma endpoint'i
app.post("/api/appointments", async (req, res) => {
  try {
    const { user, services, date, time, totalPrice } = req.body;

    // Randevuları oku
    const appointments = readAppointments();

    // Randevu anahtarı oluştur
    const appointmentKey = `${date}-${time}`;

    // Aynı tarih ve saatte randevu var mı kontrol et
    const existingAppointment = appointments.find(
      (app) => app.date === date && app.time === time
    );

    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu saat dolu, lütfen başka bir saat seçin' 
      });
    }

    // Yeni randevuyu ekle
    const newAppointment = {
      user,
      services,
      date,
      time,
      totalPrice,
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    saveAppointments(appointments);

    // E-posta gönder
    const emailSent = await sendAppointmentEmail(newAppointment);

    if (emailSent) {
      res.json({ 
        success: true, 
        message: 'Randevu başarıyla oluşturuldu ve e-posta gönderildi' 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Randevu başarıyla oluşturuldu ancak e-posta gönderilemedi' 
      });
    }
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Randevu oluşturulurken bir hata oluştu' 
    });
  }
});

app.get("/", (req, res) => {
  res.send("API Çalışıyor!");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
