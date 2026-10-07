const { normalizeMetaLead } = require("../src/services/metaLeadNormalizer");

describe("normalizeMetaLead", () => {
  test("maps common Meta field_data names", () => {
    const result = normalizeMetaLead({
      id: "987654",
      field_data: [
        { name: "full_name", values: ["Jane Doe"] },
        { name: "email", values: ["jane@example.com"] },
        { name: "phone_number", values: ["+91 9000000000"] }
      ]
    });

    expect(result).toEqual({
      metaLeadId: "987654",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+91 9000000000"
    });
  });

  test("does not crash when optional fields are missing", () => {
    const result = normalizeMetaLead({
      id: "987655",
      field_data: [{ name: "email", values: ["only@example.com"] }]
    });

    expect(result).toEqual({
      metaLeadId: "987655",
      name: null,
      email: "only@example.com",
      phone: null
    });
  });

  test("combines first and last name as a fallback", () => {
    const result = normalizeMetaLead({
      id: "987656",
      field_data: [
        { name: "first_name", values: ["Jane"] },
        { name: "last_name", values: ["Doe"] }
      ]
    });

    expect(result.name).toBe("Jane Doe");
  });
});
