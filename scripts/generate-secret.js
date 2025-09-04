#!/usr/bin/env node

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function generateJWTSecret() {
  // Generate a secure random secret
  const secret = crypto.randomBytes(64).toString('hex');
  return secret;
}

function updateEnvFile(secret) {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Please create it first.');
    return false;
  }

  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if JWT_SECRET already exists
    if (envContent.includes('JWT_SECRET=')) {
      // Update existing JWT_SECRET
      envContent = envContent.replace(
        /JWT_SECRET=.*/,
        `JWT_SECRET=${secret}`
      );
    } else {
      // Add JWT_SECRET to the end of file
      envContent += `\n# JWT Authentication\nJWT_SECRET=${secret}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    return true;
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    return false;
  }
}

function main() {
  console.log('🔐 Generating secure JWT secret...\n');
  
  const secret = generateJWTSecret();
  console.log('✅ Generated secure JWT secret:');
  console.log(`   ${secret.substring(0, 20)}...${secret.substring(secret.length - 20)}`);
  console.log('');
  
  console.log('📝 Updating .env file...');
  const success = updateEnvFile(secret);
  
  if (success) {
    console.log('✅ .env file updated successfully');
    console.log('');
    console.log('💡 Remember to:');
    console.log('   - Keep this secret secure');
    console.log('   - Never commit it to version control');
    console.log('   - Use different secrets for development and production');
  } else {
    console.log('❌ Failed to update .env file');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateJWTSecret, updateEnvFile };
