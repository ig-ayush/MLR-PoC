function firstValue(field) {
  if (!field || !Array.isArray(field.values) || field.values.length === 0) {
    return null;
  }

  const value = field.values[0];
  if (value === null || value === undefined) return null;

  return String(value).trim() || null;
}

function buildFieldMap(fieldData) {
  const map = new Map();

  if (!Array.isArray(fieldData)) return map;

  for (const field of fieldData) {
    if (!field || !field.name) continue;

    const key = String(field.name).trim().toLowerCase();
    const value = firstValue(field);

    if (value !== null) {
      map.set(key, value);
    }
  }

  return map;
}

function normalizeMetaLead(metaLead) {
  if (!metaLead || !metaLead.id) {
    throw new Error("Meta lead response is missing an id");
  }

  const fieldMap = buildFieldMap(metaLead.field_data);

  const firstName =
    fieldMap.get("first_name") ||
    fieldMap.get("firstname") ||
    "";

  const lastName =
    fieldMap.get("last_name") ||
    fieldMap.get("lastname") ||
    "";

  const combinedName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const name =
    fieldMap.get("full_name") ||
    fieldMap.get("name") ||
    combinedName ||
    null;

  const email =
    fieldMap.get("email") ||
    fieldMap.get("email_address") ||
    null;

  const phone =
    fieldMap.get("phone_number") ||
    fieldMap.get("phone") ||
    fieldMap.get("mobile_phone") ||
    null;

  return {
    metaLeadId: String(metaLead.id),
    name,
    email,
    phone
  };
}

module.exports = {
  normalizeMetaLead
};
