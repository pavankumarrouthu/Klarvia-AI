try {
  const r = await fetch('http://localhost:4000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'debugsignup@example.com', password: 'testpass123' })
  });
  console.log('Status', r.status);
  console.log('Headers', Object.fromEntries(r.headers.entries()));
  console.log('Body', await r.text());
} catch (e) {
  console.error('Fetch error', e);
}
