from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.utils.crypto import get_random_string
from django.views.decorators.csrf import csrf_exempt
import json

games = {}

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
        "answer": ["1024 Mb", "1000 Mb", "1200 Mb", "1275 Mb"],
        "correct_ans": "1024 Mb",
    },
    "Q3": {
        "question": "A web address is usually known as …",
        "answer": ["URL", "UWL", "WWW", "UVL"],
        "correct_ans": "URL",
    },
    "Q4": {
        "question": "Who was the father of computer?",
        "answer": ["Charlie Babbage", "Dennis Ritchie", "Charles Babbage", "Ken Thompson"],
        "correct_ans": "Charles Babbage",
    }

}


def index(request):
    return render(request, 'myapp/index.html', {})


def create(request):
    pin_code = get_random_string(length=6, allowed_chars='1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    games[pin_code] = []
    print(games)
    return JsonResponse({
        "pincode": pin_code,
        "participants": games[pin_code]
    })


@csrf_exempt
def join(request):
    body = json.loads(request.body.decode('utf-8'))
    pincode = body['pin_code']
    print(games)
    result = False
    if pincode in games:
        games[pincode].append(body['name'])
        result = True
    return JsonResponse({"result": result})


@csrf_exempt
def participants(request):
    body = json.loads(request.body.decode('utf-8'))
    pincode = body['pin_code']
    result = games[pincode]
    return JsonResponse({"participants": result})


def quiz(request):
    return JsonResponse(questions)
