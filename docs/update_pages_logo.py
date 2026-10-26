import glob
import os

files = [
    r'd:\VRS Computer\accessories.html',
    r'd:\VRS Computer\contactus.html',
    r'd:\VRS Computer\network.html',
    r'd:\VRS Computer\newpc.html',
    r'd:\VRS Computer\oldcomputer.html',
    r'd:\VRS Computer\pcpart.html',
    r'd:\VRS Computer\peripherals.html',
    r'd:\VRS Computer\printer.html',
    r'd:\VRS Computer\speaker.html',
    r'd:\VRS Computer\storage.html'
]

old_favicon = '<link rel="shortcut icon" type="image/x-icon" href="https://cccomputerkh.com/icon.png" />'
new_favicon = '''<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">'''

old_logo_pattern = '''<a href="index.html" class="cc-logo" aria-label="VRS Computer home">
        <img src="assets/images/vrs-logo.svg" alt="VRS Computer Logo" class="cc-logo__img" width="42" height="42">
        <span class="cc-logo__text">
          <span class="cc-logo__name">VRS <span class="accent">COMPUTER</span></span>
          <span class="cc-logo__tag">Laptop &amp; PC Store • Phnom Penh &amp; Chbar Mon</span>
        </span>
      </a>'''

new_logo = '''<a href="index.html" class="cc-logo" aria-label="RVS Computer home">
        <img src="assets/images/rvs-emblem.png" alt="RVS Computer Logo" class="cc-logo__img" width="68" height="50">
        <span class="cc-logo__text">
          <span class="cc-logo__name">RVS <span class="accent">COMPUTER</span></span>
          <span class="cc-logo__tag">Laptop &amp; PC Store • Phnom Penh &amp; Chbar Mon</span>
        </span>
      </a>'''

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    count_fav = content.count(old_favicon)
    count_logo = content.count(old_logo_pattern)
    
    content = content.replace(old_favicon, new_favicon)
    content = content.replace(old_logo_pattern, new_logo)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'{os.path.basename(fpath)}: replaced favicon: {count_fav}, replaced logo: {count_logo}')

print('Done updating all pages')
