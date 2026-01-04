import html
import json
import os
import random

import requests

DATASET_DIR = "dataset"
TABLES_FILE = "tables.json"
QUERIES_FILE = "queries.json"
DATASET_FILE = "dataset.jsonl"
TOKEN_URL = "https://opentdb.com/api_token.php"
QUESTION_URL = "https://opentdb.com/api.php"

def _get_tables(table):
    table_names = table["table_names_original"]
    table_columns = table["column_names_original"]

    columns_by_table = {}
    for i, column_name in table_columns:
        columns_by_table.setdefault(i, []).append(column_name)

    return [
        {
            "table": table_name,
            "columns": columns_by_table.get(i, []),
        }
        for i, table_name in enumerate(table_names)
    ]


def _get_queries(table, table_queries):
    table_id = table["db_id"]
    return [
        {
            "question": query["question"],
            "query": query["query"],
        }
        for query in table_queries.get(table_id, [])
    ]


def _get_samples(queries, tables):
    table_ids = set([table["db_id"] for table in tables])

    table_queries = {}
    for query in queries:
        if query["db_id"] in table_ids:
            table_queries.setdefault(query["db_id"], []).append(query)

    return [
        {
            "tables": _get_tables(table),
            "queries": _get_queries(table, table_queries),
        }
        for table in tables
    ]


def _generate_messages(schema, question, query):
    return [
        {
            "role": "system",
            "content": (
                "You are a text-to-SQL assistant. "
                "Output exactly one valid SQL query. "
                "Do not output natural language. "
                "Do not output multiple queries. "
                "Use only SELECT statements. "
                "Preserve column and table names casing. "
                "If irrelevant, output 'Please, try again'. "
            )
        },
        {
            "role": "user",
            "content": f"Given the schema: {schema}. Answer the question: {question}",
        },
        {
            "role": "assistant",
            "content": f"{query}",
        },
    ]


def main():
    token_resp = requests.get(TOKEN_URL, params={"command": "request"})
    token = token_resp.json()["token"]
    question_resp = requests.get(QUESTION_URL, params={"amount": 100, "token": token})
    results = question_resp.json()["results"]

    queries_path = os.path.join(DATASET_DIR, QUERIES_FILE)
    tables_path = os.path.join(DATASET_DIR, TABLES_FILE)

    with open(queries_path, "r") as f:
        queries = json.loads(f.read())
    with open(tables_path, "r") as f:
        tables = json.loads(f.read())

    samples = _get_samples(queries, tables)

    dataset_path = os.path.join(DATASET_DIR, DATASET_FILE)
    with open(dataset_path, "w") as f:
        for sample in samples:
            schema = json.dumps(sample["tables"])
            for query in sample["queries"]:
                messages = _generate_messages(schema, query["question"], query["query"] + ";")
                message_json = json.dumps({"messages": messages})
                f.write(message_json + "\n")
                if random.randint(1, 10) == random.randint(1, 10):
                    messages = _generate_messages(schema, html.unescape(random.choice(results)["question"]), "Please, try again.")
                    message_json = json.dumps({"messages": messages})
                    f.write(message_json + "\n")


if __name__ == "__main__":
    main()
