---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
weight: 50
summary: One or two sentences about the project.
image: images/my-project/screenshot.png      # put the file under static/images/my-project/
image_alt: Describe the screenshot
tags:
  - { name: Tag, color: green }
link: "https://github.com/shengchao-lin/my-project"
links:
  - { name: GitHub, url: "https://github.com/shengchao-lin/my-project" }
build:
  render: never
---
