import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/GEMINI_API_KEY=([^\s]+)/);

if (keyMatch) {
  const key = keyMatch[1];
  console.log(`Found Key length: ${key.length}`);
  
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
    })
  })
  .then(res => {
    console.log(`Status: ${res.status}`);
    return res.text();
  })
  .then(text => console.log(`Response: ${text.substring(0, 200)}`))
  .catch(err => console.error(err));
} else {
  console.log('No key found in .env.local');
}
