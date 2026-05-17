export const toPublicProject = (doc) => {
  const obj = doc?.toObject ? doc.toObject() : { ...doc };
  const { apiKey, ...safe } = obj;
  console.log(apiKey)
  console.log(safe)
  return safe;
};

export const toPublicProjects = (docs) => docs.map(toPublicProject);
