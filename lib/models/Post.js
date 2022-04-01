const pool = require('../utils/pool');

module.exports = class Post {
  id;
  text;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT 
        *
      FROM 
        posts
      `
    );

    return rows.map((row) => Post(row));
  }
};
