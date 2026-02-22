import os
import re

html_path = 'd:/NMDEV/NM_PETArr/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update the media query to a class, and define --bg-card
text = text.replace("@media (prefers-color-scheme: dark) {", "body.dark-mode {")
text = text.replace("            :root {", "")
# Fix indentation and closing brace
# Since we removed :root {, we need to remove one closing brace.
text = text.replace("            }\n\n            .card {", "            .card {") # actually wait, body.dark-mode acts as the root for variables now.

# Better replace logic for the whole dark mode block:
# Let's find the start of the dark mode block and redefine it properly.
old_dark_mode_start = """        @media (prefers-color-scheme: dark) {
            :root {"""
new_dark_mode_start = """        :root {
            --bg-card: #ffffff;
            --bg-table-header: var(--slate-50);
        }
        
        body.dark-mode {"""
text = text.replace(old_dark_mode_start, new_dark_mode_start)

# We removed :root {, so we have an extra closing brace at the end of the variables block.
# Let's find:
#                 --orange-600: #f97316;
#             }
old_var_end = """                --orange-600: #f97316;
            }"""
new_var_end = """                --orange-600: #f97316;
                --bg-card: #1e293b;
                --bg-table-header: #0f172a;"""
text = text.replace(old_var_end, new_var_end)

# Also fix the end of the original @media block
old_media_end = """            /* Fix dark mode specifically avoiding print interference */
            @media print {
                :root {
                    --slate-50: #f8fafc;
                    --slate-100: #f1f5f9;
                    --slate-200: #e2e8f0;
                    --slate-300: #cbd5e1;
                    --slate-400: #94a3b8;
                    --slate-500: #64748b;
                    --slate-600: #475569;
                    --slate-700: #334155;
                    --slate-800: #1e293b;
                    --slate-900: #0f172a;
                }
            }
        }"""
new_media_end = """            /* Fix dark mode specifically avoiding print interference */
            @media print {
                body.dark-mode {
                    --bg-card: #ffffff;
                    --bg-table-header: var(--slate-50);
                    --slate-50: #f8fafc;
                    --slate-100: #f1f5f9;
                    --slate-200: #e2e8f0;
                    --slate-300: #cbd5e1;
                    --slate-400: #94a3b8;
                    --slate-500: #64748b;
                    --slate-600: #475569;
                    --slate-700: #334155;
                    --slate-800: #1e293b;
                    --slate-900: #0f172a;
                }
            }"""
text = text.replace(old_media_end, new_media_end)

# 2. Replace hardcoded `background: 'white'` with `background: 'var(--bg-card)'`
text = re.sub(r"background:\s*'white'", "background: 'var(--bg-card)'", text)
# same for background-color just in case
text = re.sub(r"backgroundColor:\s*'white'", "backgroundColor: 'var(--bg-card)'", text)

# For background: 'var(--slate-50)' in table header
text = text.replace("background: 'var(--slate-50)'", "background: 'var(--bg-table-header)'")

# 3. Add toggle button in Header
# Find the header section
header_insert_point = """                                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--slate-500)' }}>Smart PET Scheduler · 高階醫療版</p>
                            </div>
                        </div>

                        <button onClick={handlePrint}"""

header_new = """                                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--slate-500)' }}>Smart PET Scheduler · 高階醫療版</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => setDarkMode(!darkMode)} className="btn-soft" style={{
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--slate-300)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                color: 'var(--slate-600)',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                            }} title="切換深色模式">
                                {darkMode ? <i className="fa-solid fa-sun" style={{ color: '#f59e0b' }}></i> : <i className="fa-solid fa-moon"></i>}
                            </button>
                            <button onClick={handlePrint}"""
text = text.replace(header_insert_point, header_new)

# 4. Add darkMode state hook
state_hook_insert = """const [activeTab, setActiveTab] = useState('planner');
        const [poslumaExpanded, setPoslumaExpanded] = useState(false);"""
state_hook_new = """const [activeTab, setActiveTab] = useState('planner');
        const [poslumaExpanded, setPoslumaExpanded] = useState(false);
        const [darkMode, setDarkMode] = useState(false);

        React.useEffect(() => {
            if (darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }, [darkMode]);"""
text = text.replace(state_hook_insert, state_hook_new)

# Fix background hardcoded in CSS for input-soft etc
text = text.replace("background-color: white;", "background-color: var(--bg-card);")
text = text.replace("background: white;", "background: var(--bg-card);")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Applied replacements successfully.")
