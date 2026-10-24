export function findRecords(records, query) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return records.filter(record => {
    const text = `${record.title} ${record.text}`.toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  });
}
