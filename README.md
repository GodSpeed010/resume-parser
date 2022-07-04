# Resume Parser

A PDF Resume Parser and Search System meant to simulate what a recruiter would use to search for candidates

## Description

* Uses Natural Language Processing to find the resume owner's name
* Regex is used to determine the resume owner's email and phone

## Getting Started

### Installing

Run `npm install` to install all dependencies

### Executing program

* Start the front-end by running `npm start` from the root directory of the project
* Start the backend by entering the **backend** directory and running `node index.js`

## User Guide

1. Upload your PDF resume by clicking the **Browse** button, then selecting your resume.
2. Click the **Upload** button to upload your resume to the backend.
3. Search for any keywords in the input-field, then click **Search**. Any uploaded resumes that had the keyword will show up in the list, displaying the owner's **name**, **email**, **phone number**, and a link to **Download the Resume**,