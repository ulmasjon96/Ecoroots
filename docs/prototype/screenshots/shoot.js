// usage: node shoot.js <fileURL> <outDir> [widths] [views]
const { chromium } = require('playwright');
const fs = require('fs');
const [URL, OUT, W_ARG, V_ARG] = process.argv.slice(2);
const WIDTHS = (W_ARG || '360,390,768,1024,1280,1440').split(',').map(Number);
fs.mkdirSync(OUT, { recursive: true });
const SEED = {
	'ecoroots:orders': [
		{
			id: 'ORD-DEMO01',
			region: 'buxoro',
			species: 'tut',
			count: 3,
			forWhom: 'gift',
			name: 'Madinabonu Abdurahmonova',
			message: 'Tugʻilgan kuning bilan! Bu daraxt sen bilan birga oʻssin.',
			pay: 'payme',
			total: 105000,
			status: 'planted',
			created: '2026-09-20T10:00:00Z',
			treeIds: ['ECR-UZ-BU-90001'],
		},
		{
			id: 'ORD-DEMO02',
			region: 'orol',
			species: 'saksovul',
			count: 10,
			forWhom: 'company',
			name: 'Zarafshon Logistics',
			message: '',
			pay: 'click',
			total: 250000,
			status: 'paid',
			created: '2026-09-24T10:00:00Z',
			treeIds: [],
		},
	],
	'ecoroots:mytrees': [
		{
			id: 'ECR-UZ-BU-90001',
			species: 'tut',
			owner: 'Madinabonu Abdurahmonova',
			region: 'buxoro',
			lat: 39.51,
			lon: 63.86,
			planted: '2026-09-21T08:00:00Z',
			status: 'planted',
			dedication: 'Tugʻilgan kuning bilan! Bu daraxt sen bilan birga oʻssin.',
			mine: true,
			photo: null,
		},
	],
};
const plant = step => async p => {
	await p.evaluate(step => {
		W = {
			step,
			region: 'buxoro',
			species: step >= 1 ? 'pista' : null,
			count: 5,
			forWhom: 'gift',
			name: step >= 2 ? 'Madinabonu Abdurahmonova' : '',
			message: step >= 2 ? 'Tugʻilgan kuning bilan!' : '',
			pay: step >= 3 ? 'uzum' : null,
		};
		if (step === 0) W.region = 'orol';
		pagePlant();
	}, step);
};
const VIEWS = {
	home: { hash: '#/' },
	map: { hash: '#/map', wait: 600 },
	plant1: { hash: '#/plant', after: plant(0) },
	plant2: { hash: '#/plant', after: plant(1) },
	plant3: { hash: '#/plant', after: plant(2) },
	plant4: { hash: '#/plant', after: plant(3) },
	my: { hash: '#/my' },
	rating: { hash: '#/rating' },
	partner: { hash: '#/partner' },
	admin: { hash: '#/admin' },
	org: { hash: '#/org' },
	tree: { hash: '#/tree/ECR-UZ-BU-90001', wait: 500 },
	'modal-cert': {
		hash: '#/tree/ECR-UZ-BU-90001',
		wait: 500,
		after: async p => {
			await p.click('#certBtn');
		},
		modal: true,
	},
	'modal-share': {
		hash: '#/my',
		after: async p => {
			await p.click('[data-share]');
		},
		modal: true,
	},
};
const names = V_ARG ? V_ARG.split(',') : Object.keys(VIEWS);
// Finds real layout problems: page h-scroll, elements poking out of their (non-scrolling) container, clipped text.
function audit() {
	const out = [];
	const de = document.documentElement;
	if (de.scrollWidth > de.clientWidth) out.push(`page h-scroll: ${de.scrollWidth} > ${de.clientWidth}`);
	const root = document.querySelector('dialog[open]') || document.body;
	const skip = el =>
		el.closest('svg, #heroMap, #mapCanvas, #miniMap, .table-wrap, .toast, [hidden]') ||
		(el.offsetParent === null && getComputedStyle(el).position !== 'fixed');
	const desc = el =>
		el.tagName.toLowerCase() +
		(el.id ? '#' + el.id : '') +
		(el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') +
		` "${(el.textContent || '').trim().slice(0, 30)}"`;
	for (const el of root.querySelectorAll('*')) {
		if (skip(el)) continue;
		const r = el.getBoundingClientRect();
		if (!r.width || !r.height) continue;
		const par = el.parentElement;
		if (par && par !== document.body) {
			const pr = par.getBoundingClientRect(),
				cs = getComputedStyle(par);
			if (
				cs.overflowX === 'visible' &&
				(r.right > pr.right + 1 || r.left < pr.left - 1) &&
				getComputedStyle(el).position !== 'absolute' &&
				getComputedStyle(el).position !== 'fixed'
			)
				out.push(
					`overflows parent: ${desc(el)} [${Math.round(r.left)}..${Math.round(r.right)}] in ${desc(par)} [${Math.round(pr.left)}..${Math.round(pr.right)}]`,
				);
		}
		if (r.right > innerWidth + 1 && getComputedStyle(el).position !== 'fixed')
			out.push(`past viewport: ${desc(el)} right=${Math.round(r.right)}`);
		const cs = getComputedStyle(el);
		if (
			(cs.overflow === 'hidden' || cs.overflowX === 'hidden') &&
			cs.textOverflow !== 'ellipsis' &&
			el.scrollWidth > el.clientWidth + 1 &&
			el.children.length === 0
		)
			out.push(`clipped text: ${desc(el)}`);
	}
	const top = document.querySelector('.top-in');
	if (top && Math.round(top.getBoundingClientRect().height) > 64)
		out.push(`header taller than 64px: ${Math.round(top.getBoundingClientRect().height)}`);
	// one-line controls that wrapped onto two lines
	// count rendered text lines of an element (via its text ranges), independent of line-height/padding
	const lines = el => {
		const tops = [],
			tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		for (let n; (n = tw.nextNode()); ) {
			if (!n.textContent.trim() || n.parentElement.closest('svg')) continue;
			const rg = document.createRange();
			rg.selectNodeContents(n);
			for (const q of rg.getClientRects())
				if (q.width >= 1 && !tops.some(t => Math.abs(t - q.top) < 4)) tops.push(q.top);
		}
		return tops.length;
	};
	for (const el of document.querySelectorAll(
		'.nav a, .tabs button, .presets button, .pill, .risk, .lang-switch button, .bottom-nav a span, th, .demo-tag, .price, .total b',
	)) {
		if (el.offsetParent !== null && lines(el) > 1) out.push(`wrapped: ${desc(el)}`);
	}
	for (const el of (document.querySelector('dialog[open]') || document).querySelectorAll('.btn')) {
		if (el.offsetParent !== null && lines(el) > 1)
			out.push(`wrapped button: ${desc(el)} w=${Math.round(el.getBoundingClientRect().width)}`);
	}
	// a single word wider than its heading/button gets broken mid-word by overflow-wrap
	const cv = document.createElement('canvas').getContext('2d');
	for (const el of document.querySelectorAll('h1, h2, h3, .btn, .nav a, .stat b, .kpis b, .total b, .price, th')) {
		if (el.offsetParent === null) continue;
		const cs = getComputedStyle(el);
		cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
		cv.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
		const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
		for (const w of el.innerText.split(/\s+/))
			if (w && cv.measureText(w).width > avail + 1) {
				out.push(
					`word wider than box: "${w}" in ${desc(el)} (${Math.round(cv.measureText(w).width)} > ${Math.round(avail)})`,
				);
				break;
			}
	}
	// tree ids must not break mid-code
	for (const el of document.querySelectorAll('.nowrap')) {
		const rs = el.getClientRects();
		if (rs.length > 1) out.push(`id split across lines: ${desc(el)}`);
	}
	// bottom nav must not cover the end of the content
	const bn = document.querySelector('#bnav');
	if (bn && getComputedStyle(bn).display !== 'none' && !document.querySelector('dialog[open]')) {
		window.scrollTo(0, document.body.scrollHeight);
		const last = [...document.querySelectorAll('main > *')].pop();
		if (last && last.getBoundingClientRect().bottom > bn.getBoundingClientRect().top)
			out.push('bottom nav covers last block');
		window.scrollTo(0, 0);
	}
	return [...new Set(out)];
}
(async () => {
	const b = await chromium.launch();
	const report = {};
	for (const w of WIDTHS) {
		const ctx = await b.newContext({
			viewport: { width: w, height: 900 },
			reducedMotion: 'reduce',
			deviceScaleFactor: 1,
		});
		await ctx.addInitScript(seed => {
			try {
				if (!sessionStorage.getItem('seeded')) {
					localStorage.clear();
					for (const k in seed) localStorage.setItem(k, JSON.stringify(seed[k]));
					sessionStorage.setItem('seeded', '1');
				}
				window.print = () => {};
			} catch (e) {}
		}, SEED);
		const p = await ctx.newPage();
		const errs = [];
		p.on('pageerror', e => errs.push(e.message));
		p.on('console', m => {
			if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errs.push(m.text());
		});
		for (const n of names) {
			const v = VIEWS[n];
			await p.goto('about:blank');
			await p.goto(URL + v.hash);
			await p.waitForTimeout(v.wait || 250);
			if (v.after) {
				await v.after(p);
				await p.waitForTimeout(250);
			}
			const issues = await p.evaluate(audit);
			if (issues.length) report[`${n}@${w}`] = issues;
			await p.screenshot({ path: `${OUT}/${n}-${w}.jpg`, type: 'jpeg', quality: 70, fullPage: !v.modal });
		}
		if (errs.length) report[`console@${w}`] = errs;
		await ctx.close();
	}
	fs.writeFileSync(OUT + '/audit.json', JSON.stringify(report, null, 1));
	const keys = Object.keys(report);
	console.log(keys.length ? `${keys.length} views with issues` : 'no issues');
	for (const k of keys) {
		console.log('##', k);
		report[k].slice(0, 8).forEach(x => console.log('   ', x));
		if (report[k].length > 8) console.log('    …+' + (report[k].length - 8));
	}
	await b.close();
})();
