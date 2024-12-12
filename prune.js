let patterns = [
  /<p style="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0">&nbsp;<\/p>/g,
  /<p style="font: 10pt Times New Roman, Times, Serif; margin: 0pt 0"><\/p>/g,
  /<p style="[^"]*"><font style="[^"]*">/g,
  /<!-- Field: Page; Sequence: [\s\S]*?<!-- Field: \/Page -->/g,
];

let words = [/<\/font>/g, /<font>/g];

export function prune(text) {
  let originalLength = text.length;

  patterns.forEach((pattern) => {
    text = text.replace(pattern, "");
  });

  text = text.replace(/\n\s*\n/g, "\n");
  text = text.replace(/(&nbsp;)+/g, "");

  words.forEach((word) => {
    text = text.replace(word, "");
  });

  let newLength = text.length;
  let reductionPercentage =
    ((originalLength - newLength) / originalLength) * 100;
  console.log(`Original length: ${originalLength}`);
  console.log(`New length: ${newLength}`);
  console.log(`Reduction percentage: ${reductionPercentage.toFixed(2)}%`);
  return text;
}
