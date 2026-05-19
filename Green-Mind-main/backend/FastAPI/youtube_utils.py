from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

def get_transcript(video_id):
    try:
        api = YouTubeTranscriptApi()  # v1.x requires instantiation
        
        # Try fetching English first, then Arabic
        for lang in [['en', 'en-US', 'en-GB'], ['ar']]:
            try:
                fetched = api.fetch(video_id, languages=lang[0] if isinstance(lang, list) else lang)
                return " ".join([item.text for item in fetched])
            except Exception:
                continue

        # Last resort: grab whatever language is available
        transcript_list = api.list(video_id)
        transcript = next(iter(transcript_list))  # first available
        fetched = transcript.fetch()
        return " ".join([item.text for item in fetched])

    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"No transcript available for {video_id}: {e}")
        return None
    except Exception as e:
        print(f"Transcript Error for {video_id}: {e}")
        return None