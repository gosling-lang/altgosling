# AltGosling Python
This is the Python version for [AltGosling](https://github.com/gosling-lang/altgosling)! AltGosling was published in [_Bioinformatics_](https://academic.oup.com/bioinformatics/article/40/12/btae670/7900296).


## Installation

```sh
pip install altgosling
```

or with [uv](https://github.com/astral-sh/uv):

```sh
uv add altgosling
```

## Development

We recommend using [uv](https://github.com/astral-sh/uv) for development.
It will automatically manage virtual environments and dependencies for you.

```sh
uv run jupyter lab example.ipynb
```

Alternatively, create and manage your own virtual environment:

```sh
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
jupyter lab example.ipynb
```

The widget front-end code bundles it's JavaScript dependencies. After setting up Python,
make sure to install these dependencies locally:

```sh
npm install
```

While developing, you can run the following in a separate terminal to automatically
rebuild JavaScript as you make changes:

```sh
npm run dev
```

Open `example.ipynb` in JupyterLab, VS Code, or your favorite editor
to start developing. Changes made in `js/` will be reflected
in the notebook.
