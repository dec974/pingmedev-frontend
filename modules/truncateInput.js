function truncateInput(text, maxLength) {
  // On vérifie que c'est bien une string
  if (typeof text !== "string") {
    return text; 
  }

  // Si le texte est déjà court, on le renvoie comme il est
  if (text.length <= maxLength) {
    return text;
  }

  // On coupe à une limite donnée
  let truncated = text.slice(0, maxLength);

  // On recule jusqu'au dernier espace, pour ne pas couper un mot
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > 0) {
    truncated = truncated.slice(0, lastSpaceIndex);
  }

  // On ajoute les points de suspension
  return truncated + "…";
}

module.exports = {truncateInput};