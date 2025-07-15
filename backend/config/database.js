const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Vercel环境使用内存数据库，本地开发使用文件数据库
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? ':memory:' : path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database: ${isVercel ? 'memory' : 'file'}`);
    initDatabase();
  }
});

function initDatabase() {
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
      } else {
        console.log('Users table ready');
      }
    });
  });
}

// 添加一些测试数据（仅在内存数据库中）
if (isVercel) {
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Error checking users count:', err.message);
        return;
      }
      
      if (row.count === 0) {
        // 添加测试用户
        const bcrypt = require('bcryptjs');
        bcrypt.hash('123456', 10).then(hashedPassword => {
          db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            ['testuser', 'test@example.com', hashedPassword],
            (err) => {
              if (err) {
                console.error('Error inserting test user:', err.message);
              } else {
                console.log('Test user created: test@example.com / 123456');
              }
            }
          );
        });
      }
    });
  }, 1000);
}

module.exports = db; 