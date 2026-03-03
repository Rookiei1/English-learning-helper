const STORAGE_KEY = 'english_helper_words_v1';

const defaultWords = [
  { english: 'apple', chinese: '苹果' },
  { english: 'book', chinese: '书' },
  { english: 'water', chinese: '水' },
  { english: 'teacher', chinese: '老师' },
  { english: 'beautiful', chinese: '美丽的' },
  { english: 'travel', chinese: '旅行' },
  { english: 'future', chinese: '未来' },
  { english: 'window', chinese: '窗户' }
];

const form = document.getElementById('word-form');
const englishInput = document.getElementById('english');
const chineseInput = document.getElementById('chinese');
const wordListEl = document.getElementById('word-list');
const wordCountEl = document.getElementById('word-count');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const correctCountEl = document.getElementById('correct-count');
const totalCountEl = document.getElementById('total-count');

let words = loadWords();
let currentAnswer = null;
let locked = false;
let correctCount = 0;
let totalCount = 0;

renderWords();
startQuiz();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const english = englishInput.value.trim().toLowerCase();
  const chinese = chineseInput.value.trim();

  if (!english || !chinese) return;

  const exists = words.some((word) => word.english === english);
  if (exists) {
    feedbackEl.textContent = `单词 ${english} 已存在，请勿重复添加。`;
    feedbackEl.style.color = '#c0392b';
    return;
  }

  words.push({ english, chinese });
  saveWords();
  renderWords();
  form.reset();
  feedbackEl.textContent = `已添加单词：${english} → ${chinese}`;
  feedbackEl.style.color = '#168447';
});

nextBtn.addEventListener('click', startQuiz);

function loadWords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWords));
    return [...defaultWords];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 4) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWords));
      return [...defaultWords];
    }
    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWords));
    return [...defaultWords];
  }
}

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function renderWords() {
  wordCountEl.textContent = String(words.length);
  wordListEl.innerHTML = words
    .map((word) => `<li><span>${word.english}</span><span>${word.chinese}</span></li>`)
    .join('');
}

function startQuiz() {
  if (words.length < 4) {
    questionEl.textContent = '至少需要 4 个单词才能开始测验。';
    optionsEl.innerHTML = '';
    return;
  }

  locked = false;
  feedbackEl.textContent = '';

  const questionWord = pickRandom(words);
  currentAnswer = questionWord.chinese;

  const wrongChoices = shuffle(
    words.filter((word) => word.chinese !== currentAnswer)
  ).slice(0, 3).map((w) => w.chinese);

  const options = shuffle([currentAnswer, ...wrongChoices]);

  questionEl.textContent = `“${questionWord.english}” 的中文是？`;
  optionsEl.innerHTML = '';

  options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(button, option));
    optionsEl.appendChild(button);
  });
}

function checkAnswer(button, picked) {
  if (locked) return;
  locked = true;
  totalCount += 1;

  const allButtons = Array.from(document.querySelectorAll('.option-btn'));

  if (picked === currentAnswer) {
    correctCount += 1;
    button.classList.add('correct');
    feedbackEl.textContent = '回答正确，太棒了！';
    feedbackEl.style.color = '#168447';
  } else {
    button.classList.add('wrong');
    allButtons.forEach((btn) => {
      if (btn.textContent === currentAnswer) {
        btn.classList.add('correct');
      }
    });
    feedbackEl.textContent = `回答错误，正确答案是：${currentAnswer}`;
    feedbackEl.style.color = '#c0392b';
  }

  correctCountEl.textContent = String(correctCount);
  totalCountEl.textContent = String(totalCount);
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
