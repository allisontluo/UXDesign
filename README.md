# Wikipedia website study

Website redesigned from pages copied from Wikipedia on September 23, 2026:

- `public/index.html`: English Wikipedia homepage, with a link to the local article.
- `public/article.html`: Italian brainrot article.
- `public/assets/`: downloaded styles and images.
- `public/help.html`: search, citation, and keyboard navigation instructions.
- `public/search.html` and `public/search.js`: search that works on static hosting.
- `public/copy.css`: redesigned layout and accessibility styles.
- `src/Main.java`: dependency-free Java 17 local server.

## Preview

From this folder run:

```sh
java src/Main.java
```

Open http://localhost:8080. Optional port: `java src/Main.java 8081`.
HTML files also open directly in a browser. Refresh after changing HTML/CSS.

This is a static reading copy, not the full MediaWiki application. Search for Italian brainrot opens the local article; other searches show a no-match page. Most outgoing encyclopedia article links have been changed to plain text. Utility, source, and image attribution links may lead to Wikipedia or other websites. Wikipedia scripts and tracking were removed. Some unavailable decorative logos were replaced with their text labels. The homepage is a dated snapshot, not a live news feed.

## Attribution

Content by Wikipedia contributors:

- https://en.wikipedia.org/wiki/Main_Page
- https://en.wikipedia.org/wiki/Italian_brainrot

Text is available under CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Original source and history links, references, and image-description links are retained in the pages. Images retain their individual licenses as described on their linked Wikimedia file pages. Wikipedia and Wikimedia marks belong to their respective owners; this student project is not affiliated with Wikipedia.

Changes from the original include a Times New Roman reading layout, colored section cards, local navigation and Help, accessible search labels, larger spaced citation targets, and removal of redundant titles and inaccessible links.

## Hosted website

https://allisontluo.github.io/UXDesign/

GitHub Actions publishes the public folder after pushes to main. GitHub Pages serves HTML/CSS and the small browser search script; the Java server remains available for local preview. Submit the hosted URL or the project files, rather than a localhost link.
