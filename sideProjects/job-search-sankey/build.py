#!/usr/bin/env python3
"""Turn data/companies.csv (local, gitignored) into index.html with counts only.

Stage codes in the CSV: S screen, A assignment, R1/R2/R3 interview rounds, O offer.
In the chart, every live conversation and every completed assignment is one numbered round:
a screen immediately followed by Round 1 counts once, and round 3 onward is merged into "Round 3+".
"""
import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent
SOURCES = {"cold": "Cold email", "portal": "Portal", "inbound": "Recruiter", "referral": "Referral"}
ENDS = {"rejected": "Rejected", "ghosted": "No response", "withdrew": "Withdrew", "declined": "Withdrew", "accepted": "Accepted"}


def round_nodes(stages):
    """Collapse the raw stage list into numbered round nodes (+ Offer)."""
    steps = []
    for s in stages:
        if s == "O":
            continue
        if s == "R1" and steps and steps[-1] == "S":
            continue  # screen directly followed by Round 1 is the same step
        steps.append(s)
    nodes = []
    for i in range(len(steps)):
        name = f"Round {i + 1}" if i < 2 else "Round 3+"
        if not nodes or nodes[-1] != name:
            nodes.append(name)
    if "O" in stages:
        nodes.append("Offer")
    return nodes


rows = list(csv.DictReader(open(ROOT / "data" / "companies.csv")))
links = Counter()
journeys = Counter()  # identical routes merged; the page draws one thin line per opportunity
for r in rows:
    stages = [s for s in r["stages"].split("|") if s]
    path = [SOURCES[r["source"]]] + round_nodes(stages) + [ENDS[r["end"]]]
    for a, b in zip(path, path[1:]):
        links[(a, b, r["source"])] += 1
    journeys[(r["source"], tuple(path))] += 1

data = {
    "total": len(rows),
    "assignments": {
        "done": sum(r["assignment"] == "done" for r in rows),
        "skipped": sum(r["assignment"] == "skipped" for r in rows),
    },
    "links": [{"source": a, "target": b, "origin": o, "value": v} for (a, b, o), v in links.items()],
    "journeys": [{"origin": o, "path": list(p), "n": n} for (o, p), n in journeys.items()],
}

template = (ROOT / "template.html").read_text()
(ROOT / "index.html").write_text(template.replace("/*__DATA__*/null", json.dumps(data)))
print(f"{len(rows)} opportunities, {len(links)} links, assignments {data['assignments']} -> index.html")
