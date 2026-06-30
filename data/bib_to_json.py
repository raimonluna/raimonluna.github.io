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
        authors = split_authors(e.get("author", "")) # reorder "Last, First" -> "First Last" if present
        authors = [" ".join([a.split(' ')[-1]] + a.split(' ')[:-1]) for a in authors]
        authors = [a.replace("\\'a", "á").replace("\\'e", "é").replace("\\'o", "ó").replace("\\'i", "i") for a in authors]
        authors = [a.replace("\\'\\i", "í").replace("\\vs", "š").replace("\\'c", "ć").replace("\\~a", "ã") for a in authors]
        journal_ref = e.get("journal", "") + ", vol. " + e.get("volume", "") + ", no. " + e.get("number", "") + ", p. " + \
                      e.get("pages", "") + ", " + e.get("year", "") + "."
        entries.append({
            "year": int(e["year"]) if e.get("year", "").isdigit() else None,
            "title": clean(e.get("title", "")).replace("$", "").replace("``", '"').replace("''", '"'),
            "authors": authors,
            "venue": journal_ref,
            "doi": e.get("doi", "").strip() or None,
            "arxiv": e.get("eprint", e.get("note", "").replace("arXiv ", "")).strip() or None,
            "inspire": None,
        })

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
