import json
import os

DATASET_DIR = "dataset"
TABLES_FILE = "tables.json"
QUERIES_FILE = "queries.json"
DATASET_FILE = "dataset.jsonl"

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
                "Generate valid SQL syntax for DuckDB. "
                "Never explain the query or use markdown. "
                "Limit the query to SELECT statements only. "
                "Avoid making any assumptions about schema. "
            )
        },
        {
            "role": "user",
            "content": f"Given the schema: {schema}. Answer the question: {question}",
        },
        {
            "role": "assistant",
            "content": f"{query};",
        },
    ]


def main():
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
                message = _generate_messages(schema, query["question"], query["query"])
                message_json = json.dumps({"messages": message})
                f.write(message_json + "\n")

if __name__ == "__main__":
    main()
