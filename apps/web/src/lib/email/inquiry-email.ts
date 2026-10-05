export type InquiryEmailData = {
  id: number | string
  name: string
  email: string
  subject: string
  message: string
  productTitle?: string
  productLineTitle?: string
  sourcePage?: string | null
  adminUrl: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Notification email to the team. All user input is escaped in the HTML part. */
export function inquiryEmail(data: InquiryEmailData) {
  const rows: [string, string | undefined | null][] = [
    ['Name', data.name],
    ['Email', data.email],
    ['Product', data.productTitle],
    ['Product line', data.productLineTitle],
    ['Sent from', data.sourcePage],
  ]
  const present = rows.filter((row): row is [string, string] => Boolean(row[1]))

  const text = [
    `New inquiry: ${data.subject}`,
    '',
    ...present.map(([label, value]) => `${label}: ${value}`),
    '',
    data.message,
    '',
    `Reply to this email to answer ${data.name} directly.`,
    `View in admin: ${data.adminUrl}`,
  ].join('\n')

  const html = `<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#181d27;line-height:1.5">
<h2 style="margin:0 0 16px;font-size:18px">${escapeHtml(data.subject)}</h2>
<table style="border-collapse:collapse;margin-bottom:16px">
${present
  .map(
    ([label, value]) =>
      `<tr><td style="padding:4px 16px 4px 0;color:#535862">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
  )
  .join('\n')}
</table>
<p style="white-space:pre-wrap;margin:0 0 24px">${escapeHtml(data.message)}</p>
<p style="color:#535862;font-size:13px">Reply to this email to answer ${escapeHtml(data.name)} directly.<br>
<a href="${escapeHtml(data.adminUrl)}" style="color:#26798a">View in admin</a></p>
</body></html>`

  return { subject: `New inquiry: ${data.subject}`, text, html }
}
