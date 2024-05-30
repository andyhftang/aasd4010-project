import logging
import sys
from datetime import datetime, timedelta, timezone
from io import BytesIO
from os import getenv as osgetenv
from zlib import crc32

import feedparser
import requests
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

logger = logging.getLogger()
logging.basicConfig(stream=sys.stdout, level=logging.INFO)


def getenv(variable_name):
    variable_value = osgetenv(variable_name)
    if variable_value is None:
        logger.error("The environment variable %s is not set", variable_name)
        sys.exit(1)
    return variable_value


# Define a function to read the RSS feed and return the entries
def read_rss_feed(rss_url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
        resp = requests.get(rss_url, headers=headers, timeout=20.0)

    except (requests.ReadTimeout, requests.ConnectTimeout) as e:
        logger.warn("Timeout when reading RSS %s due to %s", rss_url, e)
        return None

    return feedparser.parse(BytesIO(resp.content))


def save_to_mongodb(record, conn_str):
    client = MongoClient(conn_str)
    db = client.news_database
    try:
        db.stocks_news.create_index("id_hash", unique=True)
        db.stocks_news.insert_one(record)
    except DuplicateKeyError:
        logger.warn("Record %s already exists in MongoDB.", record)
        pass
    except Exception as e:
        logger.error("Error when inserting record %s due to %s", record, e)


if __name__ == "__main__":
    # Get environment variables
    rss_url = getenv("RSS_URL")
    mongodb_conn_str = getenv("MONGODB_CONNECTION_STRING")

    feed = read_rss_feed(rss_url)
    inserted = 0

    for entry in feed.entries:
        # Check if the entry was published within the last 2 hours
        now = datetime.now(timezone.utc)
        two_hours_ago = now - timedelta(hours=2)
        published_time = datetime(*entry.published_parsed[:6]).replace(
            tzinfo=timezone.utc
        )

        if two_hours_ago <= published_time <= now:
            record = {
                "id_source": entry.id,
                "id_hash": crc32(entry.id.encode()),
                "title": entry.title,
                "link": entry.link,
                "emotion": "positive",
                "published": published_time,
            }

            save_to_mongodb(record, mongodb_conn_str)
            inserted += 1

    logger.info("Captured %d news and they have been stored in MongoDB.", inserted)
