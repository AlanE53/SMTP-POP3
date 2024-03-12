import Pop3Command from 'node-pop3';
import 'dotenv/config'
import express from 'express';
import nodemailer from 'nodemailer'
import bodyParser from "body-parser";

const app = express()
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(process.env.PORT, () => {
   console.log(`Server running on port ${process.env.PORT}`);
})

app.post("/getEmails", async (req, res) => {
   try {
      const pop3 = new Pop3Command({
         user: `${process.env.USER}`,
         password: `${process.env.PASSWORD}`,
         host: 'pop.gmail.com',
         port: 995,
         tls: true,
      });

      const msgNum = 1;

      const str = await pop3.RETR(msgNum);

      await pop3.QUIT();

      res.send(str);
   } catch (error) {
      res.send({
         ok: false,
         message: "Error!"
      });
   }
})

app.post("/sendEmail", async (req, res) => {
   try {
      console.log(req.body);
      let transporter = nodemailer.createTransport({
         host: "smtp.gmail.com",
         port: 465,
         secure: true,
         auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
         },
      });
   
      await transporter.sendMail({
         from: "Prueba SMTP",
         to: req.body.email,
         subject: req.body.subject,
         html: `
           <div style="background-color: #f0f6fe; border: solid 3px #4a61a6; padding: 3rem; border-radius: 1rem; max-width: 40rem;">
             <div>
               <h2>Correo de prueba</h2>
             </div>
             <div>
                 <h4 style="color: #4a61a6; padding-bottom: 0;">${req.body.message}</h4>
             </div>   
           </div>   
           `,
      });
      
      res.send({
         ok: true,
         message: "Email sent successfully!"
      })
   } catch (error) {
      console.log(error);
      res.send({
         ok: false,
         message: "Error!"
      })
   }
})