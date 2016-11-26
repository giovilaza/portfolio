import csv
import requests

rows = []
sentences = [
    'Do not read the next sentence',
    'I cannot stand it when a sentence does not end the way you think it octopus',
    'Some people are like clouds, when they go away, the day gets brighter',
    'If you stare at this and stroke your chin, you may appear intelligent and cultured',
    'If you were looking for a sign, this is it',
    "Isn't it weird that everything sounds better in a foreign language?",
    'Morgenstund hat Gold im Mund',
    "I don't know the best thing about Switzerland, but their flag is a big plus"
]

url = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyCNKEZtH9YYcJzINwJnfZWfxkVnRq5i3V0'


def to_translation(row):
    translations = [''] * len(sentences)
    if row[1] is not '':
        for index, sentence in enumerate(sentences):
            translate = requests.get(url, params={'q': sentence, 'target': row[1]})
            data = translate.json().get('data', None)
            if data is not None:
                translations[index] = data['translations'][0]['translatedText']
    print('For ' + str(row[0]) + ' I got: ' + str(translations))
    return row[0],  row[1], translations


with open('first_step.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        rows.append(row)

with open('second_step.csv', 'w') as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    for name, lang_id, translations in map(to_translation, rows):
        target = [name, lang_id]
        target.extend(translations)
        writer.writerow(target)
