export default function renderMarkdown(text: string | undefined) {
	if (!text) return '...';
	return text
		.replace(/^# (.+)$/gm, '<h1>$1</h1>')
		.replace(/\*\*([^*]+)\*\*/g, '<em>$1</em>')
		.replace(/\*(.+?)\*/g, '<strong>$1</strong>')
		.replace(
			/\[bo\]/g,
			'<span style="font-size: 1.5em; color: var(--blossom);" class="boost dice">&#x25A0</span>'
		)
		.replace(
			/\[sb\]/g,
			'<span style="font-size: 1.5em; color: var(--obsidian);" class="setback dice">&#x25A0</span>'
		)
		.replace(
			/\[ab\]/g,
			'<span style="font-size: 1.1em; color: green;" class="ability dice">&#x25C6</span>'
		)
		.replace(
			/\[di\]/g,
			'<span style="font-size: 1.1em; color: var(--weave);" class="difficulty dice">&#x25C6</span>'
		)
		.replace(
			/\[pr\]/g,
			'<span style="font-size: 1.1em; color: #ffbf00;" class="proficiency dice">&#11042</span>'
		)
		.replace(
			/\[ch\]/g,
			'<span style="font-size: 1.1em; color: var(--threat);" class="challenge dice">&#11042</span>'
		);
}
