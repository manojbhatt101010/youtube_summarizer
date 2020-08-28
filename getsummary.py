from flask import Flask, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import spacy
import requests

app = Flask(__name__)
CORS(app)

def getSummary(videoId, summaryLength):
	transcriptJSON = {}
	try:
		transcriptJSON = YouTubeTranscriptApi.get_transcript(videoId)
	except:
		return {"Error": "No transcript found!"}

	transcript = ""
	for line in transcriptJSON:
		transcript += line["text"] + " "

	return identifySentences(transcript, summaryLength)

def identifySentences(transcript, summaryLength):
	nlp = spacy.load("en_core_web_sm")
	about_doc = nlp(transcript)

	sentences = ""
	for sentence in about_doc.sents:
		sentences += sentence.text + ". ";

	return summary(sentences, summaryLength)

API_KEY = "5A0842408D"
def summary(sentences, summaryLength):
	smmryAPIURL = ("http://api.smmry.com/&SM_API_KEY=%s&SM_LENGTH=%s" % (API_KEY, summaryLength))

	result = requests.post(smmryAPIURL, data = {"sm_api.input": sentences})
	if "sm_api_content" not in result.json():
		return {"Error": "No transcript found or too short transcripts"}

	return {"result": result.json()["sm_api_content"]}


@app.route('/')
def index():
	videoId = request.args.get("videoId")
	summaryLength = request.args.get("summaryLength")
	return getSummary(videoId, summaryLength)
	

if __name__ == "__main__":
	app.run(debug = True)