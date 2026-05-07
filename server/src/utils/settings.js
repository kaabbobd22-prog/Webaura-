import Setting from '../models/Setting.js';

export async function getSettingsObject() {
  const docs = await Setting.find({}).lean();
  return docs.reduce((acc, doc) => {
    acc[doc.key] = doc.value;
    return acc;
  }, {});
}

export async function upsertSettings(entries) {
  const pairs = Object.entries(entries || {});
  await Promise.all(pairs.map(([key, value]) => Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })));
  return getSettingsObject();
}
