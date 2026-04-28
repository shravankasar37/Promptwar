import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/GEMINI_API_KEY=([^\s]+)/);

if (keyMatch) {
  const key = keyMatch[1];
  fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(res => res.json())
  .then(data => {
      if (data.models) {
          console.log("AVAILABLE MODELS:");
          data.models.forEach(m => console.log(m.name));
      } else {
          console.log("Error listing models:", data);
      }
  })
  .catch(err => console.error(err));
}
