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

// Notificación de cambio de estado de pedido o pago
export function orderStatusUpdateTemplate({ user, orderNumber, newStatus, newPaymentStatus, orderLink }: { user: string; orderNumber: string; newStatus?: string; newPaymentStatus?: string; orderLink: string }) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h1 style="color: #1a202c;">Actualización de tu pedido</h1>
      <p>Hola <b>${user}</b>,</p>
      <p>Te informamos que tu pedido <b style="color: #e18a2d;">${orderNumber}</b> ha cambiado:</p>
      ${newStatus ? `<p>Nuevo estado del pedido: <b>${newStatus}</b></p>` : ''}
      ${newPaymentStatus ? `<p>Nuevo estado de pago: <b>${newPaymentStatus}</b></p>` : ''}
      <p>Puedes ver los detalles y el estado actualizado de tu pedido en el siguiente enlace:</p>
      <a href="${orderLink}" style="display: inline-block; margin: 16px 0; padding: 10px 20px; background: #e18a2d; color: #fff; border-radius: 6px; text-decoration: none;">Ver mi pedido</a>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 0.9rem; color: #6b7280;">Gracias por confiar en FerreMateriales Madrid.</p>
    </div>
  `;
}

// Plantilla de correo para nota de compra tras pago aprobado
export function orderReceiptTemplate({ user, orderNumber, order, company }: { user: string; orderNumber: string; order: any; company: any }) {
  // Formatea productos
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product?.name || 'Producto'}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 24px; border-radius: 8px;">
      <h1 style="color: #1a202c;">¡Pago validado!</h1>
      <p>Hola <b>${user}</b>,</p>
      <p>Hemos validado tu pago y tu pedido <b style="color: #e18a2d;">${orderNumber}</b> ha sido confirmado.</p>
      <h2 style="margin-top: 32px; color: #e18a2d;">Nota de compra</h2>
      <div style="margin-bottom: 24px;">
        <strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString('es-ES')}<br/>
        <strong>Cliente:</strong> ${user}<br/>
        ${order.isInStore ? `<strong>Teléfono:</strong> ${order.phone || 'No disponible'}<br/>` : `<strong>Email:</strong> ${order.user?.email || ''}<br/><strong>Teléfono:</strong> ${order.user?.phone || ''}<br/>`}
        <strong>Método de pago:</strong> ${order.paymentMethod || ''}<br/>
        <strong>Referencia:</strong> ${order.paymentReference || ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="text-align: left; padding: 8px;">Producto</th>
            <th style="text-align: right; padding: 8px;">Cantidad</th>
            <th style="text-align: right; padding: 8px;">Precio Unit.</th>
            <th style="text-align: right; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="text-align: right; margin-bottom: 16px;">
        <div><strong>Subtotal:</strong> $${(order.subtotal ?? 0).toFixed(2)}</div>
        <div><strong>Descuento:</strong> -$${(order.discountAmount ?? 0).toFixed(2)}</div>
        <div><strong>IVA (16%):</strong> $${(order.taxAmount ?? 0).toFixed(2)}</div>
        <div><strong>Envío:</strong> ${order.shippingAmount === 0 ? 'Gratis' : `$${(order.shippingAmount ?? 0).toFixed(2)}`}</div>
        <div style="font-size: 1.2em; margin-top: 8px;"><strong>Total:</strong> $${order.total.toFixed(2)}</div>
      </div>
      <div style="margin-top: 24px; font-size: 0.95em; color: #444;">
        <strong>Empresa:</strong> ${company.nombre}<br/>
        <strong>RIF:</strong> ${company.rif}<br/>
        <strong>Dirección:</strong> ${company.direccion}<br/>
        <strong>Teléfono:</strong> ${company.telefono}<br/>
        <strong>Email:</strong> ${company.email}
      </div>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 0.9rem; color: #6b7280;">Gracias por confiar en FerreMateriales Madrid.</p>
    </div>
  `;
}

// Plantilla de correo para nota de compra tras realizar la compra (pago pendiente)
export function orderPendingReceiptTemplate({ user, orderNumber, order, company }: { user: string; orderNumber: string; order: any; company: any }) {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product?.name || 'Producto'}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; padding: 24px; border-radius: 8px;">
      <h1 style="color: #1a202c;">¡Pedido recibido!</h1>
      <p>Hola <b>${user}</b>,</p>
      <p>Hemos recibido tu pedido <b style="color: #e18a2d;">${orderNumber}</b> y tu pago está siendo procesado.</p>
      <p>Adjuntamos tu nota de compra. Si tienes algún inconveniente con el pago o la entrega, puedes presentar esta nota como comprobante.</p>
      <h2 style="margin-top: 32px; color: #e18a2d;">Nota de compra</h2>
      <div style="margin-bottom: 24px;">
        <strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString('es-ES')}<br/>
        <strong>Cliente:</strong> ${user}<br/>
        ${order.isInStore ? `<strong>Teléfono:</strong> ${order.phone || 'No disponible'}<br/>` : `<strong>Email:</strong> ${order.user?.email || ''}<br/><strong>Teléfono:</strong> ${order.user?.phone || ''}<br/>`}
        <strong>Método de pago:</strong> ${order.paymentMethod || ''}<br/>
        <strong>Referencia:</strong> ${order.paymentReference || ''}
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="text-align: left; padding: 8px;">Producto</th>
            <th style="text-align: right; padding: 8px;">Cantidad</th>
            <th style="text-align: right; padding: 8px;">Precio Unit.</th>
            <th style="text-align: right; padding: 8px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="text-align: right; margin-bottom: 16px;">
        <div><strong>Subtotal:</strong> $${(order.subtotal ?? 0).toFixed(2)}</div>
        <div><strong>Descuento:</strong> -$${(order.discountAmount ?? 0).toFixed(2)}</div>
        <div><strong>IVA (16%):</strong> $${(order.taxAmount ?? 0).toFixed(2)}</div>
        <div><strong>Envío:</strong> ${order.shippingAmount === 0 ? 'Gratis' : `$${(order.shippingAmount ?? 0).toFixed(2)}`}</div>
        <div style="font-size: 1.2em; margin-top: 8px;"><strong>Total:</strong> $${order.total.toFixed(2)}</div>
      </div>
      <div style="margin-top: 24px; font-size: 0.95em; color: #444;">
        <strong>Empresa:</strong> ${company.nombre}<br/>
        <strong>RIF:</strong> ${company.rif}<br/>
        <strong>Dirección:</strong> ${company.direccion}<br/>
        <strong>Teléfono:</strong> ${company.telefono}<br/>
        <strong>Email:</strong> ${company.email}
      </div>
      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 0.9rem; color: #6b7280;">Gracias por confiar en FerreMateriales Madrid.</p>
    </div>
  `;
}
