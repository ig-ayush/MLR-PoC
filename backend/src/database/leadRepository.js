const { pool } = require("./pool");

function toLead(row) {
  if (!row) return null;

  return {
    id: Number(row.id),
    metaLeadId: row.meta_lead_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

async function findAll() {
  const [rows] = await pool.execute(
    `
      SELECT id, meta_lead_id, name, email, phone, created_at, updated_at
      FROM leads
      ORDER BY created_at DESC, id DESC
    `
  );

  return rows.map(toLead);
}

async function findById(id) {
  const [rows] = await pool.execute(
    `
      SELECT id, meta_lead_id, name, email, phone, created_at, updated_at
      FROM leads
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return toLead(rows[0]);
}

async function findByMetaLeadId(metaLeadId) {
  const [rows] = await pool.execute(
    `
      SELECT id, meta_lead_id, name, email, phone, created_at, updated_at
      FROM leads
      WHERE meta_lead_id = ?
      LIMIT 1
    `,
    [metaLeadId]
  );

  return toLead(rows[0]);
}

async function insertLead(lead) {
  const [result] = await pool.execute(
    `
      INSERT INTO leads (meta_lead_id, name, email, phone)
      VALUES (?, ?, ?, ?)
    `,
    [lead.metaLeadId, lead.name, lead.email, lead.phone]
  );

  return findById(result.insertId);
}

module.exports = {
  findAll,
  findById,
  findByMetaLeadId,
  insertLead
};
