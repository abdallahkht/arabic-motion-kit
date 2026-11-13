"""Build a ZIP only from reviewed, tracked repository files."""
import subprocess,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1];dest=root/'renders/arabic-motion-kit-v0.1.0.zip';dest.parent.mkdir(exist_ok=True)
files=subprocess.check_output(['git','ls-files','-z'],cwd=root).decode().split('\0')
if not any(files):raise SystemExit('No tracked files. Stage the reviewed release files first.')
with zipfile.ZipFile(dest,'x',zipfile.ZIP_DEFLATED) as z:
 for f in filter(None,files):
  if any(p in ['.git','node_modules','.venv','work','renders','review'] for p in Path(f).parts):raise SystemExit('Private/runtime path tracked: '+f)
  z.write(root/f,'arabic-motion-kit/'+f)
print(dest)
