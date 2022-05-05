import json
from urllib.parse import parse_qsl
import base64
import logging

import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    logger.info(event)
    error = None
    try:
        body = event['body']
        payload = base64.b64decode(body).decode()

        raw_posts = parse_qsl(payload)[0][1]
        posts = json.loads(raw_posts)
        client = boto3.resource('s3')
        bucket = client.Bucket(env.bucket)
        params = dict(ACL='public-read',
                      Body=json.dumps(posts).encode(),
                      ContentType='text/json',
                      Key='posts.js')
        bucket.put_object(**params)
    except Exception as e:
        logger.info(e)
        error = str(e)
    return {
        'statusCode': 200,
        'body': error or ''
    }
