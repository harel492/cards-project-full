const mongoose = require('mongoose');
const chalk = require('chalk');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.green(`✅ MongoDB Connected: ${conn.connection.host}`));
    
    console.log(chalk.blue(`📂 Database: ${conn.connection.name}`));
    
  } catch (error) {
    console.error(chalk.red(`❌ MongoDB Connection Error: ${error.message}`));
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error(chalk.red(`Database error: ${err}`));
  });

  mongoose.connection.on('disconnected', () => {
    console.log(chalk.yellow('📤 MongoDB disconnected'));
  });


  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log(chalk.yellow('📤 MongoDB connection closed through app termination'));
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(`Error during graceful shutdown: ${error.message}`));
      process.exit(1);
    }
  });
};

module.exports = connectDB;