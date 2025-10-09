export async function toggleReaction(Model, docId, userId, type) {
  if (!["likes", "dislikes"].includes(type))
    throw new Error("Invalid reaction type");

  const field = type === "likes" ? "likes" : "dislikes";
  const oppositeField = type === "likes" ? "dislikes" : "likes";

  const doc = await Model.findById(docId);
  if (!doc) throw new Error("Document not found");

  // Rimuove reazione opposta
  const oppositeIndex = doc[oppositeField].findIndex(
    (id) => id.toString() === userId
  );
  if (oppositeIndex !== -1) doc[oppositeField].splice(oppositeIndex, 1);

  // Toggle reazione
  const index = doc[field].findIndex((id) => id.toString() === userId);
  if (index !== -1) doc[field].splice(index, 1);
  else doc[field].push(userId);

  await doc.save();
  return doc;
}