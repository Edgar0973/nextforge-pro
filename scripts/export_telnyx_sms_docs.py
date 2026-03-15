from __future__ import annotations

import argparse
import collections
import dataclasses
import hashlib
import html
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urldefrag, urljoin, urlparse
from urllib.robotparser import RobotFileParser

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print(
        "Missing dependencies. Install with:\n"
        "  py -3 -m pip install requests beautifulsoup4 lxml",
        file=sys.stderr,
    )
    raise

USER_AGENT = (
    "NextForgePro-TelnyxDocsExporter/3.0 "
    "(Windows 11; educational internal crawler; contact-form SMS research)"
)

DEFAULT_START_URL = "https://developers.telnyx.com/docs/account-setup/create-account"
DEFAULT_OUT_DIR = "telnyx_sms_gpt_export"
DEFAULT_MAX_PAGES = 400
DEFAULT_TARGET_FILE_COUNT = 20
DEFAULT_TIMEOUT = 20
DEFAULT_DELAY_SECONDS = 0.35

ALLOWED_PATH_PREFIXES = (
    "/docs/messaging/",
    "/api-reference/messages/",
    "/api-reference/profiles/",
    "/api-reference/number-settings/",
    "/api-reference/mobile-number-settings/",
    "/api-reference/detail-records/",
    "/api-reference/mdr-",
    "/api-reference/opt-out-management/",
    "/api-reference/campaign/",
    "/api-reference/brands/",
    "/api-reference/messaging/",
    "/api-reference/verified-numbers/",
    "/docs/account-setup/",
    "/development/api-fundamentals/",
)

BLOCKED_PATH_PREFIXES = (
    "/docs/voice/",
    "/docs/programmable-fax/",
    "/docs/video/",
    "/docs/inference/",
    "/docs/edge-compute/",
    "/docs/tts-stt/",
    "/docs/identity/",
    "/docs/glossary/",
    "/docs/api/",
    "/api-reference/assistants/",
    "/api-reference/conversations/",
    "/api-reference/call-",
    "/api-reference/callbacks/call-",
    "/api-reference/rcs/",
    "/api-reference/fax",
    "/api-reference/porting",
    "/api-reference/number-portout/",
    "/api-reference/phone-number-orders/",
    "/api-reference/phone-number-reservations/",
    "/api-reference/inexplicit-number-orders/",
    "/api-reference/short-codes/",
    "/api-reference/verification-requests/",
)

BLOCKED_SUBSTRINGS = {
    "/rcs",
    "rcs-",
    "send-an-rcs-message",
    "receiving-rcs-webhooks",
    "rcs-capabilities",
    "rcs-getting-started",
    "rcs-ai-assistant",
    "rcs-deeplinks",
    "group-messaging",
    "group-mms",
    "send-a-group-mms-message",
    "mms-converter",
    "smil-template",
    "zapier-integration",
    "appointment-reminder",
}

RELEVANCE_KEYWORDS = {
    "sms": 16,
    "messaging": 14,
    "message": 10,
    "outbound": 12,
    "send": 8,
    "send message": 16,
    "send a message": 20,
    "retrieve a message": 14,
    "delivery": 16,
    "delivered": 14,
    "delivery_failed": 18,
    "delivery_unconfirmed": 18,
    "status": 10,
    "finalized": 12,
    "message.finalized": 20,
    "message.sent": 16,
    "webhook": 16,
    "webhooks": 16,
    "receiving webhooks": 20,
    "messaging profile": 20,
    "messaging profiles": 20,
    "messaging_profile_id": 20,
    "phone number configuration": 20,
    "number settings": 16,
    "messaging settings": 18,
    "number pool": 10,
    "sticky sender": 12,
    "sender type": 14,
    "error": 12,
    "errors": 12,
    "error code": 16,
    "messaging error codes": 20,
    "message detail record": 20,
    "message detail records": 20,
    "mdr": 16,
    "10dlc": 20,
    "campaign": 10,
    "registration": 10,
    "toll-free": 18,
    "verification": 12,
    "carrier": 14,
    "compliance": 16,
    "a2p": 16,
    "opt out": 18,
    "opt-out": 18,
    "unsubscribe": 14,
    "stop": 10,
    "rate limiting": 12,
    "rate limits": 12,
    "e.164": 10,
    "phone number": 8,
    "advanced opt-in-out": 20,
    "hosted sms": 10,
}

