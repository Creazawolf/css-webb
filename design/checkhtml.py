# -*- coding: utf-8 -*-
"""Kontrollerar taggbalans i <x-dc>-kroppen och listar mallhål."""
import io, re, sys
from html.parser import HTMLParser

VOID = {'area','base','br','col','embed','hr','img','input','link','meta',
        'param','source','track','wbr'}
# SVG-primitiver får självstängas — det är normen i både JSX och HTML5:s
# främmande innehåll.
SVG = {'path','circle','rect','line','polyline','polygon','ellipse','use',
       'stop','g','defs','clippath','lineargradient','radialgradient','text',
       'tspan','image','mask','pattern','marker','filter','feoffset',
       'fegaussianblur','feblend','femerge','femergenode','symbol','title'}

class Check(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag in VOID: return
        self.stack.append((tag, self.getpos()))
    def handle_startendtag(self, tag, attrs):
        if tag not in VOID and tag not in SVG:
            self.errors.append('självstängd icke-void-tagg <%s/> rad %d' % (tag, self.getpos()[0]))
    def handle_endtag(self, tag):
        if tag in VOID: return
        if not self.stack:
            self.errors.append('</%s> utan öppning, rad %d' % (tag, self.getpos()[0]))
            return
        if self.stack[-1][0] != tag:
            self.errors.append('</%s> stänger inte <%s> (öppnad rad %d), rad %d'
                               % (tag, self.stack[-1][0], self.stack[-1][1][0], self.getpos()[0]))
            while self.stack and self.stack[-1][0] != tag:
                self.stack.pop()
            if self.stack: self.stack.pop()
            return
        self.stack.pop()

def run(path):
    src = io.open(path, encoding='utf-8').read()
    m = re.search(r'</helmet>(.*?)</x-dc>', src, re.S)
    if not m:
        print('%-22s SAKNAR x-dc/helmet' % path); return 1
    body = m.group(1)
    p = Check(); p.feed(body); p.close()
    leftover = [t for t, _ in p.stack]
    holes = sorted(set(re.findall(r'\{\{\s*([A-Za-z0-9_.$]+)\s*\}\}', src)))
    bad = [h for h in re.findall(r'\{\{([^}]*)\}\}', src)
           if not re.fullmatch(r'\s*[A-Za-z0-9_.$]+\s*', h)]
    ok = not p.errors and not leftover and not bad
    print('%-22s %s  taggar:%s  hål:%d' % (
        path, 'OK  ' if ok else 'FEL ',
        'balanserade' if not leftover else 'ostängda ' + ','.join(leftover),
        len(holes)))
    for e in p.errors[:8]: print('    !', e)
    if bad: print('    ! uttryck i hål (stöds ej):', bad[:5])
    return 0 if ok else 1

if __name__ == '__main__':
    sys.exit(sum(run(p) for p in sys.argv[1:]))
