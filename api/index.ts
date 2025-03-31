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
  user: 'daeyangingreply@gmail.com',
  pass: 'busg xhdd xdoy zzkp'
};

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: mailerService,
  auth: mailerAuth
});

// get 메소드
app.get('/', (req, res) => {
  res.send('DaeyangING 서버');
});

// post 메소드
app.post('/postOrder', async (req, res) => {
  const { name, contact, types, title, content, files } = req.body;

  interface fileType {
    filename: string
    path: string
  };

  let fileList: Array<fileType> = [];
  files && files.map((file) => {
    fileList.push({
      filename: file.name,
      path: file.path
    });
  });

  const whereToSend = 'yeou914@gmail.com';
  const mailOptions = {
    from: mailerAuth.user,
    to: whereToSend,
    subject: `[대양ING] ${title}`,
    html: `
      <p>성함: ${name}</p>
      <p>종류: ${types.length !== 0 ? types : '미기재'}</p>
      <p>연락처: ${contact}</p>
      <p>--------</p>
      <p>${content && content.replace(/\n/g, '<br />')}</p>
      <p>--------</p>
    `,
    attachments: fileList
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ status: 200 });
  } catch (error) {
    console.log(error)
    res.json({ status: 500 });
  };
});

module.exports = app;