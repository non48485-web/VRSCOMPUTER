import base64
import os
from PIL import Image, ImageDraw

badge = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
draw = ImageDraw.Draw(badge)
rx = 110
draw.rounded_rectangle([10, 10, 502, 502], radius=rx, fill=(10, 20, 40, 255), outline=(96, 165, 250, 90), width=4)

sq_emblem = Image.open(r'd:\VRS Computer\assets\images\rvs-emblem-square.png')
badge_emblem = sq_emblem.resize((420, 420), Image.Resampling.LANCZOS)
badge.paste(badge_emblem, (46, 46), badge_emblem)
badge.save(r'd:\VRS Computer\assets\images\rvs-badge.png', 'PNG', optimize=True)
print('Saved rvs-badge.png')

with open(r'd:\VRS Computer\assets\images\rvs-logo.png', 'rb') as f:
    b64_full = base64.b64encode(f.read()).decode('utf-8')

with Image.open(r'd:\VRS Computer\assets\images\rvs-logo.png') as f_img:
    fw, fh = f_img.size

svg_full = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fw} {fh}" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_full}" x="0" y="0" width="{fw}" height="{fh}" />
</svg>'''

with open(r'd:\VRS Computer\assets\images\rvs-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_full)

with open(r'd:\VRS Computer\assets\images\vrs-logo.svg', 'w', encoding='utf-8') as f:
    f.write(svg_full)

with open(r'd:\VRS Computer\assets\images\rvs-emblem.png', 'rb') as f:
    b64_emblem = base64.b64encode(f.read()).decode('utf-8')

with Image.open(r'd:\VRS Computer\assets\images\rvs-emblem.png') as e_img:
    ew, eh = e_img.size

svg_emblem = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ew} {eh}" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_emblem}" x="0" y="0" width="{ew}" height="{eh}" />
</svg>'''

with open(r'd:\VRS Computer\assets\images\rvs-emblem.svg', 'w', encoding='utf-8') as f:
    f.write(svg_emblem)

print('Saved SVG files successfully')
