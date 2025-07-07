// Plantilla de correo para recuperación de contraseña
export function passwordResetTemplate({ user, code }: { user: string; code: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #1a202c;">Recuperación de contraseña</h1>
      <p>Hola <b>${user}</b>,</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      <p>Utiliza el siguiente código para continuar con el proceso:</p>
      <div style="font-size: 2rem; font-weight: bold; letter-spacing: 4px; color: #e18a2d; margin: 24px 0;">${code}</div>
      <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 0.9rem; color: #6b7280;">Este código es válido solo por unos minutos.</p>
      <p style="font-size: 0.9rem; color: #6b7280;">FerreMateriales Madrid</p>
    </div>
  `;
}

// Plantilla de correo para confirmación de pedido
export function orderConfirmationTemplate({ user, orderNumber, orderLink }: { user: string; orderNumber: string; orderLink: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #1a202c;">¡Pedido recibido!</h1>
      <p>Hola <b>${user}</b>,</p>
      <p>Gracias por tu compra. Hemos recibido tu pedido y está siendo procesado.</p>
      <p style="margin: 16px 0; font-size: 1.1rem;">Número de orden: <b style="color: #e18a2d;">${orderNumber}</b></p>
      <p>Puedes ver los detalles y el estado de tu pedido en el siguiente enlace:</p>
      <a href="${orderLink}" style="display: inline-block; margin: 16px 0; padding: 10px 20px; background: #e18a2d; color: #fff; border-radius: 6px; text-decoration: none;">Ver mi pedido</a>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 0.9rem; color: #6b7280;">Te avisaremos cuando tu pedido cambie de estado.</p>
      <p style="font-size: 0.9rem; color: #6b7280;">FerreMateriales Madrid</p>
    </div>
  `;
}
