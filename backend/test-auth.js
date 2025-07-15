import fetch from 'node-fetch';

const API_BASE_URL = 'https://data-clean-backend.vercel.app';

async function testAuth() {
  console.log('Testing Auth API...\n');

  // Test registration
  console.log('1. Testing registration...');
  try {
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test123@example.com',
        password: 'password123'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);
    console.log('Status:', registerResponse.status);
  } catch (error) {
    console.error('Registration error:', error.message);
  }

  console.log('\n2. Testing login...');
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    console.log('Status:', loginResponse.status);
  } catch (error) {
    console.error('Login error:', error.message);
  }

  console.log('\n3. Testing health endpoint...');
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('Health response:', healthData);
    console.log('Status:', healthResponse.status);
  } catch (error) {
    console.error('Health check error:', error.message);
  }
}

testAuth(); 