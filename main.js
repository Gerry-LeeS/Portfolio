// ═══ LOADER ═══
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderText = document.getElementById('loaderText');
const steps = [
	'Initializing',
	'Loading stars',
	'Mapping constellations',
	'Almost ready',
	'Welcome',
];
let p = 0;
const li = setInterval(() => {
	p += Math.random() * 18 + 8;
	if (p > 100) p = 100;
	loaderBar.style.width = p + '%';
	loaderText.textContent = steps[Math.min(Math.floor(p / 25), 4)];
	if (p >= 100) {
		clearInterval(li);
		setTimeout(() => loader.classList.add('hidden'), 400);
	}
}, 160);

// ═══ CURSOR ═══
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0,
	my = 0,
	rx = 0,
	ry = 0;
document.addEventListener('mousemove', (e) => {
	mx = e.clientX;
	my = e.clientY;
	dot.style.left = mx + 'px';
	dot.style.top = my + 'px';
});
(function cursorLoop() {
	rx += (mx - rx) * 0.1;
	ry += (my - ry) * 0.1;
	ring.style.left = rx + 'px';
	ring.style.top = ry + 'px';
	requestAnimationFrame(cursorLoop);
})();
function refreshHover() {
	document
		.querySelectorAll(
			'a,button,.skill-card,.project-card,.life-card,.social-icon,.contact-soc,.study-orb,.mode-toggle,.btt,.cert-card,.blog-mini,.blog-entry',
		)
		.forEach((el) => {
			el.onmouseenter = () => ring.classList.add('hover');
			el.onmouseleave = () => ring.classList.remove('hover');
		});
}
refreshHover();

// ═══ REVEALS ═══
const obs = new IntersectionObserver(
	(entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add('visible');
				e.target.querySelectorAll('.cert-fill').forEach((f) => {
					if (f.dataset.p && !f.dataset.done) {
						f.dataset.done = '1';
						setTimeout(
							() => f.style.setProperty('--w', f.dataset.p + '%'),
							300,
						);
					}
				});
			}
		});
	},
	{ threshold: 0.1 },
);
document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