NEGATIVE_HINTS = {
    "voice",
    "texml",
    "sip",
    "fax",
    "video",
    "iot",
    "storage",
    "compute",
    "virtual networking",
    "assistant",
    "assistants",
    "conversation",
    "conversations",
    "ai assistant",
    "call control",
    "call tracking",
    "media streaming",
    "ivr",
    "dialogflow",
    "port out",
    "portout",
    "no-code voice assistant",
    "rcs",
    "group messaging",
    "group mms",
    "smil",
    "zapier",
    "appointment reminder",
    "mms converter",
}

PATH_BOOSTS = {
    "/docs/messaging/": 40,
    "/api-reference/messages/": 40,
    "/api-reference/profiles/": 26,
    "/api-reference/number-settings/": 24,
    "/api-reference/mobile-number-settings/": 24,
    "/api-reference/detail-records/": 22,
    "/api-reference/mdr-": 22,
    "/api-reference/opt-out-management/": 22,
    "/api-reference/campaign/": 18,
    "/api-reference/brands/": 16,
    "/api-reference/messaging/": 18,
    "/docs/account-setup/": 8,
}

EXCLUDE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".ico",
    ".pdf",
    ".zip",
    ".gz",
    ".tgz",
    ".tar",
    ".rar",
    ".mp4",
    ".mp3",
    ".mov",
    ".avi",
    ".css",
    ".js",
    ".mjs",
    ".map",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
}


@dataclasses.dataclass
class PageDoc:
    url: str
    title: str
    text: str
    headings: list[str]
    meta_description: str
    score: int
    fetched_at: str


def normalize_url(url: str) -> str:
    url, _frag = urldefrag(url)
    parsed = urlparse(url)
    scheme = parsed.scheme or "https"
    netloc = parsed.netloc.lower()
    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return parsed._replace(
        scheme=scheme,
        netloc=netloc,
        path=path,
        params="",
        query="",
        fragment="",
    ).geturl()


def is_same_domain(url: str, root_domain: str) -> bool:
    return urlparse(url).netloc.lower() == root_domain.lower()


