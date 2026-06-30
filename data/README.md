# Updating your publications list

`publications.json` is the file the Publications page reads. The page itself
never talks to Inspire-HEP directly (browsers can't safely fetch arbitrary
BibTeX from another site at runtime), so the workflow is: **export from
Inspire-HEP → convert to JSON → drop the file in here.**

## 1. Export from Inspire-HEP

Go to your author profile on https://inspirehep.net, select the papers you
want listed, and export as **BibTeX**.

## 2. Convert BibTeX to the JSON shape this page expects

Each entry needs this shape:

```json
{
  "year": 2024,
  "title": "Paper title",
  "authors": ["Raimon Luna", "Coauthor One", "Coauthor Two"],
  "venue": "Physical Review D",
  "doi": "10.1103/PhysRevD.xxx.xxxxxx",
  "arxiv": "2401.12345",
  "inspire": "https://inspirehep.net/literature/XXXXXXX"
}
```

Only `title` is strictly required for the page not to break — the rest are
optional and simply won't render their corresponding link/line if missing.

### Quick conversion script

If you have Python with `bibtexparser` available (`pip install
bibtexparser --break-system-packages`), this script does the conversion for
you. Save it as `convert.py` next to your exported `.bib` file and run
`python convert.py export.bib publications.json`:

```python
import sys, json, re
import bibtexparser

def clean(s):
    return re.sub(r"[{}]", "", s or "").strip()

def split_authors(field):
    return [clean(a).replace(",", "").strip() for a in field.split(" and ")] if field else []

def main(bib_path, out_path):
    with open(bib_path, encoding="utf-8") as f:
        db = bibtexparser.load(f)

    entries = []
    for e in db.entries:
        authors = split_authors(e.get("author", ""))
        # reorder "Last, First" -> "First Last" if present
        authors = [
            " ".join(reversed(a.split(",", 1))).strip() if "," in a else a
            for a in authors
        ]
        entries.append({
            "year": int(e["year"]) if e.get("year", "").isdigit() else None,
            "title": clean(e.get("title", "")),
            "authors": authors,
            "venue": clean(e.get("journal", e.get("booktitle", ""))),
            "doi": e.get("doi", "").strip() or None,
            "arxiv": e.get("eprint", "").strip() or None,
            "inspire": None,
        })

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
```

Then commit the new `publications.json` and push — GitHub Pages updates
automatically, no build step needed.

## 3. Sanity check

Open `publications.html` locally in a browser before pushing (or just push
to a branch and preview) to confirm the JSON parses — a single missing comma
will blank the whole list. Any JSON validator (jsonlint.com, or your editor's
built-in linting) will catch this in a second.
