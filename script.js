function summarizeText() {
  const text = document.getElementById("inputText").value;
  const lengthOption = document.getElementById("summaryLength").value;

  if (!text.trim()) {
    alert("Please enter some text.");
    return;
  }

  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const wordFreq = {};
  const totalWords = text.split(/\s+/).length;

  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

  const scoredSentences = sentences.map(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    let score = 0;
    words.forEach(word => {
      if (wordFreq[word]) score += wordFreq[word];
    });
    return { sentence, score };
  });

  scoredSentences.sort((a, b) => b.score - a.score);

  let keepCount;
  switch (lengthOption) {
    case "short":
      keepCount = Math.max(1, Math.floor(sentences.length * 0.2));
      break;
    case "medium":
      keepCount = Math.max(1, Math.floor(sentences.length * 0.4));
      break;
    case "long":
      keepCount = Math.max(1, Math.floor(sentences.length * 0.6));
      break;
  }

  const summarySentences = scoredSentences.slice(0, keepCount).map(s => s.sentence.trim());
  const summary = summarySentences.join(" ");

  document.getElementById("summary").value = summary.trim();

  const summaryWordCount = summary.split(/\s+/).length;
  const compression = Math.round((summaryWordCount / totalWords) * 100);
  document.getElementById("summaryStats").innerText =
    `Original: ${totalWords} words | Summary: ${summaryWordCount} words (${compression}% length)`;
}

function copySummary() {
  const summary = document.getElementById("summary");
  summary.select();
  document.execCommand("copy");
  alert("Summary copied to clipboard!");
}

function downloadSummary() {
  const text = document.getElementById("summary").value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "summary.txt";
  link.href = URL.createObjectURL(blob);
  link.click();
}
