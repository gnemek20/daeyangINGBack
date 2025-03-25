// express 서버 구동
const express = require('express');
const app = express();

// 메모리 설정
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// cors 설정
const cors = require('cors');
const corsOptions = { origin: ['https://www.daeyanging.com/', 'https://daeyanging.com/'] };
// app.use(cors(corsOptions));
app.use(cors());

// mailer 설정
const mailerService = 'gmail';
const mailerAuth = {
  user: 'yeou914@gmail.com',
  pass: 'xmww rgyx nbit cdhe'
};

const nodemailer = require('nodemailer');
const mailer = nodemailer.createTransport({
  service: mailerService,
  auth: mailerAuth
});

// get 메소드
app.get('/', (req, res) => {
  res.send('DaeyangING의 서버');
});

// post 메소드
app.post('/postRequest', async (req, res) => {
  const { name, contact, types, title, content, files } = req.body;

  type fileType = {
    name: string
    path: string
  };

  let fileList: Array<fileType> = [];
  files && files.map((file) => {
    fileList.push({
      name: file.name,
      path: file.path
    });
  });

  const mailOptions = {
    from: mailerAuth.user,
    to: mailerAuth.user,
    subject: `[대양ING] ${title}`,
    html: `
      <p>성함: ${name}</p>
      <p>종류: ${types ? types : '미기재'}</p>
      <p>연락처: ${contact}</p>
      <br />
      <p>${content && content.replace(/\n/g, '<br />')}</p>
    `,
    attachments: fileList
  };

  try {
    await mailer.sendMail(mailOptions);
    res.json({ status: 200 });
  } catch (Exception) {
    res.json({ status: 500 });
  };
});

module.exports = app;