// ═══ NAV ═══
const nav = document.getElementById('nav');
window.addEventListener('scroll', () =>
	nav.classList.toggle('scrolled', scrollY > 50),
);
document.querySelectorAll('a[href^="#"]').forEach((a) => {
	a.addEventListener('click', (e) => {
		const h = a.getAttribute('href');
		if (h === '#') return;
		e.preventDefault();
		const t = document.querySelector(h);
		if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

// ═══ LANGUAGE ═══
let lang = 'en';
document.getElementById('langEN').classList.add('active');
window.setLang = function (l) {
	lang = l;
	document.documentElement.dataset.lang = l;
	document.getElementById('langEN').classList.toggle('active', l === 'en');
	document.getElementById('langJA').classList.toggle('active', l === 'ja');
	applyLang();
	updateCV();
	populateBlogPreviews();
};
function applyLang() {
	document.querySelectorAll('[data-en][data-ja]').forEach((el) => {
		const t = el.getAttribute('data-' + lang);
		if (t && el.children.length === 0) el.textContent = t;
		else if (
			t &&
			(el.tagName === 'P' ||
				el.tagName === 'EM' ||
				el.tagName === 'SPAN' ||
				el.tagName === 'H2' ||
				el.tagName === 'H3' ||
				el.tagName === 'H4')
		)
			el.textContent = t;
	});
}
function updateCV() {
	document.querySelectorAll('.cv-download').forEach((a) => {
		const h = a.getAttribute('data-' + lang + '-href');
		if (h) {
			a.href = h;
			a.setAttribute('download', '');
		}
	});
}
updateCV();

// ═══ MODE TOGGLE — labelled WORK / LIFE ═══
function updateModeToggle() {
	const mode = document.documentElement.dataset.mode;
	const workBtn = document.getElementById('modeWorkBtn');
	const lifeBtn = document.getElementById('modeLifeBtn');
	const slider = document.getElementById('modeSlider');

	workBtn.classList.toggle('active', mode === 'professional');
	lifeBtn.classList.toggle('active', mode === 'personal');

	// Position slider
	if (mode === 'professional') {
		slider.style.left = '2px';
		slider.style.width = workBtn.offsetWidth + 'px';
	} else {
		slider.style.left = workBtn.offsetWidth + 'px';
		slider.style.width = lifeBtn.offsetWidth + 'px';
	}
}

window.setMode = function (mode) {
	document.documentElement.dataset.mode = mode;
	updateModeToggle();
	setTimeout(() => {
		document
			.querySelectorAll('.reveal:not(.visible)')
			.forEach((el) => obs.observe(el));
		refreshHover();
		populateBlogPreviews();
	}, 100);
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.toggleMode = function () {
	const isP = document.documentElement.dataset.mode === 'personal';
	setMode(isP ? 'professional' : 'personal');
};

// Init toggle after DOM ready
setTimeout(updateModeToggle, 50);
window.addEventListener('resize', updateModeToggle);

// ═══ MOBILE NAV ═══
window.openMobileNav = () =>
	document.getElementById('mobileNav').classList.add('active');
window.closeMobileNav = () =>
	document.getElementById('mobileNav').classList.remove('active');

// ═══ MAGNETIC ═══
document.querySelectorAll('.magnetic').forEach((btn) => {
	btn.addEventListener('mousemove', (e) => {
		const r = btn.getBoundingClientRect();
		btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px, ${(e.clientY - r.top - r.height / 2) * 0.12}px)`;
	});
	btn.addEventListener('mouseleave', () => {
		btn.style.transform = '';
	});
});

// ═══ PARALLAX ═══
window.addEventListener('scroll', () => {
	const y = scrollY;
	document.querySelectorAll('.nebula').forEach((n, i) => {
		n.style.transform = `translateY(${y * (0.015 + i * 0.01)}px)`;
	});
});

// ═══ BLOG DATA ═══
const blogArticles = {
	article1: {
		icon: 'fa-solid fa-code',
		title: {
			en: 'My First 100 Days of Web Development',
			ja: 'ウェブ開発の最初の100日間',
		},
		date: 'January 2026',
		summary: {
			en: "Three months ago, I wrote my first line of HTML. Today, I'm building animated, bilingual portfolio sites. Here's what 100 days of learning actually looks like.",
			ja: '3ヶ月前、初めてHTMLを書きました。100日間の学習の軌跡。',
		},
		tags: ['Web Development', 'Learning Journey', 'Self-Taught'],
		content: {
			en: `<h3>Why I Started</h3><p>I've always been drawn to creating things. Not just functional things, but things that look good, feel good to use, and make people think "oh, that's nice." Web development felt like the perfect blend of logic and creativity — code on one side, design and user experience on the other.</p><p>What really pulled me in was the idea that I could build something from nothing. A blank screen turning into a real product. A real interface. A real experience.</p><h3>What I've Learned So Far</h3><p>The technical side has been challenging, but rewarding:</p><ul><li>HTML/CSS fundamentals (and how deceptively deep CSS actually is)</li><li>JavaScript basics and the mental shift of thinking in logic</li><li>Debugging (which is basically a skill on its own)</li><li>Structuring projects so they don't become chaos</li><li>That Google is basically a core development tool</li></ul><p>But more importantly, I've learned <strong>how to learn:</strong></p><ul><li>You will feel lost often — that's normal</li><li>Progress is rarely linear</li><li>You understand things deeply only after breaking them multiple times</li><li>Consistency beats motivation</li></ul><h3>The Challenges No One Warns You About</h3><p>The hardest part hasn't been syntax. It's been:</p><ul><li>Imposter syndrome ("Real developers probably understand this better than me")</li><li>Overwhelm (there are too many tools, frameworks, opinions)</li><li>Wanting things to be perfect too early</li><li>Comparing my progress to people who've been coding for years</li></ul><p>There were days where I felt stuck, slow, or like I wasn't improving. But when I compare myself to day 1? The difference is massive.</p><h3>What I Actually Enjoy About Web Development</h3><p>Surprisingly, I'm not just here for the logic. What I really love is:</p><ul><li>Animations that make interfaces feel alive</li><li>Layouts that feel clean and intentional</li><li>Micro-interactions that improve UX</li><li>Making something look beautiful and functional</li></ul><p><em>Good UX feels like good music: when it's done well, you don't notice it — you just enjoy the experience.</em></p><h3>100 Days In</h3><p>I'm still early in the journey. I still feel like a beginner most days. But I'm a beginner who can now build things, understand problems, and learn faster than before.</p><p>And honestly? That's enough motivation to keep going.</p>`,
			ja: '翻訳準備中',
		},
	},
	article2: {
		icon: 'fa-solid fa-music',
		title: {
			en: 'Coming Back to Music: Why Piano Finally Feels Like Home',
			ja: '音楽への回帰：ピアノがついに家のように感じる理由',
		},
		date: 'January 2026',
		summary: {
			en: 'I was nudged toward other instruments for years. Drums. Guitar. Things that were available. But the piano stayed in the background — always calling quietly.',
			ja: '長年他の楽器に導かれましたが、ピアノはいつも静かに呼んでいました。',
		},
		tags: ['Music', 'Piano', 'Personal Growth'],
		content: {
			en: `<p>Instead, I was nudged toward other instruments. Drums. Guitar. Things that were available, practical, or just… convenient. I tried them, but something never fully clicked.</p><p>The piano stayed in the background. Always there. Always calling quietly.</p><h3>The Instrument I Always Wanted</h3><p>There's something different about piano. It's complete on its own. Harmony, melody, rhythm — everything under your fingertips. It feels less like controlling an instrument and more like directly speaking in music.</p><p>For years, I told myself: <em>"Maybe one day."</em></p><p>Eventually, I realized something uncomfortable: If I kept waiting for "one day," it would never come.</p><p>So I finally did it. I got a piano.</p><h3>Practicing Every Day</h3><p>Now, I practice daily. Sometimes twice a day. Scales, exercises, pieces, slow repetition, careful listening. Some sessions feel frustrating. Some feel magical. Most are somewhere in between.</p><p>But I genuinely love the process.</p><p><strong>I love:</strong></p><ul><li>The feeling when a difficult bar finally flows</li><li>The way my hands slowly start to understand without conscious effort</li><li>The quiet focus it forces</li><li>The emotional connection to pieces I can barely play yet</li></ul><p>It's not about sounding impressive (yet). It's about building something deeply personal.</p><h3>Starting Late, But Seriously</h3><p>Sure, I started later than many pianists. But I've stopped seeing that as a disadvantage. If anything, it's fuel. I'm not practicing because someone told me to. I'm practicing because I want to.</p><p>This time, it's my choice. My commitment. My instrument.</p><p>And that makes all the difference.</p>`,
			ja: '翻訳準備中',
		},
	},
	article3: {
		icon: 'fa-solid fa-paw',
		title: {
			en: 'From Zookeeping to Web Development',
			ja: '動物園飼育員からウェブ開発者へ',
		},
		date: 'January 2026',
		summary: {
			en: "If you'd asked me a few years ago where I'd be today, 'web development' probably wouldn't have made the list. 'Zookeeper,' though? That was my reality.",
			ja: '数年前の私に「ウェブ開発者になる」と言っても信じなかったでしょう。',
		},
		tags: ['Career Change', 'Life Story', 'Zookeeping'],
		content: {
			en: `<p>For over five years, I worked with animals most people only ever see in documentaries: lions, primates, large herbivores, predators, prey species, complex social groups — almost every African animal you can think of… except elephants.</p><p>It wasn't glamorous. It wasn't Instagram-friendly most days. It was physical, intense, mentally demanding, and often misunderstood.</p><h3>What Zookeeping Actually Taught Me</h3><p>People imagine zookeeping as feeding animals and taking cute photos. The reality is closer to:</p><ul><li>Risk assessment every single day</li><li>Strict routines that cannot be broken</li><li>Deep understanding of behavior and psychology</li><li>Problem-solving under pressure</li><li>Responsibility for living beings that can seriously harm you</li></ul><p>You learn quickly that attention to detail isn't optional. You learn that consistency keeps everyone safe. You learn that systems matter.</p><p><em>Sound familiar?</em></p><h3>The Unexpected Connection to Tech</h3><p>Strangely, web development scratches some of the same mental itches:</p><ul><li>You observe behavior (users instead of animals)</li><li>You build environments (interfaces instead of enclosures)</li><li>You predict outcomes (UX flows instead of animal responses)</li><li>You constantly refine systems</li></ul><p>Bad enclosure design stresses animals.<br>Bad UX stresses users.</p><p>Good design makes both feel safe, understood, and comfortable.</p><h3>Why I Changed Paths</h3><p>Zookeeping is meaningful work. But it's also physically exhausting, financially limiting, and emotionally heavy. Long-term sustainability is a real concern.</p><p>Web development offered something different:</p><ul><li>Creative freedom</li><li>Long-term growth</li><li>A skill that scales globally</li><li>The ability to build things independently</li></ul><p>I didn't abandon one world for another. I evolved into a new one, carrying everything I learned with me.</p><h3>A Strange Background — and a Strength</h3><p>My path isn't traditional. It's not "computer science degree → junior dev → startup."<br>It's lions → primates → shift rotas → HTML → JavaScript → CSS animations.</p><p>And honestly? I wouldn't trade that perspective.</p><p>It gives me patience. It gives me discipline. It gives me respect for systems, environments, and the impact of good design.</p>`,
			ja: '翻訳準備中',
		},
	},
};

// ═══ BLOG MINI PREVIEWS (on the life card) ═══
function populateBlogPreviews() {
	const container = document.getElementById('blogPreview');
	if (!container) return;
	const keys = Object.keys(blogArticles).slice(0, 3);
	container.innerHTML = keys
		.map((key) => {
			const a = blogArticles[key];
			return `<div class="blog-mini" onclick="openBlogArticle('${key}')">
      <div class="blog-mini-date">${a.date}</div>
      <div class="blog-mini-title">${lang === 'ja' ? a.title.ja : a.title.en}</div>
      <div class="blog-mini-tags">${a.tags
				.slice(0, 2)
				.map((t) => `<span>${t}</span>`)
				.join('')}</div>
    </div>`;
		})
		.join('');
	refreshHover();
}
populateBlogPreviews();

// ═══ BLOG LIST MODAL ═══
window.openBlogList = function () {
	const body = document.getElementById('blogListBody');
	const keys = Object.keys(blogArticles);
	const j = lang === 'ja';
	body.innerHTML = keys
		.map((key) => {
			const a = blogArticles[key];
			return `<div class="blog-entry">
      <div class="blog-entry-header">
        <div class="blog-entry-icon"><i class="${a.icon}"></i></div>
        <div class="blog-entry-meta">
          <div class="blog-entry-date">${a.date}</div>
          <div class="blog-entry-title">${j ? a.title.ja : a.title.en}</div>
        </div>
      </div>
      <div class="blog-entry-summary">"${j ? a.summary.ja : a.summary.en}"</div>
      <div class="blog-entry-footer">
        <div class="blog-entry-tags">${a.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        <button class="btn btn-sm btn-outline magnetic" onclick="openBlogArticle('${key}')"><i class="fa-solid fa-book-open"></i> ${j ? '全文を読む' : 'Read Full Article'}</button>
      </div>
    </div>`;
		})
		.join('');
	document.getElementById('blogListOverlay').classList.add('active');
	document.body.style.overflow = 'hidden';
	refreshHover();
};

window.closeBlogList = function (e) {
	if (e.target === document.getElementById('blogListOverlay'))
		closeBlogListDirect();
};
window.closeBlogListDirect = function () {
	document.getElementById('blogListOverlay').classList.remove('active');
	document.body.style.overflow = '';
};

// ═══ BLOG ARTICLE MODAL ═══
window.openBlogArticle = function (key) {
	const a = blogArticles[key];
	if (!a) return;
	const j = lang === 'ja';

	// Close blog list if open
	document.getElementById('blogListOverlay').classList.remove('active');

	document.getElementById('blogArticleHeader').innerHTML = `
    <div class="blog-article-date"><i class="fa-regular fa-calendar"></i> ${a.date}</div>
    <div class="blog-article-title">${j ? a.title.ja : a.title.en}</div>
    <div class="blog-article-tags">${a.tags.map((t) => `<span class="blog-entry-tags"><span>${t}</span></span>`).join('')}</div>
    <div class="blog-article-divider"></div>
  `;
	document.getElementById('blogArticleBody').innerHTML = j
		? a.content.ja
		: a.content.en;
	document.getElementById('blogArticleOverlay').classList.add('active');
	document.body.style.overflow = 'hidden';

	// Scroll modal to top
	document.querySelector('#blogArticleOverlay .modal').scrollTop = 0;
};

window.backToBlogList = function () {
	document.getElementById('blogArticleOverlay').classList.remove('active');
	setTimeout(() => openBlogList(), 200);
};

window.closeBlogArticle = function (e) {
	if (e.target === document.getElementById('blogArticleOverlay'))
		closeBlogArticleDirect();
};
window.closeBlogArticleDirect = function () {
	document.getElementById('blogArticleOverlay').classList.remove('active');
	document.body.style.overflow = '';
};

// ═══ PROJECT MODAL ═══
const projectData = {
	1: {
		title: 'GILLMAN — A New Musical',
		titleJa: 'GILLMAN — 新作ミュージカルサイト',
		tags: ['HTML', 'CSS', 'JavaScript', 'Animation', 'Responsive'],
		tech: [
			'HTML5',
			'CSS3',
			'JavaScript',
			'CSS Animations',
			'Scroll Effects',
			'Responsive Design',
			'Google Fonts',
		],
		challenges: [
			'Creating an immersive theatrical atmosphere through web design',
			'Building a full song listing with expandable track details',
			'Designing a vintage circus/sideshow ticket aesthetic',
			'Smooth scroll-triggered animations throughout the site',
			'Responsive layout across all devices while maintaining the dramatic feel',
		],
		challengesJa: [
			'ウェブデザインで没入感のある劇場の雰囲気を作成',
			'曲目リストの構築',
			'ヴィンテージサーカスチケットの美学',
			'スクロールアニメーション',
			'レスポンシブ対応',
		],
		solutions: [
			'Dark, cinematic colour palette with gold accents and atmospheric backgrounds',
			'Custom marquee animations and parallax scroll effects',
			'A 17-track song listing with artist, type, and expandable details',
			'Interactive gallery, review carousel, and theatre venue cards',
			'Fully responsive with carefully preserved visual drama on mobile',
		],
		solutionsJa: [
			'シネマティックな配色とゴールドアクセント',
			'カスタムマーキーアニメーション',
			'17曲のトラックリスト',
			'ギャラリーとレビューカルーセル',
			'モバイル完全対応',
		],
		learned:
			'This project pushed my design skills the furthest — learning to create genuine atmosphere and emotion through CSS, layout, and typography. Building something that feels like a real theatrical production site was a turning point.',
		learnedJa:
			'CSSとレイアウトで本物の劇場の雰囲気を作り出すことを学びました。',
		metrics: [
			{ v: '17', l: 'SONG TRACKS' },
			{ v: '6+', l: 'SECTIONS' },
			{ v: '✓', l: 'LIVE SITE' },
			{ v: '100%', l: 'RESPONSIVE' },
		],
	},
	2: {
		title: 'Casino Site Reviews',
		titleJa: 'カジノサイトレビュー',
		tags: ['JavaScript', 'CSS', 'Dynamic', 'API', 'Dark Mode'],
		tech: [
			'HTML5',
			'CSS3',
			'JavaScript',
			'DOM Manipulation',
			'LocalStorage',
			'Responsive Design',
			'CSS Variables',
		],
		challenges: [
			'Building a dynamic filtering and sorting system entirely in JavaScript',
			'Creating a casino comparison tool for side-by-side evaluation',
			'Implementing a bonus wagering calculator with real-time results',
			'Dark mode toggle that persists across sessions',
			'Managing a large dataset of casino reviews with consistent card layouts',
		],
		challengesJa: [
			'JavaScriptでの動的フィルタリング',
			'カジノ比較ツール',
			'ボーナス計算機',
			'ダークモード',
			'大規模データの管理',
		],
		solutions: [
			'Custom filtering engine with multiple criteria and smooth DOM updates',
			'Side-by-side comparison modal with detailed feature breakdown',
			'Interactive calculator that factors in wagering requirements and bonus types',
			'CSS variables with localStorage-persisted dark/light mode',
			'Reusable card component system for consistent review presentation',
		],
		solutionsJa: [
			'カスタムフィルタリングエンジン',
			'比較モーダル',
			'インタラクティブ計算機',
			'CSS変数でダーク/ライトモード',
			'再利用可能なカードシステム',
		],
		learned:
			'This was my most JavaScript-heavy project. I learned to think about data flow, DOM performance, and building interactive tools that feel polished — not just functional pages, but actual web applications.',
		learnedJa:
			'最もJavaScriptを多用したプロジェクト。データフロー、DOMパフォーマンス、インタラクティブツールの構築を学びました。',
		metrics: [
			{ v: '5+', l: 'CASINO REVIEWS' },
			{ v: '7-Point', l: 'REVIEW SYSTEM' },
			{ v: '✓', l: 'COMPARISON TOOL' },
			{ v: '✓', l: 'DARK MODE' },
		],
	},
	3: {
		title: 'LyFocus — Company Edition',
		titleJa: 'LyFocus — 企業版',
		tags: ['Full-Stack', 'JavaScript', 'Auth', 'Dashboard', 'Multi-Role'],
		tech: [
			'HTML5',
			'CSS3',
			'JavaScript',
			'Authentication',
			'Role-Based Access',
			'Dashboard Design',
			'Form Handling',
			'Data Visualization',
		],
		challenges: [
			'Designing a multi-role system with completely different dashboards per role',
			'Building an automated stress check questionnaire system for Japanese workplace law',
			'Role-based access control: employees, managers, HR, and medical staff',
			'Creating an XP and levelling system tied to task completion',
			'Medical practitioner notes that persist across multiple stress test cycles',
		],
		challengesJa: [
			'役割別ダッシュボード設計',
			'ストレスチェック自動化',
			'ロールベースアクセス制御',
			'XPレベルシステム',
			'医療記録の永続化',
		],
		solutions: [
			'Separate dashboard views with role-specific navigation and permissions',
			'Automated stress questionnaire distribution to individuals or entire departments',
			'Employee mood logging, journal, daily tasks, and repeating task system',
			'HR department overview with stress levels, happiness metrics, and leave management',
			'Medical staff calendar, appointment scheduling, and cross-practitioner note system',
		],
		solutionsJa: [
			'役割別ダッシュボードビュー',
			'ストレスアンケート自動配信',
			'従業員のムードログ、ジャーナル、タスク管理',
			'HR部門概要',
			'医療スタッフカレンダーとノートシステム',
		],
		learned:
			'This is my most ambitious project — it taught me to think about systems at scale. User roles, permissions, data flow between departments, and designing for real workplace legislation (Japanese stress check requirements). It bridged the gap between "website" and "web application."',
		learnedJa:
			'最も野心的なプロジェクト。ユーザー役割、権限、部門間データフロー、実際の職場法規への対応を学びました。',
		metrics: [
			{ v: '4', l: 'USER ROLES' },
			{ v: '✓', l: 'STRESS CHECKS' },
			{ v: '✓', l: 'XP SYSTEM' },
			{ v: 'JP Law', l: 'COMPLIANCE' },
		],
	},
	4: {
		title: 'LyFocus — Simple Edition',
		titleJa: 'LyFocus — シンプル版',
		tags: ['HTML', 'CSS', 'JavaScript', 'Productivity'],
		tech: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage', 'Responsive Design'],
		challenges: [
			'Building a personal journalling system with persistent data',
			'Creating a mood logging interface that feels inviting, not clinical',
			'Implementing repeating daily tasks alongside standard to-do lists',
			'Clean, minimal UI that stays out of the way',
		],
		challengesJa: [
			'永続データのジャーナルシステム',
			'ムードログインターフェース',
			'繰り返しタスクの実装',
			'ミニマルUI',
		],
		solutions: [
			'LocalStorage-powered journal entries with date organisation',
			'Visual mood selector with emoji-based logging',
			'Dual task system: one-off to-dos and recurring daily habits',
			'Focused, distraction-free design with soft colour palette',
		],
		solutionsJa: [
			'LocalStorageによるジャーナル',
			'ビジュアルムードセレクター',
			'デュアルタスクシステム',
			'ミニマルデザイン',
		],
		learned:
			'This taught me about building apps people actually want to use daily. The focus was on simplicity — every feature had to earn its place. It was also my first experience with persistent data using LocalStorage.',
		learnedJa: '毎日使いたくなるアプリの構築を学びました。シンプルさが重要。',
		metrics: [
			{ v: '✓', l: 'JOURNAL' },
			{ v: '✓', l: 'MOOD LOG' },
			{ v: '✓', l: 'DAILY TASKS' },
			{ v: 'Minimal', l: 'UI DESIGN' },
		],
	},
	5: {
		title: 'Leno — Productivity App',
		titleJa: 'Leno — 生産性アプリサイト',
		tags: ['HTML', 'CSS', 'Static Site', 'Course Project'],
		tech: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
		challenges: [
			'Creating a modern, professional layout as a beginner',
			'Implementing smooth animations and transitions',
			'Making the site fully responsive across all devices',
			'Designing an attractive hero section',
		],
		challengesJa: [
			'初心者としてモダンなレイアウトを作成',
			'スムーズなアニメーション',
			'レスポンシブ対応',
			'ヒーローセクション',
		],
		solutions: [
			'Clean, semantic HTML following course best practices',
			'CSS animations for smooth user experience',
			'Mobile-first responsive design approach',
			'Engaging hero section with clear CTA buttons',
		],
		solutionsJa: [
			'セマンティックHTML',
			'CSSアニメーション',
			'モバイルファーストデザイン',
			'CTAボタン付きヒーロー',
		],
		learned:
			'My first real project — it taught me the fundamentals of building professional websites and gave me confidence that I could actually do this.',
		learnedJa:
			'初めてのプロジェクト。プロフェッショナルなサイト構築の基礎と自信を得ました。',
		metrics: [
			{ v: 'Static', l: 'SITE TYPE' },
			{ v: 'HTML/CSS', l: 'TECH' },
			{ v: '100%', l: 'RESPONSIVE' },
			{ v: 'Course', l: 'PROJECT' },
		],
	},
	6: {
		title: 'Tutor — Tutoring Platform',
		titleJa: 'Tutor — 家庭教師サイト',
		tags: ['HTML', 'CSS', 'Responsive', 'Landing Page'],
		tech: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design'],
		challenges: [
			'Designing a trustworthy, professional service landing page',
			'Clear information hierarchy for pricing and services',
			'Responsive layout that works from mobile to desktop',
			'Creating visual consistency throughout multiple sections',
		],
		challengesJa: [
			'信頼感のあるランディングページ',
			'料金とサービスの情報設計',
			'レスポンシブレイアウト',
			'ビジュアル一貫性',
		],
		solutions: [
			'Clean, approachable design with clear typography hierarchy',
			'Well-structured pricing cards with feature comparison',
			'Fully responsive with consistent spacing and alignment',
			'Cohesive colour palette and component styling throughout',
		],
		solutionsJa: [
			'クリーンなデザインとタイポグラフィ',
			'料金カード',
			'完全レスポンシブ',
			'統一された配色',
		],
		learned:
			'This project reinforced my layout fundamentals and taught me about designing for trust — a tutoring site needs to feel professional and approachable at the same time.',
		learnedJa: 'レイアウトの基礎と信頼感のあるデザインを学びました。',
		metrics: [
			{ v: 'Landing', l: 'PAGE TYPE' },
			{ v: 'HTML/CSS', l: 'TECH' },
			{ v: '✓', l: 'PRICING' },
			{ v: '100%', l: 'RESPONSIVE' },
		],
	},
	7: {
		title: 'Portfolio Website',
		titleJa: 'ポートフォリオサイト',
		tags: ['HTML', 'CSS', 'JavaScript', 'Canvas', 'Bilingual'],
		tech: [
			'HTML5',
			'CSS3',
			'JavaScript',
			'Canvas API',
			'CSS Animations',
			'IntersectionObserver',
			'Responsive',
		],
		challenges: [
			'Building an immersive star-field particle system with Canvas',
			'Seamless bilingual EN/JP language switching',
			'Dual-mode experience — Moon (professional) / Sun (personal)',
			'Performant animations with 160+ star particles and shooting stars',
			'Full blog system with list and article modals',
		],
		challengesJa: [
			'Canvasスターフィールドの構築',
			'バイリンガル切替',
			'デュアルモード体験',
			'高性能アニメーション',
			'ブログシステム',
		],
		solutions: [
			'Custom Canvas star system with twinkling, drift, constellation lines, and shooting stars',
			'Data attributes on every element with JS toggle for all text content',
			'CSS custom properties for instant Moon/Sun theme switching',
			'IntersectionObserver for scroll-triggered reveals and progress animations',
			'Three-tier blog: preview cards, article list modal, full article modal',
		],
		solutionsJa: [
			'カスタムCanvasスターシステム',
			'データ属性とJSトグル',
			'CSSカスタムプロパティ',
			'IntersectionObserver',
			'3層ブログシステム',
		],
		learned:
			'This was the project where everything came together — animations, theming, bilingual support, Canvas, modals. It taught me that a portfolio should be a portfolio piece in itself.',
		learnedJa:
			'すべてが融合したプロジェクト。ポートフォリオ自体が作品であるべきことを学びました。',
		metrics: [
			{ v: 'Dynamic', l: 'SITE TYPE' },
			{ v: '160+', l: 'STAR PARTICLES' },
			{ v: 'EN/JP', l: 'BILINGUAL' },
			{ v: '🌙/☀️', l: 'MOON / SUN' },
		],
	},
};

window.openModal = function (id) {
	const d = projectData[id];
	if (!d) return;
	const j = lang === 'ja';
	document.getElementById('modalTitle').textContent = j ? d.titleJa : d.title;
	document.getElementById('modalTags').innerHTML = d.tags
		.map((t) => `<span class="ptags"><span>${t}</span></span>`)
		.join('');
	const ch = j ? d.challengesJa : d.challenges,
		sl = j ? d.solutionsJa : d.solutions;
	const liveUrls = {
		1: 'https://thegillman.co.uk/',
		2: 'https://casinositereviews.co.uk/',
	};
	const liveUrl = liveUrls[id];
	const ctaHtml = liveUrl
		? `<div class="modal-cta"><a href="${liveUrl}" target="_blank" class="btn btn-primary magnetic" style="width:100%;justify-content:center"><i class="fa-solid fa-arrow-up-right-from-square"></i> ${j ? 'サイトを見る' : 'VISIT LIVE SITE'}</a></div>`
		: id === 3
			? `<div class="modal-cta" style="text-align:center"><span style="font-family:var(--fm);font-size:0.65rem;color:var(--text3);letter-spacing:1px"><i class="fa-solid fa-wrench" style="margin-right:6px"></i>${j ? '開発中' : 'CURRENTLY IN DEVELOPMENT'}</span></div>`
			: '';
	document.getElementById('modalBody').innerHTML = `
    <div class="modal-section"><div class="modal-section-title"><i class="fa-solid fa-code"></i> ${j ? '使用技術' : 'Technologies Used'}</div><div class="modal-tech-stack">${d.tech.map((t) => `<span class="modal-tech-tag">${t}</span>`).join('')}</div></div>
    <div class="modal-section"><div class="modal-section-title"><i class="fa-solid fa-triangle-exclamation"></i> ${j ? '課題' : 'Challenges'}</div><ul>${ch.map((c) => `<li><i class="fa-solid fa-triangle-exclamation"></i> ${c}</li>`).join('')}</ul></div>
    <div class="modal-section"><div class="modal-section-title"><i class="fa-solid fa-lightbulb"></i> ${j ? 'ソリューション' : 'Solutions'}</div><ul>${sl.map((s) => `<li><i class="fa-solid fa-square-check"></i> ${s}</li>`).join('')}</ul></div>
    <div class="modal-section"><div class="modal-section-title"><i class="fa-solid fa-graduation-cap"></i> ${j ? '学んだこと' : 'What I Learned'}</div><p>${j ? d.learnedJa : d.learned}</p></div>
    <div class="modal-section"><div class="modal-section-title"><i class="fa-solid fa-chart-line"></i> ${j ? '結果' : 'Metrics'}</div><div class="modal-metrics">${d.metrics.map((m) => `<div class="modal-metric"><div class="modal-metric-value">${m.v}</div><div class="modal-metric-label">${m.l}</div></div>`).join('')}</div></div>
    ${ctaHtml}
  `;
	document.getElementById('modalOverlay').classList.add('active');
	document.body.style.overflow = 'hidden';
};
window.closeModal = function (e) {
	if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
};
window.closeModalDirect = function () {
	document.getElementById('modalOverlay').classList.remove('active');
	document.body.style.overflow = '';
};
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		closeModalDirect();
		closeBlogListDirect();
		closeBlogArticleDirect();
	}
});
