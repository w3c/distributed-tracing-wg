# Distributed Tracing Working Group Style Guide

This document describes the editorial style preferred by the W3C Distributed Tracing Working Group.
This document should be considered supplemental to the [W3C Manual of Style](https://www.w3.org/Guide/manual-of-style/).
In general, the rules there should be followed unless otherwise stated in this document.
If a rule is not appropriate or possible in context, it may be acceptable to break the rule with the consent of the working group members reviewing a pull request.
If it is not obvious why a rule is broken, a comment should be made in the document describing the reason.

# Markdown

The following section applies to all markdown files.

## File extension

All markdown files should have the extension `.md`.

## Line Breaks

Each sentence should be on its own line.
This allows for a pull request review to make a suggestion to an individual sentence, which is a natural unit of language, without changing the line breaks for unrelated lines.

```markdown
This is a full sentence.
This is another full sentence, which is longer but still continues to be on the same line.
This is yet another full sentence, which is quite a bit longer than previous sentences, and still contains no line breaks.
```

## Referencing external RFCs

When referencing an external document such as an RFC, a markdown link of the form `[RFC0000 Section x.y](https://link.to.rfc/section)` should be used.
Note that the link includes the RFC number and relevant section.

Example:

```markdown
Values can be combined in a single header according to [RFC 7230 Section 3.2.2](https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.2).
```

## Referencing fields

Field names are generally lower case.
Fields names consisting of multiple words should be written in kebab case (e.g. `span-id`).
Use code markup (markdown backticks) when referring to field names.
When referring to the concept which the field name represents, such as Span ID in the case of `span-id`, title case should be used.
Do not use code markup or kebab case when referring to a general concept instead of a specific field name.

Example:

```markdown
Some tracing systems contain an identifier for a given operation called a Span ID.
The field [`span-id`](#span-id) refers to this identifier.
```
