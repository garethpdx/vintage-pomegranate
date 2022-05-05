import json
import requests
import logging
import base64
from urllib.parse import parse_qsl

from bs4 import BeautifulSoup


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    logger.info(event)
    error = ''
    images = []
    try:
        payload = base64.b64decode(event['body']).decode()
        url = parse_qsl(payload)[0][1]
        r = requests.get(url)
        soup = BeautifulSoup(r.text)
        images = soup.find_all('img')
    except Exception as e:
        logger.info(e)
        error = str(e)
    
    return {
        'statusCode': 200,
        'body': json.dumps(dict(images=[image['src'] for image in images],
                                error=error
                                )
                           )
        }
