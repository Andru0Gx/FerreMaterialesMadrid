import nodemailer from 'nodemailer';

// Configuración del transporter (ejemplo con Gmail, puedes cambiarlo por tu SMTP)
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tu email
        pass: process.env.EMAIL_PASS, // Tu contraseña o app password
    },
});

export interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
    return info;
}
