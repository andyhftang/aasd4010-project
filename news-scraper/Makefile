IMAGE_NAME = aasd4010-project-news-scraper

run:
	source .venv/bin/activate && python3 main.py

build:
	docker build -t $(IMAGE_NAME):latest .

clean:
	docker rmi -f $(IMAGE_NAME) || true

.PHONY: run
