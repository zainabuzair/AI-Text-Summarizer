//summarizeText-function-start
function summarizeText() {
  const text = document.getElementById("inputText").value;
  const lengthOption = document.getElementById("summaryLength").value;
  const tone = document.getElementById("toneSelector").value;
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
    case "short": keepCount = Math.max(1, Math.floor(sentences.length * 0.2)); break;
    case "medium": keepCount = Math.max(1, Math.floor(sentences.length * 0.4)); break;
    case "long": keepCount = Math.max(1, Math.floor(sentences.length * 0.6)); break;
  }

  const summarySentences = scoredSentences.slice(0, keepCount).map(s => s.sentence.trim());
  let summary = applyTone(summarySentences, tone);
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(pair => pair[0])
    .join(', ');
  const summaryWords = summary.split(/\s+/).length;
  const readingOriginal = Math.ceil(totalWords / 200);
  const readingSummary = Math.ceil(summaryWords / 200);
  const compression = Math.round((summaryWords / totalWords) * 100);
  document.getElementById("summary").value = summary;
  document.getElementById("summaryStats").innerText = 
    `📌 Topic: ${keywords} | 📖 Read time: ${readingOriginal} min → ${readingSummary} min | 📉 Compression: ${compression}%`;

function detectMood(text) {
  const positiveWords = [
    "great", "good", "happy", "excellent", "positive", "love", "amazing", "wonderful",
    "fantastic", "delightful", "brilliant", "joy", "improve", "success", "achieve", "best"
  ];

  const negativeWords = [
    "bad", "sad", "poor", "negative", "hate", "terrible", "worst", "fail", "decline",
    "awful", "disappoint", "problem", "issue", "struggle", "loss", "angry", "pain"
  ];

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/);

  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });

  if (score > 0) return { mood: "Positive 😊", class: "mood-positive" };
  else if (score < 0) return { mood: "Negative 😟", class: "mood-negative" };
  else return { mood: "Neutral 😐", class: "mood-neutral" };
}  
const mood = detectMood(summary);
document.getElementById("moodBadge").innerHTML = `<span class="${mood.class}">${mood.mood}</span>`;
}
//summarizeText-function-end

//highlightText-function-start
function highlightText() {
  const input = document.getElementById("inputText").value.trim();
  const output = document.getElementById("highlightedOutput");

  if (!input) {
    output.innerHTML = "Please enter some text first.";
    return;
  }

  let highlighted = input;
const longSentences = input.match(/[^\.!\?]{100,}[\.\!\?]/g);
  if (longSentences) {
    longSentences.forEach(sentence => {
      const safe = escapeHtml(sentence.trim());
      highlighted = highlighted.replace(sentence, `<span class="long-sentence">${safe}</span>`);
    });
  }
  const wordArray = input.toLowerCase().match(/\b\w+\b/g);
  const wordCounts = {};

  if (wordArray) {
    wordArray.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    Object.keys(wordCounts).forEach(word => {
      if (wordCounts[word] >= 3 && word.length > 3) {
        const reg = new RegExp(`\\b(${word})\\b`, "gi");
        highlighted = highlighted.replace(reg, `<span class="repeated-word">$1</span>`);
      }
    });
  }
output.innerHTML = highlighted;
}
//highlightText-function-end

//applyTone-function-start
function applyTone(sentences, tone) {
  switch (tone) {
    case "friendly":
      return sentences.map(s => s + " 😊").join(" ");
    case "formal":
      return sentences.map(s => s.replace(/\bdon't\b/g, "do not").replace(/\bcan't\b/g, "cannot")).join(" ");
    case "bullet":
      return sentences.map(s => "• " + s).join("\n");
    case "concise":
      return sentences.map(s => s.replace(/very|really|extremely/gi, "")).join(" ");
    default:
      return sentences.join(" ");
  }
}
//applyTone-function-end

//copySummary-function-start
function copySummary() {
  const summary = document.getElementById("summary");
  summary.select();
  document.execCommand("copy");
  alert("Summary copied to clipboard!");
}
//copySummary-function-end

//downloadSummary-function-start
function downloadSummary() {
  const text = document.getElementById("summary").value;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "summary.txt";
  link.href = URL.createObjectURL(blob);
  link.click();
}
//downloadSummary-function-end

//improveText-function-start
function improveText() {
  let text = document.getElementById("inputText").value;
  if (!text.trim()) {
    alert("Please enter text to improve.");
    return;
  }
  text = text
    .replace(/\bcan't\b/gi, "cannot")
    .replace(/\bdon't\b/gi, "do not")
    .replace(/\bdoesn't\b/gi, "does not")
    .replace(/\bI'm\b/gi, "I am")
    .replace(/\bvery\b/gi, "")
    .replace(/\breally\b/gi, "")
    .replace(/\bliterally\b/gi, "")
    .replace(/\bjust\b/gi, "")
    .replace(/\bsort of\b/gi, "")
    .replace(/\bkind of\b/gi, "");
  document.getElementById("summary").value = text.trim();
  document.getElementById("summaryStats").innerText = "✅ Improved for clarity and grammar.";
}
//improveText-function-end

//paraphraseText-function-start
function paraphraseText() {
  let text = document.getElementById("inputText").value;

  if (!text.trim()) {
    alert("Please enter text to paraphrase.");
    return;
  }

  const synonyms = {
    important: "crucial",
    good: "beneficial",
    bad: "unfavorable",
    easy: "straightforward",
    hard: "challenging",
    idea: "concept",
    make: "create",
    help: "assist",
    start: "begin",
    big: "significant",
    small: "minor"
  };

  const regex = new RegExp(`\\b(${Object.keys(synonyms).join("|")})\\b`, "gi");

  const paraphrased = text.replace(regex, match => synonyms[match.toLowerCase()] || match);

  document.getElementById("summary").value = paraphrased;
  document.getElementById("summaryStats").innerText = "♻️ Paraphrased with synonym replacements.";
}
//paraphraseText-function-end

//taglineText-start
const taglineText ="Say more with less.";
let i = 0;
//taglineText-function-start
function typeTagline() {
  if (i < taglineText.length) {
    document.getElementById("tagline").innerHTML += taglineText.charAt(i);
    i++;
    setTimeout(typeTagline, 80);
  }
}
//taglineText-function-
window.onload = typeTagline;
//taglineText-end

//window-load-start
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
//window-load-end

//escapeHtml-function-start
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}
//escapeHtml-function-end

//canvas-start
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(animate);
}
animate();
//canvas-end

