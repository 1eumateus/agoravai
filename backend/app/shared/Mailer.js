import nodemailer from 'nodemailer'

async function sendEmail (dest,subject,content) {
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_SENHA,
        },
        connectionTimeout: 20000
    })
    let err = false;
    await transport.sendMail({
        from: 'SOTCC',
        to: dest,
        subject: subject,
        html: content,
    })
    .then(()=>err = false)
    .catch(()=> err = true)
    transport.close();
    return err;
}

export { sendEmail }