def looks_like_doc_url(url: str) -> bool:
    path = urlparse(url).path.lower()

    if any(path.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
        return False

    if any(path.startswith(prefix) for prefix in BLOCKED_PATH_PREFIXES):
        return False

    if any(token in path for token in BLOCKED_SUBSTRINGS):
        return False

    if any(path.startswith(prefix) for prefix in ALLOWED_PATH_PREFIXES):
        return True

    return False


def should_follow(url: str, root_domain: str) -> bool:
    if not is_same_domain(url, root_domain):
        return False
    if not looks_like_doc_url(url):
        return False
    return True


def collapse_whitespace(value: str) -> str:
    value = html.unescape(value)
    value = value.replace("\xa0", " ")
    value = re.sub(r"\r\n?", "\n", value)
    value = re.sub(r"[ \t]+", " ", value)
    value = re.sub(r"\n{3,}", "\n\n", value)
    return value.strip()


def extract_main_text(soup: BeautifulSoup) -> tuple[str, list[str], str]:
    for tag in soup(
        ["script", "style", "noscript", "svg", "form", "button", "nav", "footer", "aside"]
    ):
        tag.decompose()

    candidates = [
        soup.find("main"),
        soup.find("article"),
        soup.find(attrs={"role": "main"}),
        soup.find("div", id="content"),
    ]
    root = next((c for c in candidates if c is not None), soup.body or soup)

    headings: list[str] = []
    lines: list[str] = []

    for node in root.find_all(
        ["h1", "h2", "h3", "h4", "p", "li", "pre", "code", "table", "blockquote"]
    ):
        text = collapse_whitespace(node.get_text("\n", strip=True))
        if not text:
            continue

        if node.name in {"h1", "h2", "h3", "h4"}:
            headings.append(text)
            lines.append(f"\n## {text}\n")
        elif node.name == "li":
            lines.append(f"- {text}")
        elif node.name == "pre":
            lines.append(f"```text\n{text}\n```")
        elif node.name == "code":
            parent_name = getattr(node.parent, "name", "")
            if parent_name != "pre":
                lines.append(f"`{text}`")
        else:
            lines.append(text)

    meta_tag = soup.find("meta", attrs={"name": "description"})
    meta_description = collapse_whitespace(meta_tag.get("content", "")) if meta_tag else ""

    return collapse_whitespace("\n".join(lines)), headings, meta_description


def score_page(
    url: str,
    title: str,
    text: str,
    headings: list[str],
    meta_description: str,
) -> int:
    haystack = " ".join([url, title, meta_description, " ".join(headings), text]).lower()
    lower_path = urlparse(url).path.lower()
    score = 0

    if any(lower_path.startswith(prefix) for prefix in BLOCKED_PATH_PREFIXES):
        return -999

    if any(token in lower_path for token in BLOCKED_SUBSTRINGS):
        return -999

    for phrase, weight in RELEVANCE_KEYWORDS.items():
        if phrase in haystack:
            score += weight

    for prefix, boost in PATH_BOOSTS.items():
        if lower_path.startswith(prefix):
            score += boost

    for neg in NEGATIVE_HINTS:
        if neg in haystack:
            score -= 20

    if "sms" in haystack and "send" in haystack:
        score += 20
    if "message" in haystack and "webhook" in haystack:
        score += 18
    if "messaging profile" in haystack and "phone number" in haystack:
        score += 20
    if "10dlc" in haystack and ("campaign" in haystack or "registration" in haystack):
        score += 20
    if "toll-free" in haystack and "verification" in haystack:
        score += 20
    if "message detail record" in haystack or ("mdr" in haystack and "message" in haystack):
        score += 20
    if "delivery" in haystack and (
        "failed" in haystack or "unconfirmed" in haystack or "delivered" in haystack
    ):
        score += 20
    if "opt-out" in haystack or ("stop" in haystack and "message" in haystack):
        score += 16

    if "account setup" in haystack and "messaging" not in haystack and "sms" not in haystack:
        score -= 8

    return score


def is_sms_confirmation_relevant(
    url: str,
    title: str,
    text: str,
    headings: list[str],
    meta_description: str,
) -> bool:
    haystack = " ".join([url, title, meta_description, " ".join(headings), text]).lower()
    path = urlparse(url).path.lower()

    if any(path.startswith(prefix) for prefix in BLOCKED_PATH_PREFIXES):
        return False

    if any(token in path for token in BLOCKED_SUBSTRINGS):
        return False

    blocked_content_terms = (
        "rcs",
        "group messaging",
        "group mms",
        "smil",
        "zapier",
        "appointment reminder",
        "mms converter",
        "ai assistant",
    )
    if any(term in haystack for term in blocked_content_terms):
        return False

    required_any = (
        "sms",
        "messaging",
        "message",
        "webhook",
        "messaging profile",
        "10dlc",
        "toll-free",
        "mdr",
        "message detail record",
        "opt-out",
        "send a message",
        "send message",
        "retrieve a message",
        "error code",
        "phone number configuration",
        "number settings",
    )
    if not any(term in haystack for term in required_any):
        return False

    unrelated_signals = (
        "voice api",
        "programmable voice",
        "fax",
        "video",
        "assistant",
        "conversation api",
        "call control",
        "ivr",
        "media streaming",
    )
    if any(term in haystack for term in unrelated_signals):
        if not (
            path.startswith("/docs/messaging/")
            or path.startswith("/api-reference/messages/")
            or path.startswith("/api-reference/profiles/")
            or path.startswith("/api-reference/detail-records/")
            or path.startswith("/api-reference/mdr-")
            or path.startswith("/api-reference/opt-out-management/")
            or path.startswith("/api-reference/number-settings/")
            or path.startswith("/api-reference/mobile-number-settings/")
            or path.startswith("/api-reference/campaign/")
            or path.startswith("/api-reference/brands/")
            or path.startswith("/api-reference/messaging/")
        ):
            return False

    return True


def parse_llms_txt(text: str, base_url: str) -> list[str]:
    urls: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        matches = re.findall(r"https?://[^\s)>\]]+", line)
        for match in matches:
            urls.append(normalize_url(match))
        if line.startswith("/"):
            urls.append(normalize_url(urljoin(base_url, line)))
    return list(dict.fromkeys(urls))


def get_internal_links(soup: BeautifulSoup, current_url: str, root_domain: str) -> list[str]:
    links: list[str] = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag.get("href", "").strip()
        if (
            not href
            or href.startswith("#")
            or href.startswith("mailto:")
            or href.startswith("javascript:")
        ):
            continue
        full = normalize_url(urljoin(current_url, href))
        if should_follow(full, root_domain):
            links.append(full)
    return list(dict.fromkeys(links))


def fetch(session: requests.Session, url: str, timeout: int) -> requests.Response | None:
    try:
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        content_type = response.headers.get("Content-Type", "")
        if "text/html" not in content_type and not url.endswith("llms.txt"):
            return None
        return response
    except requests.RequestException:
        return None


def build_robot_parser(base_url: str, session: requests.Session) -> RobotFileParser:
    parsed = urlparse(base_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    robot_parser = RobotFileParser()
    try:
        response = session.get(robots_url, timeout=10)
        if response.ok:
            robot_parser.parse(response.text.splitlines())
        else:
            robot_parser.parse([])
    except requests.RequestException:
        robot_parser.parse([])
    return robot_parser


def markdown_for_doc(doc: PageDoc) -> str:
    return (
        f"# {doc.title or 'Untitled'}\n\n"
        f"- URL: {doc.url}\n"
        f"- Relevance Score: {doc.score}\n"
        f"- Fetched At: {doc.fetched_at}\n"
        f"- Meta Description: {doc.meta_description or '(none)'}\n"
        f"- Headings: {', '.join(doc.headings) if doc.headings else '(none)'}\n\n"
        f"{doc.text.strip()}\n"
    )


def chunk_into_balanced_files(docs: list[PageDoc], file_count: int) -> list[list[PageDoc]]:
    buckets: list[list[PageDoc]] = [[] for _ in range(file_count)]
    sizes = [0 for _ in range(file_count)]

    decorated = sorted(docs, key=lambda d: len(markdown_for_doc(d)), reverse=True)

    for doc in decorated:
        idx = min(range(file_count), key=lambda i: sizes[i])
        buckets[idx].append(doc)
        sizes[idx] += len(markdown_for_doc(doc))

    return buckets


def write_outputs(
    docs: list[PageDoc],
    out_dir: Path,
    file_count: int,
    start_url: str,
    root_domain: str,
) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    manifest = {
        "start_url": start_url,
        "root_domain": root_domain,
        "page_count": len(docs),
        "target_file_count": file_count,
        "generated_files": [],
    }

    buckets = chunk_into_balanced_files(docs, file_count)

    for idx, bucket in enumerate(buckets, start=1):
        parts = [f"# Telnyx SMS Docs Export Part {idx:02d}\n"]
        for doc in sorted(bucket, key=lambda d: (-d.score, d.url)):
            parts.append("\n---\n")
            parts.append(markdown_for_doc(doc))

        filename = f"telnyx_sms_docs_part_{idx:02d}.md"
        file_path = out_dir / filename
        content = "\n".join(parts).strip() + "\n"
        file_path.write_text(content, encoding="utf-8")

        manifest["generated_files"].append(
            {
                "file": filename,
                "doc_count": len(bucket),
                "char_count": len(content),
                "urls": [d.url for d in bucket],
            }
        )

    index_lines = [
        "# Telnyx SMS GPT Export Manifest",
        "",
        f"- Start URL: {start_url}",
        f"- Root Domain: {root_domain}",
        f"- Pages Exported: {len(docs)}",
        f"- Parts: {file_count}",
        "",
        "## Files",
    ]

    for item in manifest["generated_files"]:
        index_lines.append(
            f"- {item['file']}: {item['doc_count']} docs, {item['char_count']} chars"
        )

    (out_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2),
        encoding="utf-8",
    )
    (out_dir / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--start-url", default=DEFAULT_START_URL)
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR)
    parser.add_argument("--max-pages", type=int, default=DEFAULT_MAX_PAGES)
    parser.add_argument("--target-files", type=int, default=DEFAULT_TARGET_FILE_COUNT)
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT)
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY_SECONDS)
    parser.add_argument("--min-score", type=int, default=40)
    args = parser.parse_args()

    start_url = normalize_url(args.start_url)
    parsed_start = urlparse(start_url)
    root_domain = parsed_start.netloc

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    robot_parser = build_robot_parser(start_url, session)

    seen: set[str] = set()
    crawled: set[str] = set()
    q: collections.deque[str] = collections.deque()

    llms_url = f"{parsed_start.scheme}://{parsed_start.netloc}/llms.txt"
    llms_resp = fetch(session, llms_url, args.timeout)
    if llms_resp is not None:
        for url in parse_llms_txt(llms_resp.text, llms_url):
            if should_follow(url, root_domain):
                q.append(url)

    q.append(start_url)

    docs: list[PageDoc] = []

    while q and len(crawled) < args.max_pages:
        url = normalize_url(q.popleft())
        if url in seen:
            continue
        seen.add(url)

        if not should_follow(url, root_domain):
            continue

        if not robot_parser.can_fetch(USER_AGENT, url):
            continue

        resp = fetch(session, url, args.timeout)
        time.sleep(args.delay)

        if resp is None:
            continue

        crawled.add(url)

        soup = BeautifulSoup(resp.text, "lxml")
        title = collapse_whitespace(soup.title.get_text(" ", strip=True) if soup.title else "")
        text, headings, meta_description = extract_main_text(soup)
        score = score_page(url, title, text, headings, meta_description)

        if (
            text
            and score >= args.min_score
            and is_sms_confirmation_relevant(url, title, text, headings, meta_description)
        ):
            docs.append(
                PageDoc(
                    url=url,
                    title=title,
                    text=text,
                    headings=headings,
                    meta_description=meta_description,
                    score=score,
                    fetched_at=time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                )
            )

        for link in get_internal_links(soup, url, root_domain):
            if link not in seen:
                q.append(link)

    deduped: list[PageDoc] = []
    hashes: set[str] = set()
    for doc in sorted(docs, key=lambda d: (-d.score, d.url)):
        digest = hashlib.sha256(doc.text.encode("utf-8")).hexdigest()
        if digest in hashes:
            continue
        hashes.add(digest)
        deduped.append(doc)

    write_outputs(
        docs=deduped,
        out_dir=Path(args.out_dir),
        file_count=args.target_files,
        start_url=start_url,
        root_domain=root_domain,
    )

    print(f"Done. Crawled: {len(crawled)} pages")
    print(f"Relevant exported docs: {len(deduped)}")
    print(f"Output folder: {Path(args.out_dir).resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

