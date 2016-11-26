import pycountry
import csv

rows = []

with open('lang.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append(row)

for row in rows:
    try:
        row['code'] = pycountry.languages.get(name=row['lang']).iso639_1_code
    except (AttributeError, KeyError):
        pass
    print(row)

with open('first_step.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    for row in rows:
        writer.writerow([row['lang'], row['code']])
