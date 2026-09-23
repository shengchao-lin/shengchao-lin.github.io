---
# One file per project; each becomes a card on the Projects page.
# Start a new one with:  hugo new projects/my-project.md
title: AlphaBridge
weight: 10                                   # card order (lower first)
summary: A bridge AI lab that evolves its own tournament-legal bidding system from noise via self-play, then explains every call it makes — built entirely on the Python standard library.
image: images/alphabridge/play-table.png     # path under static/
image_alt: The AlphaBridge play table mid-deal
tags:                                        # color: green, gold, blue, purple, red
  - { name: Python stdlib, color: green }
  - { name: Genetic evolution, color: gold }
  - { name: Bridge, color: blue }
link: "https://github.com/shengchao-lin/AlphaBridge"   # where the card title/image points
links:
  - { name: GitHub, url: "https://github.com/shengchao-lin/AlphaBridge" }
build:
  render: never                              # card only, no page of its own
---
