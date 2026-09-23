# Wikipedia website study

Two-page starting point copied from Wikipedia on September 23, 2026:

- `public/index.html`: English Wikipedia homepage, with a link to the local article.
- `public/article.html`: Italian brainrot article.
- `public/assets/`: downloaded styles and images.
- `public/copy.css`: place for upcoming design changes.
- `src/Main.java`: dependency-free Java 17 local server.

## Preview

From this folder run:

```sh
java src/Main.java
```

Open http://localhost:8080. Optional port: `java src/Main.java 8081`.
HTML files also open directly in a browser. Refresh after changing HTML/CSS.

This is a static reading copy, not the full MediaWiki application. Search, editing, account tools, and other articles link to Wikipedia. Wikipedia scripts and tracking were removed. Some unavailable decorative logos were replaced with their text labels. The homepage is a dated snapshot, not a live news feed.

## Attribution

Content by Wikipedia contributors:

- https://en.wikipedia.org/wiki/Main_Page
- https://en.wikipedia.org/wiki/Italian_brainrot

Text is available under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Original source and history links, references, and image-description links are retained in the pages. Images retain their individual licenses as described on their linked Wikimedia file pages. Wikipedia and Wikimedia marks belong to their respective owners; this student project is not affiliated with Wikipedia.

Changes from the original: local asset paths, links between the two local pages, removal of runtime scripts, a local-project notice, and a homepage shortcut to Italian brainrot. No visual redesign has been applied yet.
