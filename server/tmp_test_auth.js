const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

async function run() {
  try {
    const signupRes = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cli-test@klarvia.test', password: 'TestPass123!', name: 'CLI Test' })
    });
    const signup = await signupRes.json();
    console.log('signup:', signup);

    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cli-test@klarvia.test', password: 'TestPass123!' })
    });
    const login = await loginRes.json();
    console.log('login:', login);

    const token = login.token;
    const meRes = await fetch('http://localhost:4000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const me = await meRes.json();
    console.log('me:', me);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
