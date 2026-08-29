const ALLOWED_EMAILS = new Set([
  'intercoast.texto@gmail.com',
  'alequito09@hotmail.com',
]);

// Netlify invokes this before accepting an Identity registration. The allow
// list is enforced on the platform, rather than only in the visible form.
export default {
  userValidate(event) {
    if (!ALLOWED_EMAILS.has(String(event.user.email || '').toLowerCase())) {
      return event.deny();
    }
  },
};
