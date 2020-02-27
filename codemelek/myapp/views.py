from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
import json

games = {}
game_rooms_onPlay = []
scoreboard = {}
# questions = {}
# questions[pincode] ={....} TODO USER CAN MAKE HIS OWN QUIZ

questions = {
    "Q1": {
        "question": "Which among the following is not a computer language?",
        "answers": ["ALGOL", "COBOL", "PASCAL", "DRAM"],
        "correct_ans": "DRAM",
    },
    "Q2": {
        "question": "1 Gigabyte (Gb) =",
        "answers": ["1024 Mb", "1000 Mb", "1200 Mb", "1275 Mb"],
        "correct_ans": "1024 Mb",
    },
    "Q3": {
        "question": "In JS if you add [1, 2, 3] + [4, 5, 6] will result to?",
        "answers": ["[1, 2, 3, 4, 5, 6]", "[1, 2, 34, 5, 6]", "[[1, 2, 3], [4, 5, 6]]", "ERROR"],
        "correct_ans": "[1, 2, 34, 5, 6]",
    },
    "Q4": {
        "question": "A web address is usually known as …",
        "answers": ["URL", "UWL", "WWW", "UVL"],
        "correct_ans": "URL",
    },
    "Q5": {
        "question": "Who was the father of computer?",
        "answers": ["Charlie Babbage", "Dennis Ritchie", "Charles Babbage", "Ken Thompson"],
        "correct_ans": "Charles Babbage",
    },
    "Q6": {
        "question": "Mi hamelek shel CSS?",
        "answers": ["NETANEL", "NETANEL", "NETANEL", "NETANEL"],
        "correct_ans": "NETANEL",
    }

}


def index(request):
    return render(request, 'myapp/index.html', {})


def create(request):
    pin_code = get_random_string(length=6, allowed_chars='1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    games[pin_code] = []
    # print(games)
    return JsonResponse({"pincode": pin_code})


@csrf_exempt
def join(request):
    body = json.loads(request.body.decode('utf-8'))
    pincode = body['pin_code']
    # print(games)
    result = False
    if pincode in games:
        games[pincode].append({"name": body['name'], "score": 0})
        result = True
    return JsonResponse({"result": result})


@csrf_exempt
def participants(request):
    body = json.loads(request.body.decode('utf-8'))
    pincode = body['pin_code']
    result = games[pincode]
    return JsonResponse({"participants": result})


@csrf_exempt
def games_on_play(request):
    if request.method == "POST":
        body = json.loads(request.body.decode('utf-8'))
        pincode = body['pin_code']
        game_rooms_onPlay.append(pincode)
        return JsonResponse({"games": game_rooms_onPlay})
    else:
        return JsonResponse({"games": game_rooms_onPlay})


def update_score(participant, body):
    if participant['name'] == body['playername']:
        participant['score'] = body['score']
    return participant


@csrf_exempt
def on_answer(request):
    body = json.loads(request.body.decode('utf-8'))
    pincode = body['pin_code']
    games[pincode] = list(map(lambda p: update_score(p, body), games[pincode]))
    print(games[pincode])


temp = {}
@csrf_exempt
def next(request):
        body = json.loads(request.body)
        temp.add('continue', body['next'])
        return JsonResponse(temp)

def quiz(request):
    return JsonResponse(questions)
