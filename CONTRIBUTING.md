# Contributing docs

## Structure

This project consists of three components

1: Set-up of alt-text tree data from Gosling spec

Input:
- gosling ref
- gosling's spec-traversed api 

Output:
- alt text api


2: Data component

Input:
- gosling ref
- gosling's rawdata api
- alt text api


Output:
-- alt text + data api
-- updated data api


3: Render tree element

Input
- alt text ref
- alt text api
- alt text + data api
- updated data api

Output
-- React element with tree
-- React element with most-recently updated data
