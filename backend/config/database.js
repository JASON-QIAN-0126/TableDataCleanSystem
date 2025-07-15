import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Vercel环境使用内存数据库，本地开发使用文件数据库
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : path.join(__dirname, '../database.sqlite');

let dbReady = false;
let dbInitPromise = null;

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database: ${isVercel ? 'memory' : 'file'}`);
    dbInitPromise = initDatabase();
  }
});

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          avatar TEXT DEFAULT 'default-avatar.png',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          reject(err);
        } else {
          console.log('Users table ready');
          
          // 在Vercel环境中添加测试数据
          if (isVercel) {
            addTestUser().then(() => {
              dbReady = true;
              resolve();
            }).catch(reject);
          } else {
            dbReady = true;
            resolve();
          }
        }
      });
    });
  });
}

async function addTestUser() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error checking users count:', err.message);
        reject(err);
        return;
      }
      
      if (row.count === 0) {
        // 添加测试用户
        bcrypt.hash('test123', 10).then(hashedPassword => {
          db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            ['testuser', 'test@example.com', hashedPassword],
            (err) => {
              if (err) {
                console.error('Error inserting test user:', err.message);
                reject(err);
              } else {
                console.log('Test user created: test@example.com / test123');
                resolve();
              }
            }
          );
        }).catch(reject);
      } else {
        resolve();
      }
    });
  });
}

// 确保数据库准备就绪的中间件
export function ensureDbReady(req, res, next) {
  if (dbReady) {
    next();
  } else if (dbInitPromise) {
    dbInitPromise.then(() => {
      next();
    }).catch(err => {
      console.error('Database initialization failed:', err);
      res.status(500).json({ 
        success: false,
        error: 'Database not ready' 
      });
    });
  } else {
    res.status(500).json({ 
      success: false,
      error: 'Database not initialized' 
    });
  }
}

export default db; 