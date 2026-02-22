import os
import re

html_path = 'd:/NMDEV/NM_PETArr/index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace fonts
text = re.sub(r'<link href="https://fonts\.googleapis\.com/css2\?family=Nunito.*?>', 
              r'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;600;700&display=swap" rel="stylesheet">', 
              text)

# Replace styles
with open('d:/NMDEV/NM_PETArr/new_styles.css', 'r', encoding='utf-8') as f:
    new_styles = f.read()
text = re.sub(r'<style>.*?</style>', f'<style>\n{new_styles}\n    </style>', text, flags=re.DOTALL)

# Remove the download table function and replace UI components
parts = text.split('// ============ 下載圖片功能 ============')
if len(parts) < 2:
    parts = text.split('// ============ 醫師規劃面板 ============')
    
prefix = parts[0]

with open('d:/NMDEV/NM_PETArr/new_planner.jsx', 'r', encoding='utf-8') as f:
    planner = f.read()
with open('d:/NMDEV/NM_PETArr/new_worklist.jsx', 'r', encoding='utf-8') as f:
    worklist = f.read()
with open('d:/NMDEV/NM_PETArr/new_app.jsx', 'r', encoding='utf-8') as f:
    app = f.read()

suffix = """
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
"""

new_text = prefix + "\n" + planner + "\n\n" + worklist + "\n\n" + app + "\n" + suffix

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Successfully rebuilt index.html")
